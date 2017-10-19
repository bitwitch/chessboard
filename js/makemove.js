function clearPiece(sq) {
  const piece   = GameBoard.pieces[sq]; 
  const color   = pieceColor[piece];
  let tPieceNum = -1; 

  hashPiece(piece, sq); 

  GameBoard.pieces[sq] = pieces.empty; 
  GameBoard.material[color] -= pieceValue[piece]; 

  for(let i=0; i < GameBoard.pieceNum[piece]; i++) {
    if (GameBoard.pieceList[pieceIndex(piece, i)] === sq) {
      tPieceNum = i; 
      break; 
    }
  }

  GameBoard.pieceNum[piece]--; 
  GameBoard.pieceList[pieceIndex(piece, tPieceNum)] = GameBoard.pieceList[pieceIndex(piece, GameBoard.pieceNum[piece])]; 
};

function addPiece(piece, sq) {
  const color = pieceColor[piece]; 

  hashPiece(piece, sq); 

  GameBoard.pieces[sq] = piece; 
  GameBoard.material[color] += pieceValue[piece]; 
  GameBoard.pieceList[pieceIndex(piece, GameBoard.pieceNum[piece])] = sq; 
  GameBoard.pieceNum[piece]++; 
};

function movePiece(from, to) {
  const piece = GameBoard.pieces[from]; 

  hashPiece(piece, from); 
  GameBoard.pieces[from] = pieces.empty; 

  hashPiece(piece, to); 
  GameBoard.pieces[to] = piece; 

  for(let i=0; i < GameBoard.pieceNum[piece]; i++) {
    if (GameBoard.pieceList[pieceIndex(piece, i)] === from) {
      GameBoard.pieceList[pieceIndex(piece, i)] = to; 
      break; 
    }
  }

};

function makeMove(move) {
  // 0001 0100 1001 1111 -> first move, 5279
  const from = fromSquare(move); // from = 31
  const to   = toSquare(move);   // to   = 41
  const side = GameBoard.side;   // w 

  GameBoard.history[GameBoard.historyPly].positionKey = GameBoard.positionKey; // Generated key

  //En Passant Capture
  if ( (move & mFlagEP) !== 0) {  //////////////THIS IS THE FUCKING LINE THAT FUCKED ME!!
    if (side === colors.white) {
      clearPiece(to - 10); 
    } else {
      clearPiece(to + 10); 
    }
  //Move Rook in the case of a Castle Move
  } else if ( (move & mFlagCas) !== 0 ) {
    switch (to) {
      case squares.c1 : movePiece(squares.a1, squares.d1); break;
      case squares.c8 : movePiece(squares.a8, squares.d8); break;
      case squares.g1 : movePiece(squares.h1, squares.f1); break;
      case squares.g8 : movePiece(squares.h8, squares.f8); break;
      default : console.log('ERROR Invalid Castle: makeMove()'); break; 
    }
  }

  if (GameBoard.enPassant !== squares.noSquare) {hashEP();}

  hashCastle(); 

  GameBoard.history[GameBoard.historyPly].move = move; 
  GameBoard.history[GameBoard.historyPly].fiftyMove = GameBoard.fiftyMove;
  GameBoard.history[GameBoard.historyPly].enPassant = GameBoard.enPassant; 
  GameBoard.history[GameBoard.historyPly].castlePermission = GameBoard.castlePermission;

  GameBoard.castlePermission &= castlePermission[from]; 
  GameBoard.castlePermission &= castlePermission[to];
  GameBoard.enPassant = squares.noSquare;

  hashCastle(); 

  const cap = captured(move); 
  GameBoard.fiftyMove++; 

  if (cap !== pieces.empty) {
    clearPiece(to); 
    GameBoard.fiftyMove = 0; 
  }

  GameBoard.historyPly++;
  GameBoard.ply++;

  if (piecePawn[GameBoard.pieces[from]] === true) {
    GameBoard.fiftyMove = 0; 
    if ( (move & mFlagPS) !== 0) {
      if (side === colors.white) {
        GameBoard.enPassant = from + 10; 
      } else {
        GameBoard.enPassant = from - 10; 
      }
      hashEP(); 
    }
  }

  //Move Intended Piece 
  movePiece(from, to); 
  const promPiece = promoted(move); 
  if (promPiece !== pieces.empty) {
    clearPiece(to); 
    addPiece(promPiece, to);; 
  }

  //Switch Side
  GameBoard.side ^= 1; 
  hashSide(); 

  if (squareAttacked(GameBoard.pieceList[pieceIndex(kings[side], 0)], GameBoard.side)) {
    takeMove(); 
    return false;
  } 

  return true; 
};

function takeMove() {

  GameBoard.historyPly--;
  GameBoard.ply--;

  const move = GameBoard.history[GameBoard.historyPly].move; 
  const from = fromSquare(move); 
  const to   = toSquare(move); 

  if (GameBoard.enPassant !== squares.noSquare) {hashEP();}

  hashCastle(); 

  GameBoard.castlePermission = GameBoard.history[GameBoard.historyPly].castlePermission; 
  GameBoard.enPassant = GameBoard.history[GameBoard.historyPly].enPassant; 
  GameBoard.fiftyMove = GameBoard.history[GameBoard.historyPly].fiftyMove; 

  if (GameBoard.enPassant !== squares.noSquare) {hashEP();}

  hashCastle();

  GameBoard.side ^= 1; 
  hashSide(); 

  //En Passant Capture 
  if ( (move & mFlagEP) !== 0) {
    if (GameBoard.side === colors.white) {
      addPiece(pieces.bP, to-10); 
    } else {
      addPiece(pieces.wP, to+10);
    }
  //Move Rook back in the case of a Castle Move
  } else if ( (move & mFlagCas) !== 0 ) {
    switch (to) {
      case squares.c1 : movePiece(squares.d1, squares.a1); break;
      case squares.c8 : movePiece(squares.d8, squares.a8); break;
      case squares.g1 : movePiece(squares.f1, squares.h1); break;
      case squares.g8 : movePiece(squares.f8, squares.h8); break;
      default : console.log('ERROR Invalid Castle: takeMove()'); break; 
    }
  }

  movePiece(to, from); 

  const cap = captured(move); 
  if (cap !== pieces.empty) {
    addPiece(cap, to); 
  }

  const prom = promoted(move);
  if (prom !== pieces.empty) {
    clearPiece(from); 
    addPiece( (pieceColor[prom] === colors.white ? pieces.wP : pieces.bP), from);
  }






};













