import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
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
        className={this.props.squaresClasses[i]}
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
      squaresClasses: Array(9).fill('square'),
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
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
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
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // the index of move history considering the sorting order
      let moveInOrder = this.state.sortAsc ?
        move :
        history.length - move - 1;
      // display location of the move according to the sorting order
      let location = moveInOrder ?
        'Move to (' + step.moveCol + ', ' + step.moveRow + ')  ' :
        '';
      // display the time travel button according to the sorting order
      let desc = moveInOrder ?
        'Go to move #' + moveInOrder :
        'Go to game start';
      // bold the selected item in the move history
      if (move === this.state.selectedMoveItem) {
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
    // use the immutable copy of default classes for the squares
    let squaresClasses = this.state.squaresClasses.slice();
    if (winner) {
      status = 'Winner: ' + winner[0];
      // inherit a CSS class: https://stackoverflow.com/a/1065479/12328041
      winner[1].map(key => squaresClasses[key] = 'square square_highlight');
    } else {
      status =  'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            squaresClasses={squaresClasses}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <form>
            <label>Sort move history: </label>
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
      // flip the sorting order
      sortAsc: !this.state.sortAsc,
      // reverse the history
      history: this.state.history.slice(0).reverse(),
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
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);

