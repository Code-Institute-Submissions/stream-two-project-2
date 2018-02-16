// Function to allow the user to toggle the navigation menu on and off in the default stylesheet.
function menuToggle() {
	document.getElementById("mainMenu").classList.toggle("activate");
}

//Functions to generate flag icons in DC.js datatables.
function createFlag(nationality) {
	return "<img class='flagIcon' src='static/img/" + nationality.toLowerCase() + ".png' alt=" + nationality + " />";
}