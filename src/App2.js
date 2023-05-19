import { useState } from "react";

function Square({ value, onSquareClick, cssClass }) {
  return (
    <button className={cssClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

const location = {
  0: "(0, 0)",
  1: "(0, 1)",
  2: "(0, 2)",
  3: "(1, 0)",
  4: "(1, 1)",
  5: "(1, 2)",
  6: "(2, 0)",
  7: "(2, 1)",
  8: "(2, 2)"
};

let currentLocation;

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    currentLocation = i;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  if ((winner === null) & !squares.includes(null)) {
    status = "No one wins :(";
  }

  function RenderSquare({ i }) {
    if (winner && winner.includes(+i)) {
      return (
        <Square
          cssClass="squarehighlight"
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    } else {
      return (
        <Square
          cssClass="square"
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    }
  }

  function RenderSquareRow({ n }) {
    const row = [];
    for (let j = n; j < +n + 3; j++) {
      row.push(<RenderSquare i={j} />);
    }
    return <div className="board-row">{row}</div>;
  }

  function RenderGrid({ p }) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(<RenderSquareRow n={j * +p} />);
    }
    return <>{row}</>;
  }

  return (
    <>
      <div className="status">{status}</div>
      <RenderGrid p="3" />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  console.log(currentSquares);

  const [asc, setAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function SortMoves() {
    setAsc(!asc);
  }

  const movesSorted = [];

  if (!asc) {
    movesSorted.push([...moves].reverse());
  } else {
    movesSorted.push([...moves]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button onClick={SortMoves}>Sort Moves</button>
        <ol>{movesSorted}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      return [a, b, c];
    }
  }
  return null;
}
