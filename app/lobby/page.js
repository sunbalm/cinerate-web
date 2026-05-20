'use client';

import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';

import ConnectionMsg from '@/components/ConnectionMsg';

export default function LobbyPage(){
  const [starting, setStarting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { socket, connected } = useSocket();
  const { game } = useGame();
  const { showToast } = useToast();

  function handleStartGame(){
     setStarting(true);

     socket.emit('start_game', { roomID: game.roomID }, (response) => {
        setStarting(false);

        if (!response?.ok) {
            showToast(response?.error || 'Unable to start game.', 'error');
        }
     })
  }

  function handleLeaveLobby(){
     setLeaving(true);

     socket.emit('leave_game', { roomID: game.roomID }, (response) => {
        setLeaving(false);

        if (!response?.ok) {
            showToast(response?.error || 'Unable to leave lobby.', 'error');
        }
     })
  }

    return (
        <>
            {connected ? 
                <div className='page-container'>
                    {game && 
                        <>
                            <div className='section'>
                                <div className='card'>
                                    <div className='card-heading'>
                                        <div>
                                            <h2>Lobby</h2>
                                            <h3>{game.gameName}</h3>
                                            <p className='code-row'>
                                                Room Code: <span>{game.roomID}</span>
                                            </p>
                                        </div>
                                        <p className='status-pill'>
                                            {game.players.length} / {game.playerCount} Critics
                                        </p>
                                    </div>
                                    
                                    <ul className='player-list'>
                                        {game.players.map((player) => {
                                            const isHost = player.socketID === game.host;

                                            return (
                                                <li key={player.socketID}>
                                                    <span>{player.name}</span>
                                                    {isHost && <span className='small'>Host</span>}
                                                </li>
                                            )
                                        })} 
                                    </ul>
                                    
                                    <div className='button-row'>
                                        {game.host === socket.id ? 
                                        <button
                                            onClick={handleStartGame}
                                            disabled={game.players.length < 2 || starting || leaving}
                                        >
                                            {starting ? 'Starting...' : 'Start Game'}
                                        </button> 
                                    : <p className='muted'>Waiting for host to start the game.</p>}

                                        <button
                                            className='secondary-button'
                                            onClick={handleLeaveLobby}
                                            disabled={starting || leaving}
                                        >
                                            {leaving ? 'Leaving...' : 'Leave Lobby'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div> 
                : <ConnectionMsg />}
        </>
    )
}
