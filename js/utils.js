"use strict";

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      // var className = 'cell cell' + i + '-' + j;
      var className = `cell cell${i}-${j}`;
      // strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
      strHTML += `<td class="${className}">${cell}</td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var color = Math.floor(Math.random() * 16777216).toString(16);
  return "#000000".slice(0, -color.length) + color;
}

//Game clock runs on an interval every second, adding to seconds count
function gameClock() {
  gTime = 0;
  increaseTime = setInterval(function () {
    gTime++;
    elClock.innerHTML = gTime;
  }, 1000);
  increaseTime;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`#cell${location.g}-${location.j}`);
  elCell.innerHTML = value;
  if (value != MINE) elCell.style.backgroundColor = "rgb(180, 180, 180)";
  openCellCount++;
}

// Initializes 'Vanillatilt' for cell animation
function initTiltBoard() {
  var tiltSpans = document.querySelectorAll(".tilt");
  console.log(tiltSpans);
  // var innerTiltSpans = document.querySelectorAll(".num-cell");

  VanillaTilt.init(tiltSpans, {
    // max: gLevel.DIFF === 3 ? 15 : 20,
    // speed: 500,
    // glare: gLevel.DIFF < 3 ? true : false,
    // reverse: gLevel.DIFF === 3 ? true : false,
  });
}
