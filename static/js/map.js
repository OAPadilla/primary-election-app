// document.write("map.js content")

var data = [30, 86, 168, 281, 303, 435]

d3.select(".map-chart")
    .selectAll("div")
    .data(data)
        .enter()
        .append("div")
        .style("width", function(d) { return d + "px"; })
        .text(function(d) { return d; });
