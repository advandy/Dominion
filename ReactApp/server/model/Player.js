const Deck = require("./Deck")
const {Card} = require("./Card")
class Player {
	constructor(name, socket) {
        this.name = name;
        this.socket = socket;
		this.drawStack = new Deck();
		this.handStack = new Deck();
		this.discardStack = new Deck();
		this.pointSum = 3;
		this.buyCount = 1;
		this.actionCount = 1;
		this.readytoBuy = false;
	}

	getCurrentValue(initBuy=false) {
		if (!this.readyToBuy) {
			this.valueSum = this.handStack.getValueSum();
			this.readyToBuy = initBuy;
		}

		return this.valueSum;
	}

	buy(game, stack, callback) {
		this.getCurrentValue(true);
		if (this.buyCount < 1) {
			callback(new Error("No more buy"));
			return false;
		} else if (!game.stack[stack] || game.stack[stack].isEmpty()) {
			callback(new Error("Empty stack"));
			return false;
		} else if (this.valueSum < game.stack[stack].cards[0].cost) {
			callback(new Error("not enough money"));
			return false;
		} else {
			this.valueSum -= game.stack[stack].cards[0].cost;
			var boughtCard = game.buyCard(stack);
			if (boughtCard.type === Card.MONEY_TYPE) {
				boughtCard.enable(false)
			}
			this.handStack.addCard(boughtCard);
			this.buyCount--;
			this.pointSum += boughtCard.getPoint();
			callback(null, {handStack: this.handStack, buyCount: this.buyCount});
			return true;
		}
		return false;
	}

	_updateStaticActions(card) {
		const staticAction = card.action;
		this.buyCount += staticAction.xBuy;
		this.actionCount += staticAction.xAction;
		if (staticAction.xCard > 0) {
			this.fetchCards(staticAction.xCard);
		}
	}

	playActionCard(card_id, callback) {
		if (this.actionCount < 1) {
			callback(new Error("no actions allowed"))
			return false;
		}
		let actionCard = null;
		for (let i = 0; i < this.handStack.cards.length; i++) {
            let card = this.handStack.cards[i];
            if (card.id=== card_id && card.type === Card.ACTION_TYPE) {
                actionCard = card;
                break;
            }
        }
		if (actionCard) {
			if (!actionCard.enabled) {
				callback(new Error("action not enabled"));
				return false;
			}

			this.actionCount--;
			actionCard.useAction();
			this._updateStaticActions(actionCard);

			callback(null, {handStack: this.handStack, actionCard: actionCard});
			return true;
		}

		callback(new Error("no such action card"));
		return false;
	}

	fetchCards(count) {
		if (count > this.drawStack.leftCount()) {
			this.drawStack.addCards(Deck.shuffle(this.discardStack.cards));
			this.discardStack.emptyDeck();
		}
		this.handStack.addCards(this.drawStack.fetchCards(count));
		return this.handStack;
	}

	startNewRound() {
		this.valueSum = 0;
		this.buyCount = 1;
		this.actionCount = 1;
		this. readyToBuy = false;
		for (var i = 0; i < this.handStack.cards.length; i++) {
			var card = this.handStack.cards[i];
			if (card.getType() === Card.ACTION_TYPE || card.getType() === Card.MONEY_TYPE) {
				card.resetCard();
			}
		}
		this.discardStack.addCards(this.handStack.cards);
		this.handStack.emptyDeck();
		return this.fetchCards(5);
	}
}

module.exports = Player;

