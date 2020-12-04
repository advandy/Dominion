import React from 'react';
export default class JoinForm extends React.Component {
    constructor(props) {
      super(props);
      this.socket = props.socket;
      this.state = {value: '', submitted: false, started: false};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.socket.on("joined", (msg) => {
         
      });
      this.socket.on("game", () => {
        this.setState({started: true})
      })
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      if (!!this.state.value) {
        this.socket.emit('joined', this.state.value);
        this.setState({submitted: true});
      }
      event.preventDefault();
    }

    startGame = (event) =>{
      this.socket.emit("start");
      this.setState({started: true});
      event.preventDefault();
    }
  
    render() {
        if (this.state.started) {
          return <a>Welcome {this.state.value}, Game started!</a>
        } else if (this.state.submitted && !this.state.started) {
            return (
                <div> 
                  <a>Welcome {this.state.value}</a>
                  <button onClick={this.startGame}>Start Game</button>
                </div>
              )
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                  </label>
                  <input type="submit" value="Submit" />
                </form>
              );
        }
    }
  }