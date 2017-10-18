function printSquare(sq) {
  return fileChar[filesBoard[sq]] + rankChar[ranksBoard[sq]];
};

function printMove(move) {
  //e2e4  d3d6  a7b8q -> promote to queen 
  const ff = filesBoard[fromSquare(move)]; 
  const rf = ranksBoard[fromSquare(move)]; 
  const ft = filesBoard[toSquare(move)]; 
  const rt = ranksBoard[toSquare(move)];

  let moveString = fileChar[ff] + rankChar[rf] + fileChar[ft] + rankChar[rt]; 

  const prom = promoted(move); 

  if (prom !== pieces.empty) {
    let pChar = 'q'; 
    if(pieceKnight[prom] === true) {
      pChar = 'n'; 
    } else if (pieceRookQueen[prom] === true && pieceBishopQueen[prom] === false) {
      pChar = 'r'
    } else if (pieceRookQueen[prom] === false && pieceBishopQueen[prom] === true) {
      pChar = 'b'
    }
    moveString += pChar;
  }
  return moveString;
};

function printMoveList() {
  console.log('\nMove List: ')
  for(let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++) {
    const move = GameBoard.moveList[i];
    console.log(printMove(move));
  }
};