
const {Card} = require("./model/Card");
const Game = require("./model/Game");

class Controller {
    constructor(sessions, io) {
        this.io = io;
        this.game = new Game(sessions);
        this._startNewRound()
    }

    _startNewRound() {
        const handstack = this.game.currentPlayer.startNewRound();
        this.io.to(this.game.currentPlayer.socket.id).emit("game", {"event": "new round", payload:{
            handStack: handstack, status: this.game.currentPlayer.getStatus()
        }});
        this.io.sockets.emit("broadcast", {gameStack: this.game.stack})
    }

    _buy(socket, msg) {
        this.game.currentPlayer.buy(this.game, msg.payload, (err, payload) => {
            if (!err) {
                this.io.to(socket.id).emit("game", {"event": "bought", "payload": payload});
                this.io.sockets.emit("broadcast", {gameStack: this.game.stack})
            } else {
                this.io.to(socket.id).emit("game", {"event": "error", "payload": err.message});
            }
        });
    }

    _playActionCard(socket, msg) {
        const card_id = msg.payload;
        this.game.currentPlayer.playActionCard(card_id, (err, payload) => {
            if (!err) {
                this.io.to(socket.id).emit("game", {"event": "action_played", "payload": payload});
            } else {
                this.io.to(socket.id).emit("game", {"event": "error", "payload": err.message});
            }
        })
    }

    _takeActionCellar(socket, msg) {
        // msg payload [card_id, card_id, ...]
        // Discard any number of cards, then draw that many
        this.game.currentPlayer.takeActionCellar(msg.payload, (err, payload) => {
            if (!err) {
                this.io.to(socket.id).emit("game", {"event": "action_cellar_complete", "payload": payload});
            } else {
                this.io.to(socket.id).emit("game", {"event": "error", "payload": err.message});
            }
        });
    }

    _takeActionChapel(socket, msg) {
        // msg payload [card_id, card_id, ...]
        // Discard any number of cards, then draw that many
        this.game.currentPlayer.takeActionChapel(msg.payload, (err, payload) => {
            if (!err) {
                this.io.to(socket.id).emit("game", {"event": "action_chapel_complete", "payload": payload});
            } else {
                this.io.to(socket.id).emit("game", {"event": "error", "payload": err.message});
            }
        });
    }

    rejoin(sessionID, socket) {
        let bCurrentPlayer = false;
        this.game.players.forEach((player) => {
            if (player.sessionID === sessionID) {
                bCurrentPlayer = this.game.currentPlayer.sessionID === sessionID;
                return player.socket = socket;
            }
        });

        this.io.to(socket.id).emit("broadcast", {gameStack: this.game.stack});
        if (bCurrentPlayer) {
            this.io.to(this.game.currentPlayer.socket.id).emit("game", {"event": "new round", payload:{
                handStack: this.game.currentPlayer.handStack, status: this.game.currentPlayer.getStatus()
            }});
        }
        
    }

    handler(socket, sessionID, msg) {
        if (sessionID == this.game.currentPlayer.sessionID) {
            if (msg.event == "buy") {
                this._buy(socket, msg);
            } else if (msg.event == "finish_round") {
                this.game.getNextPlayer();
                this._startNewRound(socket);                
            } else if (msg.event == "action") {
                this._playActionCard(socket, msg)
            } else if (msg.event == "action_cellar") {
                this._takeActionCellar(socket, msg)
            } else if (msg.event == "action_chapel") {
                this._takeActionChapel(socket, msg)
            } else if (msg.event == "left") {}
        }
    }


}

module.exports = Controller
