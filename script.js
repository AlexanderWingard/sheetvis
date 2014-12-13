// Data info
//var url = 'https://docs.google.com/spreadsheet/pub?key=0AkoRtgTW4zn8dE42SWZnTVlqN0Z3U0JnZ1lVZTgtQnc&single=true&gid=0&output=csv'
var url = 'https://docs.google.com/spreadsheet/pub?key=0AkoRtgTW4zn8dFhhZ2JQenJGb1kwWFNCMHNyeUhZWEE&single=true&gid=0&output=csv'

var dateCol = "Date"
var dataCols = ["kH", "Ca", "Mg"]
var data = []

// D3 setup
var margin = {top: 20, right: 80, bottom: 30, left: 50}
var svgElem = d3.select("body")
    .append("svg")
    .attr("id", "graph")
var svg = svgElem.append("g")

// Scales
var x = d3.time.scale()
var y = d3.scale.linear()
var yAxis = d3.svg.axis().scale(y).ticks(4).orient("left")
var graphPos = d3.scale.ordinal()

var line = d3.svg.line()
    .x(function(d) { return x(d[dateCol]); })

var colors = d3.scale.category10()

d3.csv(url, function(d) {
    for(var key in d) {
        if(key.toUpperCase() == "DATE") {
            d[key] = new Date(d[key])
        } else if (key.toUpperCase() != "COMMENT") {
            d[key] = parseFloat(d[key])
        }
    }
    return d
}, function(error, d){
    data = d
    draw(data)
})

d3.select(window).on('resize', function() { draw(data) })

function draw(data) {
    // Find out size
    var w = parseInt(svgElem.style("width")) - margin.left - margin.right
    var h = parseInt(svgElem.style("height")) - margin.top - margin.bottom
    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Calculate size for each graph
    graphPos.rangeRoundBands([0, h], 0.2)
        .domain(dataCols)

    // Set ranges of scales
    x.range([0, w])
        .domain(d3.extent(data, function(d) { return d[dateCol] }))
    y.range([graphPos.rangeBand(), 0])

    // Graphs
    var graphs = svg.selectAll(".subgraph")
        .data(dataCols)

    // Graphs enter
    var graphEnter = graphs.enter()
        .append("g")
        .attr("class", "subgraph")

    graphEnter.append("g")
        .attr("class", "y axis")
        .attr("fill", function(d) { return colors(d)})

    graphEnter.append("path")
        .attr("class", "line")
        .attr("stroke", function(d) { return colors(d)})

    //Graphs update
    graphs.attr("transform", function(d) { return "translate(0," + graphPos(d) + ")"})
        .each(function(col, i) {
            var g = d3.select(this)
            var defined = data.filter(function(d) { return !isNaN(d[col]) })
            y.domain(d3.extent(defined, function(d) { return d[col]}))
            g.select(".axis")
                .call(yAxis)

            line.y(function(d) { return y(d[col])})

            g.select(".line")
                .attr("d", line(defined))
        })
}
