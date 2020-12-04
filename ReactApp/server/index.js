const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const fs = require("fs");
const http = require('https').createServer({    
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')    
},app);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

const io = require("socket.io")(http, {
    cors: {
        origin: "https://localhost:3001",
        methods: ["GET", "POST"],
        allowedHeaders: ["X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept"],
        credentials: true
      }
});
const Controller = require("./Controller");

const sessionMiddleware = session({
    secret: "hdf",
    saveUninitialized: true,
    resave: true,
    cookie: {sameSite: "none", secure: true, maxAge: 86400000}});
app.use(sessionMiddleware);


const sharedSession = require("express-socket.io-session");
io.use(sharedSession(sessionMiddleware, {
    autoSave: false
}));


app.use(express.static(path.join(__dirname, "..", "build")))
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const socket_to_alias = {};
const alias_to_socket = {};
let controller = null;

let sessionStorage = {};

io.on('connection', (socket) => {
    if (sessionStorage[socket.handshake.sessionID] &&
        sessionStorage[socket.handshake.sessionID]["status"] == "left" &&
        !!controller) {
        sessionStorage[socket.handshake.sessionID]["status"] = "joined";
        controller.rejoin(socket.handshake.sessionID, socket);
    }

    socket.on('disconnect', function() {
        if (!!socket_to_alias[this.id]) {
            io.emit("left", socket_to_alias[this.id])
            delete socket_to_alias[this.id]
            delete alias_to_socket[socket_to_alias[this.id]]
        }

        if (sessionStorage[this.handshake.sessionID]) {
            sessionStorage[this.handshake.sessionID]["status"] = "left";
            if (controller) {
                controller.handler(this, {"event": "left", payload: this.handshake.sessionID});
            }
        }
    });

    socket.on('joined', function(p) {
        socket_to_alias[this.id] = p
        alias_to_socket[p] = this
        sessionStorage[this.handshake.sessionID] = {
            status: "joined",
            alias: p,
            socket: this
        }
        io.emit("joined", p)
    });

    socket.on("game", function(event) {
        controller.handler(this, this.handshake.sessionID, event);
    });

    socket.on("start", function() {
        controller = new Controller(sessionStorage, io)
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});