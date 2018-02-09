
function displayResults() {
    dc.renderAll("group");
	document.getElementById("dataWrapper").classList.remove("hidden");
}

document.getElementById("contentSelection").onchange = displayResults;
