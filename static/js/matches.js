queue()
	.defer(d3.json, "/match_data")
	.await(makeGraphs);
 
function makeGraphs(error, crucible_results) {
	if (error) {
		console.error("Error on receiving dataset:", error.statusText);
		throw error;
	}

	// Ensuring columns are in number format.
	crucible_results.forEach(function (d) {
		d["year"] = +d["year"];
		d["winner_score"] = +d["winner_score"];
		d["loser_score"] = +d["loser_score"];
	});

	// Creating the Crossfilter instance.
	var ndx = crossfilter(crucible_results);

	// Defining dimensions for the charts.
	var resultYear = ndx.dimension(function (d) {
		return d["year"];
	});
	var resultRound = ndx.dimension(function (d) {
		return d["round"];
	});
	var matchResults = ndx.dimension(function (d) {
		return d["player_1_result"];
	});
	var matchWinner = ndx.dimension(function (d) {
		return d["winner"];
	});
	var matchLoser = ndx.dimension(function (d) {
		return d["loser"];
	});
	var scoreline = ndx.dimension(function (d) {
		return d["scoreline"];
	});
	var margin = ndx.dimension(function (d) {
		return d["margin"];
	});

	// Filtering the data to avoid duplication.
	var duplicateMatch = matchResults.filter("W");

	// Grouping the data - counting the number of records.
	var countByYear = resultYear.group();
	var countByRound = resultRound.group();
	var mostWins = matchWinner.group();
	var mostDefeats = matchLoser.group();
	var frequentScorelines = scoreline.group();
	var frequentMargins = margin.group();

	// Setting color scales for pie charts
	var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

	// Variables to define the charts on the page.
	var matchYear = dc.selectMenu("#matchYear", "onLoad");
	var matchRound = dc.selectMenu("#matchRound", "onLoad");
	var matchesWon = dc.rowChart("#matchesWon", "onLoad");
	var matchesLost = dc.rowChart("#matchesLost", "onLoad");
	var commonMargins = dc.pieChart("#commonMargins", "onLoad");
    var commonScores = dc.rowChart("#commonScores", "onLoad");
	var chosenResults = dc.dataTable("#chosenResults");

	// Filter the data by the year the matches took place.
	matchYear
		.dimension(resultYear)
		.group(countByYear);

	// Filter the data by the round in which the match was played.
	matchRound
		.dimension(resultRound)
		.group(countByRound);

	// Row chart showing the ten players with the most match wins.
	matchesWon
		.ordinalColors(["#996600"])
		.dimension(matchWinner)
		.group(mostWins)
		.width(250)
		.height(250)
		.rowsCap(10)
		.othersGrouper(false)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(5);

	// Row chart showing the ten players with the most match losses.
	matchesLost
		.ordinalColors(["#996600"])
		.dimension(matchLoser)
 		.group(mostDefeats)
		.width(250)
		.height(250)
		.rowsCap(10)
		.othersGrouper(false)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(5);

	// Pie chart showing the most frequent of different margins of victory.
	commonMargins
		.height(250)
		.width(250)
		.radius(125)
		.innerRadius(20)
		.dimension(margin)
		.group(frequentMargins)
		.colors(shadeSlices);

	// Row chart showing the most frequent scorelines.
    commonScores
    	.ordinalColors(["#996600"])
    	.dimension(scoreline)
    	.group(frequentScorelines)
    	.width(250)
    	.height(250)
    	.rowsCap(10)
    	.othersGrouper(false)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true)
		.xAxis().ticks(5);

	// Data table showing the results which match the filters, rendered and displayed only on request.
	chosenResults
		.dimension(matchWinner)
		.group(function (d) {
			return d.year;
		})
		.sortBy(function (d) {
			return d.match_number;
		})
		.size(Infinity)
		.columns([
			function (d) {
				return d.round_code;
			},
			function (d) {
				return d.winner;
			},
			function (d) {
				return createFlag(d.winner_nat);
			},
			function (d) {
				return d.winner_score;
			},
			function (d) {
				return "-";
			},
			function (d) {
				return d.loser_score;
			},
			function (d) {
				return createFlag(d.loser_nat);
			},
			function (d) {
				return d.loser;
			}
		]);

	dc.renderAll("onLoad");

}

// Function to render data table and remove CSS class that hides results when the user clicks the 'Show Results' button.
function displayResults() {
	dc.renderAll();
	document.getElementById("resultsWrapper").classList.remove("hidden");
}

// Function to hide the data table when the 'Hide Results' button is clicked.
function hideResults() {
	document.getElementById("resultsWrapper").classList.add("hidden");
}

// Run the functions when the user clicks the relevant button.
document.getElementById("showFiltered").onclick = displayResults;
document.getElementById("hideFiltered").onclick = hideResults;