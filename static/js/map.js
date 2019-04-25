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
var stateName;

var svg = d3.select("svg");
var path = d3.geoPath();

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
    // Get selected candidate name
    var candidateName = d3.select("input[name='candidate']:checked").property("value");
    console.log(candidateName)
    console.log(stateName)

    // If user selected state with candidate chosen
    if (candidateName !== "Custom") {
        // Get current color of selected state
        var currentColor = d3.select(this).style('fill');

        // Update state color depending on candidate
        updateStateColor(d3.select(this), candidateName, currentColor);

        // Selected State Options HTML
        for (var i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // Update State Data results with chosen color candidate as first
                stateData[i].results[0][candidateName] = 51
                //FIXME: Add management of numbers for rest of candidates so its automatic

                // State description and candidate results
                showStateResults(stateData[i]);
                break;
            }
        }
        // Set selected candidate to 51%, and change the rest to defaults

        // d3.select(".perc-vals").property("value") = d3.selectcandidateName.

        // calculate delegate count and update it

    // Else, user selected state with Custom
    } else {
        // Selected State Options HTML
        for (var i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // State description and candidate results
                showStateResults(stateData[i]);
                break;
            }
        }

    }
});

// Updates US Map SVG State to appropriate color based on candidate
var updateStateColor = (function(d3Obj, candidateName, currentColor) {
    // Get candidates color
    var candidateColor = defaultColor;
    for (var i = 0; i < candidateData.length; ++i) {
        if (candidateData[i].name === candidateName) {
            candidateColor = candidateData[i].color;
        }
    }

    // Change state color to default if same candidate color, otherwise change to new color
    if (currentColor === candidateColor) {
        d3Obj.style("fill", defaultColor);
    } else {
        d3Obj.style("fill", candidateColor);
    }
});

// Update HTML for State Options that contains State description and results
var showStateResults = (function(selectedState) {
    // State description
    $("#state-options-info").text(stateName + " | " + selectedState.type
        + " | " + selectedState.delegates + " Delegates");

    // State candidate results
    $("#state-options-rows").html('');
    for (var j = 0; j < candidateData.length; j++) {
        $("#state-options-rows").append(`
            <div class="row">
                <div class="col-sm-6">
                    <div class="input-group">
                        <span class="input-group-addon">
                            <input type="checkbox" aria-label="..." checked>
                        </span>
                        <span class="input-group-addon" id="addon-cand">` + candidateData[j].name + `</span>
                        <input type="number" class="form-control" id="perc-vals" aria-label="..." min="0" oninput="validity.valid||(value='');" step=0.1 value="` + selectedState.results[0][candidateData[j].name] + `">
                        <span class="input-group-addon" id="addon-perc">%</span>
                        <span class="input-group-addon" id="addon-deleg">_ Delegates</span>
                    </div>
                </div>
            </div>`
        );
    }
});

var updateStateResults = (function() {

});

// Resets Map Back to Default
var resetMap = (function() {
    svg.selectAll("*").style("fill", defaultColor);
    // Change all state results back to default (from candidates[0].poll)
});
