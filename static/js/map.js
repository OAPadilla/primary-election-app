var defaultColor;
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

    defaultColor = $('.states').css("fill");
});

// Clicking On States Actions
var selectState = (function() {
    // Get selected candidate name
    var candidateName = d3.select("input[name='candidate']:checked").property("value");
    console.log(candidateName)
    console.log(stateName)

    // If user selected state with candidate chosen
    if (candidateName !== "Custom") {
        // Update state color depending on candidate
        updateStateColorByClick(candidateName, d3.select(this));

        // Selected State Options HTML
        for (var i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // Update State Data results with chosen color candidate as first
                updateStateResultsByClick(candidateName, stateData[i], d3.select(this));
                // Display state description and candidate results
                showStateResults(stateData[i], d3.select(this));
                break;
            }
        }
    // Else, user selected state with Custom
    } else {
        // Selected State Options HTML
        for (var i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // State description and candidate results
                showStateResults(stateData[i], d3.select(this));
                break;
            }
        }

    }
});

// Updates US Map SVG State to appropriate color based on candidate chosen
var updateStateColorByClick = (function(candidateName, d3State) {
    // Get current color of selected state, converted to hex
    var currentColor =  rgba2hex(d3State.style('fill'));

    // Get candidates color
    var candidateColor = defaultColor;
    for (var i = 0; i < candidateData.length; ++i) {
        if (candidateData[i].name === candidateName) {
            candidateColor = candidateData[i].color;
        }
    }

    // Change state color to default if same candidate color, otherwise change to new color
    if (currentColor === candidateColor) {
        d3State.style("fill", defaultColor);
    } else {
        d3State.style("fill", candidateColor);
    }
});

// Updates US Map SVG State to appropriate color based on candidate
var updateStateColor = (function(candidateName, selectedState, d3State) {
    // Get candidates color
    var candidateColor = defaultColor;
    for (var i = 0; i < candidateData.length; ++i) {
        if (candidateData[i].name === candidateName) {
            candidateColor = candidateData[i].color;
        }
    }

    // Update color of selected state too apropriate candidates color
    d3State.style("fill", candidateColor);
})

// Update HTML for State Options that contains State description and results
var showStateResults = (function(selectedState, d3State) {
    // Get Total Percentage points available to be assigned in state Results
    var availablePercPoints = Math.round(10*(100 - getTotalAssignedPercentages(selectedState)))/10;

    // State description
    $("#state-options-info").text(stateName + " | " + selectedState.type
        + " | " + selectedState.delegates + " Delegates | " + selectedState.date);

    // Available Percentage Points to be Assigned
    $(".delegates-available").text("Available Percentage Points to Assign: " + availablePercPoints)

    // State candidate results
    $(".state-options-rows").html('');
    for (var j = 0; j < candidateData.length; j++) {
        // Table rows html
        $(".state-options-rows").append(`
            <tr id="` + candidateData[j].name + `">
               <td id="addon-cand">` + candidateData[j].name  + `</td>
               <td><input type="number" class="form-control" id="perc-` + candidateData[j].index + `" aria-label="..."
                   name="` + candidateData[j].name + `" oninput="validity.valid||(value='');"
                   min="0" max="` + (selectedState.results[0][candidateData[j].name] + availablePercPoints) + `" step=0.1 value="` + selectedState.results[0][candidateData[j].name] + `"></td>
               <td id="addon-perc">%</td>
               <td id="addon-del" name="` + candidateData[j].name + `"></td>
            </tr>
        `);

        // Gets state's candidate delegate counts
        showDelegates(selectedState);

        // Event Listener for when a value is updated
        $("#perc-" + candidateData[j].index).on("change", function() {
            var val = this.value;
            var name = this.name;
            updateStateResults(val, name, selectedState, d3State);
            showDelegates(selectedState);
            //FIXME: Update color
        });

    }
});

// Calculates and updates HTML with candidate delegate count for states
var showDelegates = (function(selectedState) {
    // Calculate delegate count for current present percentages
    var delegates = calculateDelegates(selectedState);

    // Update HTML for candidate delegate counts
    $(".state-options-rows tr").children("td#addon-del").text("")
    $.each(delegates, function(index, val) {
        $(".state-options-rows tr").children('td[name="' + index + '"]').text(val + " delegates")
    });
})

// Updates State Data with modified results, including managing 100% total
var updateStateResults = (function(val, candidate, selectedState, d3State) {
    // Get available percentage points to assign a candidate
    var bucket = Math.round(10*(100 - getTotalAssignedPercentages(selectedState)))/10;

    // Get difference between old and new updated result
    var diff = parseFloat(val) - selectedState.results[0][candidate];

    // If diff is negative then points are added to bucket
    bucket -= diff
    bucket = Math.round(10*(bucket))/10;

    // Update HTML for available percentage Points
    $(".delegates-available").text("Available Percentage Points to Assign: " + bucket);

    // Update candidate result
    selectedState.results[0][candidate] = parseFloat(val);

    // Update max values for a input rows to include available percentages
    $.each(selectedState.results[0], function(key, value) {
        var max = Math.round(10*(value + bucket))/10;
        $('input[name="'+key+'"').attr('max', max);
    });

    // Update color of state to top candidate
    var topCandidate = getStateTopCandidate(candidate, selectedState);
    updateStateColor(topCandidate, selectedState, d3State);
});

// Updates State Data with results when clicked with candidate choice
var updateStateResultsByClick = (function(candidate, selectedState, d3State) {
    var selectedCandidateVal = selectedState.results[0][candidate];

    // Find candidate with greatest result in state
    var topCandidate = getStateTopCandidate(candidate, selectedState);
    var topCandidateVal = selectedState.results[0][topCandidate];

    // Update top candidate with selected candidates val
    updateStateResults(selectedCandidateVal, topCandidate, selectedState, d3State);
    // Update selected candidate with top val
    updateStateResults(topCandidateVal, candidate, selectedState, d3State);
});

// Gets current top candidate in state's results
var getStateTopCandidate = (function(candidate, selectedState) {
    var topCandidate = candidate;
    for (var c in selectedState.results[0]) {
        if (selectedState.results[0][c] > selectedState.results[0][topCandidate]) {
            topCandidate = c;
        }
    }
    return topCandidate;
});

// Resets Map Back to Default
var resetMap = (function() {
    svg.selectAll("*").style("fill", defaultColor);
    //FIXME: Change all state results back to default (from candidates[0].poll)
});

// Counts total spent percentage points in a state's results
var getTotalAssignedPercentages = (function(selectedState) {
    var result = 0;
    for (var key in selectedState.results[0]) {
        result += selectedState.results[0][key];
    }
    return result;
})

// Democratic delegate allocation calculation
var calculateDelegates = (function(selectedState) {
    var delegates = {};  // {name: delegates}
    var total = 0;      // total percentage over 15

    // Get results of candidates in selected state with >=15%
    for (var key in selectedState.results[0]) {
        if (selectedState.results[0][key] >= 15) {
            delegates[key] = selectedState.results[0][key];
            total += selectedState.results[0][key];
        }
    }

    var fractalRemainders = {};       // {name: fractal remainder delegates}
    var leftoverDelegates = selectedState.delegates;  // total delegates available

    // Retabulate percentages and calculate number of delegates
    for (var key in delegates) {
        x = (delegates[key]/total) * selectedState.delegates;
        delegates[key] = Math.floor(x);
        leftoverDelegates -= delegates[key];
        fractalRemainders[key] = x - delegates[key];
    }

    // Allocate extra delegates to max fractal remainders in decreasing order
    var keys = Object.keys(fractalRemainders);
    keys.sort(function(a,b) {           // Sort array of keys based on values
        return fractalRemainders[b] - fractalRemainders[a];
    })
    for (var k in keys) {
        if (leftoverDelegates > 0) {
            delegates[keys[k]] += 1;    // Allocate extra delegate to candidate
            leftoverDelegates -= 1;     // Remove 1 from the leftover delegates
        }
    }

    return delegates;
});

// Source: StackOverflow, by user Kaiido. Modified slightly
function rgba2hex(orig) {
    var isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    return '#' + hex;
}
