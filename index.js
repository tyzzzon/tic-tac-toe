import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let winClass = 'square';
    winClass += props.isInWinCombination ? ' win' : '';
	return (
		<button className={winClass} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square 
				value={this.props.squares[i]}
                isInWinCombination={this.props.winArray[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
			</div>
		);
	}
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: [null, null],
                moveNumber: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            isReversed: false,
            winCombination: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moveNumber = current.moveNumber;
        if (calculateWinCombination(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: [i % 3 + 1, Math.floor(i / 3) + 1],
                moveNumber: moveNumber+1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    changeOrder() {
        this.setState({
            history: this.state.history.reverse(),
            isReversed: !this.state.isReversed,
        });
    }

	render() {
        const history = this.state.history;
        const abs = Math.abs(this.state.stepNumber-history.length + 1);
        const current = this.state.isReversed ? history[abs] : history[this.state.stepNumber];
        const winCombination = calculateWinCombination(current.squares);

        const moves = history.map((step) => {
            const desc = (step.moveNumber ? 'Go to move #' + step.moveNumber : 'Go to game start') +
                (step.lastMove[0] ? '(Last move: (' + step.lastMove[0] + ',' + step.lastMove[1] + '))' : '');
            return (
                <li key={step.moveNumber}>
                    <button className="history-item" onClick={() => this.jumpTo(step.moveNumber)}>{desc}</button>
                </li>
            );
        });

        let status;
        let winArray = Array(9).fill(null);
        if (winCombination) {
            for (let i = 0; i < 3; i++) {
                winArray[winCombination[i]] = true;
            }
            const winner = winCombination[0];
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

		return (
			<div className="game">
				<div className="game-board">
					<Board
                        squares={current.squares}
                        winArray={winArray}
                        onClick={(i) => this.handleClick(i)}
                    />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
                    <button className="change-order" onClick={() => this.changeOrder()}>Change Order</button>
				</div>	
			</div>
		);
	}
}

// ==============================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinCombination(squares) {
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
			return lines[i];
		}
	}
	return null;
}