import { isMoveValid } from './rules.js';

export function drawSquare(color, coordinate) {
	let square = document.createElement('div');
	square.classList.add('square');
	square.classList.add(color);

	attachSquareDragEvents(square);

	square.setAttribute('data-coord', coordinate);
	return square;
}

export function drawChessPiece(chessPiece) {
    let pieceElement = document.createElement('img');
    let svgSrc = './lib/' + chessPiece.color + '_' + chessPiece.type + '.svg';

    pieceElement.src = svgSrc;
    pieceElement.setAttribute('type', chessPiece.type);
    pieceElement.setAttribute('color', chessPiece.color);
    movePiece(pieceElement, chessPiece.coord);

	attachChessPieceDragEvents(pieceElement);

    return pieceElement;
}

function attachSquareDragEvents(square) {
    square.addEventListener('drop', function (event) {
		let element = event.target;
		element.classList.remove('drag-over');

        let originCoords = selectedChessPiece.attributes['coords'].value;
		let destinationCoords = element.attributes['data-coord'].value;

		if(isMoveValid(originCoords, destinationCoords, selectedChessPiece, false)) {
            movePiece(selectedChessPiece, destinationCoords);
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
	})
}

function attachChessPieceDragEvents(pieceElement) {
    pieceElement.addEventListener('dragstart', function (event) {
        selectedChessPiece = event.target;
    });

    pieceElement.addEventListener('drop', function (event) {
        event.preventDefault();
        let capturedPiece = event.target;

        let selectedPieceColor = selectedChessPiece.attributes['color'].value;
        let selectedPieceCoords = selectedChessPiece.attributes['coords'].value;

        let capturedPieceColor = capturedPiece.attributes['color'].value;
        let capturedPieceCoords = capturedPiece.attributes['coords'].value;

        if (capturedPieceColor != selectedPieceColor
            && capturedPieceCoords != selectedPieceCoords) {

            if (isMoveValid(selectedPieceCoords, capturedPieceCoords, selectedChessPiece, true)) {
                capturedPiece.remove();
                movePiece(selectedChessPiece, capturedPieceCoords);
            }
        }
    })

    pieceElement.addEventListener('dragover', function (event) {
        event.preventDefault();
    })
}

function movePiece(element, destinationCoords) {
	element.setAttribute('coords', destinationCoords);

	let x = alphabet.indexOf(destinationCoords.split('')[0]) * 100;
	let y = (destinationCoords.split('')[1] - 1) * 100;

	element.style.bottom = y + 'px';
	element.style.left = x + 'px';
}