import { Preferences } from '@capacitor/preferences';

function hideAllSections(){
   Array.from(document.querySelectorAll(".game")).concat([document.getElementById("main"), document.getElementById("profile")])
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

async function getPreference(key){
    const { value } = await Preferences.get({ key });
    return value === null ? null : JSON.parse(value);
}

async function setPreferences(key, obj) {
    await Preferences.set({key, value: JSON.stringify(obj)});
}

function initApp(){
    setupButtons();

    getPreference("config").then(config =>{
        hideAllSections();
        if(config === null){
            showSections("profile");
        } else {
            showSections("main");
        }
    })
}

document.getElementById("savePreferences").addEventListener("click", e => {
    e.preventDefault();
    const config = {
        name : document.getElementById("name").value, 
        nickname : document.getElementById("nickname").value
    };
    if(config.name.length === 0 || config.nickname.length === 0){
        alert("You must complete the fields")
    }else{
        setPreferences("config", config).then(()=> {
            hideAllSections();
            showSections("main");
        })
    }
})

document.addEventListener("DOMContentLoaded", initApp);
