'use client';

import { useGame } from "@/context/GameContext";

import ChooseMovie from '@/components/ChooseMovie';
import SubmitRating from '@/components/SubmitRating';
import RoundResults from '@/components/RoundResults';
import GameOver from '@/components/GameOver';

export default function GamePage(){
    const { game } = useGame();

    if (!game) {
        return (
            <div className='page-container'>
                <div className='section'>
                    <div className='card'>
                        <h2>No Active Game</h2>
                        <p className='muted'>Join or create a game to start playing.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='page-container'>
            {game.state === "choose movie" && <ChooseMovie />}
            {game.state === "submit rating" && <SubmitRating />}
            {game.state === "view round results" && <RoundResults />}
            {game.state === "game over" && <GameOver />}
        </div>
    )
}
