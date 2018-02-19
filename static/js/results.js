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
	var allRounds = ndx.dimension(function (d) {
		return d["round"];
	});
	var allOutcomes = ndx.dimension(function (d) {
		return d["player_1_result"];
	});
	var allWinners = ndx.dimension(function (d) {
		return d["winner"];
	});
	var allLosers = ndx.dimension(function (d) {
		return d["loser"];
	});
	var allYears = ndx.dimension(function (d) {
		return d["year"];
	});
	var allGaps = ndx.dimension(function (d) {
		return d["margin"];
	});

	// Filtering the data to avoid duplication.
	var duplicateFilter = allOutcomes.filter("W");

	// Setting color scales for pie charts.
	var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

	// Grouping the data - counting the number of records.
	var yearGroup = allYears.group();
	var tournamentGaps = allGaps.group();
	var allMatches = ndx.groupAll();

	// Grouping the data - sum totals from records.
	var allFrames = ndx.groupAll().reduceSum(
		function (d) {
			return (d["frames_played"]);
		}
	);

	// Variables to define the charts on the page.
	var yearSelection = dc.selectMenu("#contentSelection");
	var yearMatches = dc.numberDisplay("#matchesPlayed", "group");
	var yearFrames = dc.numberDisplay("#framesPlayed", "group");
	var yearResults = dc.dataTable("#tournamentResults", "group");
	var tournamentMargin = dc.pieChart("#tournamentMargin", "group");

	yearSelection
		.dimension(allYears)
		.group(yearGroup)
		.promptText("Tournaments")
		.render()
		.on("renderlet", function() {
			document.getElementById("chosenValue").innerHTML = $("#contentSelection select").val();
	});

	yearMatches
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(allMatches);

	yearFrames
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(allFrames);

	tournamentMargin
		.height(200)
		.width(200)
		.radius(100)
		.innerRadius(20)
		.dimension(allGaps)
		.group(tournamentGaps)
		.colors(shadeSlices);

	yearResults
		.dimension(allRounds)
		.group(function (d) {
			return d.round;
		})
		.sortBy(function (d) {
			return d.match_number;
		})
		.size(Infinity)
		.columns([
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

}