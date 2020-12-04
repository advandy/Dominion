import React from 'react';
export default class Gameboard extends React.Component {
    constructor(props) {
      super(props);
      this.socket = props.socket;
      this.state = {cards: null};
      this.STACK = [
          "Copper", "Silver", "Gold", 
          "Estate", "Duchy", "Province", 
          "Cellar","Chapel",
          "Village", "Woodcutter", "Workshop",
          "Militia", "Remodel", "Smithy",
          "Market", "Mine"
      ]
      this.socket.on("broadcast", (payload) => {
        this.setState({cards: payload.gameStack})
      });
    }
    
    handleBuy = (event) => {
        const card_name = event.currentTarget.getAttribute("data");
        this.socket.emit("game", {event: "buy", payload: card_name})
    }

    render() {
        if (this.state.cards) {
            return(
                <div style={{position: "fixed", width: "55%", left:"22.5%"}}>
                    {
                        this.STACK.map((card_name) => {
                            let cards = this.state.cards[card_name].cards;
                            let size = cards.length;
                            return (<div style={{position: "relative", width: "12.5%", display: "inline-flex"}}>
                                <a> <img style={{height: "170px"}} src={"img/" + card_name +".jpg"}></img></a>
                                <a style={{borderRadius: "25%", color: "white", background: "red", width: "20px", height: "25px", marginLeft: "-7px"}} class="card_count"> {size} </a>
                                <button style={{borderRadius: "25%",marginLeft: "-22px", marginTop: "150px"}} data={card_name} onClick={this.handleBuy}>+</button>                        
                            </div>)
                        })
                    }
                </div>
            )
        } else {
            return <p>Game not started yet</p>
        }
    }
}