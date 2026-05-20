"use client"

import { useSocket } from "@/context/SocketContext";

export default function Footer(){
    const { onlineUsers } = useSocket();

    return (
        <div className='footer'>
            <p className='small'>Online: {onlineUsers}</p>
        </div>
    )
}
