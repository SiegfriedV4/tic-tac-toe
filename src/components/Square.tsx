import type { SquareProps } from '../types';

//square component that renders a button for each square on the tic-tac-toe board. 
//It receives the value of the square and a click handler function as props.
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default Square;