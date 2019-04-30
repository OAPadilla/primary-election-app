// Candidate data for pie chart
var data = [{"name": "Joe Biden", "color": "#009933", "poll": 51},
            {"name": "Bernie Sanders", "color": "#6699ff", "poll": 24},
            {"name": "Kamala Harris", "color": "#ff9966", "poll": 11}];
console.log(data)

// Set size and attributes of pie chart
var width = 640;
var height = 360;
var radius = Math.min(width, height) / 2;
// var opacity = 0.8;
// var opacityHover = 1;
// var otherOpacity = 0.8;

// Create shapes
var pie = d3.pie()
    .value(function(d) {
        return d.poll;
    })(data);

// Arc of pie circle
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius * 0.4);

// Arc of label in pie
var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

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

// Add color to paths created with variables in data
g.append("path")
    .attr("d", arc)
    .style("fill", function(d) {
        return d.data.color;
    });

// Labels
g.append("text")
    .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + 40 + ")";
    })
    .text(function(d) {
        return d.data.poll + "%";
    })
    .style("fill", "white")
