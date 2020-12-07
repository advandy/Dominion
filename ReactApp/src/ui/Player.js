import { timingSafeEqual } from 'crypto';
import React from 'react';
export default class Player extends React.Component {
    constructor(props) {
      super(props);
      this.socket = props.socket;
      this.state = {handStack: null, status: null, yourTurn: false};
      this.multiSelect = false;
      this.multiSelectMax = 0; //Chapel action
      this.showAction = false;
      this.showDiscardCards = false; //Cellar action
      this.showTrashCards = false; //Chapel action
      this.STACK = [
          "Copper", "Silver", "Gold", 
          "Estate", "Duchy", "Province", 
          "Cellar","Chapel",
          "Village", "Woodcutter", "Workshop",
          "Militia", "Remodel", "Smithy",
          "Market", "Mine"
      ]
    }

    componentDidMount() {
        this.socket.on("game", (msg) => {
            if (msg.event === "error") {
                return alert(msg.payload);
            }
    
            if (msg.event === "action_played") {
                if (msg.payload.actionCard.name === "Cellar" && msg.payload.actionCard.status === "waiting") {
                    this.multiSelect = true;
                    this.showDiscardCards = true;
                } else if (msg.payload.actionCard.name === "Chapel" && msg.payload.actionCard.status === "waiting") {
                    this.multiSelect = true;
                    this.showTrashCards = true;
                    this.multiSelectMax = 4;
                }
            } else if (msg.event === "militia") {
                this.setState({status: msg.payload});
                this.multiSelect = true;
                return;
            }
 
            return  this.setState({handStack: msg.payload.handStack.cards, status: msg.payload.status, yourTurn: msg.payload.yourTurn});
        });
    }

    handleClick = (event) => {
        if (!this.state.yourTurn && !this.state.status.actionRequired) {
            return;
        }
        const cards = this.state.handStack;
        const id = event.currentTarget.getAttribute("data");
        let selectedCard = null;
        this.showAction = false;
        if (this.state.status.actionRequired === "militia") {
            this.multiSelect = true;
        }
        if (!this.multiSelect) {
            cards.forEach((card) => {
                if (card.id !== Number(id)) {
                    card.selected = false;
                } else {
                    selectedCard = card;
                    card.selected = !card.selected;
                }
            });

            if (selectedCard && selectedCard.type === "action" &&
                !selectedCard.isUsed && selectedCard.enabled) {
                    this.showAction = selectedCard.selected && this.state.status && this.state.status.actionCount > 0;
                }

        } else {
            let count = 0;
            cards.forEach((card) => {
                if (card.id === Number(id)) {
                    card.selected = !card.selected;
                } 
                
                if (this.multiSelectMax !== 0 && card.selected) {
                    count ++;
                    if (count > this.multiSelectMax) {
                        alert("Only up to " + this.multiSelectMax + " cards");
                        cards.forEach((card) => {
                            if (card.id === Number(id)) {
                                card.selected = false;
                            } 
                        })
                    }
                }
            });
        }

        this.setState({handStack: cards});
    }

    handleFinish = () => {
        this.showAction = false;
        this.multiSelect = false;
        this.showDiscardCards = false;
        this.showTrashCards = false;
        this.setState({handStack: null, status: null});
        this.socket.emit("game", {event: "finish_round"});
    }

    handleDiscardCards  = () => {
        const cards = this.state.handStack
                        .filter(card => card.selected)
                        .map(card => card.id);
        this.showAction = false;
        this.multiSelect = false;
        this.showDiscardCards = false;
        this.multiSelectMax = 0;
        this.socket.emit("game", {event: "action_cellar", payload: cards});
    }

    handleMilitia = () => {
        const cards = this.state.handStack
                        .filter(card => card.selected)
                        .map(card => card.id);
        if (this.state.handStack.length - cards.length !== 3) {
            return  alert("Discard down to Three Cards");
        }

        this.multiSelect = false;
        this.socket.emit("game", {event: "action_militia", payload: cards});
    }

    handleTrashCards = () => {
        const cards = this.state.handStack
                        .filter(card => card.selected)
                        .map(card => card.id);
        this.showAction = false;
        this.multiSelect = false;
        this.showTrashCards = false;
        this.socket.emit("game", {event: "action_chapel", payload: cards});
    }

    handleAction = () => {
        let card_id = null;
        this.state.handStack.forEach((card) => {
            if (card.selected && card.type === "action") {
                return card_id = card.id
            }
        });
        this.showAction = false;
        this.socket.emit("game", {event: "action", payload: card_id});
    }
    
    render() {
        if (this.state.handStack) {
            let actionButton, discardButton, statusBar, trashButton, watchingPlayer, finishButton, militia_discard_button;
            if (this.showAction && this.state.yourTurn) {
                actionButton = <button onClick={this.handleAction}>Play Action</button>;
            }
            if (this.showDiscardCards && this.state.yourTurn) {
                discardButton = <button onClick={this.handleDiscardCards}>Discard Cards</button>;
            }
            if (this.showTrashCards && this.state.yourTurn) {
                trashButton = <button onClick={this.handleTrashCards}>Trash up to 4 Cards</button>;
            }
            if (this.state.yourTurn) {
                finishButton = <button onClick={this.handleFinish}>Finish</button>
            }

            if (this.state.status.actionRequired === "militia") {
                militia_discard_button = <button onClick={this.handleMilitia}>Discard down to 3 Cards</button>
            }

            if (this.state.status) {
            statusBar = (<div style={{width: "100%", position: "relative", fontSize: "xx-large", color: "honeydew"}}>
                    <i>Buy: {this.state.status.buyCount}, </i>
                    <i>Action: {this.state.status.actionCount}, </i>
                    <i>Coin: {this.state.status.value}, </i>
                </div>
            )
            }
            return (<div className="player" style={{width: "50%", position: "fixed", left: "25%" , bottom: "10px"}}>
                <div className="playedCardArea" style={{width: "100%"}}>
                {
                    this.state.handStack
                    .filter(card => card.isUsed)
                    .map((card) => {
                        return <a><img style={{width: "120px", margin: "10px"}} data={card.id} src={"img/" + card.name +".jpg"}></img></a>
                    })
                }
                </div>
                {watchingPlayer}
                {statusBar}
                {actionButton}
                {discardButton}
                {trashButton}
                {finishButton}
                {militia_discard_button}

                {
                    this.state.handStack
                    .filter(card => !card.isUsed)
                    .map((card) => {
                       if (card.selected) {
                            return <a><img style={{width: "120px", margin: "10px", border: "10px solid gold"}} data={card.id} onClick={this.handleClick} src={"img/" + card.name +".jpg"}></img></a>
                       } else {
                            return <a><img style={{width: "120px", margin: "10px"}} data={card.id} onClick={this.handleClick} src={"img/" + card.name +".jpg"}></img></a>
                       }
                        
                    })
                }


            </div>)
        }

        return <div style={{width: "30%", position: "relative", float: "left", marginRight: "20px"}}></div>
    }
}