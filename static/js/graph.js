queue()
    .defer(d3.json, "/results")
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
    var finals = crossfilter(crucible_results);
    var allResults = crossfilter(crucible_results);

    // Defining dimensions
    var finalRound = finals.dimension(function (d) {
        return d["round"];
    });
    var finalWinner = finals.dimension(function (d) {
    	return d["winner"];
    });
    var finalLoser = finals.dimension(function (d) {
    	return d["loser"];
    });
    var finalYear = finals.dimension(function (d) {
    	return d["year"];
    });
    var allRounds = allResults.dimension(function (d) {
        return d["round"];
    });
    var allWinners = allResults.dimension(function (d) {
    	return d["winner"];
    });
    var allLosers = allResults.dimension(function (d) {
    	return d["loser"];
    });
    var allYears = allResults.dimension(function (d) {
    	return d["year"];
    });

    // Filtering the data
    var finalFilter = finalRound.filter("The Final");

    // Grouping the data
    var allFinals = finals.groupAll();
    var champions = finalWinner.group();
    var runnersUp = finalLoser.group();
    var yearGroup = allYears.group();
    var roundGroup = allRounds.group();
    var allMatches = allResults.groupAll();
    var matchWinners = allWinners.group();
    var matchLosers = allLosers.group();

    var allFrames = allResults.groupAll().reduceSum(
    		function (d) {
    			return (d["winner_score"] + d["loser_score"]);
    		}
    	);

    // Charts
    var tournaments = dc.numberDisplay("#totalTournaments");
    var winnerList = dc.rowChart("#winnersRow");
    var runnerUpList = dc.rowChart("#runnerUpRow");
    var finalResults = dc.dataTable("#winnersTable");
    var yearSelection = dc.selectMenu('#yearSelect');
    var yearMatches = dc.numberDisplay("#matchesPlayed");
    var yearFrames = dc.numberDisplay("#framesPlayed");
    var yearResults = dc.dataTable("#tournamentResults");
    var roundSelection = dc.selectMenu('#roundSelect');
    var winningPlayers = dc.rowChart("#mostWins");
    var losingPlayers = dc.rowChart("#mostDefeats");

    tournaments
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(allFinals);

    winnerList
    	.ordinalColors(["#996600"])
    	.dimension(finalWinner)
    	.group(champions)
    	.width(250)
    	.height(300)
    	.rowsCap(6)
    	.ordering(function(d) { return -d.value; })
    	.xAxis().ticks(7);

    runnerUpList
    	.ordinalColors(["#996600"])
    	.dimension(finalLoser)
    	.group(runnersUp)
    	.width(250)
    	.height(300)
    	.rowsCap(11)
    	.ordering(function(d) { return -d.value; })
    	.xAxis().ticks(7);

    finalResults
    	.dimension(finalYear)
    	.group(function (d) {
       		return d.year;
   		})
   		.size(Infinity)
   		.columns([
   			function (d) {
       			return d.year;
   			},
   			function (d) {
       			return d.winner;
   			},
   			function (d) {
       			return "<img class='flagIcon' src='static/img/" + d.winner_nat.toLowerCase() + ".png' alt=" + d.winner_nat + " />";
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
       			return "<img class='flagIcon' src='static/img/" + d.loser_nat.toLowerCase() + ".png' alt=" + d.loser_nat + " />";
   			},
   			function (d) {
       			return d.loser;
   			}
   		])

   	yearSelection
   		.dimension(allYears)
   		.group(yearGroup)

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

    yearResults
    	.dimension(allRounds)
    	.group(function (d) {
       		return d.round;
   		})
   		.sortBy(function (d) {
       		return d.winner;
   		})
   		.size(Infinity)
   		.columns([
   			function (d) {
       			return d.winner;
   			},
   			function (d) {
       			return "<img class='flagIcon' src='static/img/" + d.winner_nat.toLowerCase() + ".png' alt=" + d.winner_nat + " />";
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
       			return "<img class='flagIcon' src='static/img/" + d.loser_nat.toLowerCase() + ".png' alt=" + d.loser_nat + " />";
   			},
   			function (d) {
       			return d.loser;
   			}
   		])

   	roundSelection
   		.dimension(allRounds)
   		.group(roundGroup)

    winningPlayers
    	.ordinalColors(["#996600"])
    	.dimension(allWinners)
    	.group(matchWinners)
    	.othersGrouper(false)
    	.width(250)
    	.height(250)
    	.rowsCap(10)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true)
    	.xAxis().ticks(10);

    losingPlayers
    	.ordinalColors(["#996600"])
    	.dimension(allLosers)
    	.group(matchLosers)
    	.othersGrouper(false)
    	.width(250)
    	.height(250)
    	.rowsCap(10)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true)
    	.xAxis().ticks(10);

    dc.renderAll();
}