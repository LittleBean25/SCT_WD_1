function TicTacToe(placeholder, grid_size, callback) {
  this.placeholder = placeholder;
  this.paint(grid_size);
  this.callback = callback;
  this.scores = { X: 0, O: 0 };
  this.marks = { X: "X", O: "O", count: 0 };
  return this;
}

TicTacToe.prototype.paint = function (grid_size) {
  var self = this;
  document.documentElement.style.setProperty('--grid-size', grid_size);
  self.grid_size = grid_size;

  let html = '<table id="tic-tac-toe" align="center">';
  for (let i = 0; i < grid_size; i++) {
    html += "<tr>";
    for (let j = 0; j < grid_size; j++) {
      html += "<td></td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  self.placeholder.innerHTML = html;

  self.columns = self.placeholder.getElementsByTagName("td");
  for (let i = 0; i < self.columns.length; i++) {
    self.columns[i].addEventListener("click", function (e) {
      self.mark(e.target);
    });
  }
};

TicTacToe.prototype.mark = function (column) {
  if (column.innerHTML) return;
  this.marks.count++;
  let current_mark = this.marks.count % 2 === 1 ? this.marks.X : this.marks.O;

  column.innerHTML = current_mark;
  column.classList.add(current_mark);

  if (this.didWin(current_mark)) {
    if (current_mark === "X") this.scores.X++;
    else this.scores.O++;
    this.callback(current_mark, this.scores);
  } else if (this.marks.count === this.columns.length) {
    this.callback("draw");
  }
};

TicTacToe.prototype.didWin = function (mark) {
  let size = this.grid_size;
  let right_to_left_count = 0, left_to_right_count = 0;

  for (let i = 0; i < size; i++) {
    let horizontal_count = 0, vertical_count = 0;
    for (let j = 0; j < size; j++) {
      if (this.columns[i * size + j].innerHTML === mark) horizontal_count++;
      if (this.columns[j * size + i].innerHTML === mark) vertical_count++;
    }
    if (horizontal_count === size || vertical_count === size) return true;
    if (this.columns[i * size + i].innerHTML === mark) right_to_left_count++;
    if (this.columns[(size - 1) * (i + 1)].innerHTML === mark) left_to_right_count++;
  }
  return right_to_left_count === size || left_to_right_count === size;
};

TicTacToe.prototype.empty = function () {
  for (let i = 0; i < this.columns.length; i++) {
    this.columns[i].innerHTML = "";
    this.columns[i].classList.remove(this.marks.X, this.marks.O);
  }
  this.marks.count = 0;
};

TicTacToe.prototype.reset = function () {
  this.empty();
  this.scores = { X: 0, O: 0 };
};

var placeholder = document.getElementById("placeholder");
var winPopup = document.getElementById("win-popup");
var winPopupContent = document.getElementById("win-popup-content");
var tictactoe = new TicTacToe(placeholder, 3, onResult);

function showWinPopup(message) {
  winPopupContent.textContent = message;
  winPopup.style.display = "flex";

  // Hide popup after 2 seconds
  setTimeout(() => {
    winPopup.style.display = "none";
  }, 2000);
}

function pulseBackgroundText() {
  document.body.classList.add("pulse-bg");
  setTimeout(() => {
    document.body.classList.remove("pulse-bg");
  }, 1000);
}

function onResult(result, scores) {
  setTimeout(() => {
    if (result === "draw") {
      showWinPopup("It's a Draw!");
    } else {
      showWinPopup(result + " Wins!");
      pulseBackgroundText();
      updateScores(scores.X, scores.O);
    }
    tictactoe.empty();
  }, 200);
}

function updateScores(X, O) {
  document.getElementById("player1").innerHTML = X;
  document.getElementById("player2").innerHTML = O;
}

function restart() {
  tictactoe.reset();
  updateScores(0, 0);
  tictactoe.paint(3);
}
