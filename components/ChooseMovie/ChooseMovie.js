'use client';
import { useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";
import { useToast } from "@/context/ToastContext";

import LoaderBar from '@/components/LoaderBar';
import noPoster from '@/images/no_poster.png';

export default function ChooseMovie(){
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectingMovie, setSelectingMovie] = useState(false);

    const { socket } = useSocket();
    const { game } = useGame();
    const { showToast } = useToast();
    const dealer = game?.dealer?.socketID === socket.id;
    const dealerName = game?.dealer?.name || 'The dealer';

    function wasAlreadyPlayed(imdbID) {
        const storedMovies = localStorage.getItem('cinerate');

        if (!storedMovies) {
            return false;
        }

        try {
            return JSON.parse(storedMovies).includes(imdbID);
        } catch {
            return false;
        }
    }

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
        setSelectingMovie(true);

        try {
            const response = (await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/movie?imdbID=${imdbID}`))
            const json = await response.json();
            socket.emit(
                'set_movie',
                { roomID: game.roomID, movie: json },
                (response) => {
                    setSelectingMovie(false);

                    if (!response?.ok) {
                        showToast(response?.error || 'Unable to choose that movie.', 'error');
                        return;
                    }

                    setSearchResults([]);
                    setSearchInput('');
                }
            );
        } catch (err) {
            console.error(err);
            setSelectingMovie(false);
            showToast('Movie lookup failed.', 'error');
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
                                <button type='submit' disabled={loading || selectingMovie}>
                                    {loading ? "Searching..." : "Search"}
                                </button>
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
                                    onClick={() => {
                                        if (selectingMovie) return;

                                        if(wasAlreadyPlayed(movie.imdbID)){
                                            showToast("That movie was already played this game.", 'error')
                                        }else{
                                            getFilmDetails(movie.imdbID)}
                                        }
                                    }
                                >
                                    <img 
                                        src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : noPoster.src}
                                        alt={movie.Title}
                                        onError={event => event.target.src = noPoster.src}
                                    />
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
            <LoaderBar
                timer={game?.timer}
                serverNow={game?._serverNow}
                receivedAt={game?._receivedAt}
                label='Movie pick'
            />
        </>
    )
}
