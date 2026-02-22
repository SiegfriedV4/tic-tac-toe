import type { BoardState } from '../types';

function isDraw(squares: BoardState): boolean {
  return squares.every((cell) => cell !== null);
}

export { isDraw };