'use client';

import { useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";

import LoaderBar from '@/components/LoaderBar';

export default function SubmitRating(){
    const [movieRating, setMovieRating] = useState(5.5);
    const [disableGuess, setDisableGuess] = useState(false);
    
    const { game } = useGame();
    const { socket } = useSocket();

    function submitRating(event){
        event.preventDefault()
        socket.emit(
            'submit_rating', 
            {
                game,
                movieRating, 
                user: socket.id
            });
        setDisableGuess(true);
    }

    return (
        <>
        <div className='section'>
            <div className='card'>    
                <h2>Guess Rating</h2>
                <h3>{game.guessMovie.Title}</h3>
                <img 
                    className='movie-poster' 
                    src={game.guessMovie.Poster} 
                />
                    
                <label>Guess Rating: {movieRating}</label>
                <form onSubmit={submitRating}>
                    <input 
                        type='range' 
                        disabled={disableGuess} 
                        value={movieRating} 
                        step='0.1' 
                        min='0' 
                        max='10' 
                        onChange={(event) => 
                            setMovieRating(event.target.value)} 
                    />
                    <button 
                        type='submit' 
                        disabled={disableGuess}>
                            {disableGuess ? "Awaiting other guesses" : "Submit"}
                    </button>
                </form>
            </div>
        </div>
        
        <div className='section'>
            <div className='card'>
                <h2>Movie Details</h2>

                <div className='movie-accordion'>
                    <details open>
                        <summary>Movie Info</summary>
                        <table>
                            <tbody>
                                <tr>
                                    <td><p>Released</p></td>
                                    <td><p> {game.guessMovie.Released}</p></td>
                                </tr>
                                                                <tr>
                                    <td><p>Rated</p></td>
                                    <td><p> {game.guessMovie.Rated}</p></td>
                                </tr>
                                                                <tr>
                                    <td><p>Genre</p></td>
                                    <td><p> {game.guessMovie.Genre}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </details>

                    <details>
                        <summary>Cast & Crew</summary>
                        <table>
                            <tbody>
                                <tr>
                                    <td><p>Actors</p></td>
                                    <td><p>{game.guessMovie.Actors}</p></td>
                                </tr>
                                                        <tr>
                                    <td><p>Director(s)</p></td>
                                    <td><p>{game.guessMovie.Director}</p></td>
                                </tr>
                                                        <tr>
                                    <td><p>Writer(s)</p></td>
                                    <td><p>{game.guessMovie.Writer}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </details>

                    <details>
                        <summary>Awards & Plot</summary>
                        <table>
                            <tbody>
                                <tr>
                                    <td><p>Box Office</p></td>
                                    <td><p>{game.guessMovie.BoxOffice}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Awards</p></td>
                                    <td><p>{game.guessMovie.Awards}</p></td>
                                </tr>
                                <tr>
                                    <td><p>Plot</p></td>
                                    <td><p>{game.guessMovie.Plot}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </details>
                </div>
            </div>
        </div>
        <LoaderBar />
</>
    )
}