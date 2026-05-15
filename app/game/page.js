'use client';

import { useState, useEffect } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";
import { useRouter } from "next/navigation";

export default function GamePage(){
  const { socket, games } = useSocket();
  const [dealer, setDealer] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [state, setState] = useState("choose movie");
  const [movieRating, setMovieRating] = useState(5.5);
  const [disableGuess, setDisableGuess] = useState(false);
  const { game } = useGame();
  const router = useRouter();


   function getUserName(id){
    for(let i = 0; i < game.players.length; i++){
        if(id === game.players[i].socketID){
            return game.players[i].name;
        }
    }
  }

async function handleSearch(event) {
  event.preventDefault();
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/search?query=${encodeURIComponent(searchInput)}`);

    const data = await resp.json();
    setSearchResults(data)

  } catch (err) {
    console.error(err);
  }
}

async function getFilmDetails(imdbID) {
  try {
    const res = await (await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/movie?imdbID=${imdbID}`)).json()

    console.log("film details:", res)

    socket.emit("set_movie", {game, movie: res});

     setSearchResults([])
     setSearchInput("")
  } catch (err) {
    console.error(err);
  }
}
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

//adjust game state
useEffect(() => {
    if(game.state === "choose movie"){
        setState("choose movie");
         setDisableGuess(false);
    }else if(game.state === "submit rating"){
        setState("submit rating");
    }else if(game.state === "view round results"){
        setState("view round results")
    }else if(game.state === "game over"){
        setState("game over");
        setTimeout(() => {
            router.push("/")
        }, 15000)
    }
})

function submitRating(event){
    event.preventDefault()
    socket.emit("submit_rating", {game, user: socket.id, movieRating});
    setDisableGuess(true);
}

    return (
        <div>

            {state === "choose movie" && <>
            
<p>Choosing Movie</p>
            {dealer ? 
            
            <div>
                <p>You are the dealer. Pick a movie.</p>
                    
                    <form onSubmit={handleSearch}>
                        <input placeholder="Type Movie" type='text' onChange={(event) => setSearchInput(event.target.value)} value={searchInput} />
                        <button type='submit'>Search</button>
                    </form>


                    {searchResults.map((movie, index) => {
                        console.log('MOVIE', movie)
                        return (
                            <div key={`search-result-${index}`} onClick={() => getFilmDetails(movie.imdbID)}>
                                <img src={movie.Poster} />
                                {movie.Title}
                                ({movie.Year})
                            </div>
                        )
                    })}


                    
                    </div> 
                    
                    
                    : <div>
                <p>Waiting while {dealerName} pick's a movie.</p></div>}


            </>}

            {state === "submit rating" && <>
            
<p>Guess Rating</p>
            <img src={game.guessMovie.Poster} />
            {game.guessMovie.Title}
            {game.guessMovie.Released}
            {game.guessMovie.Rated}
            {game.guessMovie.Genre}
            {game.guessMovie.Director}
            {game.guessMovie.BoxOffice}
            {game.guessMovie.Awards}
            {game.guessMovie.Plot}
            {game.guessMovie.Writer}
            {game.guessMovie.Actors}
            {movieRating}
            <form onSubmit={submitRating}>
                    <input type="range" disabled={disableGuess} value={movieRating} step="0.1" min="0" max="10" onChange={(event) => setMovieRating(event.target.value)} />
                   <button type="submit" disabled={disableGuess}>Submit</button>
                   </form>

                   {disableGuess && <>Awaiting other guesses.</>}

            </>}

                {state === "awaiting votes" && <>
                
                awaiting votes
                </>}

            {state === "view round results" && <>
            
            <p>Round Results</p>
            <img src={game.guessMovie.Poster} />
            {game.guessMovie.Title}
            Rating: {game.guessMovie.imdbRating}
            IMDB Votes: {game.guessMovie.imdbVotes}

            {game.roundWinners.map(winner => {
                return (
                    <div>
                        {getUserName(winner.user)} !!!
                    </div>
                )
            })}
            {game.guesses.map(guess => {
                return (
                    <>
                        {guess.movieRating} {getUserName(guess.user)}
                    </>
                )
            })}

                        {game.scores.map(score => {
                return (
                    <>
                    {score.name} - {score.score}
                    </>
                )
            })}
            </>}

         {state === "game over" && <>
                {game.winners.map(winner => {
                    return (
                        <div>
                            {winner.name} !
                        </div>
                    )
                })}
               
                </>}
            
        </div>
    )
}