"use strict";

const MINE = "💣";
const FLAG = "🚩";
const FACE = "😐";
const DEAD = "🤯";
const EMPTY = "";
const HAPPY = "🥳";
const openColor = "rgb(180, 180, 180)";
const HEART = "💖";
const BROKEN = "💔";
const SHIELD = "🛡️";
const INITIALTEXT = "Click a cell to initialize the game 🎮";
const BOOMSOUND = new Audio("sounds/boom.mp3");
const BGC = "rgb(100, 185, 200)";
const HINT = "";

/****************** GLOBAL VARIABLES ******************/

var elFace = document.querySelector(".faceHolder");
elFace.innerHTML = FACE;
var gTime = 0;
var elClock = document.querySelector(".clock");
var elBody = document.querySelector("body");
var gBoard;
var numOfMines = 2;
var isGameOn = false;
var gPrevValue = "";
var gMineLocations = [];
var increaseTime;
var gFlagCount = 0;
var openCellCount = 0;
var gBoardSize = 4;
var elLives = document.querySelector(".indications .lives");
var elShields = document.querySelector(".shields");
var gLives = 2;
var gShields = 2;
var gCurrLevel = "Easy";
/****************** LEVEL MODIFIER ******************/

function levelModif(level) {
  gCurrLevel = level;
  elFace.innerHTML = FACE;
  document.querySelector("h1").innerHTML = INITIALTEXT;

  elClock.innerHTML = 0;
  if (isGameOn) {
    faceBtn();
  }
  if (level === "Easy") {
    numOfMines = 2;
    gBoardSize = 4;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART;
    elShields.innerText = SHIELD + SHIELD;
    gLives = 2;
    gShields = 2;
    elBody.style.backgroundColor = BGC;
  }
  if (level === "Medium") {
    numOfMines = 12;
    gBoardSize = 8;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART + HEART;
    elShields.innerText = SHIELD + SHIELD + SHIELD;
    gLives = 3;
    gShields = 3;
    elBody.style.backgroundColor = BGC;
  }
  if (level === "Hard") {
    numOfMines = 30;
    gBoardSize = 12;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART + HEART;
    elShields.innerText = SHIELD + SHIELD + SHIELD;
    gLives = 3;
    gShields = 3;
    elBody.style.backgroundColor = BGC;
  }
}
/****************** INITIALIZING FUNCTION ******************/
function init() {
  gBoard = createBoard(gBoardSize);
  renderBoard(gBoard);
  document.querySelector("body").style.opacity = 1;
  if (!isGameOn) document.querySelector("#Easy").checked = true;
  levelModif(gCurrLevel);
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

      strHtml += `<td data-i="${i}" data-j="${j}" id="cell${i}-${j}" onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)">
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
  console.log(cellPos.g, cellPos.j);
  var cellValue = cell.children[0].innerText;
  if (cellValue === FLAG || gBoard[cellPos.g][cellPos.j].isHit === true) return;
  gBoard[cellPos.g][cellPos.j].isHit = true;
  if (isGameOn) cell.children[0].style.opacity = 1;
  if (!isGameOn && elFace.innerHTML === FACE) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
    var newCell = document.querySelector(`#cell${cellPos.g}-${cellPos.j}`);
    console.log(newCell);
    newCell.children[0].style.opacity = 1; // Attempt to set opacity of first clicked cell in order  to show its value after first click and after board is rendered
    newCell.style.backgroundColor = openColor; //Attempt to set first click background
    if (gBoard[cellPos.g][cellPos.j].value === EMPTY)
      openRecur(cellPos, gBoard);
    openCellCount++;
    document.querySelector("h1").innerHTML = "May the Force be with you 🐸";
    return;
  }
  if (cellValue === MINE && isGameOn && gLives === 1) {
    cell.style.backgroundColor = "red";
    BOOMSOUND.play();
    elLives.innerText = "";
    loseGame();
  } else if (cellValue === MINE && isGameOn && gLives > 1) {
    cell.style.backgroundColor = "red";
    BOOMSOUND.play();
    gLives--;
    gFlagCount++;
    if (gLives === 2) elLives.innerText = HEART + HEART;
    if (gLives === 1) {
      elLives.innerText = HEART;
      elBody.style.backgroundColor = "rgb(179, 21, 21)";
      document.querySelector("h1").innerHTML = "DANGER";
    }
  } else if (cellValue === EMPTY && isGameOn) {
    cell.style.backgroundColor = openColor;
    openRecur(cellPos, gBoard);
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
  elClock.innerHTML = 0;
  clearInterval(increaseTime);
  init();
  elFace.innerHTML = FACE;
  openCellCount = 0;
  gFlagCount = 0;
  document.querySelector("h1").innerHTML = INITIALTEXT;
  elBody.style.backgroundColor = BGC;
}

/****************** EMOJI FACE BUTTON FUNCTION ******************/
function safeClick() {
  if (!isGameOn || gShields === 0) return;
  var safeCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isHit && gBoard[i][j].value !== MINE) {
        var position = {
          i,
          j,
        };
        safeCells.push(position);
      }
    }
  }
  var safePos = safeCells[getRandomIntInclusive(0, safeCells.length - 1)];
  var safeCell = document.querySelector(`#cell${safePos.i}-${safePos.j}`);
  safeCell.style.backgroundColor = "green";
  setTimeout(function () {
    safeCell.style.backgroundColor = "rgb(144, 144, 144)";
  }, 500);
  gShields--;
  if (gShields === 2) elShields.innerHTML = SHIELD + SHIELD + " ";
  if (gShields === 1) elShields.innerHTML = SHIELD + " " + " ";
  if (gShields === 0) elShields.innerHTML = " " + " " + " ";
}

/****************** RECURSION TEST ******************/
function openRecur(cell, board) {
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
      if (value !== EMPTY) continue;
      openRecur(nextCell, board);
    }
  }
}
