const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const FILE_ROW_PIECES = ['rook', 'queen'];
const DIAGONAL_PIECES = ['bishop', 'queen', 'rook'];

export function isMoveValid(originCoords, destinationCoords, selectedChessPiece, isCapture) {

	let originX = alphabet.indexOf(originCoords.split('')[0]) + 1;
	let originY = parseInt(originCoords.split('')[1]);

	let destinationX = alphabet.indexOf(destinationCoords.split('')[0]) + 1;
	let destinationY = parseInt(destinationCoords.split('')[1]);

	return checkValidMove(originX, originY, destinationX, destinationY, selectedChessPiece, isCapture);
}

function checkValidMove(originX, originY, destinationX, destinationY, chessPiece, isCapture) {

	let isValidMove = false;
	let type = chessPiece.attributes['type'].value;
	let color = chessPiece.attributes['color'].value;
	let hasMoved = chessPiece.attributes['hasmoved']?.value;

	let side = color === 'white' ? 1 : -1;

	let X_Polarity = (destinationX - originX < 0) ? -1 : 1;
	let Y_Polarity = (destinationY - originY < 0) ? -1 : 1;

	let hasObstruction = checkForObstruction(originX, originY, destinationX, destinationY, X_Polarity, Y_Polarity, type);

	let slope = Math.abs(((destinationY - originY) / (destinationX - originX)));
	let isDiagonal = slope === 1;

	switch (type) {
		case 'pawn':
			// TODO: Work on starting move
			if (isCapture) {
				if ((destinationY === originY + (1 * side)) && (destinationX == originX - (1 * side) || destinationX == originX + (1 * side))) {
					isValidMove = true;
				}
			} else if (destinationY === (originY + 1 * side) || (originY + hasMoved ? 0 : 2 * side) && destinationX === originX) {
				isValidMove = true;
			}
			break;
		case 'bishop':
			if (isDiagonal && !hasObstruction) {
				isValidMove = true;
			}
			break;
		case 'knight':
			if (calculateKnightMove(originX, originY, destinationX, destinationY, X_Polarity, Y_Polarity)) {
				isValidMove = true;
			}
			break;
		case 'rook':
			if ((destinationX === originX || destinationY === originY) && !hasObstruction) {
				isValidMove = true;
			}
			break;
		case 'queen':
			if (((destinationX === originX || destinationY === originY) || isDiagonal) && !hasObstruction) {
				isValidMove = true;
			}
			break;
		default:
			isValidMove = false;
	}

	return isValidMove;
}

function checkForObstruction(originX, originY, destinationX, destinationY, X_Polarity, Y_Polarity, type) {
	let pieceInWay = false;

	let currentX = originX;
	let currentY = originY;

	if (originX === destinationX && (FILE_ROW_PIECES.includes(type))) {
		// If piece is in the same file

		while (currentY != destinationY) {
			currentY += Y_Polarity;

			let checkCoords = alphabet[currentX - 1] + currentY;
			let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

			if (potentialPiece && currentY != destinationY) {
				pieceInWay = true;
			}
		}
	} else if (originY === destinationY && (FILE_ROW_PIECES.includes(type))) {
		// If piece is in the same row

		while (currentX != destinationX) {
			currentX += X_Polarity;

			let checkCoords = alphabet[currentX - 1] + currentY;
			let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

			if (potentialPiece && currentX != destinationX) {
				pieceInWay = true;
			}
		}
	} else if (DIAGONAL_PIECES.includes(type)) {
		// We are going in the diagonal direction

		while (currentX != destinationX && currentY != destinationY && !pieceInWay) {
			currentX = currentX + X_Polarity;
			currentY = currentY + Y_Polarity;

			let checkCoords = alphabet[currentX - 1] + currentY;
			let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

			if (potentialPiece && currentX != destinationX && currentY != destinationY) {
				pieceInWay = true;
			}
		};
	}

	return pieceInWay;
}

function calculateKnightMove(originX, originY, destinationX, destinationY, X_Polarity, Y_Polarity) {
	return (destinationX === originX + (1 * X_Polarity) && destinationY === originY + (2 * Y_Polarity)) || (destinationX === originX + (2 * X_Polarity) && destinationY === originY + (1 * Y_Polarity))
}