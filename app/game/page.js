'use client';

import { useState, useEffect } from 'react';
import { useGame } from "@/context/GameContext";
import { useRouter } from "next/navigation";

import ChooseMovie from '@/components/ChooseMovie';
import SubmitRating from '@/components/SubmitRating';
import RoundResults from '@/components/RoundResults';
import GameOver from '@/components/GameOver';

export default function GamePage(){
    const [state, setState] = useState("choose movie");

    const { game } = useGame();
    const router = useRouter();
    
    //adjust game state
    useEffect(() => {
        switch(game?.state){
            case "choose movie": setState("choose movie"); break;
            case "submit rating": setState("submit rating"); break;
            case "view round results": setState("view round results"); break;
            case "game over": 
                setState("game over");
                setTimeout(() => {
                    router.push("/")
                }, 10000);
                break;
            default: break;
        }
    })

    return (
        <div className='page-container'>
            {state === "choose movie" && <ChooseMovie />}
            {state === "submit rating" && <SubmitRating />}
            {state === "view round results" && <RoundResults />}
            {state === "game over" && <GameOver />}
        </div>
    )
}