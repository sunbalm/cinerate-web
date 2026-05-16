'use client'

import { useSocket } from '@/context/SocketContext';

import UpdateName from '@/components/UpdateName';
import CreateJoin from '@/components/CreateJoin';
import PublicGames from '@/components/PublicGames';
import ConnectionMsg from '@/components/ConnectionMsg';

export default function Home(){
  const { socket, connected, games } = useSocket();

  return (
    <>
      {connected ? 
        <div className='page-container'>
          <UpdateName socket={socket} />
          <CreateJoin />
          <PublicGames socket={socket} games={games} />
        </div>
      :<ConnectionMsg />}
    </>
  )
}