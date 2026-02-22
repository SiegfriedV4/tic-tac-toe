import { useState } from 'react';
import Board from './Board';
import type { BoardState, GameStats, Player } from '../types';

// game logic handling history, current move, and game statistics. 
export default function Game() {
  // history state is an array of BoardState objects that keeps track of the state of the board after each move.
  const [history, setHistory] = useState<BoardState[]>([Array(9).fill(null) as BoardState]);

  // currentMove keeps track of the index of the current move in the history array, allowing users to navigate through previous moves.
  const [currentMove, setCurrentMove] = useState<number>(0);

  // stats state is used to keep track of the number of wins for each player and the number of draws.
  const [stats, setStats] = useState<GameStats>({ X: 0, O: 0, draws: 0 });

  // gameOverRecorded is a boolean state that tracks whether the game over state has been recorded for the current game. 
  // This prevents multiple updates to the stats when a player wins or when there's a draw.
  const [gameOverRecorded, setGameOverRecorded] = useState<boolean>(false);

  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: BoardState = history[currentMove];

  function handlePlay(nextSquares: BoardState): void {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleGameOver(result: Player | 'draw'): void {
    setGameOverRecorded(true);
    setStats((prev) => {
      if (result === 'draw') return { ...prev, draws: prev.draws + 1 };
      return { ...prev, [result]: prev[result] + 1 };
    });
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
    setGameOverRecorded(false);
  }

  // The moves variable generates a list of buttons that allow the user to jump to any previous move in the game history. 
  // Each button is labeled with the move number or "Go to game start" for the initial state.
  const moves = history.map((squares: BoardState, move: number) => {
    let description: string;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <style>{`
        .game {
          display: flex;
          flex-direction: row;
          gap: 20px;
        }

        .status {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: bold;
        }

        .board-row {
          display: flex;
        }

        .square {
          background: #fff;
          border: 1px solid #999;
          float: left;
          font-size: 24px;
          font-weight: bold;
          line-height: 34px;
          height: 34px;
          margin-right: -1px;
          margin-top: -1px;
          padding: 0;
          text-align: center;
          width: 34px;
          cursor: pointer;
        }

        .square:focus {
          outline: none;
          background: #ddd;
        }

        .game-info ol {
          padding-left: 30px;
        }

        .scoreboard {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.8;
        }
      `}</style>

      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            onGameOver={handleGameOver}
            gameOverRecorded={gameOverRecorded}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
          <div className="scoreboard">
            <div><strong>X Wins:</strong> {stats.X}</div>
            <div><strong>O Wins:</strong> {stats.O}</div>
            <div><strong>Draws:</strong> {stats.draws}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;