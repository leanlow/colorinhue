const K = 5;

let game = {
  colors: getColors(),
  difficulty: 1,
  board: [],
  score: "00",
  context: null,
  activeColor: null
};

function getColors() {
  let colors = [];

  const buttons = document.getElementsByClassName("buttons")[0];
  buttons.querySelectorAll("button").forEach(button => {
    colors.push(button.dataset.color);
  });

  return colors;
}

function chooseColor(button) {
  game.activeColor = button.dataset.color;

  setScore();

  propagateColor(0, 0, game.activeColor);
  drawBoard();

  game.board.squares.forEach(row => {
    row.forEach(sq => {
      sq.visited = false;
    });
  });
}

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

  square.color = newColor;
}

function drawSquare(x, y, size, color) {
  game.context.fillStyle = color;
  game.context.fillRect(x, y, size, size);
}

function getRandomColor() {
  return game.colors[Math.floor(Math.random() * game.colors.length)];
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