// Oggetto con tutte le risposte dei comandi
const Risposte = {
    "system.event.void:moonfall": "ERR. Moon",
    "u+2726": "ERR. Is that you? [][][][][][]",
    "database.u+2447.getdata:lv2_void": "ERR. This file is not avaiable from your client",
    "database.u+2447.moon":"ERR. <⑇> Mark101 had very big troubles with the moon... So do i, and this is why: https://www.mediafire.com/file/nt6jpfzm8tjgigb/a_sight_to_behold.png/file"
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