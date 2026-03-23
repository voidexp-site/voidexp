function addToLog(message) {
    const logArea = document.getElementById("logArea");
    const p = document.createElement("p");
    p.textContent = message;
    logArea.appendChild(p);
    logArea.scrollTop = logArea.scrollHeight;
}

function sendText() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    // Ottieni risposta dal file risposte.js
    const message = getRisposta(text);

    addToLog(message);
    input.value = "";
}

// Messaggio iniziale appena la pagina è pronta
window.addEventListener("DOMContentLoaded", () => {
    addToLog("***ADM_--Aj--onsole. erminal 3.-***");
    addToLog("ERR.");
});