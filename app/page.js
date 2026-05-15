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
        <div className='section'>
        <form onSubmit={updateName}>
        <label>Name</label>
        <input placeholder={socket.id} value={name} onChange={(event) => setName(event.target.value)}></input>
      <button type="submit">Update</button>
      </form>
      </div>

<div className='section grid'>
<button onClick={() => router.push("/create-game")}>Create Game</button>
    
      <button>Join Private Game</button>
</div>
      
<div className='section'>
      <h2>Public Games</h2>
      <p className='small'>Click game below to join</p>
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
      </> : <div className='section'><p>Server warming up.</p><div className="loader-container">
  <div
    className="loader-bar"
    style={{ "--duration": "75s" }}
  ></div></div>
  </div>}
      
    </div>
  )
}