'use client';

import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useToast } from "@/context/ToastContext";

export default function UpdateName() {
    const [name, setName] = useState('');

    const { showToast } = useToast();
    const { socket, alias } = useSocket();

    function validateName(value) {
        const trimmed = value.trim();

        // Empty
        if (!trimmed) {
            return 'Name is required';
        }

        // Max length
        if (trimmed.length > 15) {
            return 'Name must be 15 characters or less';
        }

        // Only letters
        // Allows uppercase + lowercase letters only
        if (!/^[A-Za-z]+$/.test(trimmed)) {
            return 'Name can only contain letters';
        }

        return null;
    }

    function updateName(event) {
        event.preventDefault();

        const error = validateName(name);

        if (error) {
            showToast(error, 'error');
            return;
        }

        socket.emit('update_name', {
            socketid: socket.id,
            name: name.trim()
        });

        showToast('Name Updated', 'success');

        setName('');
    }

    return (
        <div className='section'>
            <div className='card'>
                <h2>Enter Name</h2>

                <form onSubmit={updateName}>
                    <label>Name</label>

                    <input
                        placeholder={alias ? alias : socket?.id}
                        value={name}
                        maxLength={15}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <button type="submit">
                        Update Name
                    </button>
                </form>
            </div>
        </div>
    );
}