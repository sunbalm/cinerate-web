"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [games, setGames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected");
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("online_users", data => setOnlineUsers(data));
    socket.on("games", data => setGames(data));
    socket.on("disconnect", onDisconnect);
    
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        onlineUsers,
        games,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}