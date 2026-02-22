import { useState } from 'react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type BoardState = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue
];

interface GameStats {
  X: number;
  O: number;
  draws: number;
}

interface SquareProps {
  value: CellValue;
  onSquareClick: () => void;
}
// BoardProps includes a new prop gameOverRecorded to track if the game over state has been recorded for the current game. This prevents multiple updates to the stats when a player wins or when there's a draw.

interface BoardProps {
  xIsNext: boolean;
  squares: BoardState;
  onPlay: (nextSquares: BoardState) => void;
  onGameOver: (result: Player | 'draw') => void;
  gameOverRecorded: boolean;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// The Board component now checks for a winner or a draw after each move and calls the onGameOver callback if the game has ended.
function Board({ xIsNext, squares, onPlay, onGameOver, gameOverRecorded }: BoardProps) {
  function handleClick(i: number): void {
    if (calculateWinner(squares) || squares[i] || isDraw(squares)) {
      return;
    }
    const nextSquares = squares.slice() as BoardState;
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);

    if (!gameOverRecorded) {
      const winner = calculateWinner(nextSquares);
      if (winner) {
        onGameOver(winner);
      } else if (isDraw(nextSquares)) {
        onGameOver('draw');
      }
    }
  }

  // The caluculateWinner and isDraw functions are called to determine the current status of the game, which is then displayed to the user
  const winner = calculateWinner(squares);
  const draw = !winner && isDraw(squares);

  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (draw) {
    status = "It's a draw!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// game logic handling history, current move, and game statistics. 
export default function Game() {
  const [history, setHistory] = useState<BoardState[]>([Array(9).fill(null) as BoardState]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>({ X: 0, O: 0, draws: 0 });
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

  // The moves variable generates a list of buttons that allow the user to jump to any previous move in the game history. Each button is labeled with the move number or "Go to game start" for the initial state.
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


function calculateWinner(squares: BoardState): Player | null {
  const lines: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // The lines.length is 8, which corresponds to the 8 possible winning combinations in a tic-tac-toe game (3 rows, 3 columns, and 2 diagonals). The loop iterates through each of these combinations to check if there is a winner.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as Player;
    }
  }
  return null;
}

function isDraw(squares: BoardState): boolean {
  return squares.every((cell) => cell !== null);
}