const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerSequence = [];
let level = 0;

const startButton = document.getElementById("start-button");
const gameBoard = document.getElementById("game-board");
const colorElements = colors.map(color => document.getElementById(color));
const modal = document.getElementById("game-over-modal");
const closeModalButton = document.getElementById("close-modal");
const finalLevelText = document.querySelector(".final-level");
const btnGoBack = document.getElementById("btn-g3-back");


function startGame() {
  sequence = [];
  playerSequence = [];
  level = 0;
  startButton.disabled = true;
  btnGoBack.disabled = false;
  closeModal();
  nextRound();
}

function nextRound() {
  level++;
  btnGoBack.disabled = true;
  document.querySelectorAll(".final-level").forEach(el => el.textContent = level); // escribe el nivel
  playerSequence = [];
  const nextColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(nextColor);
  displaySequence();
}

function displaySequence() {
  let delay = 500;
  sequence.forEach((color, index) => {
    setTimeout(() => activateColor(color), delay * (index + 1));
  });
  
  setTimeout(() => enablePlayerInput(), delay * sequence.length + 500);
}

function playSound(color) {
  const audio = new Audio(`./assets/sounds/${color}.mp3`);
  audio.play();
}

function activateColor(color) {
  const element = document.getElementById(color);
  element.classList.add("active");
  playSound(color); // sonido
  setTimeout(() => element.classList.remove("active"), 300);
}

function enablePlayerInput() {
  gameBoard.addEventListener("click", handlePlayerInput);
}

function disablePlayerInput() {
  gameBoard.removeEventListener("click", handlePlayerInput);
}

function handlePlayerInput(event) {
  const { id } = event.target;
  if (!colors.includes(id)) return;
  
  playerSequence.push(id);
  activateColor(id); //reproduce el sonido
  
  const currentStep = playerSequence.length - 1;
  if (playerSequence[currentStep] !== sequence[currentStep]) {
    gameOver();
    return;
  }
  
  if (playerSequence.length === sequence.length) {
    disablePlayerInput();
    setTimeout(nextRound, 1000);
  }
}

function gameOver() {
  finalLevelText.textContent = level;
  modal.style.display = "flex";
  startButton.disabled = false;
  disablePlayerInput();
}


function closeModal() {
  document.querySelectorAll(".final-level").forEach(el => el.textContent = 0)
  btnGoBack.disabled = false;
  modal.style.display = "none";
  
}

// Comienza el juego
startButton.addEventListener("click", startGame);
closeModalButton.addEventListener("click", closeModal);


