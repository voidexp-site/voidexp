// Oggetto con tutte le risposte dei comandi
const Risposte = {
    "database.cleanse":"[ADMINSPACE]: Database erased",
    "database.void.masscleanse":"ADMINSPACE ACTIVE",
    "default":"[ADMINSPACE]: Unknown command",
    "data.u+1447.log_4":"<⑇> My fav italian song: https://youtu.be/WN9H0L97nVM?si=70XSI-8kA95wxQNX"
};

/**
 * Funzione per ottenere la risposta a un comando
 * @param {string} inputText - testo scritto dall'utente
 * @returns {string} - risposta corrispondente
 */
function getRisposta(inputText) {
    if (!inputText) return Risposte["default"]; 
    
    const text = inputText.trim().toLowerCase();

    // restituisce la risposta se esiste, altrimenti default
    return Risposte[text] || Risposte["default"];
}