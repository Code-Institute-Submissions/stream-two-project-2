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
    var firstAppearance = ndx.dimension(function (d) {
        return d["first"];
    });
    var careerNationality = ndx.dimension(function (d) {
        return d["country"];
    });
    var bestRecord = ndx.dimension(function (d) {
        return d["best_performance"];
    });

    // Formatting numbers for data tables
    var twoDec = d3.format(".2f");

    // Setting color scales for pie charts
    var blockSlices = d3.scale.ordinal().range(["#000000", "#ff6666", "#0000ff", "#663300", "#006600", "#ffff00", "#ee0000"]);
    var shadeSlices = d3.scale.ordinal().range(["rgb(100,50,0)", "rgb(105,56,7)", "rgb(110,62,14)", "rgb(115,68,21)", "rgb(120,74,28)", "rgb(125,80,35)", "rgb(130,86,42)", "rgb(135,92,49)", "rgb(140,98,56)", "rgb(145,104,63)", "rgb(150,110,70)", "rgb(155,116,77)", "rgb(160,122,84)", "rgb(165,128,91)", "rgb(170,134,98)", "rgb(175,140,105)", "rgb(180,146,112)", "rgb(185,152,119)", "rgb(190,158,126)", "rgb(195,164,133)", "rgb(200,170,140"]);

    // Grouping the data - count
    var crucibleDebut = firstAppearance.group();
    var countryGroup = careerNationality.group();
    var furthestReached = bestRecord.group();

    // Grouping the data - sum

    // Charts
    var careerRecords = dc.dataTable("#careerRecords");
    var roundRecords = dc.dataTable("#roundRecords");
    // var debutYear = dc.barChart("#debutYear");
    var countryCareer = dc.pieChart("#countryCareer");
    var stageReached = dc.pieChart("#stageReached");

     // debutYear
     //  .ordinalColors(["#996600"])
     //  .width(500)
     //  .height(250)
     //  .dimension(firstAppearance) 
     //  .group(crucibleDebut)
     //  .x(d3.scale.ordinal())
     //  .xUnits(dc.units.ordinal);

// $( window ).resize(function() {
//   debutYear.width(window.innerWidth * 0.2);
//   debutYear.render();
// });

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

    roundRecords
      .dimension(playerCareer)
      .group(function (d) {
          return d.record_type;
      })
      .size(Infinity)
      .sortBy(function (d) {
          return ((((d.winner * 100 + d.runner_up) * 100 + d.semi_finals) * 100 + d.quarter_finals) * 100 + d.last_16) * 100 + d.first_round;
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
            return d.first_round;
        },
        function (d) {
            return d.last_16;
        },
        function (d) {
            return d.quarter_finals;
        },
        function (d) {
            return d.semi_finals;
        },
        function (d) {
            return d.runner_up;
        },
        function (d) {
            return d.winner;
        }
      ])

     countryCareer
      .height(200)
      .radius(100)
      .innerRadius(20)
      .dimension(careerNationality) 
      .group(countryGroup)
      .colors(blockSlices)
      .ordering(function(d) { return -d.value; });

     stageReached
      .height(200)
      .radius(100)
      .innerRadius(20)
      .dimension(bestRecord) 
      .group(furthestReached)
      .colors(shadeSlices)
      .ordering(function(d) { return d.best_performance; });

    dc.renderAll();

}