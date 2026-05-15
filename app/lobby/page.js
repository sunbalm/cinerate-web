'use client';

import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";

export default function LobbyPage(){
  const { socket } = useSocket();
  const { game } = useGame();

  function handleStartGame(){
     socket.emit("start_game", game)
  }

    return (
        <div>
            <h2>Lobby</h2>
            {console.log("game", game)}

            {game ? <>
            
            <h3>{game.gameName}</h3>
            <p>{game.players.length} / {game.playerCount} Players</p>
            <ul>
            {game.players.map((player, index) => {
                return (
                    <li key={`player-${index}`}><p>{player.name}</p></li>
                )
            })} 
            </ul>
            {game.host === socket.id ? 
                <button onClick={handleStartGame} disabled={game.players.length < 2}>Start Game</button> : "Waiting for host to start the game"}
       
            </> : <></>}
             </div>
    )
}