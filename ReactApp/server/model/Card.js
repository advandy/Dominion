"use strict";
class Card {
	constructor(name, cost, id) {
		this.name = name;
		this.cost = cost;
		this.value = 0;
		this.point = 0;
		this.id = id;
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
	constructor(name, cost, id) {
		super(name, cost, id);
		this.type = Card.MONEY_TYPE;
		this.canBeUsed = true;
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

	getValue() {
		return this.canBeUsed ? this.value : 0;
	}

	resetCard() {
		this.canBeUsed = true;
	}

	enable(bEnabled) {
		this.canBeUsed = bEnabled;
	}
}

class ActionCard extends Card {
	constructor(name, cost, action, id) {
		super(name, cost);
		this.type = Card.ACTION_TYPE;
		this.action = action;
		this.isUsed = false;
		this.enabled = false;
		this.id = id;
		this.status = null;
	}

	enable(bEnabled) {
		this.enabled = bEnabled;
	}

	useAction() {
		this.enabled = false;
		this.isUsed = true;
		this.status = "waiting"
	}

	resetCard() {
		this.enabled = true;
		this.isUsed = false;
		this.status = null;
	}

	getValue() {
		return this.isUsed ? this.action.xValue : 0;
	}
}

class PointCard extends Card {
	constructor(name, cost, id) {
		super(name, cost, id);
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

module.exports = {
    Card: Card,
    MoneyCard: MoneyCard,
    ActionCard: ActionCard,
    PointCard: PointCard
}