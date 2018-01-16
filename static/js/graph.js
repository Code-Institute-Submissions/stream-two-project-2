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

    // Min and max dates
    var minDate = yearDim.bottom(1)[0]["year"];
    var maxDate = yearDim.top(1)[0]["year"];

    // Charts
    var tournaments = dc.numberDisplay("#totalTournaments");

    tournaments
    	.formatNumber(d3.format("d"))
    	.valueAccessor(function (d) {
            return d;
        })
        .group(all);

    dc.renderAll();
}