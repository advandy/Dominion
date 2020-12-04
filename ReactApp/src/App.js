import './App.css';
import Gameboard from "./ui/Gameboard";
import JoinForm from "./ui/JoinForm";
import Player from "./ui/Player";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://localhost:3000";
function App() {
  const socket = socketIOClient(ENDPOINT, {withCredentials: true});
  return (
    <div className="App" style={{backgroundImage: "url(img/background.jpg)", height: "100%", backgroundSize: "cover", fontFamily: "oldLondon"}}>
      <JoinForm socket={socket}></JoinForm>
      <Gameboard socket={socket}></Gameboard>
      <Player socket = {socket}></Player>
    </div>
  );
}

export default App;
