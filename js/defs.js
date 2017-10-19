const pieces = { empty: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6, 
               bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12};

const boardSquareNum = 120; 

const files = {fileA: 0, fileB: 1, fileC: 2, fileD: 3, fileE: 4, fileF: 5, 
                fileG: 6, fileH: 7, fileNone: 8};

const ranks = {rank1: 0, rank2: 1, rank3: 2, rank4: 3, rank5: 4, rank6: 5,
                rank7: 6, rank8: 7, rankNone: 8};

const colors = {black: 1, white: 0, both: 2}; 
  
const castleBit = {wK: 1, wQ: 2, bK: 4, bQ: 8};

const squares = {a1: 21, b1: 22, c1: 23, d1: 24, e1: 25, f1: 26, g1: 27, h1: 28,
                 a8: 91, b8: 92, c8: 93, d8: 94, e8: 95, f8: 96, g8: 97, h8: 98,
                 noSquare: 99, offBoard: 100}; 

const startFen  = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const pieceChar = '.PNBRQKpnbrqk';
const sideChar  = 'wb-';
const rankChar  = '12345678'; 
const fileChar  = 'abcdefgh'; 

// const bool = {false: 0, true: 1};

const maxGameMoves     = 2048; 
const maxPositionMoves = 256; 
const maxDepth         = 64; 

const filesBoard = new Array(boardSquareNum); 
const ranksBoard = new Array(boardSquareNum); 

let pieceBig   = [ false, false, true, true, true, true, true, false, true, true, true, true, true ];
let pieceMajor = [ false, false, false, false, true, true, true, false, false, false, true, true, true ];
let pieceMinor = [ false, false, true, true, false, false, false, false, true, true, false, false, false ];
let pieceValue = [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
let pieceColor = [ colors.both, colors.white, colors.white, colors.white, colors.white, colors.white, colors.white, colors.black, colors.black, colors.black, colors.black, colors.black, colors.black ];
  
let  piecePawn   = [ false, true, false, false, false, false, false, true, false, false, false, false, false ]; 
let  pieceKnight = [ false, false, true, false, false, false, false, false, true, false, false, false, false ];
let  pieceKing   = [ false, false, false, false, false, false, true, false, false, false, false, false, true ];
let  pieceSlides = [ false, false, false, true, true, true, false, false, false, true, true, true, false ];
let  pieceRookQueen = [ false, false, false, false, true, true, false, false, false, false, true, true, false ];
let  pieceBishopQueen = [ false, false, false, true, false, true, false, false, false, true, false, true, false ];

const knightDir = [-8, -19, -21, -12, 8, 19, 21, 12];
const rookDir   = [-1, -10, 1, 10]; 
const bishopDir = [-9, -11, 11, 9]; 
const kingDir   = [-1, -10, 1, 10, -9, -11, 11, 9];

const dirNum    = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
const pieceDir  = [0, 0, knightDir, bishopDir, rookDir, kingDir, kingDir, 0, knightDir, bishopDir, rookDir, kingDir, kingDir];
  // pieceDir[wN][0], pieceDir[wN][1]
const loopNonSlidePiece = [pieces.wN, pieces.wK, 0, pieces.bN, pieces.bK, 0];
const loopNonSlideIndex = [0, 3]; 
/* 
while (piece !== 0)
  pieceIndex = loopNonSlideIndex[white] = 0; 
  piece = loopNonSlidePiece[pieceIndex]  (wN) 
  pieceIndex++; 
  loop pieceDir[wN][0 - 8]
*/

const loopSlidePiece = [pieces.wB, pieces.wR, pieces.wQ, 0, pieces.bB, pieces.bR, pieces.bQ, 0];
const loopSlideIndex = [0, 4];


// Indexed by piece * 120 + square
const pieceKeys  = new Array(14 * 120); 
const castleKeys = new Array(16); 
let sideKey; 
// enPassant -> piece === empty * 120 + sq 

const sq120To64 = new Array(boardSquareNum); 
const sq64To120 = new Array(64); 

function fileRankToSquare(f, r) {
  return ( (21 + f) + (r * 10) );
};

function rand32() {
  return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16) 
        | (Math.floor((Math.random()*255)+1) << 8) |  Math.floor((Math.random()*255)+1);  
};

function sq64(sq120) {
  return sq120To64[(sq120)];
};

function sq120(sq64) {
  return sq64To120[(sq64)]; 
};

function pieceIndex(piece, pieceNum) {
  return piece * 10 + pieceNum; 
};

const kings = [pieces.wK, pieces.bK];

const castlePermission = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];

/*
  0000 0000 0000 0000 0000 0111 1111 -> From, 0x7f               (7bits)
  0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7f            (7bits)
  0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xf      (4bits)
  0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000               (1bit )
  0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000       (1bit )
  0000 1111 0000 0000 0000 0000 0000 -> Promoted pce >> 20, 0xf  (4bits)
  0001 0000 0000 0000 0000 0000 0000 -> Castle, 0x1000000        (1bit )
*/

function fromSquare(move) { return (move & 0x7f); }
function toSquare(move) { return ( (move >> 7) & 0x7f); }
function captured(move) { return ( (move >> 14) & 0xf); }
function promoted(move) { return ( (move >> 20) & 0xf); }

const mFlagEP   = 0x40000;
const mFlagPS   = 0x80000;
const mFlagCas  = 0x1000000; 
const mFlagCap  = 0x7c000; 
const mFlagProm = 0Xf00000; 
const noMove    = 0; 

function squareOffBoard(sq) {
  return filesBoard[sq] === squares.offBoard ? true : false; 
}

function hashPiece(piece, sq) {
  GameBoard.positionKey ^= pieceKeys[(piece * 120) + sq];
}

function hashCastle() {
  GameBoard.positionKey ^= castleKeys[GameBoard.castlePermission];
}

function hashSide() {
  GameBoard.positionKey ^= sideKey; 
}

function hashEP() {
  GameBoard.positionKey ^= pieceKeys[GameBoard.enPassant]; 
}































