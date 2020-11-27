class App extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {
        return (
            <div>
                <JoinForm></JoinForm>
                <Gameboard></Gameboard>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);