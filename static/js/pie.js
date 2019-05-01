// Candidate data that includes delegates for pie chart
addCandidatesTotalDelegates();
var data = candidateData;

// Set size and attributes of pie chart
var width = 640;
var height = 360;
var radius = Math.min(width, height) / 2;
var opacity = 1;
var opacityHover = 0.7;

// Create pie shape holding data
var pie = d3.pie()
    .value(function(d) {
        return Math.round(1000*(d.delegates/totalDelegates))/10;
    })(data);

// Arc of pie circle
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius * 0.45);

// Arc of labels in pie
var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

// Set Pie SVG
var pieSVG = d3.select("#pie-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

// Join data with the arcs in the pie
var g = pieSVG.selectAll("arc")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "arc");

// Create center candidate data in donut hole
var holeText = d3.select("#pie-chart").select("svg")
    .append("g")
    .append("text")
    .attr("class", "candidate-text")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
    .attr('text-anchor', 'middle');

// Add color/style with variables of data
g.append("path")
    .attr("d", arc)
    .style("fill", function(d) {
        return d.data.color;
    })
    .style("opacity", opacity)
    .on("mouseover", function(d) {
        d3.select(this).style("opacity", opacityHover);

        // Display candidate, percentage, delegates won in donut hole
        holeText.append("tspan")
            .text(d.data.name + " (" + Math.round(1000*(d.data.delegates/totalDelegates))/10 + "%)")
            .attr("class", "name")
            .attr("x", 0)
            .attr("dx", 0)
            .attr("dy", 0);

        holeText.append("tspan")
            .text(d.data.delegates + " Delegates")
            .attr("class", "del")
            .attr("x", 0)
            .attr("dx", 0)
            .attr("dy", 20);
    })
    .on("mouseout", function(d) {
        d3.select(this).style("opacity", opacity);
        // Clear displayed info in donut hole
        d3.select(".candidate-text")
            .text('');
    })

// Labels
g.append("text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + 40 + ")";
    })
    .text(function(d) {
        var perc = Math.round(1000*(d.data.delegates/totalDelegates))/10;
        if (perc >= 5) {
            return perc + "%";
        }
    })

// Update Pie Chart with new data
function updatePie() {
    addCandidatesTotalDelegates();
    data = candidateData;
    var pie = d3.pie()
        .value(function(d) {
            return Math.round(1000*(d.delegates/totalDelegates))/10;
        })(data);

    path = d3.select("#pie-chart").selectAll("path").data(pie);

    path.attr("d", arc);

    d3.selectAll("text")
        .data(pie)
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + 40 + ")";
        });
}

// Append national delegate results for all candidates
function addCandidatesTotalDelegates() {
    for (var c in candidateData) {
        candidateData[c].delegates = 0;
    }
    for (var c in candidateData) {
        var candidateName = candidateData[c].name;
        for (var s in stateData) {
            // Check if state in stateData has delegate results, if not skip
            if (stateData[s].results[1] != null) {
                // Check if candidate in candidateData has delegates key, if not make it =0
                if (candidateData[c]["delegates"] == null) {
                    candidateData[c]["delegates"] = 0;
                }
                // Check if state delegate results in stateData includes the candidate
                if (stateData[s].results[1][candidateName] != null) {
                    candidateData[c]["delegates"] += stateData[s].results[1][candidateName];
                }
            }
        }
    }
}

// OnClick refresh and update pie chart button
$(document).ready(function() {
    $("#refresh").on("click", updatePie);
});
