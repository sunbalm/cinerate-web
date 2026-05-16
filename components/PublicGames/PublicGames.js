
import { useRouter } from 'next/navigation';
import { useSocket } from "@/context/SocketContext";

export default function PublicGames() {
    const router = useRouter();
    const { socket, games } = useSocket();

    function joinGame(targetGame){
        socket.emit(
            "join_game", 
            {
                targetGame: targetGame, 
                targetUser: socket.id
            })
        router.push("/lobby");
    }

    return (
        <div className='section'>
            
            <div className='card'>
                <h2>Public Games</h2>
                <ul>
                    {Object.keys(games).map((game) => {
                        const currentGame = games[game];
                        
                        if (currentGame.password.length !== 0 || currentGame.active) {
                            return null;
                        }
                        
                        return (
                            <li
                                onClick={() => joinGame(game)}
                                key={`game-${currentGame.host}`}
                            >
                                <p>{currentGame.gameName}</p>
                                <p className="small">
                                    {currentGame.players.length} / {currentGame.playerCount} Players
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
      </div>
    )
}