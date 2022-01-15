import { drawSquare, drawChessPiece } from './ui.js';

export function drawChessBoard(side) {
    let chessMatrix = [[]];
	side = 1; // 0: black - 1: white

	let chessBoardElement = document.querySelector('.chess-board');

	for (let i = 0; i < 8; i++) {
		chessMatrix[i] = [];
		let rowDiv = createRowDiv();
		chessBoardElement.appendChild(rowDiv);
		for (let j = 0; j < 8; j++) {
			let modifier = 1;
			let color = 'white';

			if (i % 2) {
				modifier = 0;
			}

			let coordinate = alphabet[j] + Math.abs(((8 * side) - i));

			if ((j + modifier) % 2 === 0) {
				color = 'black';
			} else {
				color = 'white';
			}
			chessMatrix[i][j] = coordinate;
			rowDiv.appendChild(drawSquare(color, coordinate));
		}
	}
	console.dir(chessMatrix);
}

export function drawStartingPositions(chessPiecesJSON) {
    let chessBoard = document.querySelector('.chess-board');
	let chessPiecesDiv = document.createElement('div');

	chessPiecesDiv.classList.add('chess-pieces');

	chessBoard.appendChild(chessPiecesDiv);

	for (let i = 0; i < chessPiecesJSON.length; i++) {
        let pieceElement = drawChessPiece(chessPiecesJSON[i]);
		chessPiecesDiv.appendChild(pieceElement);
	}
}

function createRowDiv() {
	let rowDiv = document.createElement('div');
	rowDiv.classList.add('row');
	return rowDiv;
}