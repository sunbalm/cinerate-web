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

    function hydrateGame(gameData, serverNow) {
      if (!gameData) {
        setGame(null);
        return;
      }

      setGame({
        ...gameData,
        _serverNow: serverNow,
        _receivedAt: Date.now(),
      });
    }

    function handleUpdateGame({ gameData, serverNow }) {
      hydrateGame(gameData, serverNow);
    }

    function handleStartedGame({ gameData, serverNow }) {
      hydrateGame(gameData, serverNow);
      router.push('/game');
    }

    function handleMovieSet({ gameData, serverNow }) {
      hydrateGame(gameData, serverNow);
    }

    function handleGameRemoved() {
      setGame(null);
      router.push('/');
    }

    function handleLeftGame() {
      setGame(null);
      router.push('/');
    }

    socket.on("update_game", handleUpdateGame);
    socket.on("started_game", handleStartedGame);
    socket.on("movie_set", handleMovieSet);
    socket.on("game_removed", handleGameRemoved);
    socket.on("left_game", handleLeftGame);

    return () => {
      socket.off("update_game", handleUpdateGame);
      socket.off("started_game", handleStartedGame);
      socket.off("movie_set", handleMovieSet);
      socket.off("game_removed", handleGameRemoved);
      socket.off("left_game", handleLeftGame);
    };
  }, [socket, connected, router]);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
