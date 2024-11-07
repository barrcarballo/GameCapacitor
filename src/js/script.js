function hideAllSections(){
   Array.from(document.querySelectorAll(".game")).concat([document.getElementById("main")])
    .forEach (element => element.classList.add("nodisp"))
}
function showSections(sectionId){
    document.getElementById(sectionId).classList.remove("nodisp");
}
function setupButtons(){
    document.querySelectorAll(".game")
    .forEach (gameElement => {
        const id = gameElement.getAttribute("id")
        document.getElementById(`btn-${id}`).addEventListener("click", () => {
            hideAllSections();
            showSections(id);
        });
        document.getElementById(`btn-${id}-back`).addEventListener("click", () => {
            hideAllSections();
            showSections("main");
        });
    });
}

function initApp(){
    setupButtons();

}

document.addEventListener("DOMContentLoaded", initApp);
