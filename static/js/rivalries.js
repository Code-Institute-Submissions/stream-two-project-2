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
	var dupl = crossfilter(crucible_results);

	// Defining dimensions
	var h2hMatches = ndx.dimension(function (d) {
		return d["match_number"];
	});
	var player1List = ndx.dimension(function (d) {
		return d["player_1"];
	});
	var player1List = ndx.dimension(function (d) {
		return d["player_1"];
	});
	var player2List = ndx.dimension(function (d) {
		return d["player_2"];
	});
	var winningPlayer1 = ndx.dimension(function (d) {
		return d["player_1_win"];
	});
	var winningPlayer2 = ndx.dimension(function (d) {
		return d["player_2_win"];
	});
	var scorePlayer1 = ndx.dimension(function (d) {
		return d["player_1_score"];
	});
	var scorePlayer2 = ndx.dimension(function (d) {
		return d["player_2_score"];
	});
	var match_up_result = dupl.dimension(function (d) {
		return d["player_1_result"];
	});
	var allMatchups = dupl.dimension(function (d) {
		return d["match_up"];
	});
	var matchRound = dupl.dimension(function (d) {
		return d["round"];
	});

	// Filtering the data to avoid duplicates
	var duplicateMatchFilter = match_up_result.filter("W");

	// Setting color scales for pie charts
	var h2hSlices = d3.scale.ordinal().range(["#ee0000", "#000000"]);

	// Grouping the data - count
	var selectedPlayer1 = player1List.group();
	var selectedPlayer2 = player2List.group();
	var frequentMatchups = allMatchups.group();
	var frequentRound = matchRound.group();

	// Grouping the data - sum
	var player1MatchesWon = ndx.groupAll().reduceSum(
		function (d) {
			return d["player_1_win"];
		}
	);
	var player2MatchesWon = ndx.groupAll().reduceSum(
		function (d) {
			return d["player_2_win"];
		}
	);
	var player1FramesWon = ndx.groupAll().reduceSum(
		function (d) {
			return d["player_1_score"];
		}
	);
	var player2FramesWon = ndx.groupAll().reduceSum(
		function (d) {
			return d["player_2_score"];
		}
	);
	var totalFrames = dupl.groupAll().reduceSum(
		function (d) {
			return d["frames_played"];
		}
	);

	// Charts
	var player1Select = dc.selectMenu("#player1Select");
	var player2Select = dc.selectMenu("#player2Select");
	var player1Wins = dc.numberDisplay("#player1Wins");
	var player2Wins = dc.numberDisplay("#player2Wins");
	var player1Frames = dc.numberDisplay("#player1Frames");
	var player2Frames = dc.numberDisplay("#player2Frames");
	var h2hPlayerResults = dc.dataTable("#h2hPlayerResults");
	var matchUpRound = dc.selectMenu("#matchUpRound");
	var mostFrequent = dc.rowChart("#mostFrequent");

	player1Select
		.dimension(player1List)
		.group(selectedPlayer1)
		.promptText('Select:');

	player2Select
		.dimension(player2List)
		.group(selectedPlayer2)
		.promptText('Select:');

	player1Wins
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(player1MatchesWon);

	player2Wins
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(player2MatchesWon);

	player1Frames
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(player1FramesWon);

	player2Frames
		.formatNumber(d3.format("d"))
		.valueAccessor(function (d) {
			return d;
		})
		.group(player2FramesWon);

	matchUpRound
		.dimension(matchRound)
		.group(frequentRound)
		.promptText('Select a Round:');

	mostFrequent
		.ordinalColors(["#996600"])
		.dimension(allMatchups)
		.group(frequentMatchups)
		.othersGrouper(false)
		.width(250)
		.height(500)
		.rowsCap(20)
		.ordering(function(d) { return -d.value; })
		.elasticX(true);

	h2hPlayerResults
		.dimension(h2hMatches)
		.group(function (d) {
			return d.year;
		})
		.sortBy(function (d) {
			return d.match_number;
		})
		.size(Infinity)
		.columns([
			function (d) {
				return d.year;
			},
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

	dc.renderAll();
}

// Display the head-to-head details only when both players have been selected.

// Both players set to false on page load.
var h2hSelectors = {player1: false, player2: false};

// Charts hidden by default - remove class 'hidden' only when both players set to true.
function displayResults() {
	if (h2hSelectors.player1 && h2hSelectors.player2) {
		document.getElementById("h2hWrapper").classList.remove("hidden");
	}
}

// When player 1 selected, function sets player to true and calls display function again.
document.getElementById("player1Select").onchange = setPlayer1;

function setPlayer1() {
	h2hSelectors.player1 = true;
	displayResults();
}

// When player 2 selected, function sets player to true and calls display function again.
document.getElementById("player2Select").onchange = setPlayer2;

function setPlayer2() {
	h2hSelectors.player2 = true;
	displayResults();
}
