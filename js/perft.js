let perftLeafNodes;

function perft(depth) {

  if (depth === 0) {
    perftLeafNodes++; 
    return;
  }

  generateMoves();
 
  for(let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply+1]; i++) {
    let move = GameBoard.moveList[i]; 
    if (makeMove(move) === false) {continue;}
    perft(depth-1); // recurse 
    takeMove(); 
  }

  return;
};

function perftTest(depth) {
  printBoard(); 
  console.log('Starting Test to Depth: ', depth); 
  perftLeafNodes = 0; 

  generateMoves(); 
  let moveNum = 0; 
  for(let i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply+1]; i++) {
    let move = GameBoard.moveList[i]; 
    if (makeMove(move) === false) {continue;}
    moveNum++; 
    let cumNodes = perftLeafNodes; 
    perft(depth-1);
    takeMove(); 
    let oldNodes = perftLeafNodes - cumNodes; 
    console.log('move: ' + moveNum + ' ' + printMove(move) + ' ' + oldNodes); 
  }

  console.log('Test Complete: ' + perftLeafNodes + ' leaf nodes visited');

  return;
};



















  
