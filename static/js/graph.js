queue()
    .defer(d3.json, "/data")
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
    var playerResults = crossfilter(crucible_results);

    // Defining dimensions - finals only
    var finalRound = finals.dimension(function (d) {
        return d["round"];
    });
    var finalOutcome = finals.dimension(function (d) {
        return d["player_1_result"];
    });
    var finalWinner = finals.dimension(function (d) {
    	return d["winner"];
    });
    var winnerNat = finals.dimension(function (d) {
    	return d["winner_nat"];
    });
    var winnerGap = finals.dimension(function (d) {
    	return d["margin"];
    });
    var finalLoser = finals.dimension(function (d) {
    	return d["loser"];
    });
    var finalYear = finals.dimension(function (d) {
    	return d["year"];
    });

    // Defining dimensions - results based
    var allRounds = allResults.dimension(function (d) {
        return d["round"];
    });
    var allOutcomes = allResults.dimension(function (d) {
        return d["player_1_result"];
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

    // Defining dimensions - player based
    var playerList = playerResults.dimension(function (d) {
    	return d["player_1"];
    });
    var opponentsList = playerResults.dimension(function (d) {
    	return d["player_2"];
    });
    var playerOutcomes = playerResults.dimension(function (d) {
        return d["player_1_result"];
    });
    var victoryMargin = playerResults.dimension(function (d) {
        return d["margin"];
    });
    var tournamentStage = playerResults.dimension(function (d) {
        return d["round"];
    });

    // Filtering the data for finals only
    var finalFilter = finalRound.filter("The Final");
    var duplicateFinalFilter = finalOutcome.filter("W");
    var duplicateFilter = allOutcomes.filter("W");

    // Setting color scales for pie charts
    var booleanSlices = d3.scale.ordinal().range(["#ee0000", "#000000"]);
    var blockSlices = d3.scale.ordinal().range(["#000000", "#ff6666", "#0000ff", "#663300", "#006600", "#ffff00", "#ee0000", "#ffffff"]);
    var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

    // Grouping the data - count
    var allFinals = finals.groupAll();
    var champions = finalWinner.group();
    var winningCountry = winnerNat.group();
    var winningMargin = winnerGap.group();
    var runnersUp = finalLoser.group();
    var yearGroup = allYears.group();
    var roundGroup = allRounds.group();
    var allMatches = allResults.groupAll();
    var matchWinners = allWinners.group();
    var matchLosers = allLosers.group();
    var selectedPlayer = playerList.group();
    var playerWinLoss = playerOutcomes.group();
    var playerOpponent = opponentsList.group();
    var playerMargin = victoryMargin.group();
    var playerStage = tournamentStage.group();

    // Grouping the data - sum
    var allFrames = allResults.groupAll().reduceSum(
    		function (d) {
    			return (d["winner_score"] + d["loser_score"]);
    		}
    	);
    var playerFramesWon = playerResults.groupAll().reduceSum(
    		function (d) {
    			return d["player_1_score"];
    		}
    	);
    var playerFramesLost = playerResults.groupAll().reduceSum(
    		function (d) {
    			return d["player_2_score"];
    		}
    	);

    // Charts
    var tournaments = dc.numberDisplay("#totalTournaments");
    var winnerList = dc.rowChart("#winnersRow");
    var winnersByCountry = dc.pieChart("#winningCountry");
    var winnersByMargin = dc.pieChart("#winningMargin");
    var runnerUpList = dc.rowChart("#runnerUpRow");
    var finalResults = dc.dataTable("#winnersTable");
    var yearSelection = dc.selectMenu('#yearSelect');
    var yearMatches = dc.numberDisplay("#matchesPlayed");
    var yearFrames = dc.numberDisplay("#framesPlayed");
    var yearResults = dc.dataTable("#tournamentResults");
    var roundSelection = dc.selectMenu('#roundSelect');
    var winningPlayers = dc.rowChart("#mostWins");
    var losingPlayers = dc.rowChart("#mostDefeats");
    var playerSelection = dc.selectMenu('#playerSelect');
    var playerResults = dc.dataTable("#playerResults");
    var winLossRecord = dc.pieChart("#winLoss");
    var playerOpponents = dc.rowChart("#playerOpponents");
    var framesWon = dc.numberDisplay("#framesWon");
    var framesLost = dc.numberDisplay("#framesLost");
    var playerMargins = dc.pieChart("#playerMargins");
    var playerRounds = dc.rowChart("#playerRounds");

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
    	.height(250)
    	.rowsCap(6)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true);

    runnerUpList
    	.ordinalColors(["#996600"])
    	.dimension(finalLoser)
    	.group(runnersUp)
    	.width(250)
    	.height(300)
    	.rowsCap(11)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true);

    winnersByCountry
    	.height(200)
    	.radius(100)
    	.innerRadius(20)
    	.dimension(winnerNat)
    	.group(winningCountry)
    	.ordering(function(d) { return -d.value; })
    	.colors(blockSlices);

    winnersByMargin
    	.height(200)
    	.radius(100)
    	.innerRadius(20)
    	.dimension(winnerGap)
    	.group(winningMargin)
    	.colors(shadeSlices);

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
       		return d.match_number;
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
    	.elasticX(true);

    losingPlayers
    	.ordinalColors(["#996600"])
    	.dimension(allLosers)
    	.group(matchLosers)
    	.othersGrouper(false)
    	.width(250)
    	.height(250)
    	.rowsCap(10)
    	.ordering(function(d) { return -d.value; })
    	.elasticX(true);

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