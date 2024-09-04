"use strict"

const MINE = "*"
const FLAG = "🚩"
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

//      Creating Board And Rendering it       //

function createBoard() {
	const board = []

	for (var i = 0; i < gLevel.SIZE; i++) {
		board[i] = []
		for (var j = 0; j < gLevel.SIZE; j++) {
			board[i][j] = {
				// creating each cell in the board with an object
				minesAroundCount: 0,
				isShown: false,
				isMine: false,
				isMarked: false,
			}
		}
	}

	randomMineLocation(board) // see mine functions
	renderMinesNegsCount(board) // see mine functions
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

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

//  Click Functions     //

function onCellClicked(elCell, i, j) {
	var cell = gBoard[i][j]

	if (cell.isShown || cell.isMarked) return

	cell.isShown = true
	gGame.shownCount++

	if (cell.isMine) {
		elCell.innerText = MINE
		gameOver()
	} else {
		elCell.innerText = cell.minesAroundCount
		elCell.classList.remove("hide")

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
}

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

//       Mines Functions        //

function randomMineLocation(board) {
	var minesPlaced = 0
	while (minesPlaced < gLevel.MINES) {
		const idxI = randomIdx()
		const idxJ = randomIdx()

		if (!board[idxI][idxJ].isMine) {
			board[idxI][idxJ].isMine = true
			minesPlaced++
		}
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

//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶//̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶/̶

//        other functions         //

function revealNeighbors(cellI, cellJ, mat) {
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= mat[i].length) continue
			if (i === cellI && j === cellJ) continue

			var neighborCell = gBoard[i][j]
			var neighborElCell = document.querySelector(`.cell-${i}-${j}`)

			if (!neighborCell.isShown && !neighborCell.isMarked) {
				onCellClicked(neighborElCell, i, j)
			}
		}
	}
}
function randomIdx() {
	return getRandomIntInclusive(0, gLevel.SIZE - 1)
}
function checkGameOver() {
		if(gGame.markedCount === gLevel.MINES){
			if(gGame.shownCount === ((gLevel.SIZE ** 2 - gLevel.MINES))){
				alert('you win')
				gGame.isOn = false
			}
		}
	}


function gameOver() {
	alert("Game over!")
}
