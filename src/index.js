import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // build React components in loops, use array to store a list of components
    // refer: https://www.delftstack.com/howto/react/for-loop-in-react/#javascript-for-loop
    let squareRow = [];
    for (let row = 0; row < 3; row++) {
      let squares = [];
      for (let col = 0; col < 3; col++) {
        squares[col] = this.renderSquare(row * 3 + col);
      }
      squareRow[row] = (<div className="board-row">{squares}</div>);
    }
    return (
      <div>{squareRow}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        // the location of each move
        moveCol: null,
        moveRow: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      // the item selected from the move history
      selectedMoveItem: null,
      sortAsc: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedMoveItem: step,
    });
  }

  handleClick(i) {
    // const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat(
        [{
          squares: squares,
          // calculate the column and row of this move
          moveCol: Math.floor(i / 3),
          moveRow: i % 3,
        }]
      ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    // sort the history according to the order
    const history = this.state.sortAsc ?
      this.state.history :
      this.state.history.slice(0).reverse();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // display location of the move
      let location = move ?
        'Move to (' + step.moveCol + ', ' + step.moveRow + ')  ' :
        '';
      let desc = move ?
        'Go to move #' + move :
        'Go to game start';
      // bold the selected item in the move history
      if (move && move === this.state.selectedMoveItem) {
        location = <b>{location}</b>;
        desc = <b>{desc}</b>;
      }
      return (
        <li key={move}>
          {location}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status =  'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <form>
            <input type="radio" id="html" name="sorting" value="Ascending"
                   checked={this.state.sortAsc}
                   onClick={() => this.changeSorting()} />
            <label htmlFor="html">Ascending</label>
            <input type="radio" id="css" name="sorting" value="Descending"
                   checked={!this.state.sortAsc}
                   onClick={() => this.changeSorting()} />
            <label htmlFor="css">Descending</label>
          </form>
          <ol reversed={!this.state.sortAsc}>{moves}</ol>
        </div>
      </div>
    );
  }

  changeSorting() {
    this.setState({
      sortAsc: !this.state.sortAsc,
    });
  }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);

