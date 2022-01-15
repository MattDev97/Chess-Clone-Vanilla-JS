import { drawChessBoard, drawStartingPositions } from './chessBoard.js';
import { getStartingPieces } from './lib/pieces.js';

const chessPieces = getStartingPieces();

drawChessBoard();
drawStartingPositions(chessPieces);