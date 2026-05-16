import { getWinnerPhrase } from '@/functions/generateWinnerPhrase';
import { useGame } from '@/context/GameContext';

import LoaderBar from '@/components/LoaderBar';
import ConfettiBurst from '@/components/ConfettiBurst';

export default function GameOver(){
    const { game } = useGame();

    return (
        <>
            <ConfettiBurst />
            <div className='section'>
                <div className='card'>
                    <h2>Game Over</h2>
                    <h3>{getWinnerPhrase()}</h3>
                    {game.winners.map((winner) => {
                        return (
                            <p
                                key={winner.socketID}
                                className='winner-name'
                            >
                                {winner.name}
                            </p>
                        );
                    })}
                
                    <br />
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
                                        (winner) => winner.socketID === score.socketID)
                                
                                        return (
                                            <tr
                                                key={score.socketID}
                                                className={isWinner ? 'exact-row' : ''}
                                            >
                                                <td>{score.name}</td>
                                                <td>{score.score}</td>
                                            </tr>
                                        );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <LoaderBar time={15} />
        </>
    )
}