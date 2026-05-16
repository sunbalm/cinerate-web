'use client';

import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useToast } from "@/context/ToastContext";

export default function UpdateName() {
    const [name, setName] = useState('');
    const { showToast } = useToast();
    const { socket } = useSocket()

    function updateName(event){
        event.preventDefault();
        socket.emit(
            'update_name', 
            {
                socketid: socket.id, 
                name: name
            })
        showToast('Name Updated', 'success')
    }

    return (
        <div className='section'>

            <div className='card'>
                <h2>Enter Name</h2>
                <form onSubmit={updateName}>
                    <label>Name</label>
                    <input 
                        placeholder={socket.id} 
                        value={name} 
                        onChange={(event) => 
                            setName(event.target.value)} />
                    <button type="submit">Update Name</button>
                </form>
            </div>

        </div>
    )
}