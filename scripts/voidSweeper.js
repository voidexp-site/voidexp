let flagMode = false;
const flagToggle = document.getElementById("flagToggle");

let grid = [];
let timer = 0;
let timerInterval = null;
let revealedCount = 0;
let firstClick = true;

let size = 9;          
let totalMines = 10;  


const gridEl = document.getElementById("grid");
const mineCountEl = document.getElementById("mineCount");
const timerEl = document.getElementById("timer");

document.addEventListener("contextmenu", e => e.preventDefault());

function initGame() {
    firstClick = true;
    grid = [];
    revealedCount = 0;
    timer = 0;
    clearInterval(timerInterval);
    timerEl.textContent = "Time: 0";

    mineCountEl.textContent = "Mines: " + totalMines;

    gridEl.style.gridTemplateColumns = `repeat(${size}, 16px)`;
    gridEl.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
        grid.push({
            mine: false,
            revealed: false,
            flag: false,
            count: 0
        });
    }

    calculateNumbers();
    render();
}

function calculateNumbers() {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].mine) continue;
        grid[i].count = getNeighbors(i).filter(n => grid[n].mine).length;
    }
}

function getNeighbors(i) {
    const x = i % size;
    const y = Math.floor(i / size);
    const n = [];
    for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size)
                n.push(ny * size + nx);
        }
    return n;
}

function reveal(i) {
    const cell = grid[i];
    if (cell.revealed || cell.flag) return;

    if (firstClick) {
        placeMinesSafe(i);
        calculateNumbers();
        startTimer();
        firstClick = false;
    }

    cell.revealed = true;
    cell.question = false; 
    revealedCount++;

    if (cell.mine) {
        cell.exploded = true; 
        gameOver();
        return;
    }

    if (cell.count === 0) {
        getNeighbors(i).forEach(reveal);
    }

    checkWin();
    render();
}




function toggleFlag(i) {
    const cell = grid[i];
    if (cell.revealed) return;

    if (cell.flag) {
        cell.flag = false;

        if (questionMode) {
            cell.question = true;  
        } else {
            cell.question = false;
        }
    } else {
        cell.flag = true;
        cell.question = false;
    }

    mineCountEl.textContent =
        "Mines: " + (totalMines - grid.filter(c => c.flag).length);

    render();
}

function render() {
    gridEl.innerHTML = "";

    grid.forEach((cell, i) => {
        const div = document.createElement("div");
        div.classList.add("cell");

        if (cell.flag && !cell.revealed) {
            div.classList.add("flag");
        } 
        if (cell.wrongFlag) {
            div.classList.add("wrong-flag"); 
        }
        else if (cell.question && !cell.revealed) {
            div.classList.add("question");
        }
        else if (!cell.revealed) {
            div.classList.add("hidden");
        }
        else if (cell.exploded) {
            div.classList.add("exploded");
        }
        else if (cell.mine) {
            div.classList.add("mine");
        }
        else if (cell.count > 0) {
            div.classList.add("n" + cell.count);
        }
        else {
            div.classList.add("revealed");
        }

        div.onclick = () => {
            if (flagMode) toggleFlag(i);
            else if (cell.revealed && cell.count > 0) chord(i);
            else reveal(i);
        };

        div.oncontextmenu = (e) => {
            e.preventDefault();
            toggleFlag(i);
        };

        gridEl.appendChild(div);
    });
}


function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = "Time: " + timer;
    }, 1000);
}

function gameOver() {
    clearInterval(timerInterval);
    face.src = "textures/face_dead.png";

    grid.forEach(cell => {
        cell.revealed = true;

        if (cell.question && cell.mine) {
            cell.mine = true;
        }


        if (cell.flag && !cell.mine) {
            cell.wrongFlag = true;
        }
    });

    render();
}

function checkWin() {
   
    if (revealedCount === size * size - totalMines) {
        clearInterval(timerInterval);
        
        
        grid.forEach(cell => {
            if (!cell.revealed && cell.mine) {
                cell.flag = true;
            }
        });

        render();


        face.src = "textures/face_win.png"; 
        alert("☑ Void Stabilizzato! ⚐");
    }
}

function placeMinesSafe(firstIndex) {
    let forbidden = [firstIndex, ...getNeighbors(firstIndex)];

    let placed = 0;
    while (placed < totalMines) {
        const i = Math.floor(Math.random() * grid.length);
        if (!grid[i].mine && !forbidden.includes(i)) {
            grid[i].mine = true;
            placed++;
        }
    }
}

function chord(i) {
    const cell = grid[i];
    if (!cell.revealed || cell.count === 0) return;

    const neighbors = getNeighbors(i);
    const flags = neighbors.filter(n => grid[n].flag).length;

    if (flags === cell.count) {
        neighbors.forEach(n => {
            if (!grid[n].flag && !grid[n].revealed) {
                reveal(n);
            }
        });
    }
}


const face = document.getElementById("face");

face.onclick = initGame;

document.addEventListener("mousedown", () => {
    face.src = "textures/face_pressed.png";
});

document.addEventListener("mouseup", () => {
    face.src = "textures/face_idle.png";
});

flagToggle.onclick = () => {
    flagMode = !flagMode;
    flagToggle.src = flagMode
        ? "textures/flag_on.png"
        : "textures/flag_off.png";
};

let questionMode = false;
const helpToggle = document.getElementById("helpToggle");

helpToggle.onchange = () => {
    questionMode = helpToggle.checked;
};


const menuContainer = document.getElementById("menu-container");
const menuButton = document.getElementById("menu-button");

menuButton.onclick = () => {
    menuContainer.classList.toggle("active");
};

// chiude il menu cliccando fuori
document.addEventListener("click", e => {
    if (!menuContainer.contains(e.target)) {
        menuContainer.classList.remove("active");
    }
});

const diffButtons = document.querySelectorAll(".difficulty-btn");

diffButtons.forEach(btn => {
    btn.onclick = () => {
        const diff = btn.dataset.diff;
        switch(diff) {
            case "beginner":
                size = 9;
                totalMines = 10;
                break;
            case "intermediate":
                size = 16;
                totalMines = 40;
                break;
            case "expert":
                size = 24;
                totalMines = 99;
                break;
        }
        initGame();
    }
});

const customSizeInput = document.getElementById("custom-size");
const customMinesInput = document.getElementById("custom-mines");
const applyCustomBtn = document.getElementById("applyCustom");

applyCustomBtn.onclick = () => {
    const customSize = parseInt(customSizeInput.value);
    const customMines = parseInt(customMinesInput.value);

    if (!customSize || !customMines) return;

    size = customSize;
    totalMines = customMines;
    initGame();
};

window.onload = () => {
    initGame();
};

document.addEventListener("DOMContentLoaded", () => {
    const classicToggle = document.getElementById("classicTextures");

    if (!classicToggle) {
        console.error("DEBUG: checkbox #classicTextures non trovata!");
        return;
    }

    classicToggle.addEventListener("change", () => {
        console.log("DEBUG: toggle texture", classicToggle.checked);
        document.body.classList.toggle("classic", classicToggle.checked);
    });
});