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

    // Defining dimensions - player based
    var playerList = ndx.dimension(function (d) {
    	return d["player_1"];
    });
    var opponentsList = ndx.dimension(function (d) {
    	return d["player_2"];
    });
    var playerOutcomes = ndx.dimension(function (d) {
        return d["player_1_result"];
    });
    var victoryMargin = ndx.dimension(function (d) {
        return d["margin"];
    });
    var tournamentStage = ndx.dimension(function (d) {
        return d["round"];
    });

    // Setting color scales for pie charts
    var booleanSlices = d3.scale.ordinal().range(["#ee0000", "#000000"]);
    var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

    // Grouping the data - count
    var selectedPlayer = playerList.group();
    var playerWinLoss = playerOutcomes.group();
    var playerOpponent = opponentsList.group();
    var playerMargin = victoryMargin.group();
    var playerStage = tournamentStage.group();

    // Grouping the data - sum
    var playerFramesWon = ndx.groupAll().reduceSum(
    		function (d) {
    			return d["player_1_score"];
    		}
    	);
    var playerFramesLost = ndx.groupAll().reduceSum(
    		function (d) {
    			return d["player_2_score"];
    		}
    	);

    // Charts
    var playerSelection = dc.selectMenu('#playerSelect');
    var playerResults = dc.dataTable("#playerResults");
    var winLossRecord = dc.pieChart("#winLoss");
    var playerOpponents = dc.rowChart("#playerOpponents");
    var framesWon = dc.numberDisplay("#framesWon");
    var framesLost = dc.numberDisplay("#framesLost");
    var playerMargins = dc.pieChart("#playerMargins");
    var playerRounds = dc.rowChart("#playerRounds");

   	playerSelection
   		.dimension(playerList)
   		.group(selectedPlayer)

    playerResults
    	.dimension(playerList)
    	.group(function (d) {
       		return d.year;
   		})
   		.sortBy(function (d) {
       		return d.tournament_stage;
   		})
   		.size(Infinity)
   		.columns([
   			function (d) {
       			return d.round_code;
   			},
   			function (d) {
       			return "v";
   			},
   			function (d) {
       			return "<img class='flagIcon' src='static/img/" + d.player_2_nat.toLowerCase() + ".png' alt=" + d.player_2_nat + " />";
   			},
   			function (d) {
       			return d.player_2;
   			},
   			function (d) {
       			return d.player_1_result;
   			},
   			function (d) {
       			return d.player_1_score;
   			},
   			function (d) {
       			return "-";
   			},
   			function (d) {
       			return d.player_2_score;
   			}
   		])

    winLossRecord
    	.dimension(playerOutcomes)
    	.group(playerWinLoss)
    	.height(200)
    	.radius(100)
    	.innerRadius(20)
    	.colors(booleanSlices);

    playerOpponents
    	.ordinalColors(["#996600"])
    	.dimension(opponentsList)
    	.group(playerOpponent)
    	.width(250)
    	.height(283)
    	.rowsCap(10)
    	.othersGrouper(false)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true);

    framesWon
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(playerFramesWon);

    framesLost
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(playerFramesLost);

    playerMargins
    	.dimension(victoryMargin)
    	.group(playerMargin)
    	.height(200)
    	.radius(100)
    	.innerRadius(20)
    	.colors(shadeSlices);

    playerRounds
    	.ordinalColors(["#996600"])
    	.dimension(tournamentStage)
    	.group(playerStage)
    	.width(250)
    	.height(200)
    	.elasticX(true);

    dc.renderAll();
}