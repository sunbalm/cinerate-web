"use client"

import { useSocket } from "@/context/SocketContext";

export default function Footer(){
    const { socket, connected, onlineUsers } = useSocket();

    return (
        <div className='footer'>
            <p>{connected ? "Connected" : "Disconnected"}</p>
            <p>Online: {onlineUsers}</p>
            <p>Sunbalm</p>
        </div>
    )
}