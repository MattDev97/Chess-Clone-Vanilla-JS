const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
	let modifier = color === 'white' ? 1 : -1;

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
			if (slope === 1 && !checkForObstruction(originX, originY, destinationX, destinationY)) {
				isValidMove = true;
			}
			break;
		case 'knight':
			if ((destinationY === originY + (1 * modifier)) && (destinationX == originX - (1 * modifier) || destinationX == originX + (1 * modifier))) {
				isValidMove = true;
			}
			break;
        case 'rook':
            if((destinationX === originX || destinationY === originY) && !checkForObstruction(originX, originY, destinationX, destinationY)) {
                isValidMove = true;
            }
            break;
		default:
			isValidMove = false;
	}

	return isValidMove;
}

function checkForObstruction(originX, originY, destinationX, destinationY) {
	let pieceInWay = false;

    let currentX = originX;
    let currentY = originY;

    let isDirectionNegative_X = destinationX - originX < 0;
    let isDirectionNegative_Y = destinationY - originY < 0;
    
    if(originX === destinationX) {
        // If piece is in the same file
        
        while(currentY != destinationY) {
            currentY += isDirectionNegative_Y ? -1 : 1;

            let checkCoords = alphabet[currentX - 1] + currentY;
            let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

            if (potentialPiece && currentY != destinationY) {
                pieceInWay = true;
            }
        }
    } else if(originY === destinationY) {
        // If piece is in the same row

        while(currentX != destinationX) {
            currentX += isDirectionNegative_X ? -1 : 1;

            let checkCoords = alphabet[currentX - 1] + currentY;
            let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

            if (potentialPiece && currentX != destinationX) {
                pieceInWay = true;
            }
        }
    } else {
        // We are going in the diagonal direction

        while (currentX != destinationX && currentY != destinationY && !pieceInWay) {
            currentX = currentX + (isDirectionNegative_X ? -1 : 1);
            currentY = currentY + (isDirectionNegative_Y ? -1 : 1);

            let checkCoords = alphabet[currentX - 1] + currentY;
            let potentialPiece = document.querySelector('[coords="' + checkCoords + '"]');

            if (potentialPiece && currentX != destinationX && currentY != destinationY) {
                pieceInWay = true;
            }
        };
    }

	return pieceInWay;
}