
const {Card} = require("./model/Card");
const Game = require("./model/Game");

class Controller {
    constructor(sockets, io) {
        this.io = io;
        this.game = new Game(sockets);
        this._startNewRound()
    }

    _startNewRound() {
        const handstack = this.game.currentPlayer.startNewRound();
        this.io.to(this.game.currentPlayer.socket.id).emit("game", {"event": "new round", payload:handstack})
    }

    _buy(socket, msg) {
        this.game.currentPlayer.initBuy();
        this.game.currentPlayer.buy(this.game, msg.payload, (err, payload) => {
            if (!err) {
                this.io.to(socket.id).emit("game", {"event": "bought", "payload": payload});
            } else {
                this.io.to(socket.id).emit("game", {"event": "error", "payload": err.message});
            }
        });
    }

    _playActionCard(socket, msg) {
        debugger
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
        // [card_id, card_id, ...]
        // Discard any number of cards, then draw that many
        let count = 0
        msg.payload.forEach((card_id) => {
            let card = this.game.currentPlayer.handStack.discardCard(card_id);
            if (!!card) {
                this.game.currentPlayer.discardStack.addCard(card)
                count++;
            }
        });
        this.io.to(socket.id).emit("game", {"event": "action_cellar_complete", "payload": this.game.currentPlayer.fetchCards(count)});

    }

    handler(socket, msg) {
        if (socket.id == this.game.currentPlayer.socket.id) {
            if (msg.event == "buy") {
                this._buy(socket, msg);
            } else if (msg.event == "finish_round") {
                this._startNewRound();                
            } else if (msg.event == "action") {
                this._playActionCard(socket, msg)
            } else if (msg.event == "action_cellar") {
                this._takeActionCellar(socket, msg)
            }
        }
    }


}

module.exports = Controller
