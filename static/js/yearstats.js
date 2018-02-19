queue()
	.defer(d3.json, "/year_data")
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
		d["frames_played"] = +d["frames_played"];
		d["loser_score"] = +d["loser_score"];
	});

	// Creating the Crossfilter instance.
	var ndx = crossfilter(crucible_results);

	// Defining dimensions for the charts.
	var playerTournament = ndx.dimension(function (d) {
		return d["record_type"];
	});
	var playerCountry = ndx.dimension(function (d) {
		return d["country"];
	});
	var playerResult = ndx.dimension(function (d) {
		return d["result"];
	});
	var yearRecords = ndx.dimension(function (d) {
		return d["year"];
	});
	var playerRecords = ndx.dimension(function (d) {
		return d["player"];
	});

	// Formatting numbers for data tables to ensure percentages display to two decimal places.
	var twoDec = d3.format(".2f");

	// Setting color scales for pie charts.
	var blockSlices = d3.scale.ordinal().range(["#000000", "#ff6666", "#0000ff", "#663300", "#006600", "#ffff00", "#ee0000", "#ffffff"]);

	// Grouping the data - counting the number of records.
	var countryAppearances = playerCountry.group();
	var roundResults = playerResult.group();
	var selectTournament = yearRecords.group();
	var selectPlayer = playerRecords.group();

	// Variables to define the charts on the page.
	var tournamentYear = dc.selectMenu("#tournamentYear");
	var tournamentPlayer = dc.selectMenu("#tournamentPlayer");
	var recordsCountry = dc.rowChart("#recordsCountry");
	var tournamentResult = dc.rowChart("#tournamentResult");
	var mostFrames = dc.dataTable("#mostFrames");
	var winningPercentage = dc.dataTable("#winningPercentage");

	tournamentYear
		.dimension(yearRecords)
		.group(selectTournament);

	tournamentPlayer
		.dimension(playerRecords)
		.group(selectPlayer);

	recordsCountry
		.ordinalColors(["#996600"])
		.width(250)
		.height(220)
		.dimension(playerCountry)
		.group(countryAppearances)
		.rowsCap(8)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(6);

	tournamentResult
		.ordinalColors(["#996600"])
		.width(250)
		.height(220)
		.dimension(playerResult)
		.group(roundResults)
		.ordering(function(d) { return -d.value; })
		.elasticX(true)
		.xAxis().ticks(6);

	mostFrames
		.dimension(playerTournament)
		.group(function (d) {
			return d.record_type;
		})
		.size(Infinity)
		.sortBy(function (d) {
			return d.frames_played;
		})
		.order(d3.descending)
		.columns([
			function (d) {
				return createFlag(d.country);
			},
			function (d) {
				return d.player;
			},
			function (d) {
				return d.year;
			},
			function (d) {
				return d.result_code;
			},
			function (d) {
				return d.frames_played;
			},
			function (d) {
            	return d.frames_won;
			},
			function (d) {
				return d.frames_lost;
			},
			function (d) {
				return twoDec(d.frame_win_pct);
			}
		]);

	winningPercentage
		.dimension(playerTournament)
		.group(function (d) {
			return d.record_type;
		})
		.size(Infinity)
		.sortBy(function (d) {
			return d.frame_win_pct;
		})
		.order(d3.descending)
		.columns([
			function (d) {
				return createFlag(d.country);
			},
			function (d) {
				return d.player;
			},
			function (d) {
				return d.year;
			},
			function (d) {
				return d.result_code;
			},
			function (d) {
				return d.frames_played;
			},
			function (d) {
				return d.frames_won;
			},
			function (d) {
				return d.frames_lost;
			},
			function (d) {
				return twoDec(d.frame_win_pct);
			}
		]);

	// Render all the charts on the page.
	dc.renderAll();

}
