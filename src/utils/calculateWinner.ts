import type { BoardState, Player } from '../types';

//pure function that checks the current state of the board to determine if there is a winner. 
//It takes an array of squares (the current state of the board) as input and returns the player ('X' or 'O') who has won, or null if there is no winner yet.
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

export { calculateWinner };