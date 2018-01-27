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
    var match_up_result = ndx.dimension(function (d) {
        return d["player_1_result"];
    });
    var allMatchups = ndx.dimension(function (d) {
      return d["match_up"];
    });
    var matchRound = ndx.dimension(function (d) {
      return d["round"];
    });

    // Filtering the data for finals only
    var duplicateMatchFilter = match_up_result.filter("W");

    // Setting color scales for pie charts

    // Grouping the data - count
    var frequentMatchups = allMatchups.group();
    var frequentRound = matchRound.group();

    // Charts
    var mostFrequent = dc.rowChart("#mostFrequent");
    var matchUpRound = dc.selectMenu("#matchUpRound");

    matchUpRound
      .dimension(matchRound)
      .group(frequentRound)

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

    dc.renderAll();
}