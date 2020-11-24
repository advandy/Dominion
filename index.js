const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const Controller = require("./Controller");

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const socket_to_alias = {};
const alias_to_socket = {};
let controller = null;

io.on('connection', (socket) => {
    socket.on('disconnect', function() {
        if (!!socket_to_alias[this.id]) {
            io.emit("left", socket_to_alias[this.id])
            delete socket_to_alias[this.id]
            delete alias_to_socket[socket_to_alias[this.id]]
        }
    });

    socket.on('joined', function(p) {
        socket_to_alias[this.id] = p
        alias_to_socket[p] = this
        io.emit("joined", p)
    });

    socket.on("game", function(event) {
        controller.handler(this, event);
    });

    socket.on("start", function() {
        controller = new Controller(alias_to_socket, io)
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});