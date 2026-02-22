import type { BoardProps } from '../types';
import { calculateWinner } from '../utils/calculateWinner';
import { isDraw } from '../utils/isDraw';
import Square from './Square';
import type { BoardState } from '../types';

// The Board component now checks for a winner or a draw after each move and calls the onGameOver callback if the game has ended.
function Board({ xIsNext, squares, onPlay, onGameOver, gameOverRecorded }: BoardProps) {
  function handleClick(i: number): void {
    if (calculateWinner(squares) || squares[i] || isDraw(squares)) {
      return;
    }
    // The handleClick function is responsible for handling user interactions with the board. 
    // It checks if the clicked square is already occupied or if the game has already been won or drawn. 
    // If any of these conditions are true, it returns early and does nothing. 
    // Otherwise, it creates a copy of the current squares array, updates the clicked square with the current player's symbol ('X' or 'O'), and calls the onPlay callback to update the game state in the parent component.
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
    // The Board component renders the status message and the 3x3 grid of Square components. Each Square receives its value and a click handler as props.
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

export default Board;