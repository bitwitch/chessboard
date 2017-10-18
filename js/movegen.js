/*
  0000 0000 0000 0000 0000 0111 1111 -> From, 0x7f               (7bits)
  0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7f            (7bits)
  0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xf      (4bits)
  0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000               (1bit )
  0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000       (1bit )
  0000 1111 0000 0000 0000 0000 0000 -> Promoted pce >> 20, 0xf  (4bits)
  0001 0000 0000 0000 0000 0000 0000 -> Castle, 0x1000000        (1bit )
*/

function move(from, to, captured, promoted, flag) {
  return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function addCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move; 
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++] = 0;
}

function addQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move; 
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++] = 0;
}

function addEnPassantMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]] = move; 
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++] = 0;
}

function addWhitePawnCaptureMove(from, to, captured) {
  if (ranksBoard[from] === ranks.rank7) {
    addCaptureMove( move(from, to, captured, pieces.wQ, 0) ); // makeMove() will handle changing the pawn to its promoted piece
    addCaptureMove( move(from, to, captured, pieces.wR, 0) );
    addCaptureMove( move(from, to, captured, pieces.wB, 0) );
    addCaptureMove( move(from, to, captured, pieces.wN, 0) );
  } else {
    addCaptureMove( move(from, to, captured, pieces.empty, 0) );
  }
}

function addBlackPawnCaptureMove(from, to, captured) {
  if (ranksBoard[from] === ranks.rank2) {
    addCaptureMove( move(from, to, captured, pieces.bQ, 0) ); // makeMove() will handle changing the pawn to its promoted piece
    addCaptureMove( move(from, to, captured, pieces.bR, 0) );
    addCaptureMove( move(from, to, captured, pieces.bB, 0) );
    addCaptureMove( move(from, to, captured, pieces.bN, 0) );
  } else {
    addCaptureMove( move(from, to, captured, pieces.empty, 0) );
  }
}

function addWhitePawnQuietMove(from, to) {
  if(ranksBoard[from] === ranks.rank7) {
    addQuietMove( move(from, to, pieces.empty, pieces.wQ, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.wR, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.wB, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.wN, 0) );
  } else {
    addQuietMove( move(from, to, pieces.empty, pieces.empty, 0) );
  }
}

function addBlackPawnQuietMove(from, to) {
  if(ranksBoard[from] === ranks.rank2) {
    addQuietMove( move(from, to, pieces.empty, pieces.bQ, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.bR, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.bB, 0) );
    addQuietMove( move(from, to, pieces.empty, pieces.bN, 0) );
  } else {
    addQuietMove( move(from, to, pieces.empty, pieces.empty, 0) );
  }
}

function generateMoves() {
  GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply]; 

  let pieceType, sq, pieceNum, pIndex, piece, tSq, dir; 

  if (GameBoard.side === colors.white) {
    pieceType = pieces.wP; 

    for(pieceNum=0; pieceNum < GameBoard.pieceNum[pieceType]; pieceNum++) {
      sq = GameBoard.pieceList[pieceIndex(pieceType, pieceNum)]; // gets the sq that the white pawn of number = piece num, is sitting on

      // WHITE PAWN NONCAPTURING MOVES 
      if (GameBoard.pieces[sq + 10] === pieces.empty) {
        addWhitePawnQuietMove(sq, sq+10); 
        if (ranksBoard[sq] === ranks.rank2 && GameBoard.pieces[sq + 20] === pieces.empty) {
          addQuietMove( move(sq, sq+20, pieces.empty, pieces.empty, mFlagPS) );
        } 
      }

      // WHITE PAWN CAPTURING MOVES 
      if (squareOffBoard(sq + 9) === false && pieceColor[GameBoard.pieces[sq+9]] === colors.black) {
        addWhitePawnCaptureMove(sq, sq+9, GameBoard.pieces[sq+9]);
      }

      if (squareOffBoard(sq + 11) === false && pieceColor[GameBoard.pieces[sq+11]] === colors.black) {
        addWhitePawnCaptureMove(sq, sq+11, GameBoard.pieces[sq+11]);
      }

      if (GameBoard.enPassant !== squares.noSquare) {
        if (sq + 9 === GameBoard.enPassant){
          addEnPassantMove( move(sq, sq+9, pieces.empty, pieces.empty, mFlapEP) ); // makeMove() will handle the capture, i.e. why capture is pieces.empty here
        }

        if (sq + 11 === GameBoard.enPassant){
          addEnPassantMove( move(sq, sq+11, pieces.empty, pieces.empty, mFlapEP) );
        }
      }
    }

    // WHITE KING SIDE CASTLE 
    if (GameBoard.castlePermission & castleBit.wK) {
      if (GameBoard.pieces[squares.f1] === pieces.empty && GameBoard.pieces[squares.g1] === pieces.empty) {
        if (squareAttacked(squares.f1, colors.black) === false && squareAttacked(squares.e1, colors.black) === false) {
          addQuietMove( move(squares.e1, squares.g1, pieces.empty, pieces.empty, mFlagCas) );
        }
      }
    }

    // WHITE QUEEN SIDE CASTLE 
    if (GameBoard.castlePermission & castleBit.wQ) {
      if (GameBoard.pieces[squares.d1] === pieces.empty && GameBoard.pieces[squares.c1] === pieces.empty 
            && GameBoard.pieces[squares.b1] === pieces.empty) {
        if (squareAttacked(squares.d1, colors.black) === false && squareAttacked(squares.e1, colors.black) === false) {
          addQuietMove( move(squares.e1, squares.c1, pieces.empty, pieces.empty, mFlagCas) );
        }
      }
    }


    // pieceType = pieces.wN

  } else {
    pieceType = pieces.bP; 

    for(pieceNum=0; pieceNum < GameBoard.pieceNum[pieceType]; pieceNum++) {
      sq = GameBoard.pieceList[pieceIndex(pieceType, pieceNum)]; // gets the sq that the white pawn of number = piece num, is sitting on
      
      // BLACK PAWN NONCAPTURING MOVES 
      if (GameBoard.pieces[sq - 10] === pieces.empty) {
        addBlackPawnQuietMove(sq, sq-10);  
        if (ranksBoard[sq] === ranks.rank7 && GameBoard.pieces[sq - 20] === pieces.empty) {
          addQuietMove( move(sq, sq-20, pieces.empty, pieces.empty, mFlagPS) );
        } 
      }

      // BLACK PAWN CAPTURING MOVES 
      if (squareOffBoard(sq - 9) === false && pieceColor[GameBoard.pieces[sq - 9]] === colors.white) {
        addBlackPawnCaptureMove(sq, sq-9, GameBoard.pieces[sq-9]);
      }

      if (squareOffBoard(sq - 11) === false && pieceColor[GameBoard.pieces[sq - 11]] === colors.white) {
        addBlackPawnCaptureMove(sq, sq-11, GameBoard.pieces[sq-11]);
      }

      if (GameBoard.enPassant !== squares.noSquare) {
        if (sq - 9 === GameBoard.enPassant){
          addEnPassantMove( move(sq, sq-9, pieces.empty, pieces.empty, mFlapEP) );
        }

        if (sq - 11 === GameBoard.enPassant){
          addEnPassantMove( move(sq, sq-11, pieces.empty, pieces.empty, mFlapEP) );
        }
      }
    }

    // BLACK KING SIDE CASTLE 
    if (GameBoard.castlePermission & castleBit.bK) {
      if (GameBoard.pieces[squares.f8] === pieces.empty && GameBoard.pieces[squares.g8] === pieces.empty) {
        if (squareAttacked(squares.f8, colors.white) === false && squareAttacked(squares.e8, colors.white) === false) {
          addQuietMove( move(squares.e8, squares.g8, pieces.empty, pieces.empty, mFlagCas) );
        }
      }
    }

    // BLACK QUEEN SIDE CASTLE 
    if (GameBoard.castlePermission & castleBit.bQ) {
      if (GameBoard.pieces[squares.d8] === pieces.empty && GameBoard.pieces[squares.c8] === pieces.empty 
            && GameBoard.pieces[squares.b8] === pieces.empty) {
        if (squareAttacked(squares.d8, colors.white) === false && squareAttacked(squares.e8, colors.white) === false) {
          addQuietMove( move(squares.e8, squares.c8, pieces.empty, pieces.empty, mFlagCas) );
        }
      }
    }

    // get piece for side wN, wK
    // loop all dir for piece -> need to know num of dir for piece 
  }

  //NONSLIDING PIECE MOVES 
  pIndex = loopNonSlideIndex[GameBoard.side];
  piece  = loopNonSlidePiece[pIndex++]; 

  while (piece !== 0) {
    for(pieceNum=0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
      sq = GameBoard.pieceList[pieceIndex(piece, pieceNum)]; 

      for(let i=0; i<dirNum[piece]; i++) {
        dir = pieceDir[piece][i];
        tSq = sq + dir; 

        if (squareOffBoard(tSq) === true) {
          continue;
        } 

        if (GameBoard.pieces[tSq] !== pieces.empty) { 
          if (pieceColor[GameBoard.pieces[tSq]] !== GameBoard.side) {
            addCaptureMove( move(sq, tSq, GameBoard.pieces[tSq], pieces.empty, 0) );
          }
        } else {
           addQuietMove( move(sq, tSq, pieces.empty, pieces.empty, 0) );
        }
      }
    }
    piece = loopNonSlidePiece[pIndex++]
  }

  //SLIDING PIECE MOVES
  pIndex = loopSlideIndex[GameBoard.side];
  piece  = loopSlidePiece[pIndex++]; 

  while (piece !== 0) {
    for(pieceNum=0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
      sq = GameBoard.pieceList[pieceIndex(piece, pieceNum)]; 

      for(let i=0; i<dirNum[piece]; i++) {
        dir = pieceDir[piece][i];
        tSq = sq + dir; 

        while ( squareOffBoard(tSq) === false ) {

          if (GameBoard.pieces[tSq] !== pieces.empty) { 
            if (pieceColor[GameBoard.pieces[tSq]] !== GameBoard.side) {
               addCaptureMove( move(sq, tSq, GameBoard.pieces[tSq], pieces.empty, 0) );
            }
            break; 
          } 
          addQuietMove( move(sq, tSq, pieces.empty, pieces.empty, 0) );
          tSq += dir;
        } 
      }
    }
    piece = loopSlidePiece[pIndex++]
  }

}; //end generateMoves()

