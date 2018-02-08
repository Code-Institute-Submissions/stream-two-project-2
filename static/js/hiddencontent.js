
function displayResults() {
	document.getElementById("dataWrapper").classList.remove("hidden");
}

document.getElementById("contentSelection").onchange = displayResults;
