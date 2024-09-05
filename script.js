"use strict"

const MINE = "💣"
const FLAG = "🏴‍☠️"
const RESET = "😊"
const LOSE = "😢"
const WIN = "😎"

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
	seconds: 0,
	lives: 2,
	timer: null,
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

function onInIt() {
	gBoard = createBoard()
	renderBoard(gBoard)
	livesCount()
	updateSmiley(RESET)
	resetTimer()
	hideVictory()
}

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
	var strHTML = ""
	for (var i = 0; i < board.length; i++) {
		strHTML += `<tr>`
		for (var j = 0; j < board[0].length; j++) {
			var cellClass = `cell-${i}-${j}`
			strHTML += `<td class="hide cell ${cellClass}" 
                  onclick="onCellClicked(this, ${i}, ${j})" 
                  oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;"></td>`
		}
		strHTML += `</tr>`
	}

	const elBoard = document.querySelector(".board-container")
	elBoard.innerHTML = strHTML
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

function onCellClicked(elCell, i, j) {
	if (!gGame.isOn && gFirstClick) {
		gFirstClick = false
		gGame.isOn = true
		placeMines(i, j)
		renderMinesNegsCount(gBoard)
		startTimer()
	}
	if(gGame.isOn){

		if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return
	
		gBoard[i][j].isShown = true
		elCell.classList.remove("hide")
	
		if (gBoard[i][j].isMine) {
			elCell.innerText = MINE
			gGame.lives--
			livesCount()
			if (gGame.lives === 0) gameOver()
		} else {
			elCell.innerText = gBoard[i][j].minesAroundCount
			if (gBoard[i][j].minesAroundCount === 0) revealNeighbors(i, j, gBoard)
		}
	
		gGame.shownCount++
		checkGameOver()
	}
	}


function onCellMarked(elCell, i, j) {
	if (gBoard[i][j].isShown) return

	const cell = gBoard[i][j]

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

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

function livesCount() {
	const elLives = document.querySelector(".lives")
	elLives.innerHTML = "" 

	for (var i = 0; i < gGame.lives; i++) {
		const elHeart = document.createElement("img")
		elHeart.src = "1f90e.png"
		elHeart.classList.add("heart-icon")
		elLives.appendChild(elHeart)
	}
}

function resetHeart() {
	if (gLevel.SIZE === 4) {
		gGame.lives = 2
	} else {
		gGame.lives = 3 
	}
	livesCount()
}

function setLevelSize(size) {
	gLevel.SIZE = size

	if (size === 4) {
		gLevel.MINES = 2
		gGame.lives = 2
	} else if (size === 8) {
		gLevel.MINES = 14
		gGame.lives = 3
	} else if (size === 12) {
		gLevel.MINES = 32
		gGame.lives = 3
	}

	onRestart() 
}

function onRestart() {
	gGame.isOn = false
	gGame.shownCount = 0
	gGame.markedCount = 0
	gFirstClick = true
	resetHeart() 
	resetTimer()
	onInIt() 
}

function gameOver() {
	gGame.isOn = false
	updateSmiley(LOSE) 
	stopTimer() 
}

function checkGameOver() {
	const totalCells = gLevel.SIZE * gLevel.SIZE
	const regularCells = totalCells - gLevel.MINES

	if (gGame.shownCount === regularCells) {
		var correctFlagMines = 0
		var noFlagShownMines = 0

		for (var i = 0; i < gLevel.SIZE; i++) {
			for (var j = 0; j < gLevel.SIZE; j++) {
				const cell = gBoard[i][j]
				if (cell.isMine && cell.isMarked) {
					correctFlagMines++
				}
				if (cell.isMine && cell.isShown && !cell.isMarked) {
					noFlagShownMines++
				}
			}
		}

		if (
			correctFlagMines + noFlagShownMines === gLevel.MINES &&
			gGame.lives > 0
		) {
			updateSmiley(WIN)
			gGame.isOn = false
			stopTimer() 
			showVictory() 
		}
	}
}

function updateSmiley(smiley) {
	const smileyButton = document.querySelector(".smiley-button")
	smileyButton.innerText = smiley
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

function placeMines(firstI, firstJ) {
	var minesPlaced = 0
	while (minesPlaced < gLevel.MINES) {
		const idxI = randomIdx()
		const idxJ = randomIdx()

		if ((idxI === firstI && idxJ === firstJ) || gBoard[idxI][idxJ].isMine)
			continue

		gBoard[idxI][idxJ].isMine = true
		minesPlaced++
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

function revealNeighbors(cellI, cellJ, mat) {
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= mat[i].length) continue
			if (i === cellI && j === cellJ) continue

			var neighborCell = mat[i][j]
			var elNeighborCell = document.querySelector(`.cell-${i}-${j}`)

			if (!neighborCell.isShown && !neighborCell.isMarked) {
				neighborCell.isShown = true
				gGame.shownCount++

				if (neighborCell.minesAroundCount === 0) {
					revealNeighbors(i, j, mat) // Recursively reveal neighbors
				}

				elNeighborCell.innerText = neighborCell.minesAroundCount
				elNeighborCell.classList.remove("hide")
			}
		}
	}
}

function randomIdx() {
	return Math.floor(Math.random() * gLevel.SIZE)
}

function startTimer() {
	gGame.seconds = 0
	gGame.timer = setInterval(() => {
		gGame.seconds++
		document.querySelector(".timer").innerText = gGame.seconds
	}, 1000)
}

function stopTimer() {
	clearInterval(gGame.timer)
	gGame.timer = null
}

function resetTimer() {
	stopTimer()
	gGame.seconds = 0
	document.querySelector(".timer").innerText = gGame.seconds
}

function showVictory() {
	const elVictory = document.querySelector(".game-won-message")
	elVictory.classList.add("show")
}

function hideVictory() {
	const elVictory = document.querySelector(".game-won-message")
	elVictory.classList.remove("show")
}
