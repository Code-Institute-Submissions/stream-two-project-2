
function displayResults() {
	document.getElementById("tournamentResults").classList.remove("hidden");
	document.getElementById("makeSelection").classList.add("hidden");
	document.getElementById("makeSelection").classList.remove("activate");

}

document.getElementById("yearSelect").onchange = displayResults;
