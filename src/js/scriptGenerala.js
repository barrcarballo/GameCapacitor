const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");
const btnGoBack = document.getElementById("btn-g2-back");
let gameStarted = false; // Variable para verificar si el juego ha comenzado
let selectedDados;
let dados;


// Dados
const DICE_SIZE = 65;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

// Combinaciones de juegps
const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

const game = {
    dices : [0, 0, 0, 0,0],
    selectedDices: [false, false, false, false, false],
    moves: 1,
    players: 2,
    turn: 1,
    scores: [],
    round: 1
};

function initGame() {
  drawScores.innerHTML = "";
  btnGoBack.disabled = false; // Deshabilita el botón
  game.dices = [0, 0, 0, 0, 0];
  game.selectedDices = [false, false, false, false, false];
  game.moves = 0;
  game.turn = 1;
  for (let i = 0; i < game.players; i++) {
    game.scores.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 0]);
  }

  document
    .querySelectorAll("#contenedorGenerala .dice")
    .forEach((dadoElement) => {
      dadoElement.addEventListener("click", () =>
        toggleDadoSelection(
          parseInt(dadoElement.getAttribute("class").replace("dice d", ""))
        )
      );
    });

    drawDices()
    drawState();
    drawScores();
}

const isGameMatch = (regex) => {
  return game.dices.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
}; // copia el array, se ordena y se convierte string. Se matchea con la jugada, si no da null se cumple la jugada. 

const gameScore = (whichGame) => {
  let score = 0;
  switch (whichGame) {
    case 6:
      if(isGameMatch(reEscalera)){
      score = game.moves === 2 ? 25 : 20;
      }
      break;
  
    case 7:
      if(isGameMatch(reFull)){
        score = game.moves === 2 ? 35 : 30;
        }
      break;
    case 8: 
    if(isGameMatch(rePoker)){
      score = game.moves === 2 ? 45 : 40;
      }
    case 9:
      if(isGameMatch(reGenerala)){
        score = game.moves === 2 ? 55 : 50;
        }
    break;
    case 10:
      if(isGameMatch(reGenerala)){
        score = game.moves === 2 ? 105 : 100;
        }
    break;
    default:
      score = game.dices.filter(dice => dice -1 === whichGame).reduce((acc,cur) => acc + cur,0);
      break;
  }
  return score; 
} 

function toggleDadoSelection(dadoNumber) {
  game.selectedDices[dadoNumber] = !game.selectedDices[dadoNumber];

  const dadoElement = document.querySelector(
    `#contenedorGenerala .dice.d${dadoNumber}`
  );
  if (game.selectedDices[dadoNumber]) {
    dadoElement.classList.add("selected");
  } else {
    dadoElement.classList.remove("selected");
  }

  console.log("Dados selection" + game.selectedDices);
}

function drawDices() {
  game.dices.forEach((dice, i) => {
    const dadoElement = document.querySelector(`#contenedorGenerala .dice.d${i}`);
    if(game.selectedDices[i]){
      dadoElement.classList.add("selected");
    }else{
      dadoElement.classList.remove("selected");
    }
    showDice(dadoElement, dice);
  });
}

const drawState = () => {
  document.getElementById("generala-player").innerHTML = game.turn;
  document.getElementById("generala-jugadas").innerHTML = game.moves;
};

const drawScores = () => {
  const contHeader = document.querySelector("#g2 .scores table thead tr");
  const contGames = document.querySelector("#g2 .scores table tbody");

  contHeader.innerHTML = ""; 

  const cellGame = document.createElement("th");
  cellGame.innerHTML = "Juego";
  contHeader.appendChild(cellGame);

  for(let i = 0; i < game.players; i++){
    const cellPlayerName = document.createElement("th");
    cellPlayerName.innerHTML = `J${i + 1}`; // En la app usar el nick del jugador guardado en perfil
    contHeader.appendChild(cellPlayerName);
  }

  // Limpiar el body de la tabla antes de agregar filas
  contGames.innerHTML = "";

  // Tachar juegos
  for(let i = 0; i < 11; i++){
    const contGame = document.createElement("tr");
    const cellGameName = document.createElement("th");
    cellGameName.innerHTML = getGameName(i);
    contGame.appendChild(cellGameName);

    for (let p = 0; p < game.players; p++) {
      const cellPlayerScore = document.createElement("td");
      cellPlayerScore.innerHTML = game.scores[p][i];}


    for(let p = 0; p < game.players; p++){
      const cellPlayerScore = document.createElement("td");
      cellPlayerScore.innerHTML = game.scores[p][i];
      contGame.appendChild(cellPlayerScore);
    }
    contGames.appendChild(contGame);
    contGame.addEventListener("click", () => {
      if(game.dices.some((dice)=> dice === 0)){
        return;
      }
      if(game.scores[game.turn - 1][i] !== " "){
        showModal(`Ya se anoto el juego ${getGameName(i)}`, () => {
          console.log("Modal cerrado.");
        });
        return;
      } else{
        const score = gameScore(i);
        
        if (
          i === 9 &&
          !isGameMatch(reGenerala) &&
          game.scores[game.turn - 1][10] !== "X"
        ) {
          showModal('Primero tachar la Doble antes de tachar la Generala.');
          return;
        }

        if (
          i === 10 &&
          isGameMatch(reGenerala) &&
          (game.scores[game.turn - 1][9] !== 50 ||
            game.scores[game.turn - 1][9] !== 55)
        ) {
          showModal('No podés anotar la doble sin antes haber hecho generala');
          return;
        }

        if (score === 0) {
          confirmTacharPuntaje(i);
        } else {
          game.scores[game.turn - 1][i] = score;
          game.scores[game.turn - 1][11] += score;
          changePlayerTurn();
        }
        
        drawScores();
      }

    })
  }

  // Total
  const contTotal = document.createElement("tr");
  const cellTotalName = document.createElement("th");
  cellTotalName.innerHTML = "Total";
  contTotal.appendChild(cellTotalName);
  for(let p = 0; p < game.players; p++){
    const cellPlayerTotal = document.createElement("td");
    cellPlayerTotal.innerHTML = game.scores[p][11];
    contTotal.appendChild(cellPlayerTotal);
  }
  contGames.appendChild(contTotal);
};


function tirarDados() {
  
  if (!gameStarted) {
    btnGoBack.disabled = true;
    gameStarted = true; // El juego ha comenzado
  }

  for (let i = 0; i < game.dices.length; i++) {
    if (game.moves === 0 || game.selectedDices[i]) {
      game.dices[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  game.selectedDices = [false, false, false, false, false];
  drawDices();

  game.moves++;
  if (game.moves > 3) {
    btnDados.setAttribute("disabled", "disabled");
  }else{
    drawState();
  }
}


const changePlayerTurn = () => {
  game.dices = [0, 0, 0, 0, 0];
  game.selectedDices = [false, false, false, false, false];
  game.moves = 0;
  game.turn++;
    if (game.turn > game.players) {
      game.turn = 1;
      game.round++;
      if(game.round == 12){
        gameOver();
      }
    }
    btnDados.removeAttribute("disabled");
    drawDices();
    drawState();
    highlightCurrentPlayer()
}


const gameOver = () => {
  btnDados.setAttribute("disabled", "disabled");
  let winner = 0;
  let winningScore = 0;
  for (let i = 0; i < game.players; i++){
    if(game.scores[i][11] > winningScore){
      winningScore = game.scores[i][11];
      winner = i;
      btnGoBack.disabled = false; 
    }
  }
  showGameOverModal(`J${winner} won with ${winningScore} points`);
}

const getGameName = (whichGame) => {
  const games = ["1", "2", "3", "4", "5", "6", "E", "F", "P", "G", "D"];
  return games[whichGame];
};

/* dados dibujados - comienzo */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

const showDice = (contDiv, number) => {
  contDiv.innerHTML = null;
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", "" + DICE_SIZE);
  canvas.setAttribute("height", "" + DICE_SIZE);
  drawDice(canvas, number);
  contDiv.appendChild(canvas);
  };
  

const drawDice = (cont, number) => {
  let ctx = cont.getContext("2d");

  // Borro
  ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

  // Dado
  ctx.beginPath();
  ctx.rect(0, 0, DICE_SIZE, DICE_SIZE);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();

  switch (number) {
      case 1:
          drawDot(ctx, AT_HALF, AT_HALF);
          break;
      case 2:
          drawDot(ctx, AT_3QUARTER, AT_QUARTER);
          drawDot(ctx, AT_QUARTER, AT_3QUARTER);
          break;
      case 3:
          drawDot(ctx, AT_HALF, AT_HALF);
          drawDot(ctx, AT_3QUARTER, AT_QUARTER);
          drawDot(ctx, AT_QUARTER, AT_3QUARTER);
          break;
      case 4:
          drawDot(ctx, AT_3QUARTER, AT_QUARTER);
          drawDot(ctx, AT_QUARTER, AT_3QUARTER);
          drawDot(ctx, AT_QUARTER, AT_QUARTER);
          drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
          break;
      case 5:
          drawDot(ctx, AT_HALF, AT_HALF);
          drawDot(ctx, AT_3QUARTER, AT_QUARTER);
          drawDot(ctx, AT_QUARTER, AT_3QUARTER);
          drawDot(ctx, AT_QUARTER, AT_QUARTER);
          drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
          break;
      case 6:
          drawDot(ctx, AT_3QUARTER, AT_QUARTER);
          drawDot(ctx, AT_QUARTER, AT_3QUARTER);
          drawDot(ctx, AT_QUARTER, AT_QUARTER);
          drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
          drawDot(ctx, AT_QUARTER, AT_HALF);
          drawDot(ctx, AT_3QUARTER, AT_HALF);
  }
} 
// dados dibujados - fin

// Dados con imgs
const drawDiceImages = (contDiv, number) => {
      contDiv.innerHTML = null;
      let img = document.createElement("img");
      img.setAttribute("width", "" + DICE_SIZE);
      img.setAttribute("height", "" + DICE_SIZE);
      img.setAttribute("alt", `dice-${number}`);
      img.setAttribute(
        "src",
        document.getElementById(`d${number}`).getAttribute("src")
      );
      contDiv.appendChild(img);
    };

  // Modal Alerts generales
function showModal(message, callback) {
  const modal = document.getElementById("customModal");
  const modalMessage = document.getElementById("modalMessage");
  const okButton = document.getElementById("modalOkBtn");

  modalMessage.innerText = message;

  modal.style.display = "flex";

  const handleOkClick = () => {
    modal.style.display = "none"; 
    if (callback) callback(); 
    okButton.removeEventListener("click", handleOkClick);
  };

  okButton.addEventListener("click", handleOkClick);
}

// Modal Game over
const showGameOverModal = (winner) => {
  const modal = document.getElementById("gameOverModal");
  const message = document.getElementById("gameOverMessage");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const goToHomeBtn = document.getElementById("goToHomeBtn");

  // Actualiza el mensaje con el ganador
  message.textContent = winner;

  // Muestra el modal
  modal.style.display = "flex";

  // Botón de volver a jugar
  playAgainBtn.onclick = () => {
    modal.style.display = "none";
    initGame();
  };

  // Botón de volver al inicio
  goToHomeBtn.onclick = () => {
    modal.style.display = "none";
    window.location.href = "index.html";
  };
};

function highlightCurrentPlayer() {
  // Remove highlight from all player score headers
  const scoreHeaders = document.querySelectorAll("#g2 .scores table thead tr th");
  scoreHeaders.forEach(header => {
    header.classList.remove("playerTurn");
  });

  // Add highlight to the current player's score header
  const currentPlayerHeader = document.querySelector(`#g2 .scores table thead tr th:nth-of-type(${game.turn + 1})`);
  if (currentPlayerHeader) {
    currentPlayerHeader.classList.add("playerTurn");
  }
}


// Modal para confirmar si quiere tachar la jugada
const confirmTacharPuntaje = (i) => {
  const modal = document.getElementById("modalConfirmacion");
  const message = document.getElementById("mensajeModal");
  const confirmarBtn = document.getElementById("confirmarTachar");
  const cancelarBtn = document.getElementById("cancelarTachar");

  // Actualizar el mensaje del modal
 message.textContent = `¿Estás seguro de que deseas tachar el puntaje?`;

  // Mostrar el modal
  modal.style.display = "flex";

  // Acción al confirmar
  const confirmar = () => {
    game.scores[game.turn - 1][i] = "X";
    drawScores();
    changePlayerTurn();
    cerrarModal();
  };

  // Cerrar modal (al cancelar o confirmar)
  const cerrarModal = () => {
    modal.style.display = "none";
    confirmarBtn.removeEventListener("click", confirmar);
    cancelarBtn.removeEventListener("click", cerrarModal);
  };

  // Agregar eventos a los botones
  confirmarBtn.addEventListener("click", confirmar);
  cancelarBtn.addEventListener("click", cerrarModal);
};

btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
