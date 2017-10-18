**************** ON VIDEO NUM 30 !!!!!!!!    **********

TOPIC: Checking all possible moves

SUMMARY: By using a pieceList of all possible pieces on board at a given time
         checking possible moves can be computed much faster than by checking 
         every square on the GameBoard. In order to do this, a single array 
         must be created that holds all possible pieces to check. 

loop(pieces) 
if (pieces on square === side to move)
then genmoves() for piece on square 


square that a piece is on, given by pieceList[index]
index? 

wP * 10 + wPNum -> 0 based index of num of pieces from GameBoard.pieceNum
wN * 10 + wNNum


say we have 4 white pawns -> GameBoard.pieceNum[wP] = 4...
for(pieceNum = 0; pieceNum < GameBoard.pieceNum[wP]; ++pieceNum) {
  square = pieceList[wP * 10 + pieceNum];
}

sq1 = pieceList[wP * 10 + 0]
sq2 = pieceList[wP * 10 + 1]
sq3 = pieceList[wP * 10 + 2]
sq4 = pieceList[wP * 10 + 3]

wP 10 -> 19
wN 20 -> 29 

-----------------------------------------------------------------------

TOPIC: What defines a unique positionKey

the piece on each square 
side to play 
castle permission 
en Passant 

found by: (xOR)
positionKey ^= RandNum for all pieces on square 
positionKey ^= RandNum side to play 
... so on 

ex. const piece1 = rand32();
    const piece2 = rand32();
    const piece3 = rand32();
    const piece4 = rand32();  

    xOR in each piece:
    let key = 0; 
    key ^= piece1;
    key ^= piece2; 
    key ^= piece3;
    key ^= piece4;

    key.toString(16); 

    now if piece1 is captured, you can xOR out piece1 to get the same key as if
    piece1 were never used to build the key.

    key ^= piece1; 

-----------------------------------------------------------------------

TOPIC: Fen notation 
SUMMARY:
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
rank 8/rank 7/space/rank 2/rank 1 toMove castlePerm enPasSquare fiftyMove halfMoveCount

-----------------------------------------------------------------------

TOPIC: Move Generation / Storing Move Info

SUMMARY: Move info stored in bits as follows: 

  0000 0000 0000 0000 0000 0111 1111 -> From, 0x7f               (7bits)
  0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7f            (7bits)
  0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xf      (4bits)
  0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000               (1bit )
  0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000       (1bit )
  0000 1111 0000 0000 0000 0000 0000 -> Promoted pce >> 20, 0xf  (4bits)
  0001 0000 0000 0000 0000 0000 0000 -> Castle, 0x1000000        (1bit )





  Move has a fromSq and toSq. 

  Need to know: 
    en passant capture?
    captured piece?
    promoted piece?
    pawn start?
    castling move?

    all of this information can be stored in bits of a 32 bit number

    0000 0000 0000 0000 0000 0000 0000
    0000 0000 0000 0000 0000 0000 0001
    0000 0000 0000 0000 0000 0000 1111
    0000 0000 0000 0000 0000 0001 0000

    hex:  0    0    0    0    0    f    8
    bin: 0000 0000 0000 0000 0000 1111 1000


    The from square can be stored in the first 7 bits: 
                              7    F
    0000 0000 0000 0000 0000 0111 1111 -> From 0x7f     (first 7 bits)  

    If the move is stored in var d,
    fromSq = d & 0x7f:

    0010 1100 0000 1111 0000 0101 1001 -> var d 
                     &
    0000 0000 0000 0000 0000 0111 1111 -> 0x7f
                     =
    0000 0000 0000 0000 0000 0101 1001 -> just the fromSq


    The toSq can also be stored in 7 bits: 

    0000 0000 0000 0000 0000 0111 1111 -> 0x7f
    0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7f

    When we want the toSq, we can take the move, bitwise shift 7 
    to the right, and then bitwise & with 0x7f. 

-----------------------------------------------------------------------

TOPIC: Move Generation 

SUMMARY: The moveListStart array is used to index the moveList. The 
         moveListStart array is indexed by ply. 

    GameBoard.moveListStart[] -> index for the first move at a given ply (position in the search tree)
    GameBoard.moveList[index] 

    say ply === 1, loop all moves 
    for(index = GameBoard.moveListStart[1]; index < GameBoard.moveListStart[2]; index++) {
      move = moveList[index]; 

      ... do something with move
    }

    GameBoard.moveListStart[2] = GameBoard.moveListStart[1]

    addMove(move) {
      GameBoard.moveList[GameBoard.moveListStart[2]] = move; 
      GameBoard.moveListStart[2]++
    }



















