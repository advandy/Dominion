"use strict";
class Card {
	constructor(name, cost) {
		this.name = name;
		this.cost = cost;
		this.value = 0;
		this.point = 0;
	}

	isBuyable(offer) {
		return offer >= this.cost;
	}

	getPoint() {
		return this.point;
	}

	getValue() {
		return this.value;
	}

	getType() {
		return this.type;
	}
}

Card.MONEY_TYPE = "money";
Card.ACTION_TYPE = "action";
Card.POINT_TYPE = "point";

class MoneyCard extends Card{
	constructor(name, cost) {
		super(name, cost);
		this.type = Card.MONEY_TYPE;
		switch (cost) {
			case 0: 
				this.value = 1;
				break;
			case 3:
				this.value = 2;
				break;
			case 6:
				this.value = 3;
				break;
		}
	}
}

class ActionCard extends Card {
	constructor(name, cost, action) {
		super(name, cost);
		this.type = Card.ACTION_TYPE;
		this.action = action;
		this.isUsed = false;
	}

	useAction() {
		this.isUsed = true;
	}

	resetAction() {
		this.isUsed = false;
	}

	getValue() {
		return this.isUsed ? this.action.xValue : 0;
	}
}

class PointCard extends Card {
	constructor(name, cost) {
		super(name, cost);
		this.type = Card.POINT_TYPE;
		switch (cost) {
			case 2: 
				this.point = 1;
				break;
			case 5:
				this.point = 3;
				break;
			case 8:
				this.point = 6;
				break;
		}

	}
}

class Action {
	constructor(xBuy, xCard, xAction, xValue, fnAction) {
		this.xBuy = xBuy;
		this.xCard = xCard;
		this.xAction = xAction;
		this.xValue = xValue;
		this.takeAction = fnAction;
	}
}

class Deck {
	constructor(cards) {
		this.cards = cards || [];
	}

	emptyDeck() {
		this.cards = [];
	}

	isEmpty() {
		return this.cards.length === 0;
	}

	leftCount() {
		return this.cards.length;
	}

	addCard(card) {
		this.cards.unshift(card);
		return this;
	}

	getValueSum() {
		var sum = 0;
		for (var i = 0; i < this.cards.length; i++) {
			sum = sum + this.cards[i].getValue();
		}
		return sum;
	}

	getPointSum() {
		var sum = 0;
		for (var i = 0; i < this.cards.length; i++) {
			sum = sum + this.cards[i].getPoint();
		}
		return sum;
	}

	addCards(cards) {
		this.cards = cards.concat(this.cards);
		return this;
	}

	fetchCards(count) {
		return this.cards.splice(this.cards.length - count, count);
	}

	popCard() {
		this.cards.pop();
		return this;
	}

	static shuffle(cards) {
		for (let i = cards.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [cards[i], cards[j]] = [cards[j], cards[i]];
	    }
	    return cards;
	}
}

class Game {
	constructor(playerCount) {
		this.stack = {
			"Gold": (function() {
				var deck = new Deck();
				for (var i = 0; i < 30; i++) {
					deck.addCard(new MoneyCard("Gold", 6))
				}
				return deck;
			})(),
			"Silver": (function() {
				var deck = new Deck();
				for (var i = 0; i < 40; i++) {
					deck.addCard(new MoneyCard("Silver", 3))
				}
				return deck;
			})(),
			"Copper": (function() {
				var deck = new Deck();
				for (var i = 0; i < 60; i++) {
					deck.addCard(new MoneyCard("Copper", 0))
				}
				return deck;
			})(),
			"Estate": (function() {
				var deck = new Deck();
				for (var i = 0; i < 24; i++) {
					deck.addCard(new PointCard("Estate", 2))
				}
				return deck;
			})(),
			"Duchy": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					deck.addCard(new PointCard("Duchy", 5))
				}
				return deck;
			})(),
			"Province": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					deck.addCard(new PointCard("Province", 8))
				}
				return deck;
			})(),
			"Cellar": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Cellar", 2, new Action(0, 0, 1, 0, null)));
				}
				return deck;
			})(),
			"Moat": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Moat", 2, new Action(0, 2, 0, 0, null)));
				}
				return deck;
			})(),
			"Village": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Village", 3, new Action(0, 1, 2, 0, null)));
				}
				return deck;
			})(),
			"Workshop": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Workshop", 3, new Action(0, 0, 0, 0, null)));
				}
				return deck;
			})(),
			"Woodcutter": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Woodcutter", 2, new Action(1, 0, 0, 2, null)));
				}
				return deck;
			})(),
			"Smithy": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Smithy", 4, new Action(0, 3, 0, 0, null)));
				}
				return deck;
			})(),
			"Remodel": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Remodel", 4, new Action(0, 0, 0, 0, null)));
				}
				return deck;
			})(),
			"Militia": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Militia", 4, new Action(0, 0, 0, 2, null)));
				}
				return deck;
			})(),
			"Market": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Market", 5, new Action(1, 1, 1, 1, null)));
				}
				return deck;
			})(),
			"Mine": (function() {
				var deck = new Deck();
				for (var i = 0; i < 12; i++) {
					// xBuy, xCard, xAction, xValue, fnAction
					deck.addCard(new ActionCard("Mine", 5, new Action(0, 0, 0, 0, null)));
				}
				return deck;
			})()
		};
		this.players = [];
		for (var i = 1; i <= playerCount; i++) {
			var player = new Player("Player " + i);
			var initialCards = this.stack.Copper.fetchCards(7).concat(this.stack.Estate.fetchCards(3));
			player.trailStack = new Deck(Deck.shuffle(initialCards));
			this.players.push(player);

			if (this.players.length !== 1) {
				this.players[this.players.length - 2].next = player;
			}

			if (this.players.length === playerCount) {
				player.next = this.players[0];
			}
		}
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

class Player {
	constructor(name) {
		this.name = name;
		this.trailStack = new Deck();
		this.handStack = new Deck();
		this.trayStack = new Deck();
		this.valueSum = 0;
		this.pointSum = 3;
		this.buyCount = 1;
		this.actionCount = 1;
	}

	readyToBuy() {
		this.valueSum = this.handStack.getValueSum();
		this.actionCount = 0;

		return this.valueSum;
	}

	buy(game, stack) {
		if (this.buyCount !== 0 && !game.stack[stack].isEmpty() && this.valueSum >= game.stack[stack].cards[0].cost) {
			this.valueSum -= game.stack[stack].cards[0].cost;
			var boughtCard = game.buyCard(stack);
			this.handStack.addCard(boughtCard);
			this.buyCount--;
			this.pointSum += boughtCard.getPoint();

			return true;
		}
		return false;
	} 

	fetchCards(count) {
		if (count > this.trailStack.leftCount()) {
			this.trailStack.addCards(Deck.shuffle(this.trayStack.cards));
			this.trayStack.emptyDeck();
		}
		this.handStack.addCards(this.trailStack.fetchCards(count));
		return this.handStack;
	}

	startNewRound() {
		this.valueSum = 0;
		this.buyCount = 1;
		this.actionCount = 1;
		for (var i = 0; i < this.handStack.cards.length; i++) {
			var card = this.handStack.cards[i];
			if (card.getType() === Card.ACTION_TYPE) {
				card.resetAction();
			}
		}
		this.trayStack.addCards(this.handStack.cards);
		this.handStack.emptyDeck();
		return this.fetchCards(5);
	}
}



var gm = new Game(3);

gm.players[0].startNewRound();
var p1 = gm.players[0];
p1.readyToBuy();
p1.buy(gm, "Cellar");
p1.startNewRound();
var p2 = p1.next;
p2.readyToBuy();
