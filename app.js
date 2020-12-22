var game = new Chess();
var board = new ChessBoard('board', {
  onSquareClick: onSquareClick
});
setTimeout(update, 1000);   

function onSquareClick(clickedSquare, selectedSquares) {
  console.log("onSquareClick");
  console.log(clickedSquare);
  console.log("selected");
  console.log(selectedSquares);

  if (selectedSquares.length === 0) {
    if (game.moves({ square: clickedSquare }).length > 0) {
      console.log("legal");
      console.log(game.moves({ square: clickedSquare }));
      board.selectSquare(clickedSquare);
    }

    return;
  }

  var selectedSquare = selectedSquares[0];
   
  if (clickedSquare === selectedSquare) {
    board.unselectSquare(clickedSquare);
    return;
  }

  board.unselectSquare(selectedSquare);

  var clickedPieceObject = game.get(clickedSquare);
  var selectedPieceObject = game.get(selectedSquare);

  if (clickedPieceObject && (clickedPieceObject.color === selectedPieceObject.color)) {
    board.selectSquare(clickedSquare);
    return;
  }

  var legalMoves = game.moves({ square: selectedSquare, verbose: true });
  var isMoveLegal = legalMoves.filter(function(move) {
    return move.to === clickedSquare;
  }).length > 0;

  if (!isMoveLegal) {
    return;
  }

  if (selectedPieceObject.type === 'p' && (clickedSquare[1] === '1' || clickedSquare[1] === '8')) { // Promotion
    board.askPromotion(selectedPieceObject.color, function(shortPiece) {
      move(selectedSquare, clickedSquare, shortPiece);
    });
  } else {
    move(selectedSquare, clickedSquare);
  }
}

function update() {
  // send position:
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
      
         console.log("SERVED STATE");
         
         console.log(xhttp.responseText);
         if(xhttp.responseText === undefined || xhttp.responseText === game.fen()) {
             setTimeout(update, 1000);   
         } else {
             console.log("UPDATING BOARD POSITION");
             board.setPosition(xhttp.responseText);
             game.load(xhttp.responseText);
             setTimeout(update, 100);   
         }
      }
  };
  xhttp.open("GET", "http://shikib.sp.cs.cmu.edu:9334/", true);
  xhttp.send();
}

function move(from, to, promotionShortPiece) {
  game.move({
    from: from,
    to: to,
    promotion: promotionShortPiece
  });

  board.setPosition(game.fen());
  game.load(game.fen());

  console.log(game.fen());
  //randomMove();
  

  // send position:
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
      
         setTimeout(update, 1000);   
      }
  };
  xhttp.open("POST", "http://shikib.sp.cs.cmu.edu:9334/", true);
  xhttp.send(game.fen()); 
}

function randomMove() {
  var legalMoves = game.moves();

  var randomIndex = Math.floor(Math.random() * legalMoves.length);

  game.move(legalMoves[randomIndex]);
  board.setPosition(game.fen());

  if (game.game_over()) {
    if (game.in_checkmate()) {
      alert('You ' + (game.turn() === 'w' ? 'lost' : 'won'));
    } else {
      alert('It\'s a draw');
    }
  }
}

