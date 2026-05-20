'use client'
import { useState } from 'react';
import { useGame } from "@/context/GameContext";

import LoaderBar from "@/components/LoaderBar";

export default function RoundResults(){
    const [activeTab, setActiveTab] = useState("winner");
    const { game } = useGame();

    function getUserName(id){
        for(let i = 0; i < game.players.length; i++){
            if(id === game.players[i].socketID){
                return game.players[i].name;
            }
        }
    }

    let actualRating = Number(game?.guessMovie?.imdbRating);
    
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
        <>
            <div className='section'>
                <div className='card'>
                    <h2>Round Results</h2>
                    <p className='rating'>{game.guessMovie.imdbRating}</p>
                    <p>{game.guessMovie.imdbVotes} votes</p>
                    
                    <div className="results-tabs">
                        <button
                            className={`results-tab ${activeTab === "winner" ? "active-tab" : ""}`}
                            disabled={activeTab === "winner"}
                            onClick={() => setActiveTab("winner")}
                            >
                            Winner
                        </button>

                        <button
                            className={`results-tab ${activeTab === "guesses" ? "active-tab" : ""}`}
                            disabled={activeTab === "guesses"}
                            onClick={() => setActiveTab("guesses")}
                        >
                            Guesses
                        </button>

                        <button
                            className={`results-tab ${activeTab === "score" ? "active-tab" : ""}`}
                            disabled={activeTab === "score"}
                            onClick={() => setActiveTab("score")}
                        >
                            Score
                        </button>
                    </div>

         
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

                        {activeTab === "score" && (
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
        <LoaderBar
            timer={game?.timer}
            serverNow={game?._serverNow}
            receivedAt={game?._receivedAt}
            label='Next round'
        />
    </>
    )
}
