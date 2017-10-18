$('#setFen').click(function() {
  const fenString = $('#fenIn').val(); 
  parseFen(fenString); 
  printBoard();
});



const board  = document.getElementById('board');

const ctx = board.getContext('2d'); 
ctx.fillStyle = '#b1b7d1';

ctx.fillRect(0, 525, 75, 75);
ctx.fillRect(0, 375, 75, 75);
ctx.fillRect(0, 225, 75, 75);
ctx.fillRect(0, 75, 75, 75);

ctx.fillRect(75, 450, 75, 75);
ctx.fillRect(75, 300, 75, 75);
ctx.fillRect(75, 150, 75, 75);
ctx.fillRect(75, 0, 75, 75);

ctx.fillRect(150, 525, 75, 75);
ctx.fillRect(150, 375, 75, 75);
ctx.fillRect(150, 225, 75, 75);
ctx.fillRect(150, 75, 75, 75);

ctx.fillRect(225, 450, 75, 75);
ctx.fillRect(225, 300, 75, 75);
ctx.fillRect(225, 150, 75, 75);
ctx.fillRect(225, 0, 75, 75);

ctx.fillRect(300, 525, 75, 75);
ctx.fillRect(300, 375, 75, 75);
ctx.fillRect(300, 225, 75, 75);
ctx.fillRect(300, 75, 75, 75);

ctx.fillRect(375, 450, 75, 75);
ctx.fillRect(375, 300, 75, 75);
ctx.fillRect(375, 150, 75, 75);
ctx.fillRect(375, 0, 75, 75);

ctx.fillRect(450, 525, 75, 75);
ctx.fillRect(450, 375, 75, 75);
ctx.fillRect(450, 225, 75, 75);
ctx.fillRect(450, 75, 75, 75);

ctx.fillRect(525, 450, 75, 75);
ctx.fillRect(525, 300, 75, 75);
ctx.fillRect(525, 150, 75, 75);
ctx.fillRect(525, 0, 75, 75);

ctx.fillStyle='#edeef4';

ctx.fillRect(0, 450, 75, 75);
ctx.fillRect(0, 300, 75, 75);
ctx.fillRect(0, 150, 75, 75);
ctx.fillRect(0, 0, 75, 75);

ctx.fillRect(75, 525, 75, 75);
ctx.fillRect(75, 375, 75, 75);
ctx.fillRect(75, 225, 75, 75);
ctx.fillRect(75, 75, 75, 75);

ctx.fillRect(150, 450, 75, 75);
ctx.fillRect(150, 300, 75, 75);
ctx.fillRect(150, 150, 75, 75);
ctx.fillRect(150, 0, 75, 75);

ctx.fillRect(225, 525, 75, 75);
ctx.fillRect(225, 375, 75, 75);
ctx.fillRect(225, 225, 75, 75);
ctx.fillRect(225, 75, 75, 75);

ctx.fillRect(300, 450, 75, 75);
ctx.fillRect(300, 300, 75, 75);
ctx.fillRect(300, 150, 75, 75);
ctx.fillRect(300, 0, 75, 75);

ctx.fillRect(375, 525, 75, 75);
ctx.fillRect(375, 375, 75, 75);
ctx.fillRect(375, 225, 75, 75);
ctx.fillRect(375, 75, 75, 75);

ctx.fillRect(450, 450, 75, 75);
ctx.fillRect(450, 300, 75, 75);
ctx.fillRect(450, 150, 75, 75);
ctx.fillRect(450, 0, 75, 75);

ctx.fillRect(525, 525, 75, 75);
ctx.fillRect(525, 375, 75, 75);
ctx.fillRect(525, 225, 75, 75);
ctx.fillRect(525, 75, 75, 75);
