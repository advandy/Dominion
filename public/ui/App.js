import JoinForm from "join_game";


class App extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {
        <div>
            <JoinForm></JoinForm>
        </div>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);