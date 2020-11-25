class JoinForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: '', submitted: false, started: false};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      socket.on("joined", () => {
         debugger
      });
      socket.on("game", () => {
        this.setState({started: true})
      })
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      if (!!this.state.value) {
        socket.emit('joined', this.state.value);
        this.setState({submitted: true});
      }
      event.preventDefault();
    }

    startGame = (event) =>{
      socket.emit("start");
      this.setState({started: true});
      event.preventDefault();
    }
  
    render() {
        if (this.state.started) {
          return <p>Welcome {this.state.value}, Game started!</p>
        } else if (this.state.submitted && !this.state.started) {
            return (
                <div> 
                  <p>Welcome {this.state.value}</p>
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

  ReactDOM.render(
    <JoinForm />,
    document.getElementById('root')
  );