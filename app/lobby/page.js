'use client';

import { useSocket } from '@/context/SocketContext';
import { useGame } from '@/context/GameContext';

import ConnectionMsg from '@/components/ConnectionMsg';

export default function LobbyPage(){
  const { socket, connected } = useSocket();
  const { game } = useGame();

  function handleStartGame(){
     socket.emit('start_game', game)
  }

    return (
        <>
            {connected ? 
                <div className='page-container'>
                    {game && 
                        <>
                            <div className='section'>
                                
                                <div className='card'>
                                    <h2>Lobby</h2>
                                    <h3>{game.gameName}</h3>
                                    <h4>Critics 
                                        <span>
                                            <p className='small'>
                                                {game.players.length} / {game.playerCount} Critics
                                            </p>
                                        </span>
                                    </h4>
                                    
                                    {game.players.map((player, index) => {
                                        return (
                                            <p key={`player-${index}`}>
                                                {player.name}
                                            </p>)
                                    })} 
                                    
                                    <br /><br />
                                    {game.host === socket.id ? 
                                    <button onClick={handleStartGame} disabled={game.players.length < 2}>
                                        Start Game
                                    </button> 
                                : <p>Waiting for host to start the game.</p>}
                                </div>
                            </div>
                        </>
                    }
                </div> 
                : <ConnectionMsg />}
        </>
    )
}