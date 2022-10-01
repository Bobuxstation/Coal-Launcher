const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")

document.getElementById('player').src = game;
document.getElementById('body').style.backgroundImage = "url('" + banner + "')";

function refresh() {
    document.getElementById('player').src = game;
}