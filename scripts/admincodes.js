

function controlla() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    console.log("ID ricevuto:", id);
    const risposta = document.getElementById("input").value.trim();
    const risultato = document.getElementById("risultato");
    
    let codici = {}

    if (id === "adminspaceconsole") {
      codici = {
          "2674598713": {
              img: "/images/yes.png",
              link: "adminspace_console.html?id=u2447",
              testo: "[VoidEXP] Admin code identificato come U+2447"
          },
          "1756439802": {
              img: "/images/yes.png",
              link: "adminspace_console.html?id=u2726",
              testo: "[VoidEXP] Admin code identificato come U+2726"
          }
      };
    } else if (id === "tvbconsole") {
      codici = {
          "2674598713": {
              img: "/images/yes.png",
              link: "tvb_terminal.html?id=u2447",
              testo: "[VoidEXP] Admin code identificato come U+2447"
          },
          "1756439802": {
              img: "/images/yes.png",
              link: "tvb_terminal.html?id=u2726",
              testo: "[VoidEXP] Admin code identificato come U+2726"
          }
      };
    } else {
      risultato.innerHTML = `
            <p style="color: red; font-size: 18px;">
                ATTENZIONE: non è stata specificata un output per questa analisi, si prega di controllare il link
            </p>
        `;
       return;
    }

    console.log("Codice inserito:", risposta);

    if (codici[risposta]) {
        const dato = codici[risposta];

        risultato.innerHTML = `
            <p style="margin-top:10px; color: green; font-size:18px;">
                ${dato.testo}
            </p>
            <div id="space"></div>
            <div id="yes"><a href="${dato.link}">
                <img src="${dato.img}" width="128">
            </a></div>
            <div id="space2"></div>
        `;
    } else {
        risultato.innerHTML = `
            <p style="color: red; font-size: 18px;">
                Admin Code errato o non esistente
            </p>
        `;
    }
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let link = {}
if (id === "adminspaceconsole") {
    link = "AdminSPACE Console";
} else if (id === "tvbconsole") {
    link = "The Void Bridge Console";
} else {
    link = "null";
}

let text = "Login per ";
document.getElementById("linking").textContent = text + link;