'use client';
import { useState, useEffect } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";

import LoaderBar from '@/components/LoaderBar';

export default function ChooseMovie(){
    const [dealer, setDealer] = useState(false);
    const [dealerName, setDealerName] = useState("");
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const { socket } = useSocket();
    const { game } = useGame();

    //check if dealer
    useEffect(() => {
        if(!game?.dealer) return;
        
        setDealerName(game.dealer.name);

        if (game.dealer.socketID === socket.id) {
            setDealer(true);
        } else {
            setDealer(false);
        }
    }, [game, socket.id]);

    async function handleSearch(event) {
        event.preventDefault();

        setLoading(true);
        
        try {
            const response = (await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/search?query=${encodeURIComponent(searchInput)}`))
            const json = await response.json();
            setSearchResults(json);
            
            } catch (err) {
                console.error(err);
        }

        setLoading(false);
    }

    async function getFilmDetails(imdbID) {
        try {
            const response = (await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/movie?imdbID=${imdbID}`))
            const json = await response.json();
            socket.emit('set_movie', {game, movie: json});
            setSearchResults([]);
            setSearchInput('');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {dealer ? 
                <div>
                    <div className='section'>
                        <div className='card'>
                            <h2>Choose Movie</h2>

                            <form onSubmit={handleSearch}>
                                <label>Enter Movie Title</label>
                                <input 
                                    placeholder='Type Movie' 
                                    type='text' 
                                    onChange={(event) => 
                                        setSearchInput(event.target.value)} 
                                        value={searchInput} 
                                />
                                <button type='submit' disabled={loading}>{loading ? "Searching..." : "Search"}</button>
                            </form>
                        </div>
                    </div>

                    <div className='section grid'>
                        {searchResults !== null && searchResults.length === 0 && <p>No movies found.</p>}
                        
                        {searchResults && searchResults.map((movie, index) => {
                            return (
                                <div 
                                    className='movie-card' 
                                    key={`search-result-${index}`} 
                                    onClick={() => getFilmDetails(movie.imdbID)}
                                >
                                    <img src={movie.Poster} />
                                    <p>{movie.Title}</p>
                                    <p className='small'>({movie.Year})</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            : 
                <div className='section'>
                    <div className='card'>
                        <h2>Choosing Movie</h2>
                        <p className='small'>
                            {dealerName} is picking a movie.
                        </p>
                    </div>
                </div>
            }
            <LoaderBar />
        </>
    )
}