queue()
    .defer(d3.json, "/career_data")
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
    var playerCareer = ndx.dimension(function (d) {
        return d["record_type"];
    });

    // Formatting numbers for data tables
    var twoDec = d3.format(".2f");

    // Setting color scales for pie charts

    // Grouping the data - count

    // Grouping the data - sum

    // Charts
    var careerRecords = dc.dataTable("#careerRecords");

    careerRecords
      .dimension(playerCareer)
      .group(function (d) {
          return d.record_type;
      })
      .size(Infinity)
      .sortBy(function (d) {
          return (d.matches_won * 100 + d.matches_played) * 1500 + d.frames_won;
      })
      .order(d3.descending)
      .columns([
        function (d) {
            return "<img class='flagIcon' src='static/img/" + d.country.toLowerCase() + ".png' alt=" + d.country + " />";
        },
        function (d) {
            return d.player;
        },
        function (d) {
            return d.tournaments;
        },
        function (d) {
            return d.matches_played;
        },
        function (d) {
            return d.matches_won;
        },
        function (d) {
            return d.matches_lost;
        },
        function (d) {
            return d.frames_played;
        },
        function (d) {
            return d.frames_won;
        },
        function (d) {
            return d.frames_lost;
        }
      ])

    dc.renderAll();

}