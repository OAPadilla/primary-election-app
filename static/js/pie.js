//
// var data = [{"name": "Joe Biden", "color": "#009933", "poll": 51, "delegates": 100},
//             {"name": "Bernie Sanders", "color": "#6699ff", "poll": 24, "delegates": 50},
//             {"name": "Kamala Harris", "color": "#ff9966", "poll": 11, "delegates": 25}];

//FIXME: Append total delegate counts to data holding candidateData

// Candidate data for pie chart
var data = candidateData

// Set size and attributes of pie chart
var width = 640;
var height = 360;
var radius = Math.min(width, height) / 2;
var opacity = 1;
var opacityHover = 0.7;

// Create pie shape holding data
var pie = d3.pie()
    .value(function(d) {
        return d.poll;
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
    .attr("class", "arc")

// Create center candidate data in donut hole
var holeText = d3.select("#pie-chart").select("svg")
    .append("g")
    .append("text")
    .attr("class", "candidate-text")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
    .attr('text-anchor', 'middle')

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
            .text(d.data.name + " (" + d.data.poll + "%)")
            .attr("class", "name")
            .attr("x", 0)
            .attr("dx", 0)
            .attr("dy", 0)

        holeText.append("tspan")
            .text(d.data.delegates + " Delegates")
            .attr("class", "del")
            .attr("x", 0)
            .attr("dx", 0)
            .attr("dy", 20)
    })
    .on("mouseout", function(d) {
        d3.select(this).style("opacity", opacity)
        // Clear displayed info in donut hole
        d3.select(".candidate-text")
            .text('')
    })

// Labels
g.append("text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + 40 + ")";
    })
    .text(function(d) {
        if (d.data.poll >= 5) {
            return d.data.poll + "%";
        }
    })
