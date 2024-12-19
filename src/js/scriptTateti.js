const N = 9;
let contador = 0;
let casillas = ["", "", "", "", "", "", "", "", ""];

const combinacionesGanadoras = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const section = document.getElementById("contenedor");
let turno = document.getElementById("turnojugador");
let h2 = document.querySelector("h2");

function onload() {
  initGame();
}

document.addEventListener("DOMContentLoaded", function() { initGame() }); 

function initGame() {
  turno.innerHTML = 'X';
  casillas = ["", "", "", "", "", "", "", "", ""];
  table();
  deshabilitarBoton();
  h2.innerHTML = `TA TE TI`; // Asegúrate de que esta sea la única vez que tocas h2.
}

function deshabilitarBoton() {
  const reiniciar = document.getElementById("reiniciar");
  reiniciar.setAttribute("href", "javascript:tirarMoneda();");
  reiniciar.classList.add("disable");
}

function deshabilitarBotonRegreso() {
  const btnBack = document.getElementById("btn-g1-back");
  btnBack.classList.add("disable");
}

function habilitarBotonRegreso() {
  const btnBack = document.getElementById("btn-g1-back");
  btnBack.classList.remove("disable");
}

function table() {
  section.innerHTML = "";
  for (let i = 0; i < N; i++) {
    const div = document.createElement("div");
    div.addEventListener("click", function () {
      play(i);
      deshabilitarBotonRegreso();
      div.innerHTML = casillas[i];
      div.classList.add("disable");

      if (!winner() && contador == N) {
        h2.innerHTML = "Empate";
        habilitarBoton();
        habilitarBotonRegreso();  // Habilitar el botón de retroceso en empate
      } else if (winner()) {
        h2.innerHTML = `Ganó: <span id=${turnojugador}"> ${casillas[i]}</span>`;
        habilitarBoton();
        habilitarBotonRegreso();  // Habilitar el botón de retroceso en victoria
      }
    });
    section.appendChild(div);
  }
}

function habilitarBoton() {
  const reiniciar = document.getElementById("reiniciar");
  reiniciar.classList.remove("disable");
  reiniciar.classList.add("reiniciar");
  contador = 0;
  
  reiniciar.addEventListener("click", () => {
    initGame();
    button();
  });
}

function button() {
  const btnBack = document.getElementById("btn-g1-back");
  btnBack.classList.remove("disable");
}

function play(celda) {
  if(winner()) {
    return;
  }
  const div = section.children[celda]; // Obtener el div de la casilla
  if (casillas[celda] == "" && turno.innerHTML == "X") {
    casillas[celda] = "X";
    div.style.color = "fuchsia"; // Cambiar el color de "X" a rojo
    turno.innerHTML = "O";
    contador += 1;
  } else if (casillas[celda] == "" && turno.innerHTML == "O") {
    casillas[celda] = "O";
    div.style.color = "blue"; // Cambiar el color de "O" a azul
    turno.innerHTML = "X";
    contador += 1;
  }
}

function winner() {
  for (let i = 0; i < combinacionesGanadoras.length; i++) {
    const combinacion = combinacionesGanadoras[i];
    const celda1 = casillas[combinacion[0]];
    const celda2 = casillas[combinacion[1]];
    const celda3 = casillas[combinacion[2]];
    if (celda1 !== "" && celda1 === celda2 && celda2 === celda3) {
      const cells = section.children;
      cells[combinacion[0]].classList.add("winner");
      cells[combinacion[1]].classList.add("winner");
      cells[combinacion[2]].classList.add("winner");
      Array.from(section.children).forEach(cell => cell.classList.add("disable"));
      return true;
    }
  }
}

document.getElementById("reiniciar").addEventListener("click", () => { initGame() });

