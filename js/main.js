"use strict";

const MINE = "💣";
const FLAG = "🚩";

var elClock = document.querySelector(".clock");
var gBoard;
var numOfMines = 2;
var isGameOn = false;

function init() {
  gBoard = createBoard(4);
  renderBoard(gBoard);

  // console.table(gBoard);
}

//Building the game board according to size
function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        i,
        j,
        value: "",
        isHit: false,
      };
    }
  }
  //   console.table(board);
  return board;
}

//Placing mines on the board, using random inclusive function according to random number
function placeMines(board, mines) {
  for (var i = 0; i < mines; i++) {
    var position = {
      i: getRandomIntInclusive(0, 3),
      j: getRandomIntInclusive(0, 3),
    };
    if (!board[position.i][position.j].isHit) {
      board[position.i][position.j].value = MINE;
    } else {
      i--;
    }
  }
}

function checkAllNeighbours(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = board[i][j];
      if (cell.value === MINE) continue;
      cell.value = checkCellNeighbours(cell, board);
    }
  }
}

function checkCellNeighbours(cell, board) {
  var neighCount = 0;
  for (var i = cell.i - 1; i <= cell.i + 1 && i < gBoard.length; i++) {
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].value === MINE) neighCount++;
    }
  }
  return neighCount;
}

//Rendering board
function renderBoard(board) {
  var strHtml = "";
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += "<tr>";
    for (var j = 0; j < row.length; j++) {
      var cell = board[i][j].value;

      strHtml += `<td data-i="${i}" data-j="${j}" class="cell" onclick="cellClicked(this)">
                                ${cell}
                            </td>`;
    }
    strHtml += "</tr>";
  }
  var elMat = document.querySelector(".game-board");
  elMat.innerHTML = strHtml;
}

function cellClicked(cell) {
  console.log(cell.dataset);
  var i = +cell.dataset.i;
  var j = +cell.dataset.j;
  gBoard[i][j].isHit = true;
  //   console.log(gBoard[i][j]);
  if (!isGameOn) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
  }
}

//Game clock runs on an interval every second, adding to seconds count
function gameClock() {
  var time = 0;
  var increaseTime = setInterval(function () {
    time++;
    elClock.innerHTML = time;
  }, 1000);
  increaseTime;
}
