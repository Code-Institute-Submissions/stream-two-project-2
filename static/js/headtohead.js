
function displayH2H() {
	document.getElementById("h2hWrapper").classList.remove("hidden");
}

// document.getElementById("player1Select").onchange = displayH2H;
(document.getElementById("player1Select").onchange && document.getElementById("player2Select").onchange) = displayH2H;