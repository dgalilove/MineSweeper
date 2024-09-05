"use strict"

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
	var letters = "0123456789ABCDEF"
	var color = "#"
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function randomIdx() {
	return Math.floor(Math.random() * gLevel.SIZE)
}

function startTimer() {
  gGame.seconds = 0
  gGame.timer = setInterval(() => {
    gGame.seconds++
    document.querySelector(".timer").innerText = formatTime(gGame.seconds)
  }, 1000);
}

function stopTimer() {
  clearInterval(gGame.timer)
  gGame.timer = null
}

function resetTimer() {
  stopTimer();
  gGame.seconds = 0
  document.querySelector(".timer").innerText = formatTime(gGame.seconds)
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function showVictory() {
	const elVictory = document.querySelector(".game-won-message")
	elVictory.classList.add("show")
}

function hideVictory() {
	const elVictory = document.querySelector(".game-won-message")
	elVictory.classList.remove("show")
}