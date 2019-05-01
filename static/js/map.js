let defaultColor;
let stateName;
const svg = d3.select("svg");
const path = d3.geoPath();

// US Map Generation with D3
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;

    const data = topojson.feature(us, us.objects.states).features;
    const names = {};

    // Collect state names for ids in us.json from us-state-names.tsv
    const stateNamesTSV = "https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/us-state-names.tsv"
    d3.tsv(stateNamesTSV , function(tsv) {
        tsv.forEach(function(d, i) {
            let key = d.id;
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
function selectState () {
    // Get selected candidate name
    const candidateName = d3.select("input[name='candidate']:checked").property("value");
    console.log(candidateName)
    console.log(stateName)

    // If user selected state with candidate chosen
    if (candidateName !== "Custom") {
        // Update state color depending on candidate
        updateStateColorByClick(candidateName, d3.select(this));

        // Selected State Options HTML
        for (let i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // Update State Data results with chosen color candidate as first
                updateStateResultsByClick(candidateName, stateData[i], d3.select(this));
                // Display state description and candidate results
                showStateResults(stateData[i], d3.select(this), true);
                break;
            }
        }
    // Else, user selected state with Custom
    } else {
        // Selected State Options HTML
        for (let i = 0; i < stateData.length; i++) {
            if (stateData[i].name === stateName) {
                // State description and candidate results
                showStateResults(stateData[i], d3.select(this), false);
                break;
            }
        }

    }
}

// Updates US Map SVG State to appropriate color based on candidate chosen
function updateStateColorByClick(candidateName, d3State) {
    // Get current color of selected state, converted to hex
    const currentColor =  rgba2hex(d3State.style('fill'));

    // Get candidates color
    let candidateColor = defaultColor;
    for (let i = 0; i < candidateData.length; ++i) {
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
}

// Updates US Map SVG State to appropriate color based on candidate
function updateStateColor(candidateName, selectedState, d3State) {
    // Get candidates color
    let candidateColor = defaultColor;
    for (let i = 0; i < candidateData.length; ++i) {
        if (candidateData[i].name === candidateName) {
            candidateColor = candidateData[i].color;
        }
    }

    // Update color of selected state too apropriate candidates color
    d3State.style("fill", candidateColor);
}

// Update HTML for State Options that contains State description and results
function showStateResults(selectedState, d3State, appendDelegatesFlag) {
    // Get Total Percentage points available to be assigned in state Results
    const availablePercPoints = Math.round(10*(100 - getTotalAssignedPercentages(selectedState)))/10;

    const year = selectedState.date.substring(0,4);
    const month = selectedState.date.substring(5,7);
    const day = selectedState.date.substring(8);
    // State description
    $("#state-options-info").text(stateName + " • " + selectedState.type
        + " • " + selectedState.delegates + " Delegates • " + month + "/" + day + "/" + year);

    // Available Percentage Points to be Assigned
    $(".delegates-available").text("Available Percentage Points: " + availablePercPoints)

    // State candidate results
    $(".state-options-rows").html('');
    for (let j = 0; j < candidateData.length; j++) {
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
        showDelegates(selectedState, appendDelegatesFlag);

        // Event Listener for when a value is updated
        $("#perc-" + candidateData[j].index).on("change", function() {
            updateStateResults(this.value, this.name, selectedState, d3State);
            // showDelegates has appendDelegatesFlag=true so delegate count is officially counted nationally
            showDelegates(selectedState, true);
        });
    }
}

// Calculates and updates HTML with candidate delegate count for states
function showDelegates(selectedState, appendDelegatesFlag) {
    // Calculate delegate count for current present percentages
    const delegates = calculateDelegates(selectedState, appendDelegatesFlag);

    // Update HTML for candidate delegate counts
    $(".state-options-rows tr").children("td#addon-del").text("")
    $.each(delegates, function(index, val) {
        $(".state-options-rows tr").children('td[name="' + index + '"]').text(val + " delegates")
    });
}

// Updates State Data with modified results, including managing 100% total
function updateStateResults(val, candidate, selectedState, d3State) {
    // Get available percentage points to assign a candidate
    let bucket = Math.round(10*(100 - getTotalAssignedPercentages(selectedState)))/10;

    // Get difference between old and new updated result
    const diff = parseFloat(val) - selectedState.results[0][candidate];

    // If diff is negative then points are added to bucket
    bucket -= diff
    bucket = Math.round(10*(bucket))/10;

    // Update HTML for available percentage Points
    $(".delegates-available").text("Available Percentage Points to Assign: " + bucket);

    // Update candidate result
    selectedState.results[0][candidate] = parseFloat(val);

    // Update max values for a input rows to include available percentages
    $.each(selectedState.results[0], function(key, value) {
        let max = Math.round(10*(value + bucket))/10;
        $('input[name="'+key+'"').attr('max', max);
    });

    // Update color of state to top candidate
    const topCandidate = getStateTopCandidate(candidate, selectedState);
    updateStateColor(topCandidate, selectedState, d3State);
}

// Updates State Data with results when clicked with candidate choice
function updateStateResultsByClick(candidate, selectedState, d3State) {
    const selectedCandidateVal = selectedState.results[0][candidate];

    // Find candidate with greatest result in state
    const topCandidate = getStateTopCandidate(candidate, selectedState);
    const topCandidateVal = selectedState.results[0][topCandidate];

    // Update top candidate with selected candidates val
    updateStateResults(selectedCandidateVal, topCandidate, selectedState, d3State);
    // Update selected candidate with top val
    updateStateResults(topCandidateVal, candidate, selectedState, d3State);
}

// Gets current top candidate in state's results
function getStateTopCandidate(candidate, selectedState) {
    let topCandidate = candidate;
    for (let c in selectedState.results[0]) {
        if (selectedState.results[0][c] > selectedState.results[0][topCandidate]) {
            topCandidate = c;
        }
    }
    return topCandidate;
}

// Resets Map Back to Default
function resetMap() {
    // Cleans map of color
    svg.selectAll("path").style("fill", defaultColor);  //FIXME: Map glitches when reset
    // Clear results that holds delegates, clears pie chart data
    for (let s in stateData) {
        stateData[s].results.splice(1);
    }
}

// Counts total spent percentage points in a state's results
function getTotalAssignedPercentages(selectedState) {
    let result = 0;
    for (let key in selectedState.results[0]) {
        result += selectedState.results[0][key];
    }
    return result;
}

// Democratic delegate allocation calculation
function calculateDelegates(selectedState, appendDelegatesFlag) {
    const delegates = {};  // {name: delegates}
    let total = 0;      // total percentage over 15

    // Get results of candidates in selected state with >=15%
    for (let key in selectedState.results[0]) {
        if (selectedState.results[0][key] >= 15) {
            delegates[key] = selectedState.results[0][key];
            total += selectedState.results[0][key];
        }
    }

    const fractalRemainders = {};       // {name: fractal remainder delegates}
    let leftoverDelegates = selectedState.delegates;  // total delegates available

    // Retabulate percentages and calculate number of delegates
    for (let key in delegates) {
        let x = (delegates[key]/total) * selectedState.delegates;
        delegates[key] = Math.floor(x);
        leftoverDelegates -= delegates[key];
        fractalRemainders[key] = x - delegates[key];
    }

    // Allocate extra delegates to max fractal remainders in decreasing order
    let keys = Object.keys(fractalRemainders);
    keys.sort(function(a,b) {           // Sort array of keys based on values
        return fractalRemainders[b] - fractalRemainders[a];
    })
    for (let k in keys) {
        if (leftoverDelegates > 0) {
            delegates[keys[k]] += 1;    // Allocate extra delegate to candidate
            leftoverDelegates -= 1;     // Remove 1 from the leftover delegates
        }
    }

    // If flag true, adds state delegates to stateData officially for national count
    // Flag is true when a state is colored in, otherwise don't consider results official
    if (appendDelegatesFlag) {
        addDelegatesOfficially(selectedState, delegates);
    }

    return delegates;
}

// Adds delegates calculated in state to stateData to be officially a part of national count
function addDelegatesOfficially(selectedState, delegates) {
    selectedState.results[1] = delegates;
}

// Modified from Source: StackOverflow, by user Kaiido.
function rgba2hex(orig) {
    let rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    return '#' + hex;
}

// OnClick refresh map button
$(document).ready(function() {
    $("#reset-map").on("click", resetMap);
});
