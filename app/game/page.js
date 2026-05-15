'use client';

import { useState, useEffect } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/context/GameContext";
import { useRouter } from "next/navigation";
import ConfettiBurst from '@/components/ConfettiBurst';

export default function GamePage(){
  const { socket, games } = useSocket();
  const [dealer, setDealer] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [state, setState] = useState("choose movie");
  const [movieRating, setMovieRating] = useState(5.5);
  const [disableGuess, setDisableGuess] = useState(false);
  const [activeTab, setActiveTab] = useState("winner");
  const { game } = useGame();
  const router = useRouter();

  const winnerPhrases = [
  "Certified Rotten Genius",
  "The IMDb Oracle Has Spoken",
  "Critics Fear This Player",
  "Cinema Champion",
  "Box Office Beast",
  "Rotten Tomatoes Called. They're Nervous.",
  "The Sequel Nobody Could Beat",
  "Master of Movie Ratings",
  "This Player Deserves an Oscar",
  "Letterboxd Legend",
  "Critically Acclaimed",
  "The Franchise Continues",
  "Popcorn Prophet",
  "The Ratings Were Rigged (Maybe)",
  "Too Cinephile To Fail",
  "Straight To The Hall Of Fame",
  "The Final Cut Belongs To You",
  "Professional Couch Critic",
  "Viewer Discretion Advised",
  "Peak Cinema Achieved",
  "Now Showing: Absolute Dominance",
  "5 Stars. No Notes.",
  "The Audience Went Wild",
  "Academy Award For Best Guessing",
  "The Critics Stand Defeated",
  "This Win Was Directed By Christopher Nolan",
  "The Plot Twist Nobody Saw Coming",
  "The Chosen One",
  "Certified Fresh Victory",
  "A24 Wishes They Made This Ending",
  "The Multiverse's Greatest Guesser",
  "The Last Cinebender",
  "An Absolute Box Office Smash",
  "Built Different In IMAX",
  "The Ratings Assassin",
  "Streaming Worldwide Now",
  "The Hero Hollywood Needed",
  "Movie Night MVP",
  "One Guess To Rule Them All",
  "The Ratings Reaper",
  "Cinematic Royalty",
  "The Ultimate Director’s Cut",
  "Too Fast Too Accurate",
  "Viewer Rating: Legendary",
  "The Rotten Tomato Destroyer",
  "Lights. Camera. Victory.",
  "The Main Character Won Again",
  "Based On A True Skill Issue",
  "Cinema Has Peaked",
  "The End Credits Rolled For Everyone Else",
];

function getRandomWinnerPhrase() {
  return winnerPhrases[
    Math.floor(Math.random() * winnerPhrases.length)
  ];
}


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
    if(game?.state === "choose movie"){
        setState("choose movie");
         setDisableGuess(false);
    }else if(game?.state === "submit rating"){
        setState("submit rating");
    }else if(game?.state === "view round results"){
        setState("view round results")
    }else if(game?.state === "game over"){
        setState("game over");
        setTimeout(() => {
            router.push("/")
        }, 15000)
    }else{}
})

function submitRating(event){
    event.preventDefault()
    socket.emit("submit_rating", {game, user: socket.id, movieRating});
    setDisableGuess(true);
}





let actualRating = Number(game?.guessMovie?.imdbRating);

function getGuessDifference(guessValue) {
  return Math.abs(Number(guessValue) - actualRating).toFixed(1);
}

function isRoundWinner(socketID) {
  return game.roundWinners.some((winner) => winner.user === socketID);
}

function gotExactRating(socketID) {
  const guess = game.guesses.find((guess) => guess.user === socketID);

  if (!guess) return false;

  return Number(guess.movieRating) === actualRating;
}

function getWinnerGuess(socketID) {
  return game.guesses.find((guess) => guess.user === socketID);
}

    return (
        <div className='page-container'>
            
            {state === "choose movie" && 
                <>{dealer ? 
                    <div>
                        <div className='section'>
                            <h2>Choosing Movie</h2>
                            <p className='small'>You are the dealer. Pick a movie.</p>
                        </div>

                        <div className='section'>
                            <form onSubmit={handleSearch}>
                                <input placeholder="Type Movie" type='text' onChange={(event) => setSearchInput(event.target.value)} value={searchInput} />
                                <button type='submit'>Search</button>
                            </form>
                        </div>

                        <div className='section grid'>
                            {searchResults.map((movie, index) => {
                                return (
                                    <div className='movie-card' key={`search-result-${index}`} onClick={() => getFilmDetails(movie.imdbID)}>
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
                        <h2>Choosing Movie</h2>
                        <p className='small'>{dealerName} is picking a movie.</p>
                    </div>
                }

          <div className="loader-container">

  <div

    className="loader-bar"

    style={{ "--duration": "60s" }}

  ></div>

</div>
            </>}
            

            {state === "submit rating" && 
                <>
                    <div className='section'>
                        <h2>Guess Rating</h2>
                        <img className='movie-poster' src={game.guessMovie.Poster} />
                        <h3>{game.guessMovie.Title}</h3>
                        <label>Guess Rating: {movieRating}</label>
                        <form onSubmit={submitRating}>
                            <input type="range" disabled={disableGuess} value={movieRating} step="0.1" min="0" max="10" onChange={(event) => setMovieRating(event.target.value)} />
                            <button type="submit" disabled={disableGuess}>Submit</button>
                        </form>

                        {disableGuess && <p>Awaiting other guesses.</p>}
                    </div>
  
                    <div className="movie-accordion">
                        <details open>
                            <summary>Movie Info</summary>

                            <p>Released: {game.guessMovie.Released}</p>
                            <p>Rated: {game.guessMovie.Rated}</p>
                            <p>Genre: {game.guessMovie.Genre}</p>
                        </details>

                        <details>
                            <summary>Cast & Crew</summary>

                            <p>Actors: {game.guessMovie.Actors}</p>
                            <p>Director: {game.guessMovie.Director}</p>
                            <p>Writer(s): {game.guessMovie.Writer}</p>
                        </details>

                        <details>
                            <summary>Awards & Plot</summary>

                            <p>Awards: {game.guessMovie.Awards}</p>
                            <p>Box Office: {game.guessMovie.BoxOffice}</p>
                            <p>Plot: {game.guessMovie.Plot}</p>
                        </details>
                    </div>

                <div className="loader-container">

  <div

    className="loader-bar"

    style={{ "--duration": "60s" }}

  ></div>

</div>
                </>}

            {state === "view round results" && 
                <>
                    <div className='section'>
                        <h2>Round Results</h2>
                        
                        <h3>{game.guessMovie.Title}</h3>
                        <p className='rating'>{game.guessMovie.imdbRating}</p>
                        <p>{game.guessMovie.imdbVotes} votes</p>
                    </div>
<div className="results-card">

  <div className="results-tabs">

    <button
      className={`results-tab ${
        activeTab === "winner" ? "active-tab" : ""
      }`}
      disabled={activeTab === "winner"}
      onClick={() => setActiveTab("winner")}
    >
      Winner
    </button>

    <button
      className={`results-tab ${
        activeTab === "guesses" ? "active-tab" : ""
      }`}
      disabled={activeTab === "guesses"}
      onClick={() => setActiveTab("guesses")}
    >
      Guesses
    </button>

    <button
      className={`results-tab ${
        activeTab === "scoreboard" ? "active-tab" : ""
      }`}
      disabled={activeTab === "scoreboard"}
      onClick={() => setActiveTab("scoreboard")}
    >
      Scoreboard
    </button>

  </div>


<div className="section">
  {activeTab === "winner" && (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Guess</th>
        </tr>
      </thead>

      <tbody>
        {game.roundWinners.map((winner) => {
          const guess = getWinnerGuess(winner.user);
          const exact = Number(guess?.movieRating) === actualRating;

          return (
            <tr
              key={winner.user}
              className={exact ? "exact-row" : "winner-row"}
            >
              <td>{getUserName(winner.user)}</td>
              <td>{guess.movieRating}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}

  {activeTab === "guesses" && (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Guess</th>
        </tr>
      </thead>

      <tbody>
        {game.guesses.map((guess) => {
          const exact = Number(guess.movieRating) === actualRating;
          const winner = isRoundWinner(guess.user);

          return (
            <tr
              key={guess.user}
              className={exact ? "exact-row" : winner ? "winner-row" : ""}
            >
              <td>{getUserName(guess.user)}</td>
              <td>{guess.movieRating}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}

  {activeTab === "scoreboard" && (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {game.scores.map((score) => {
          const exact = gotExactRating(score.socketID);
          const winner = isRoundWinner(score.socketID);

          return (
            <tr
              key={score.socketID}
              className={exact ? "exact-row" : winner ? "winner-row" : ""}
            >
              <td>{score.name}</td>
              <td>{score.score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>


</div>
<div className="loader-container">

  <div

    className="loader-bar"

    style={{ "--duration": "10s" }}

  ></div>

</div>

                </>}

            {state === "game over" && 
                <>
                    <div className="section winner-section">
  <ConfettiBurst />

  <h2>{getRandomWinnerPhrase()}</h2>

  <div className="winner-names">
    {game.winners.map((winner) => {
      return (
        <p
          key={winner.socketID}
          className="winner-name"
        >
          {winner.name}
        </p>
      );
    })}
  </div>

  <div className="final-scoreboard">

    <h3>Final Scoreboard</h3>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {game.scores
          .sort((a, b) => b.score - a.score)
          .map((score) => {
            const isWinner = game.winners.some(
              (winner) =>
                winner.socketID === score.socketID
            );

            return (
              <tr
                key={score.socketID}
                className={isWinner ? "exact-row" : ""}
              >
                <td>{score.name}</td>
                <td>{score.score}</td>
              </tr>
            );
          })}
      </tbody>
    </table>

  </div>
</div>

<div className="loader-container">
  <div
    className="loader-bar"
    style={{ "--duration": "10s" }}
  ></div>
</div>
                </>}
                
        </div>
    )
}