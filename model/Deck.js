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

	getCardById(card_id) {
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].id === card_id) {
				return this.cards[i]
			}
		}

		return null;
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

	discardCard(card_id) {
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].id === card_id) {
				return this.cards.splice(i, 1)[0];
			}
		}

		return false;
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

module.exports = Deck;
