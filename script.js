"use strict"

const MINE = "💣"
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
	seconds: 0,
	lives: 2,
	timer: null,
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

function onInIt() {
	gBoard = createBoard()
	renderBoard(gBoard)
	livesCount()
	updateSmiley("reset")
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
	if (gGame.isOn) {
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
			if (gBoard[i][j].minesAroundCount === 0) revealNegs(i, j, gBoard)
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
		elHeart.src = "img/1f90e.png"
		elHeart.classList.add("heart-icon")
		elLives.appendChild(elHeart) // note to self : If the given child is a DocumentFragment, the entire contents of the DocumentFragment are moved into the child list of the specified parent node.
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
	updateSmiley("lose")
	stopTimer()
}

function checkGameOver() {
	var shownOrFlaggedCells = 0
	var totalCells = gLevel.SIZE * gLevel.SIZE

	for (var i = 0; i < gLevel.SIZE; i++) {
		for (var j = 0; j < gLevel.SIZE; j++) {
			var cell = gBoard[i][j]

			if (cell.isShown || cell.isMarked) {
				shownOrFlaggedCells++
			}
		}
	}

	if (shownOrFlaggedCells === totalCells && gGame.lives > 0) {
		updateSmiley("win")
		gGame.isOn = false
		stopTimer()
		showVictory()
		return true
	}

	if (gGame.lives === 0) {
		gameOver()
		return true
	}

	return false
}

function updateSmiley(state) {
	const smileyButton = document.querySelector(".smiley-button")
	switch (state) {
		case "win":
			smileyButton.innerHTML =
				'<img src="img/winner.png" alt="Cool Face" width="60">'
			break
		case "lose":
			smileyButton.innerHTML =
				'<img src="img/dead.png" alt="Sad Face" width="60">'
			break
		default:
			smileyButton.innerHTML =
				'<img src="img/smiley.png" alt="Smiley Face" width="60">'
			break
	}
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

function revealNegs(cellI, cellJ, mat) {
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= mat[i].length) continue
			if (i === cellI && j === cellJ) continue

			var negCell = mat[i][j]
			var elNegCell = document.querySelector(`.cell-${i}-${j}`)

			if (!negCell.isShown && !negCell.isMarked) {
				negCell.isShown = true
				gGame.shownCount++

				if (negCell.minesAroundCount === 0) {
					revealNegs(i, j, mat)
				}

				elNegCell.innerText = negCell.minesAroundCount
				elNegCell.classList.remove("hide")
			}
		}
	}
}
