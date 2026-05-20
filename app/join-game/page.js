'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { useToast } from '@/context/ToastContext';

import ConnectionMsg from '@/components/ConnectionMsg';

export default function JoinGamePage(){
    const [roomID, setRoomID] = useState('');
    const [password, setPassword] = useState('');
    const [joining, setJoining] = useState(false);

    const { socket, connected } = useSocket();
    const { showToast } = useToast();
    const router = useRouter();

    function joinGame(event){
        event.preventDefault();

        const targetGame = roomID.trim();

        if (!targetGame) {
            showToast('Room code is required.', 'error');
            return;
        }

        setJoining(true);

        socket.emit(
            'join_game',
            {
                targetGame,
                password,
            },
            (response) => {
                setJoining(false);

                if (!response?.ok) {
                    showToast(response?.error || 'Unable to join game.', 'error');
                    return;
                }

                router.push('/lobby');
            }
        )
    }

    return (
        <>
            {connected ?
                <div className='page-container'>
                    <div className='section'>
                        <div className='card'>
                            <h2>Join Private Game</h2>

                            <form onSubmit={joinGame}>
                                <div className='form-group'>
                                    <label>Room Code</label>
                                    <input
                                        type='text'
                                        value={roomID}
                                        onChange={(event) => setRoomID(event.target.value)}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Password</label>
                                    <input
                                        type='text'
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>

                                <button type='submit' disabled={joining}>
                                    {joining ? 'Joining...' : 'Join Game'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            : <ConnectionMsg />}
        </>
    )
}
