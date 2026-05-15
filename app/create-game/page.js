'use client';

import { useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { generateGameName } from '@/functions/generateGameName';

export default function CreateGamePage(){
    const [password, setPassword] = useState("");
    const [playerCount, setPlayerCount] = useState(2);
    const [gameName, setGameName] = useState(generateGameName())
    const [winCount, setWinCount] = useState(5);
    
    const { socket } = useSocket();
    const router = useRouter();

    function createGame(event){
        event.preventDefault();
        const payload = {
            socketid: socket.id, 
            password: password, 
            playerCount: playerCount,
            gameName: gameName,
            winCount: winCount
        }
        socket.emit("create_game", payload)
        router.push("/lobby")
    }

    return (
        <div className='page-container'>
            

            <div className='section'>
                <h2>Create Game</h2>

<form onSubmit={createGame}>
  <div className="form-group">
    <label>Enter game name</label>

    <input
      type="text"
      onChange={(event) => setGameName(event.target.value)}
      value={gameName}
    />
  </div>

  <div className="form-group">
    <label>Points to Win</label>

    <input
      type="number"
      min="1"
      max="15"
      step="1"
      onChange={(event) => setWinCount(event.target.value)}
      value={winCount}
    />
  </div>

  <div className="form-group">
    <label>Max Players</label>

    <input
      type="number"
      min="2"
      max="10"
      step="1"
      onChange={(event) => setPlayerCount(event.target.value)}
      value={playerCount}
    />
  </div>

  <div className="form-group">
    <p>
      Enter a password to create a private game
      or leave blank to create a public game.
    </p>

    <label>Password</label>

    <input
      placeholder="Password"
      type="text"
      onChange={(event) => setPassword(event.target.value)}
    />
  </div>

  <button type="submit">
    Create Game
  </button>
</form>
            </div>
        </div>
    )
}