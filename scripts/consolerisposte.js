// Oggetto con tutte le risposte dei comandi
const Risposte = {
    "void.status": "[Console]: Void01, Status: 3-nmrl 5-void",
    "locate.unicode+2447": "[Console]: Skybase",
    "default": "[Console]: Error, unvalid command",
    "database.cleanse": "[Console]: You don't have permissions to run this command",
    "database.void.test_end": "[Console]: End? result: negative",
    "log.unicode+2447.log:2": "[Console]: <⑇> If you are ill, i hope you get better",
    "log.unicode+2447.log:3": "[Console]: <⑇> My mother is from marocco, it is a beautiful place"
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