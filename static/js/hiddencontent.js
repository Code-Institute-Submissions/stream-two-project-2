// Function to render charts and remove CSS class that hides chart headings on Results and Player Data pages.
function displayResults() {
	dc.renderAll("group");
	document.getElementById("dataWrapper").classList.remove("hidden");
}

// Run the function when a selection is made from the menu.
document.getElementById("contentSelection").onchange = displayResults;