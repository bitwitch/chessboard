const GameBoard = {
  pieces: new Array(boardSquareNum),
  side: colors.white,
  fiftyMove: 0, 
  historyPly: 0,                    // index of all half-moves made 
  ply: 0,                           // index of position in the tree of all moves 
  enPassant: 0,
  material: new Array(2),
  pieceNum: new Array(13),          // indexed by pieces
  pieceList: new Array(14 * 10),
  positionKey: 0,
  moveList: new Array(maxDepth * maxPositionMoves),   // index for the first move at a given ply
  moveListStart: new Array(maxDepth), 
  moveScores: new Array(maxDepth * maxPositionMoves),
  /*
  piece * 10 + pieceNum         

  pieceNum[bP] = 4 

  for (num=0 to 3) 
    bP * 10 + num;     70,71,72,73
    sq = pieceList[70]...
  */         
  castlePermission: 0 
  /*
  0001   white kingside
  0010   white queenside
  0100   black kingside
  1000   black queenside

  ex: if(1101 & castleBit.wK !== 0) then white can castle kingside
  */
};


function printBoard () {

  console.log("\nGame Board:\n");

  for(let rank = ranks.rank8; rank >= ranks.rank1; rank--) {
    let line = rankChar[rank] + ' '; 
    for(let file = files.fileA; file <= files.fileH; file++) {
      let sq = fileRankToSquare(file, rank); 
      let piece = GameBoard.pieces[sq]; 
      line += ' ' + pieceChar[piece] + ' '; 
    }
    console.log(line); 
  }

  console.log('');
  let line = '  ';
  for(let file = files.fileA; file <= files.fileH; file++) {
    line += (' ' + fileChar[file] + ' ');
  }

  console.log(line); 
  console.log('side: ' + sideChar[GameBoard.side]);
  console.log('enPassant: ' + GameBoard.enPassant); 
  line = ''; 

  if(GameBoard.castlePermission & castleBit.wK) {line += 'K';}
  if(GameBoard.castlePermission & castleBit.wQ) {line += 'Q';}
  if(GameBoard.castlePermission & castleBit.bK) {line += 'k';}
  if(GameBoard.castlePermission & castleBit.bQ) {line += 'q';}
  console.log('castle: ', line);
  console.log('key: ', GameBoard.positionKey.toString(16)); 
};

function generatePositionKey() {
  let finalKey = 0; 

  for(let sq=0; sq < boardSquareNum; sq++) {
    let piece = GameBoard.pieces[sq]; 
    if(piece !== pieces.empty && piece !== squares.offBoard) {
      finalKey ^= pieceKeys[(piece * 120) + sq];
    }
  }

  if(GameBoard.side === colors.white) {
    finalKey ^= sideKey; 
  }

  if(GameBoard.enPassant != squares.noSquare) {
    finalKey ^= pieceKeys[GameBoard.enPassant];
  }

  finalKey ^= castleKeys[GameBoard.castlePermission];

  return finalKey; 
};

function printPieceLists() {
  for(let piece = pieces.wP; piece <= pieces.bK; piece++) {
    for(let pieceNum=0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++){
      console.log('Piece: ', pieceChar[piece], ' on ', printSquare(GameBoard.pieceList[pieceIndex(piece, pieceNum)]) );
    }
  }
};

function updateListsMaterial() {
  for(let i=0; i < 14 * 120; i++) {
    GameBoard.pieceList[i] = pieces.empty;
  }

  for(let i=0; i<2; i++) {
    GameBoard.material[i] = 0; 
  }

  for(let i=0; i<13; i++) {
    GameBoard.pieceNum[i] = 0; 
  }

  for(let i=0; i<64; i++) {
    let sq    = sq120(i); 
    let piece = GameBoard.pieces[sq]; 
    if (piece !== pieces.empty) {
      let color = pieceColor[piece]; 
      GameBoard.material[color] += pieceValue[piece]; 
      GameBoard.pieceList[pieceIndex(piece, GameBoard.pieceNum[piece])] = sq; 
      GameBoard.pieceNum[piece]++; 
    }
  }

  printPieceLists();
};

function resetBoard() {
  for(let i=0; i<boardSquareNum; i++) {
    GameBoard.pieces[i] = squares.offBoard; 
  }

  for(let i=0; i<64; i++) {
    GameBoard.pieces[sq120(i)] = pieces.empty; 
  }

  GameBoard.side = colors.both; 
  GameBoard.enPassant = squares.noSquare; 
  GameBoard.fiftyMove = 0; 
  GameBoard.historyPly = 0; 
  GameBoard.ply = 0; 
  GameBoard.castlePermission = 0; 
  GameBoard.positionKey = 0;
  GameBoard.moveListStart[GameBoard.ply] = 0; 
};

function parseFen(fen) {
  resetBoard(); 

  let rank     = ranks.rank8; 
  let file     = files.fileA; 
  let fenCount = 0; 
  let count    = 0; 
  let piece    = 0; 
  let sq120    = 0; 

  while (rank >= ranks.rank1 && fenCount < fen.length) {
    count = 1; 
    switch (fen[fenCount]) {
      case 'p' : piece = pieces.bP; break;
      case 'r' : piece = pieces.bR; break;
      case 'n' : piece = pieces.bN; break;
      case 'b' : piece = pieces.bB; break;
      case 'q' : piece = pieces.bQ; break;
      case 'k' : piece = pieces.bK; break;
      case 'P' : piece = pieces.wP; break;
      case 'R' : piece = pieces.wR; break;
      case 'N' : piece = pieces.wN; break;
      case 'B' : piece = pieces.wB; break;
      case 'Q' : piece = pieces.wQ; break;
      case 'K' : piece = pieces.wK; break;

      case '1' : 
      case '2' : 
      case '3' : 
      case '4' : 
      case '5' : 
      case '6' : 
      case '7' : 
      case '8' : piece = pieces.empty; 
                 count = +fen[fenCount]; 
                 break;

      case '/' : 
      case ' ' : rank--; 
                 file = files.fileA; 
                 fenCount++;
                 continue; 

      default  : console.log('FEN error'); 
                 return; 
    }

    for(let i=0; i<count; i++) {
      sq120 = fileRankToSquare(file, rank); 
      GameBoard.pieces[sq120] = piece; 
      file++; 
    }
    fenCount++; 
  } // while loop end 

  GameBoard.side = (fen[fenCount] === 'w') ? colors.white : colors.black; 
  fenCount += 2; 

  for(let i=0; i<4; i++) { 
    if (fen[fenCount] === ' ') {break;}
    switch (fen[fenCount]) {
      case 'k' : GameBoard.castlePermission |= castleBit.bK; break; 
      case 'q' : GameBoard.castlePermission |= castleBit.bQ; break; 
      case 'K' : GameBoard.castlePermission |= castleBit.wK; break; 
      case 'Q' : GameBoard.castlePermission |= castleBit.wQ; break; 
      default  : break; 
    }
    fenCount++; 
  }
  fenCount++; 

  if (fen[fenCount] !== '-') {
    file = fen[fenCount].charCodeAt() - 'a'.charCodeAt(); 
    rank = (+fen[fenCount + 1]) - 1; 
    GameBoard.enPassant = fileRankToSquare(file, rank); 
  }

  GameBoard.positionKey = generatePositionKey(); 
  updateListsMaterial(); 
  printSquareAttacked(); 
};

function printSquareAttacked() { 
  let piece;
  console.log('\nAttacked:\n');
  for(let rank = ranks.rank8; rank >= ranks.rank1; rank--) {
    let line = (rank+1) + ' '; 
    for(let file = files.fileA; file <= files.fileH; file++) {
      let sq = fileRankToSquare(file, rank); 
      if (squareAttacked(sq, GameBoard.side) === true) {piece = 'X';}
      else {piece = '-';}
      line += (' ' + piece + ' '); 
    }
    console.log(line); 
  }
  console.log(' '); 
};

function squareAttacked(sq, side) {
  // PAWN
  if(side === colors.white) {
    if(GameBoard.pieces[sq - 11] === pieces.wP || GameBoard.pieces[sq - 9] === pieces.wP){
      return true; 
    }
  } else {
    if(GameBoard.pieces[sq + 11] === pieces.bP || GameBoard.pieces[sq + 9] === pieces.bP){
      return true;
    }
  }

  //KNIGHT 
  for(let i=0; i<8; i++) {
    let piece = GameBoard.pieces[sq + knightDir[i]]; 
    if (piece !== squares.offBoard && pieceColor[piece] === side && pieceKnight[piece] === true) {
      return true; 
    }
  }

  //ROOK 
  for(let i=0; i<4; i++) {
    let dir   = rookDir[i]; 
    let tSq   = sq + dir; 
    let piece = GameBoard.pieces[tSq];
    while (piece !== squares.offBoard) {
      if(piece != pieces.empty){
        if(pieceRookQueen[piece] === true && pieceColor[piece] === side) {
          return true; 
        }
        break; 
      } 
      tSq  += dir; 
      piece = GameBoard.pieces[tSq]; 
    }
  }

  //BISHOP 
  for(let i=0; i<4; i++) {
    let dir   = bishopDir[i]; 
    let tSq   = sq + dir; 
    let piece = GameBoard.pieces[tSq];
    while (piece !== squares.offBoard) {
      if(piece != pieces.empty){
        if(pieceBishopQueen[piece] === true && pieceColor[piece] === side) {
          return true; 
        }
        break; 
      } 
      tSq  += dir; 
      piece = GameBoard.pieces[tSq]; 
    }
  }

  //KING
  for(let i=0; i<8; i++) {
    let piece = GameBoard.pieces[sq + kingDir[i]]; 
    if (piece !== squares.offBoard && pieceColor[piece] === side && pieceKing[piece] === true) {
      return true; 
    }
  }

  return false;
};


















