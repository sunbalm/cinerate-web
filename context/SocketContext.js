"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [games, setGames] = useState({});
  const [alias, setAlias] = useState("");

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

    const onOnlineUsers = (data) => setOnlineUsers(data);
    const onGames = (data) => setGames(data || {});
    const onUpdatedName = (data) => setAlias(data.name);

    socket.on("connect", onConnect);
    socket.on("online_users", onOnlineUsers);
    socket.on("games", onGames);
    socket.on("disconnect", onDisconnect);
    socket.on("updated_name", onUpdatedName);

    return () => {
      socket.off("connect", onConnect);
      socket.off("online_users", onOnlineUsers);
      socket.off("games", onGames);
      socket.off("disconnect", onDisconnect);
      socket.off("updated_name", onUpdatedName);
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
        alias
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
