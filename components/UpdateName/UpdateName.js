'use client';

import { useState } from 'react';

export default function UpdateName({ socket }) {
    const [name, setName] = useState('');
    
    function updateName(event){
        event.preventDefault();
        socket.emit(
            'update_name', 
            {
                socketid: socket.id, 
                name: name
            })
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