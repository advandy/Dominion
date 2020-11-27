import React from 'react';
export default class Player extends React.Component {
    constructor(props) {
      super(props);
      this.socket = props.socket;
      this.state = {handStack: null, deskStack: null};
      this.multiSelect = false;
      this.showAction = false;
      this.showDiscardCards = false; //Cellar action
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
            if (msg.event === "new round" || msg.event === "bought") {
                return this.setState({handStack: msg.payload.handStack.cards})
            }
    
            if (msg.event === "action_played") {
                if (msg.payload.actionCard.name === "Cellar" && msg.payload.actionCard.status === "waiting") {
                    this.multiSelect = true;
                    this.showDiscardCards = true;
                }
                this.setState({handStack: msg.payload.handStack.cards});
            }

            if (msg.event === "action_cellar_complete") {
                this.setState({handStack: msg.payload.cards});
            }
        });
    }

    handleClick = (event) => {
        const cards = this.state.handStack;
        const id = event.currentTarget.getAttribute("data");
        let selectedCard = null;
        this.showAction = false
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
                    this.showAction = selectedCard.selected;
                }

        } else {
            cards.forEach((card) => {
                if (card.id === Number(id)) {
                    card.selected = !card.selected;
                    return;
                }
            });
        }

        this.setState({handStack: cards});
    }

    handleFinish = () => {
        this.showAction = false;
        this.multiSelect = false;
        this.socket.emit("game", {event: "finish_round"});
    }

    handleDiscardCards  = () => {
        const cards = this.state.handStack
                        .filter(card => card.selected)
                        .map(card => card.id);
        this.showAction = false;
        this.multiSelect = false;
        this.showDiscardCards = false;
        this.socket.emit("game", {event: "action_cellar", payload: cards});
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
            let actionButton, discardButton;
            if (this.showAction) {
                actionButton = <button onClick={this.handleAction}>Play Action</button>;
            }
            if (this.showDiscardCards) {
                discardButton = <button onClick={this.handleDiscardCards}>Discard Cards</button>;
            }
            return (<div style={{width: "30%", position: "relative", float: "left", background: "rgb(237, 212, 166)", marginRight: "20px"}}>
                {
                    this.state.handStack
                    .filter(card => !card.isUsed)
                    .map((card) => {
                       if (card.selected) {
                            return <a><img style={{width: "100px", margin: "10px", border: "10px solid gold"}} data={card.id} onClick={this.handleClick} src={"img/" + card.name +".jpg"}></img></a>
                       } else {
                            return <a><img style={{width: "100px", margin: "10px"}} data={card.id} onClick={this.handleClick} src={"img/" + card.name +".jpg"}></img></a>
                       }
                        
                    })
                }

                {actionButton}
                {discardButton}
                <button onClick={this.handleFinish}>Finish</button>

                {
                    this.state.handStack
                    .filter(card => card.isUsed)
                    .map((card) => {
                        return <a><img style={{width: "100px", margin: "10px", opacity: "0.7"}} data={card.id} src={"img/" + card.name +".jpg"}></img></a>
                    })
                }


            </div>)
        }

        return <div style={{width: "30%", position: "relative", float: "left", marginRight: "20px"}}></div>
    }
}