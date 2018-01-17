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

    //Crossfilter instance
    var championsFilter = crossfilter(crucible_results);

    // Defining dimensions
    var roundDim = championsFilter.dimension(function (d) {
        return d["round"];
    });
    var winnerDim = championsFilter.dimension(function (d) {
    	return d["winner"];
    });
    var yearDim = championsFilter.dimension(function (d) {
    	return d["year"];
    });

    // Filtering the data
    var finalFilter = roundDim.filter("TF");

    // Grouping the data
    var all = championsFilter.groupAll();

    // Charts
    var tournaments = dc.numberDisplay("#totalTournaments");
    var honourRoll = dc.dataTable("#winnersTable");

    tournaments
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(all);

    honourRoll
    	.dimension(yearDim)
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

    dc.renderAll();
}