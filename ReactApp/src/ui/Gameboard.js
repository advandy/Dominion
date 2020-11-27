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
                <div style={{position: "relative"}}>
                    {
                        this.STACK.map((card_name) => {
                            let cards = this.state.cards[card_name].cards;
                            let size = cards.length;
                            return (<div style={{position: "relative", width:"250px", height: "350px", paddingLeft: "10px", float: "left"}}>
                                <a style={{marginLeft: "110px"}}>left: {size} <button data={cards[0].name} onClick={this.handleBuy}>BUY</button></a>
                                {
                                    cards.map((card, idx) => {
                                        const style = {
                                            "display":"inline",
                                            "position": "absolute", 
                                            "left": "0px", 
                                            "marginLeft": 2*idx +"px",
                                            "marginTop": 2*idx +"px" 
                                        }
                                        return <li key={card.id} style={style}>
                                            <img style={{"height": "200px"}} src={"img/" + card.name +".jpg"}></img>
                                        </li>
                                    })
                                }
                            
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