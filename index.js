var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var coloroptions = ['#6cbafd','#64f750', '#fa80bd', '#eaf737'];


var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + coloroptions.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}
var count = 0;

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  var last = event.results.length - 1;

  console.log('All of it: ' + event.results[last][0].transcript);

  var stringer = event.results[last][0].transcript;
  var stringer = stringer.split(" ");

  if(count == 0){
  	var color = stringer[0];
  }
  else{
  	var color = stringer[1];
  }
  
  console.log(typeof(color));
  console.log('the spoken string?: ' + stringer);

  if (color == "blue"){
        color = "#6cbafd";
  }
  if (color == "pink"){
    color = "#fa80bd";
  }
  if (color == "yellow"){
    color = "#eaf737";
  }
  if (color == "green"){
    color = "#64f750";
  }

  game.activeColor = color;

  setScore();

  console.log('Color selected: ' + game.activeColor);

  console.log(game.activeColor + typeof(game.activeColor));
  console.log(coloroptions.includes(game.activeColor));

  if(coloroptions.includes(game.activeColor)){
  	propagateColor(0, 0, game.activeColor);
  }
  	
  drawBoard();

  count +=1;

  game.board.squares.forEach(row => {
    row.forEach(sq => {
      sq.visited = false;
    });
  });
  
}

//////////

const K = 5;

let game = {
  coloroptions: coloroptions,
  difficulty: 1,
  board: [],
  score: "00",
  context: null,
  activeColor: null
};


/*
function getColors() {
  let colors = [];

  const buttons = document.getElementsByClassName("buttons")[0];
  buttons.querySelectorAll("button").forEach(button => {
    colors.push(button.dataset.color);
  });

  return colors;
}
*/



function setScore() {
  const score = document.getElementById("score");
  const currentScore = parseInt(score.innerHTML);

  if (currentScore < 10) {
    game.score = "0" + (currentScore + 1);
  } else {
    game.score = currentScore + 1;
  }

  score.innerHTML = game.score;
}

function resetGame() {
  game.board = [];
  game.context = null;
  game.activeColor = null;
  game.score = "00";

  document.getElementById("score").innerHTML = game.score;

  play();
}

function changeDifficulty(select) {
  game.difficulty = parseInt(select.value);

  resetGame();
}

function play() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  game.context = context;

  buildBoard();
}

function buildBoard() {
  const screen = document.getElementById("canvas").getBoundingClientRect();
  const boardSize = game.difficulty * K;
  game.context.canvas.width = screen.width;
  game.context.canvas.height = screen.height;

  const squareSize = game.context.canvas.width / boardSize;

  game.board = new Board(boardSize, squareSize);
  game.board.squares.forEach((row, i) => {
    for (let j = 0; j < row.length; j++) {
      const square = new Square(i, j, game.board.squareSize, getRandomColor());

      game.board.setSquare(i, j, square);
    }
  });

  drawBoard();
}

function drawBoard() {
  game.board.squares.forEach(row => {
    row.forEach(sq => {
      sq.visited = false;

      if (sq.color == "blue"){
        sq.color = "#6cbafd";
      }
      if (sq.color == "pink"){
        sq.color = "#fa80bd";
      }
      if (sq.color == "yellow"){
        sq.color = "#eaf737";
      }
      if (sq.color == "green"){
        sq.color = "#64f750";
      }

      drawSquare(sq.x, sq.y, game.board.squareSize, sq.color);
    });
  });
}

function propagateColor(i, j, newColor) {
  let square = game.board.squares[i][j];
  let surround = game.board.getSurroundingSquares(square.row, square.column);

  square.visited = true;

  surround.forEach(sq => {
    if (!sq.visited && sq.color == square.color) {
      propagateColor(sq.row, sq.column, newColor);
    }
  });

  if (square.color == "blue"){
        square.color = "#6cbafd";
      }
      if (square.color == "pink"){
        square.color = "#fa80bd";
      }
      if (square.color == "yellow"){
        square.color = "#eaf737";
      }
      if (square.color == "green"){
        square.color = "#64f750";
      }

  square.color = newColor;
}

function drawSquare(x, y, size, color) {
  game.context.fillStyle = color;
  game.context.fillRect(x, y, size, size);
}

function getRandomColor() {
  return game.coloroptions[Math.floor(Math.random() * game.coloroptions.length)];
}

function toggle(button) {
  button.parentNode.classList.toggle("visible");
}

class Square {
  constructor(row, col, size, color) {
    this.x = row * size;
    this.y = col * size;
    this.size = size;
    this.color = color;
    this.row = row;
    this.column = col;
  }
}

class Board {
  constructor(boardSize, squareSize) {
    this.boardSize = boardSize;
    this.squareSize = squareSize;

    this.squares = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
      this.squares[i] = new Array(boardSize);
    }
  }

  setSquare(i, j, square) {
    this.squares[i][j] = square;
  }

  getSurroundingSquares(x, y) {
    let surround = [];

    let positions = [];
    positions.push([x - 1, y]); //up
    positions.push([x, y - 1]); //left
    positions.push([x, y + 1]); //right
    positions.push([x + 1, y]); //down

    positions.forEach(pos => {
      const isInsideBoard =
        pos[0] >= 0 &&
        pos[0] < this.boardSize &&
        pos[1] >= 0 && pos[1] < this.boardSize;
      if (isInsideBoard) {
        surround.push(this.squares[pos[0]][pos[1]]);
      }
    });

    return surround;
  }
}

window.onLoad = play();