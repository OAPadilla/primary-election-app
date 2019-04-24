// document.write("map.js content")

// var data = [30, 86, 168, 281, 303, 435]
//
// d3.select(".map-chart")
//     .selectAll("div")
//     .data(data)
//         .enter()
//         .append("div")
//         .style("width", function(d) { return d + "px"; })
//         .text(function(d) { return d; });

const defaultColor = $('.states').css("fill");

var svg = d3.select("svg");

var path = d3.geoPath();

var stateName = ''

// US Map Generation with D3
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;

    var data = topojson.feature(us, us.objects.states).features;
    var names = {};

    // Collect state names for ids in us.json from us-state-names.tsv
    var stateNamesTSV = "https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv"
    d3.tsv(stateNamesTSV , function(tsv) {
        tsv.forEach(function(d, i) {
            var key = d.id;
            if (d.id.length === 1) {
                key = '0' + d.id;
            }
            names[key] = d.name;
        })
    });

    // Build paths, on click get state name and do action
    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .on("mousedown.log", function(d) {
            stateName = names[d.id]
        })
        .on("click", selectState);

    // Borders
    svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        })));

});

// Clicking On States Actions
var selectState = (function() {
    // Get selected candidate name and color
    var candidateName = d3.select("input[name='candidate']:checked").property("value");
    console.log(candidateName)
    console.log(stateName)

    // Get current color of selected state
    var currentColor = d3.select(this).style('fill');

    // If user selected state with candidate chosen
    if (candidateName !== "Custom") {
        // Get appropriate color for candidate
        var candidateColor = defaultColor;
        for (var i = 0; i < candidateData.length; ++i) {
            if (candidateData[i].name === candidateName) {
                candidateColor = candidateData[i].color;
            }
        }

        // Change color to default if same candidate color, otherwise change to new color
        if (currentColor === candidateColor) {
            d3.select(this).style("fill", defaultColor);
        } else {
            d3.select(this).style("fill", candidateColor);
        }

        // change percentage values to default values for each candidate in selected state

        // d3.select(".perc-vals").property("value") = d3.selectcandidateName.

        // calculate delegate count and update it

    // Else, user selected state with Custom
    } else {
        console.log("update state color test")
        // updateStateResults();
    }
});

var updateStateColor = (function(candidateName, currentColor) {
    console.log("update state color test")
});

var updateStateResults = (function() {

});

// Resets Map Back to Default
var resetMap = (function() {
    svg.selectAll("*").style("fill", defaultColor);
});
