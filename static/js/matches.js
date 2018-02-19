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
	var margin = ndx.dimension(function (d) {
		return d["margin"];
	});

	// Filtering the data to avoid duplicates
	var duplicateMatch = matchResults.filter("W");

	// Grouping the data - count
	var countByYear = resultYear.group();
	var countByRound = resultRound.group();
	var mostWins = matchWinner.group();
	var mostDefeats = matchLoser.group();
	var frequentScorelines = scoreline.group();
	var frequentMargins = margin.group();

	// Setting color scales for pie charts
	var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

	// Charts
	var matchYear = dc.selectMenu("#matchYear");
	var matchRound = dc.selectMenu("#matchRound");
	var matchesWon = dc.rowChart("#matchesWon");
	var matchesLost = dc.rowChart("#matchesLost");
	var commonMargins = dc.pieChart("#commonMargins");
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

	commonMargins
		.height(250)
		.width(250)
		.radius(125)
		.innerRadius(20)
		.dimension(margin)
		.group(frequentMargins)
		.colors(shadeSlices);

	dc.renderAll();

}