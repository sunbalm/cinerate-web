"use client"

import { useSocket } from "@/context/SocketContext";

export default function Footer(){
    const { onlineUsers } = useSocket();

    return (
        <div className='footer'>
            <p className='small'>👁️ {onlineUsers}</p>
            <p className='small'>Sunbalm</p>
        </div>
    )
}