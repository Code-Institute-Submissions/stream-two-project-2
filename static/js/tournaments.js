queue()
    .defer(d3.json, "/year_data")
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
    var playerTournament = ndx.dimension(function (d) {
        return d["record_type"];
    });

    // Formatting numbers for data tables
    var twoDec = d3.format(".2f");

    // Setting color scales for pie charts

    // Grouping the data - count

    // Grouping the data - sum

    // Charts
    var mostFrames = dc.dataTable("#mostFrames");
    var winningPercentage = dc.dataTable("#winningPercentage");

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
            return "<img class='flagIcon' src='static/img/" + d.country.toLowerCase() + ".png' alt=" + d.country + " />";
        },
        function (d) {
            return d.player;
        },
        function (d) {
            return d.year;
        },
        function (d) {
            return d.result;
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
      ])

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
            return "<img class='flagIcon' src='static/img/" + d.country.toLowerCase() + ".png' alt=" + d.country + " />";
        },
        function (d) {
            return d.player;
        },
        function (d) {
            return d.year;
        },
        function (d) {
            return d.result;
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
      ])

    dc.renderAll();

}