'use client';

import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import { generateGameName } from '@/functions/generateGameName';
import { useToast } from "@/context/ToastContext";

import ConnectionMsg from '@/components/ConnectionMsg';

export default function CreateGamePage(){
    const [password, setPassword] = useState('');
    const [playerCount, setPlayerCount] = useState(2);
    const [gameName, setGameName] = useState(generateGameName())
    const [winCount, setWinCount] = useState(5);
    const [creating, setCreating] = useState(false);
    
    const { socket, connected } = useSocket();
    const router = useRouter();
    const { showToast } = useToast();

    function validateGameName(value) {
        const trimmed = value.trim();

        // Max length check
        if (trimmed.length > 50) {
            showToast('Game name must be 50 characters or less', 'error');
            return false;
        }

        if (!/^[A-Za-z\s]+$/.test(trimmed)) {
            showToast('Game name can only contain letters and spaces', 'error');
            return false;
        }

        return true;
    }

    function createGame(event){
        event.preventDefault();

        if(validateGameName(gameName)){
            setCreating(true);

            const payload = {
                socketid: socket.id, 
                password: password, 
                playerCount: Number(playerCount),
                gameName: gameName,
                winCount: Number(winCount)
            }

            socket.emit('create_game', payload, (response) => {
                setCreating(false);

                if (!response?.ok) {
                    showToast(response?.error || 'Unable to create game.', 'error');
                    return;
                }

                router.push('/lobby')
            })
        }
    }

    return (
        <>
            {connected ?
                <div className='page-container'>
                    <div className='section'>

                        <div className='card'>
                            <h2>Create Game</h2>
                            <form onSubmit={createGame}>
                                <div className='form-group'>
                                    <label>Enter game name</label>
                                    <input
                                        type='text'
                                        onChange={(event) => setGameName(event.target.value)}
                                        value={gameName}
                                    />
                                </div>
                                
                                <div className='form-group'>
                                    <label>Points to Win</label>
                                    <input
                                        type='number'
                                        min='1'
                                        max='15'
                                        step='1'
                                        onChange={(event) => setWinCount(event.target.value)}
                                        value={winCount}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Max Players</label>
                                    <input
                                        type='number'
                                        min='2'
                                        max='10'
                                        step='1'
                                        onChange={(event) => setPlayerCount(event.target.value)}
                                        value={playerCount}
                                    />
                                </div>

                                <div className='form-group'>
                                    <p>
                                        Enter a password to create a private game 
                                        or leave blank to create a public game.
                                    </p>
                                    <label>Password</label>
                                    <input
                                        placeholder='Password'
                                        type='text'
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>

                                <button type='submit' disabled={creating}>
                                    {creating ? 'Creating...' : 'Create Game'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            : <ConnectionMsg />}
        </>
    )
}
