const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");
let selectedDados;
let dados;

const game = {
    dices : [0, 0, 0, 0,0],
    selectedDados: [false, false, false, false, false],
    moves: 1,
    players: 1,
    turn: 1

};

const DICE_SIZE = 100;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

function initGame() {
  dados = [0, 0, 0, 0, 0];
  selectedDados = [false, false, false, false, false];
 

  document
    .querySelectorAll("#contenedorGenerala .dice")
    .forEach((dadoElement) => {
      dadoElement.addEventListener("click", () =>
        toggleDadoSelection(
          parseInt(dadoElement.getAttribute("class").replace("dice d", ""))
        )
      );
    });

    drawDados();
}

const isGameMatch = (regex) => {
  return game.dices.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
};

function toggleDadoSelection(dadoNumber) {
  selectedDados[dadoNumber] = !selectedDados[dadoNumber];

  const dadoElement = document.querySelector(
    `#contenedorGenerala .dice.d${dadoNumber}`
  );
  if (selectedDados[dadoNumber]) {
    dadoElement.classList.add("selected");
  } else {
    dadoElement.classList.remove("selected");
  }

  console.log("Dados selection" + selectedDados);
}

function drawDados() {
  dados.forEach((dado, i) => {
    const dadoElement = document.querySelector(`#contenedorGenerala .dice.d${i}`);
    if(selectedDados[i]){
      dadoElement.classList.add("selected");
    }else{
      dadoElement.classList.remove("selected");
    }
    showDice(dadoElement, dado);
  });
}

const drawState = () => {
  document.getElementById("generala-player").innerHTML = game.turn;
  document.getElementById("generala-jugadas").innerHTML = game.moves;
};

function tirarDados() {
  for (let i = 0; i < game.dices.length; i++) {
    if (game.moves === 1 || game.selectedDados[i]) {
      game.dices[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  game.selectedDados = [false, false, false, false, false];
  drawDados();

  game.moves++;
  if (game.moves > 3) {
    const rollButton = document.getElementById('dice-roll').setAttribute("disabled","disabled")
    game.turn++;
    if (game.turn > game.players) {
      game.turn = 1;
    }
    game.moves = 1;
  }
  drawState();
}

/* Draw dices code begins */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

const showDice = (contDiv, number) => {
    contDiv.innerHTML = '';
    let img = document.createElement("img"); 
    img.setAttribute("src", `./assets/imgs/dice${number}.svg`); 
    img.setAttribute("alt", `dice${number}`); 
    img.setAttribute("width", DICE_SIZE); 
    img.setAttribute("height", DICE_SIZE);
    contDiv.appendChild(img);
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
/* Draw dices code ends */


const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker =
  /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull =
  /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;


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


    const gameScore = (whichGame) => {
      let score = 0;
      switch (whichGame) {
        case 1:
        case 2:
        case 3:
        case 4: 
        case 5:
        case 6: 
        case 7:
          if(isGameMatch(reEscalera)){
          score = game.moves === 2 ? 25 : 20;
          }
          break;
      
        case 8:
          if(isGameMatch(reFull)){
            score = game.moves === 2 ? 35 : 30;
            }
          break;
        case 9: 
        if(isGameMatch(rePoker)){
          score = game.moves === 2 ? 45 : 40;
          }
        case 10:
          if(isGameMatch(reGenerala)){
            score = game.moves === 2 ? 55 : 50;
            }
        break;
        case 11:
          if(isGameMatch(reGenerala)){
            score = game.moves === 2 ? 105 : 100;
            }
        break;
        default:
          score = game.dados.filter(dado => dado -1 === whichGame).reduce((acc,cur) => acc + cur,0);
      }
      return score; 
    } 

    const drawScores = () => {
      const contHeader = document.querySelector("#g2 .scores table thead tr");
      const contGames = document.querySelector("#g2 .scores table tbody");
    
      contHeader.innerHTML = ""; 
    
      const cellGame = document.createElement("th");
      cellGame.innerHTML = "Juego";
      contHeader.appendChild(cellGame);
    
      for(let i = 0; i < game.players; i++){
        const cellPlayerName = document.createElement("th");
        cellPlayerName.innerHTML = 'J${i + 1}'; // En la app usar el nick del jugador guardado en perfil
        contHeader.appendChild(cellPlayerName);
      }
    
      // Limpiar el cuerpo de la tabla antes de agregar filas
      contGames.innerHTML = "";
    
      // Juegos
      for(let i = 0; i < 11; i++){
        const contGame = document.createElement("tr");
        const cellGameName = document.createElement("th");
        cellGameName.innerHTML = getGameName(i);
        contGame.appendChild(cellGameName);
    
        for(let p = 0; p < game.players; p++){
          const cellPlayerScore = document.createElement("td");
          cellPlayerScore.innerHTML = game.scores[p][i];
          contGame.appendChild(cellPlayerScore);
        }
        contGames.appendChild(contGame);
        contGame.addEventListener("click", () => {
          if(game.dados.some((dado)=> dado === 0)){
            return;
          }
          if(game.scores[game.turno - 1][i] !== " "){
            alert(`Ya se anoto el juego ${getGameName(i)}`);
            return;
          }else{
            const score = gameScore(i);
            game.scores[game.turn - 1][i] = score === 0 ? "X" : score;
            game.scores[game.turn - 1][11] += score;
            drawScores();
            changePlayerTurn();
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

btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
