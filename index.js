const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const chessPieces = [
	{ type: 'pawn', color: 'white', coord: 'a2' },
	{ type: 'pawn', color: 'white', coord: 'b2' },
	{ type: 'pawn', color: 'white', coord: 'c2' },
	{ type: 'pawn', color: 'white', coord: 'd2' },
	{ type: 'pawn', color: 'white', coord: 'e2' },
	{ type: 'pawn', color: 'white', coord: 'f2' },
	{ type: 'pawn', color: 'white', coord: 'g2' },
	{ type: 'pawn', color: 'white', coord: 'h2' },

	{ type: 'rook', color: 'white', coord: 'a1' },
	{ type: 'knight', color: 'white', coord: 'b1' },
	{ type: 'bishop', color: 'white', coord: 'c1' },
	{ type: 'queen', color: 'white', coord: 'd1' },
	{ type: 'king', color: 'white', coord: 'e1' },
	{ type: 'bishop', color: 'white', coord: 'f1' },
	{ type: 'knight', color: 'white', coord: 'g1' },
	{ type: 'rook', color: 'white', coord: 'h1' },

	{ type: 'pawn', color: 'black', coord: 'a7' },
	{ type: 'pawn', color: 'black', coord: 'b7' },
	{ type: 'pawn', color: 'black', coord: 'c7' },
	{ type: 'pawn', color: 'black', coord: 'd7' },
	{ type: 'pawn', color: 'black', coord: 'e7' },
	{ type: 'pawn', color: 'black', coord: 'f7' },
	{ type: 'pawn', color: 'black', coord: 'g7' },
	{ type: 'pawn', color: 'black', coord: 'h7' },

	{ type: 'rook', color: 'black', coord: 'a8' },
	{ type: 'knight', color: 'black', coord: 'b8' },
	{ type: 'bishop', color: 'black', coord: 'c8' },
	{ type: 'queen', color: 'black', coord: 'd8' },
	{ type: 'king', color: 'black', coord: 'e8' },
	{ type: 'bishop', color: 'black', coord: 'f8' },
	{ type: 'knight', color: 'black', coord: 'g8' },
	{ type: 'rook', color: 'black', coord: 'h8' },
]

let selectedChessPiece = {};

document.addEventListener("DOMContentLoaded", function () {
	initChessBoard();
	initStartingPositions();
});

function initChessBoard() {
	let chessMatrix = [[]];
	let side = 1; // 0: black - 1: white

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
			rowDiv.appendChild(createSquare(color, coordinate));
		}
	}
	console.dir(chessMatrix);
}

function initStartingPositions() {
	let chessBoard = document.querySelector('.chess-board');
	let chessPiecesDiv = document.createElement('div');

	chessPiecesDiv.classList.add('chess-pieces');

	chessBoard.appendChild(chessPiecesDiv);

	for (let i = 0; i < chessPieces.length; i++) {
		let piece = chessPieces[i];
		let pieceElement = document.createElement('img');
		let svgSrc = './lib/' + piece.color + '_' + piece.type + '.svg';

		//whitePawnImg.classList.add('white-pawn');
		pieceElement.src = svgSrc;
		pieceElement.setAttribute('type', piece.type);
		pieceElement.setAttribute('color', piece.color);
		movePiece(pieceElement, piece.coord);

		pieceElement.addEventListener('dragstart', function (event) {
			selectedChessPiece = event.target;
		});

		pieceElement.addEventListener('drop', function (event) {
			event.preventDefault();
			let capturedPiece = event.target;

			if (capturedPiece.attributes['color'].value != selectedChessPiece.attributes['color'].value
				&& capturedPiece.attributes['coords'].value != selectedChessPiece.attributes['coords'].value) {

				if (checkValidMove(selectedChessPiece.attributes['coords'].value, capturedPiece.attributes['coords'].value, selectedChessPiece, true)) {
					let capturedCoords = capturedPiece.attributes['coords'].value;
					capturedPiece.remove();

					movePiece(selectedChessPiece, capturedCoords);
				}

			}
		})

		pieceElement.addEventListener('dragover', function (event) {
			event.preventDefault();
			//event.dataTransfer.dropEffect = 'move';
		})
		chessPiecesDiv.appendChild(pieceElement);
	}
}

function createRowDiv() {
	let rowDiv = document.createElement('div');
	rowDiv.classList.add('row');
	return rowDiv;
}

function createSquare(color, coordinate) {
	let square = document.createElement('div');
	square.classList.add('square');
	square.classList.add(color);

	square.addEventListener('drop', function (event) {
		let element = event.target;
		element.classList.remove('drag-over');

		let coords = element.attributes['data-coord'].value;
		if (checkValidMove(selectedChessPiece.attributes['coords'].value, coords, selectedChessPiece, false)) {
			movePiece(selectedChessPiece, coords);
		}
	});

	square.addEventListener('dragenter', function (event) {
		event.preventDefault();
		let element = event.target;
		element.classList.add('drag-over');
	})

	square.addEventListener('dragleave', function (event) {
		event.preventDefault();
		let element = event.target;
		element.classList.remove('drag-over');
	})

	square.addEventListener('dragover', function (event) {
		event.preventDefault();
		//event.dataTransfer.dropEffect = 'move';
	})

	square.setAttribute('data-coord', coordinate);
	return square;
}

function movePiece(element, coords) {
	element.setAttribute('coords', coords);

	let coordsArray = coords.split('');
	let x = alphabet.indexOf(coordsArray[0]) * 100;
	let y = (coordsArray[1] - 1) * 100;

	element.style.bottom = y + 'px';
	element.style.left = x + 'px';
}

function checkValidMove(origin, destination, chessPiece, isCapture) {

	let isValidMove = false;
	let type = chessPiece.attributes['type'].value;
	let color = chessPiece.attributes['color'].value;
	let modifier = color === 'white' ? 1 : -1;

	let originX = alphabet.indexOf(origin.split('')[0]) + 1;
	let originY = parseInt(origin.split('')[1]);

	let destinationX = alphabet.indexOf(destination.split('')[0]) + 1;
	let destinationY = parseInt(destination.split('')[1]);

	switch (type) {
		case 'pawn':
			// TODO: Work on starting move
			if (isCapture) {
				if ((destinationY === originY + (1 * modifier)) && (destinationX == originX - (1 * modifier) || destinationX == originX + (1 * modifier))) {
					isValidMove = true;
				}
			} else if (destinationY === originY + (1 * modifier) && destinationX === originX) {
				isValidMove = true;
			}
			break;
		case 'bishop':
			let slope = Math.abs(((destinationY - originY) / (destinationX - originX)));
			if (slope === 1 && !checkIfPieceInWayBishop(originX, originY, destinationX, destinationY)) {
				isValidMove = true;
			}
			break;
		case 'knight':

			if ((destinationY === originY + (1 * modifier)) && (destinationX == originX - (1 * modifier) || destinationX == originX + (1 * modifier))) {
				isValidMove = true;
			}
			break;
		default:
			isValidMove = false;
	}

	return isValidMove;
}

function checkIfPieceInWayBishop(originX, originY, destinationX, destinationY) {
	let pieceInWay = false;

	let isSlopeXNegative = destinationX - originX < 0;
	let isSlopeYNegative = destinationY - originY < 0;

	let currentX = originX;
	let currentY = originY;

	do {
		currentX = currentX + (isSlopeXNegative ? -1 : 1);
		currentY = currentY + (isSlopeYNegative ? -1 : 1);

		let checkCoords = alphabet[currentX - 1] + currentY;
		let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

		if (potentialPiece && currentX != destinationX && currentY != destinationY) {

			pieceInWay = true;
		}
	}
	while (currentX != destinationX && currentY != destinationY && !pieceInWay);
	return pieceInWay;
}