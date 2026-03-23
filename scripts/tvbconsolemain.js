//console
const menuButton = document.getElementById("console");
const menuContainer = document.getElementById("input-area");


menuButton.onclick = (e) => {
    e.stopPropagation();
    menuContainer.classList.toggle("active");
};


document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target) && e.target !== menuButton) {
        menuContainer.classList.remove("active");
    }
});