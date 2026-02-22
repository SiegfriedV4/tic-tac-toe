// going into types.ts
// type players, cell values, board state, game stats, and props for Square and Board components
export type Player = 'X' | 'O';

// CellValue can be 'X', 'O', or null (for empty cells)
export type CellValue = Player | null;

// BoardState is an array of 9 CellValues representing the 3x3 grid of the tic-tac-toe board.
export type BoardState = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue
];

// GameStats keeps track of the number of wins for each player and the number of draws.
export interface GameStats {
  X: number;
  O: number;
  draws: number;
}

// SquareProps defines the props for the Square component, which includes the value of the square and a click handler function.
export interface SquareProps {
  value: CellValue;
  onSquareClick: () => void;
}

// BoardProps includes a new prop gameOverRecorded to track if the game over state has been recorded for the current game. 
// This prevents multiple updates to the stats when a player wins or when there's a draw.
export interface BoardProps {
  xIsNext: boolean;
  squares: BoardState;
  onPlay: (nextSquares: BoardState) => void;
  onGameOver: (result: Player | 'draw') => void;
  gameOverRecorded: boolean;
}