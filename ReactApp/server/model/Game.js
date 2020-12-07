const {MoneyCard, ActionCard, PointCard} = require("./Card")
const Action = require("./Action")
const Deck = require("./Deck")
const Player = require("./Player")

class Game {
	constructor(sessionMaps) {
		let temp = 0
		this.stack = {
			"Gold": (function() {
				var deck = new Deck();
				for (var i = 0; i < 30; i++) {
					deck.addCard(new MoneyCard("Gold", 6, temp))
					temp++;
				}
				return deck;
			})(),
			"Silver": (function() {
				var deck = new Deck();
				for (var i = 0; i < 40; i++) {
					deck.addCard(new MoneyCard("Silver", 3, temp))
					temp++;
				}
				return deck;
			})(),
			"Copper": (function() {
				var deck = new Deck();
				for (var i = 0; i < 60; i++) {
					deck.addCard(new MoneyCard("Copper", 0, temp))
					temp++;
				}
				return deck;
			})(),
			"Estate": (function() {
				var deck = new Deck();
				for (var i = 0; i < 24; i++) {
					deck.addCard(new PointCard("Estate", 2, temp))
					temp++;
				}
				return deck;
			})(),
			"Duchy": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					deck.addCard(new PointCard("Duchy", 5, temp))
					temp++;
				}
				return deck;
			})(),
			"Province": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					deck.addCard(new PointCard("Province", 8, temp))
					temp++;
				}
				return deck;
			})(),
			"Cellar": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Cellar", 2, new Action(0, 0, 1, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Chapel": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Chapel", 2, new Action(0, 0, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Moat": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Moat", 2, new Action(0, 2, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Village": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Village", 3, new Action(0, 1, 2, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Workshop": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Workshop", 3, new Action(0, 0, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Woodcutter": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Woodcutter", 2, new Action(1, 0, 0, 2, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Smithy": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Smithy", 4, new Action(0, 3, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Remodel": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Remodel", 4, new Action(0, 0, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Militia": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Militia", 4, new Action(0, 0, 0, 2, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Market": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Market", 5, new Action(1, 1, 1, 1, null), temp));
					temp++;
				}
				return deck;
			})(),
			"Mine": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Mine", 5, new Action(0, 0, 0, 0, null), temp));
					temp++;
				}
				return deck;
			})()
		};
        this.players = [];
        for (var key in sessionMaps) {
            const player = new Player(sessionMaps[key].alias, key, sessionMaps[key].socket);
            const initialCards = this.stack.Copper.fetchCards(7).concat(this.stack.Estate.fetchCards(3));
			player.drawStack = new Deck(Deck.shuffle(initialCards));
			this.players.push(player);

			if (this.players.length !== 1) {
				this.players[this.players.length - 2].next = player;
			}

			if (this.players.length === Object.keys(sessionMaps).length) {
				player.next = this.players[0];
			}

		}
		this.currentPlayer = this.players[0];
	}

	getCurrentPlayer() {
		return this.currentPlayer;
	}

	getPlayerBySessionID(id) {
		let p = null;
		this.players.forEach((player) => {
			if (player.sessionID === id) {
				return p = player;
			}
		});

		return p;
	}

	getNextPlayer() {
		this.currentPlayer = this.currentPlayer.next;
		return this.currentPlayer;
	}

	buyCard(stack) {
		if (!this.stack[stack].isEmpty()) {
			return this.stack[stack].fetchCards(1)[0];
		}
	}

	leftCount(stack) {
		return this.stack[stack].leftCount();
	}
}

module.exports = Game