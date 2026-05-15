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
        <div className='page-container'>
            
            {game ? 
            <>
                <div className='section'>
                    <h2>Lobby</h2>
                    <p>{game.gameName}</p>

                    <h4>Critics <span><p className='small'>{game.players.length} / {game.playerCount} Critics</p></span></h4>
           
                    {game.players.map((player, index) => {
                        return (
                            <p key={`player-${index}`}>{player.name}</p>
                        )
                        })} 
                </div>

                    {game.host === socket.id ? 
                <div className='section'>
                    <button onClick={handleStartGame} disabled={game.players.length < 2}>Start Game</button>
                    </div>
                    : <div className='section'><p>Waiting for host to start the game</p></div>}
            </> : <></>}
         
             </div>
    )
}