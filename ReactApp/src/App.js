import './App.css';
import Gameboard from "./ui/Gameboard";
import JoinForm from "./ui/JoinForm";
import Player from "./ui/Player";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
function App() {
  const socket = socketIOClient(ENDPOINT);
  return (
    <div className="App">
      <JoinForm socket={socket}></JoinForm>
      <Player socket = {socket}></Player>
      <Gameboard socket={socket}></Gameboard>
    </div>
  );
}

export default App;
