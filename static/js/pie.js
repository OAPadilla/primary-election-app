// Candidate data that includes delegates for pie chart
addCandidatesTotalDelegates();
const data = candidateData;

// Set size and attributes of pie chart
const width = 360;
const height = 360;
const radius = Math.min(width, height) / 2;
const opacity = 1;
const opacityHover = 0.7;

// Create pie shape holding data
const pie = d3.pie()
    .value(function(d) {
        return Math.round(1000*(d.delegates/totalDelegates))/10;
    })(data);

// Arc of pie circle
const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius * 0.55);

// Arc of labels in pie
const labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

// Set Pie SVG
const pieSVG = d3.select("#pie-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

// Join data with the arcs in the pie
const g = pieSVG.selectAll("arc")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "arc");

// Create center candidate data in donut hole
const holeText = d3.select("#pie-chart").select("svg")
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
    });

// Labels
g.append("text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + 40 + ")";
    })
    .text(function(d) {
        const perc = Math.round(1000*(d.data.delegates/totalDelegates))/10;
        if (perc >= 5) {
            return perc + "%";
        }
    });

// Update Pie Chart with new data
function updatePie() {
    addCandidatesTotalDelegates();
    const data = candidateData;
    const pie = d3.pie()
        .value(function(d) {
            return Math.round(1000*(d.delegates/totalDelegates))/10;
        })(data);

    let path = d3.select("#pie-chart").selectAll("path").data(pie);

    path.attr("d", arc);

    d3.selectAll("text")
        .data(pie)
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + 40 + ")";
        });

    d3.select("#pie-chart").style("background-color", "transparent").style("opacity", 1.0);

}

// Append national delegate results for all candidates
function addCandidatesTotalDelegates() {
    for (let c in candidateData) {
        candidateData[c].delegates = 0;
    }
    for (let c in candidateData) {
        let candidateName = candidateData[c].name;
        for (let s in stateData) {
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
