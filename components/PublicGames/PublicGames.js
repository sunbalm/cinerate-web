
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';

export default function PublicGames() {
    const router = useRouter();
    const { socket, games } = useSocket();
    const { game } = useGame();
    const { showToast } = useToast();
    const [joiningRoom, setJoiningRoom] = useState(null);

    function joinGame(targetGame){
        setJoiningRoom(targetGame);
        socket.emit(
            "join_game", 
            {
                targetGame: targetGame, 
                targetUser: socket.id
            },
            (response) => {
                setJoiningRoom(null);

                if (!response?.ok) {
                    showToast(response?.error || 'Unable to join that game.', 'error');
                    return;
                }

                router.push("/lobby");
            }
        )
    }

    const publicGames = Object.values(games);
    const currentGameName = game?.players?.some((player) => {
        return player.socketID === socket.id;
    }) ? game.gameName : null;

    return (
        <div className='section'>
            
            <div className='card'>
                <h2>Public Games</h2>
                {currentGameName && (
                    <div className='notice-row'>
                        <p>You are already in {currentGameName}.</p>
                        <button onClick={() => router.push('/lobby')}>Return to Lobby</button>
                    </div>
                )}

                {publicGames.length === 0 ? (
                    <p className='muted'>No public games are open right now.</p>
                ) : (
                    <ul className='game-list'>
                        {publicGames.map((currentGame) => {
                            const isJoining = joiningRoom === currentGame.roomID;

                            return (
                                <li key={`game-${currentGame.roomID}`}>
                                    <button
                                        className='game-list-button'
                                        onClick={() => joinGame(currentGame.roomID)}
                                        disabled={Boolean(currentGameName) || isJoining}
                                    >
                                        <span>{currentGame.gameName}</span>
                                        <span className="small">
                                            {currentGame.players.length} / {currentGame.playerCount} Players
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
      </div>
    )
}
