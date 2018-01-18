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
    var finalYear = finals.dimension(function (d) {
    	return d["year"];
    });
    var allRounds = allResults.dimension(function (d) {
        return d["round"];
    });
    var allWinners = allResults.dimension(function (d) {
    	return d["winner"];
    });
    var allYears = allResults.dimension(function (d) {
    	return d["year"];
    });

    // Filtering the data
    var finalFilter = finalRound.filter("The Final");

    // Grouping the data
    var allFinals = finals.groupAll();
    var winners = finalWinner.group();
    var yearGroup = allYears.group();
    var allMatches = allResults.groupAll();

    var allFrames = allResults.groupAll().reduceSum(
    		function (d) {
    			return (d["winner_score"] + d["loser_score"]);
    		}
    	);

    // //Defining min and max values
    // var minDate = finalWinner.bottom(1)[0]["winner"];
    // var maxDate = finalWinner.top(1)[0]["winner"];

    // Charts
    var tournaments = dc.numberDisplay("#totalTournaments");
    var topPlayers = dc.rowChart("#winnersRow")
    var honourRoll = dc.dataTable("#winnersTable");
    var yearSelection = dc.selectMenu('#yearSelect');
    var yearMatches = dc.numberDisplay("#matchesPlayed");
    var yearFrames = dc.numberDisplay("#framesPlayed");

    tournaments
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(allFinals);

    topPlayers
    	.ordinalColors(["#996600"])
    	.dimension(finalWinner)
    	.group(winners)
    	.width(280)
    	.height(500)
    	.rowsCap(20)
    	.ordering(function(d) { return -d.value; })
    	.xAxis().ticks(7);

    honourRoll
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

    dc.renderAll();
}