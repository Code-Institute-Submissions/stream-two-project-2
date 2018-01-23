
function displayResults() {
	document.getElementById("dataWrapper").classList.remove("hidden");
}

document.getElementById("yearSelect").onchange = displayResults;
