class Action {
	constructor(xBuy, xCard, xAction, xValue, fnAction) {
		this.xBuy = xBuy;
		this.xCard = xCard;
		this.xAction = xAction;
		this.xValue = xValue;
		this.takeAction = fnAction;
	}
}

module.exports = Action