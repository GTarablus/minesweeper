"use strict";

const MINE = "💣";
const FLAG = "🚩";
const FACE = "😐";
const DEAD = "🤯";
const EMPTY = "";
const HAPPY = "🥳";
const openColor = "rgb(180, 180, 180)";

/****************** GLOBAL VARIABLES ******************/

var elFace = document.querySelector(".faceHolder");
elFace.innerHTML = FACE;
var gTime = 0;
var elClock = document.querySelector(".clock");
var gBoard;
var numOfMines = 2;
var isGameOn = false;
var gPrevValue = "";
var gMineLocations = [];
var increaseTime;
var gFlagCount = 0;
var openCellCount = 0;
var gBoardSize = 4;

/****************** LEVEL MODIFIER ******************/

function levelModif(level) {
  elFace.innerHTML = FACE;
  document.querySelector("h1").innerHTML =
    "Click a cell twice to initialize game 😉";
  elClock.innerHTML = 0;
  if (isGameOn) {
    faceBtn();
  }
  if (level === "Easy") {
    numOfMines = 2;
    gBoardSize = 4;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
  }
  if (level === "Medium") {
    numOfMines = 12;
    gBoardSize = 8;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
  }
  if (level === "Hard") {
    numOfMines = 30;
    gBoardSize = 12;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
  }
}
/****************** INITIALIZING FUNCTION ******************/
function init() {
  gBoard = createBoard(gBoardSize);
  renderBoard(gBoard);
  document.querySelector("#Easy").checked = true;
  document.querySelector("body").style.opacity = 1;
}
/****************** CREATE GAME BOARD ******************/
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
  return board;
}
/****************** PLACING MINES ******************/
//Placing mines on the board, using random inclusive function according to random number
function placeMines(board, mines) {
  for (var i = 0; i < mines; i++) {
    var position = {
      g: getRandomIntInclusive(0, board.length - 1),
      j: getRandomIntInclusive(0, board.length - 1),
    };
    var currValue = board[position.g][position.j].value;
    if (board[position.g][position.j].isHit || currValue === MINE) {
      i--;
    } else {
      board[position.g][position.j].value = MINE;
      gMineLocations[i] = position;
    }
  }
}
/****************** CHECKING ALL NEIGHBOURS ******************/
function checkAllNeighbours(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = board[i][j];
      if (cell.value === MINE) continue;
      cell.value = checkCellNeighbours(cell, board);
    }
  }
}
/****************** CHECK CELL NEIGHBOURS ******************/
function checkCellNeighbours(cell, board) {
  var neighCount = 0;
  for (var i = cell.i - 1; i <= cell.i + 1 && i < gBoard.length; i++) {
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].value === MINE) neighCount++;
    }
  }
  if (neighCount === 0) {
    neighCount = EMPTY;
  }
  return neighCount;
}
/****************** RENDERING BOARD ******************/
//Rendering board
function renderBoard(board) {
  var strHtml = "";
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += "<tr>";
    for (var j = 0; j < row.length; j++) {
      var cell = board[i][j].value;

      strHtml += `<td data-i="${i}" data-j="${j}" class="cell${i}-${j}" onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)">
                               <p> ${cell} </p>
                            </td>`;
    }
    strHtml += "</tr>";
  }
  var elMat = document.querySelector(".game-board");
  elMat.innerHTML = strHtml;
}
/****************** CELLCLICKED FUNCTION ******************/
/* cellClicked function
Returns if clicked cell is flagged, updates isHit to true
show content only if game is on, places mines (except for clicked pos)
check for neighbours according to mine position
Renders board, sends to loseGame function if mine is clicked
*/
function cellClicked(cell) {
  var cellPos = {
    g: +cell.dataset.i,
    j: +cell.dataset.j,
  };
  var cellValue = cell.children[0].innerText;
  if (cellValue === FLAG) return;
  gBoard[cellPos.g][cellPos.j].isHit = true;
  if (isGameOn) cell.children[0].style.opacity = 1;
  if (!isGameOn && elFace.innerHTML === FACE) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
    cell.children[0].style.opacity = 1;
    cell.style.backgroundColor = openColor;
    return;
  }
  if (cellValue === MINE && isGameOn) {
    cell.style.backgroundColor = "red";
    loseGame();
  } else if (cellValue === EMPTY && isGameOn) {
    cell.style.backgroundColor = openColor;
    openNeighbours(cellPos, gBoard);
    openCellCount++;
    checkVictory();
  } else {
    cell.style.backgroundColor = openColor;
    openCellCount++;
    checkVictory();
  }
}
/****************** FLAGGING CELLS ******************/
function cellFlagged(cell) {
  gFlagCount++;
  var cellValue = cell.children[0].innerText;
  var i = +cell.dataset.i;
  var j = +cell.dataset.j;
  if (!isGameOn) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
  }
  if (!gBoard[i][j].isHit) {
    if (cellValue !== FLAG) {
      gPrevValue = cellValue;
      cell.children[0].innerText = FLAG;
      cell.children[0].style.opacity = 1;
    } else {
      cell.children[0].innerText = gPrevValue;
      cell.children[0].style.opacity = 0;
      gFlagCount--;
    }
  }
  checkVictory();
}
/****************** OPENING NEIGHBOUR CELLS ******************/
function openNeighbours(cell, board) {
  for (var i = cell.g - 1; i <= cell.g + 1 && i < gBoard.length; i++) {
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].isHit) continue;
      var value = board[i][j].value;
      var nextCell = {
        g: i,
        j,
      };
      board[i][j].isHit = true;
      renderCell(nextCell, value);
    }
  }
}
/****************** LOSE GAME ******************/
/* loseGame function
Reveals all mine locations using a mine array
stops the clock, changes player face, turns off game
*/
function loseGame() {
  for (var i = 0; i < gMineLocations.length; i++) {
    var currLocation = gMineLocations[i];
    renderCell(currLocation, MINE);
    clearInterval(increaseTime);
    elFace.innerHTML = DEAD;
    isGameOn = false;
    openCellCount = 0;
    gFlagCount = 0;
    document.querySelector("h1").innerHTML = "🤯 You Died! 💀";
  }
}
/****************** CHECK VICTORY ******************/
function checkVictory() {
  var notMineCount = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].value !== MINE) {
        notMineCount++;
      }
    }
  }
  if (gFlagCount === numOfMines && openCellCount === notMineCount) {
    winGame();
  }
} /****************** WIN GAME FUNCTION ******************/

function winGame() {
  elFace.innerHTML = HAPPY;
  clearInterval(increaseTime);
  isGameOn = false;
  openCellCount = 0;
  gFlagCount = 0;
  document.querySelector("h1").innerHTML =
    "🎉🎊 You Win! 🎊🎉 <br> Your Time: " + gTime + " Seconds";
}
/****************** EMOJI FACE BUTTON FUNCTION ******************/
function faceBtn() {
  isGameOn = false;
  clearInterval(increaseTime);
  elClock.innerHTML = 0;
  init();
  elFace.innerHTML = FACE;
  openCellCount = 0;
  gFlagCount = 0;
  document.querySelector("h1").innerHTML =
    "Click a cell twice to initialize game 😉";
}

/*
List of bugs:
1. First cell doesn't show content when clicked.
2. First cell doesn't show content when flagged.
Find way to turn bugs into feature.
*/
