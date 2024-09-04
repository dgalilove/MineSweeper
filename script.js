"use strict"

const MINE = "*"
const FLAG = "🏴‍☠️"

var gFirstClick = true
var gBoard
var gLevel = {
	SIZE: 4,
	MINES: 2,
}
var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0,
}

function onInIt() {
	gBoard = createBoard()
	renderBoard(gBoard)
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

// build , render , modal

function createBoard() {
  const board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  return board
}

function renderBoard(board) {
	var strHTML = "<table>"
	for (var i = 0; i < board.length; i++) {
		strHTML += `<tr>`
		for (var j = 0; j < board[0].length; j++) {
			var cellClass = `cell-${i}-${j}`
			strHTML += `<td class="hide cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;"></td>`
		}
		strHTML += `</tr>`
	}
	strHTML += "</table>"

	const elBoard = document.querySelector(".board-container")
	elBoard.innerHTML = strHTML
}

function gameOver() {
	showModal("Game Over!")
}

function checkGameOver() {
	const totalCells = gLevel.SIZE * gLevel.SIZE
	const nonMineCells = totalCells - gLevel.MINES

	if (gGame.shownCount !== nonMineCells) return

	for (var i = 0; i < gLevel.SIZE; i++) {
		for (var j = 0; j < gLevel.SIZE; j++) {
			const cell = gBoard[i][j]
			if (cell.isMine && !cell.isMarked) {
				return
			}
		}
	}

	showModal("You Win!")
	gGame.isOn = false
}

function showModal(message) {
  const modal = document.querySelector(".modal")
  const gameMessage = document.querySelector(".game-message")
  gameMessage.innerText = message
  modal.classList.add("show")
}

function onRestart() {
  const modal = document.querySelector(".modal")
  modal.classList.remove("show") 
  gGame.isOn = true
  gGame.shownCount = 0
  gGame.markedCount = 0
  onInIt() 
}



//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶


// 					Click Functions						//


function onCellClicked(elCell, i, j) {
  var cell = gBoard[i][j]

  if (cell.isShown || cell.isMarked) return

  
  if (gFirstClick) {
    gFirstClick = false
    placeMines(i, j) 
    renderMinesNegsCount(gBoard) 
  }

  cell.isShown = true

  if (cell.isMine) {
    elCell.innerText = MINE
    gameOver()
  } else {
    elCell.innerText = cell.minesAroundCount
    elCell.classList.remove("hide")

    gGame.shownCount++

    if (cell.minesAroundCount === 0) {
      revealNeighbors(i, j, gBoard)
    }
  }

  checkGameOver()
}

function onCellMarked(elCell, i, j) {
	var cell = gBoard[i][j]

	if (cell.isShown) return

	if (!cell.isMarked) {
		cell.isMarked = true
		gGame.markedCount++
		elCell.innerText = FLAG
	} else {
		cell.isMarked = false
		gGame.markedCount--
		elCell.innerText = ""
	}

	checkGameOver()
}


///̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶



//								 Mines Functions								//


function placeMines(i, j) {
  var minesPlaced = 0;
  while (minesPlaced < gLevel.MINES) {
    const idxI = randomIdx();
    const idxJ = randomIdx();

    // Ensure the mine is not placed on the clicked cell
    if ((idxI === i && idxJ === j) || gBoard[idxI][idxJ].isMine) {
      continue;
    }

    gBoard[idxI][idxJ].isMine = true;
    minesPlaced++;
  }
}


function renderMinesNegsCount(board) {
	for (var i = 0; i < gLevel.SIZE; i++) {
		for (var j = 0; j < gLevel.SIZE; j++) {
			board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)
		}
	}
}

function setMinesNegsCount(cellI, cellJ, mat) {
	var negsCount = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= mat[i].length) continue
			if (i === cellI && j === cellJ) continue
			if (mat[i][j].isMine) negsCount++
		}
	}
	return negsCount
}

// Other functions
function revealNeighbors(cellI, cellJ, mat) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue
      if (i === cellI && j === cellJ) continue

      var neighborCell = mat[i][j]
      var neighborElCell = document.querySelector(`.cell-${i}-${j}`)

      if (!neighborCell.isShown && !neighborCell.isMarked) {
        neighborCell.isShown = true
        gGame.shownCount++

        if (neighborCell.minesAroundCount === 0) {
          revealNeighbors(i, j, mat)
        }

        // Keep 0 visible
        neighborElCell.innerText = neighborCell.minesAroundCount
        neighborElCell.classList.remove("hide")
      }
    }
  }
}

function randomIdx() {
	return getRandomIntInclusive(0, gLevel.SIZE - 1)
}

