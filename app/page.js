'use client'

import { useSocket } from "@/context/SocketContext";
import { useState } from 'react'
import { useRouter } from "next/navigation";

export default function Home(){
  const { socket, connected, games } = useSocket();
  const [name, setName] = useState("");
  const router = useRouter();

  function updateName(event){
    event.preventDefault();
    const payload = {socketid: socket.id, name: name}
    socket.emit("update_name", payload)
  }

  function joinGame(targetGame){
    socket.emit("join_game", {targetGame: targetGame, targetUser: socket.id})
    router.push("/lobby");
  }

  return (
    <div className='page-container'>
      {connected ? 
        <>
        <form onSubmit={updateName}>
        <label>Name:</label>
        <input placeholder={socket.id} value={name} onChange={(event) => setName(event.target.value)}></input>
      <button type="submit">Update</button>
      </form>

      <button onClick={() => router.push("/create-game")}>Create Game</button>
    
      <button>Join Private Game</button>

      <h2>Public Games</h2>
      <ul>
        {Object.keys(games).map((game, index) => {
          return (
            <div key={`game-${index}`}>
              {games[game].password.length === 0 &&
              !games[game].active && (
                <li key={`game-${games[game].host}`}>
                  <span>{games[game].gameName}</span> 
                  <span>{games[game].players.length} / {games[game].playerCount} Players</span> 
                  <span><button onClick={() => joinGame(game)}>Join Game</button></span>
                </li>
              )}
            </div>
          );          
        })}
      </ul>
      </> : <><p>Server warming up.</p></>}
    </div>
  )
}