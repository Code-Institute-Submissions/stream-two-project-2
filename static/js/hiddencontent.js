
function displayResults() {
	document.getElementById("resultsTable").classList.remove("hidden");
}

document.getElementById("yearSelect").onchange = displayResults;
