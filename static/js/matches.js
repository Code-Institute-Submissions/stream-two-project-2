queue()
	.defer(d3.json, "/match_data")
	.await(makeGraphs);
 
function makeGraphs(error, crucible_results) {
	if (error) {
		console.error("Error on receiving dataset:", error.statusText);
		throw error;
	}

	crucible_results.forEach(function (d) {
		d["year"] = +d["year"];
		d["winner_score"] = +d["winner_score"];
		d["loser_score"] = +d["loser_score"];
	});

	//Crossfilter instances
	var ndx = crossfilter(crucible_results);

	// Defining dimensions
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

	// Filtering the data to avoid duplicates
	var duplicateMatch = matchResults.filter("W");

	// Grouping the data - count
	var countByYear = resultYear.group();
	var countByRound = resultRound.group();
	var mostWins = matchWinner.group();
	var mostDefeats = matchLoser.group();
	var frequentScorelines = scoreline.group();

	// Charts
	var matchYear = dc.selectMenu("#matchYear");
	var matchRound = dc.selectMenu("#matchRound");
	var matchesWon = dc.rowChart("#matchesWon");
	var matchesLost = dc.rowChart("#matchesLost");
	var commonScores = dc.rowChart("#commonScores");

	matchYear
		.dimension(resultYear)
		.group(countByYear);

	matchRound
		.dimension(resultRound)
		.group(countByRound);
      
	matchesWon
		.ordinalColors(["#996600"])
		.dimension(matchWinner)
		.group(mostWins)
		.width(250)
		.height(300)
		.rowsCap(10)
		.othersGrouper(false)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(5);

	matchesLost
		.ordinalColors(["#996600"])
		.dimension(matchLoser)
 		.group(mostDefeats)
		.width(250)
		.height(300)
		.rowsCap(10)
		.othersGrouper(false)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(5);

	commonScores
		.ordinalColors(["#996600"])
		.dimension(scoreline)
		.group(frequentScorelines)
		.width(250)
		.height(300)
		.rowsCap(10)
		.othersGrouper(false)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(5);

	dc.renderAll();

}