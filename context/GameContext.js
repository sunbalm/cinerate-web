"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

const GameContext = createContext();

export function GameProvider({ children }) {
  const { socket, connected } = useSocket();
  const [game, setGame] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!connected) return;

    socket.on("update_game", ({gameData}) => {
      setGame(gameData);
    });

    socket.on("started_game", ({gameData}) => {
        setGame(gameData);
        router.push('/game');
    });

        socket.on("movie_set", ({gameData}) => {
        setGame(gameData);
    });

    return () => {
      socket.off("game_updated", () => {console.log("off")});
    };
  }, [socket, connected]);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}