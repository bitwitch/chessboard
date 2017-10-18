$(function () {
  init(); 
  parseFen(startFen); 
  printBoard(); 
  generateMoves(); 
  printMoveList(); 
});

function init() {
  initFilesRanksBoard();
  initHashKeys(); 
  initSq120To64();
};

function initFilesRanksBoard() {
  for(let i=0; i < boardSquareNum; i++) {
    filesBoard[i] = squares.offBoard;
    ranksBoard[i] = squares.offBoard; 
  }

  for(let rank = ranks.rank1; rank <= ranks.rank8; rank++) {
    for(let file = files.fileA; file <= files.fileH; file++) {
      let sq = fileRankToSquare(file, rank); 
      filesBoard[sq] = file;
      ranksBoard[sq] = rank; 
    }
  }
};

function initHashKeys() {
  for(let i=0; i < 14 * 120; i++) {
    pieceKeys[i] = rand32(); 
  }

  for(let i=0; i<16; i++) {
    castleKeys[i] = rand32(); 
  }

  sideKey = rand32();
};

function initSq120To64() {
  for(let i=0; i<boardSquareNum; i++) {
    sq120To64[i] = 65; 
  }

  for(let i=0; i<64; i++) {
    sq64To120[i] = 120; 
  }

  let sq64 = 0; 
  for(let rank = ranks.rank1; rank <= ranks.rank8; rank++) {
    for(let file = files.fileA; file <= files.fileH; file++) {
      let sq = fileRankToSquare(file, rank); 
      sq64To120[sq64] = sq;  
      sq120To64[sq] = sq64; 
      sq64++; 
    }
  }
};


