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
var colors = d3.scale.category10()

function draw(sheet) {
    var data = sheet.data;
    var index = sheet.index;
    var cols = sheet.cols;

    // Find out size
    var w = parseInt(svgElem.style("width")) - margin.left - margin.right
    var h = parseInt(svgElem.style("height")) - margin.top - margin.bottom
    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Calculate size for each graph
    graphPos.rangeRoundBands([0, h], 0.2)
        .domain(cols)

    // Set ranges of scales
    x.range([0, w])
        .domain(d3.extent(data, function(d) { return d[index] }))
    y.range([graphPos.rangeBand(), 0])
    line.x(function(d) { return x(d[index]) })

    // Graphs
    var graphs = svg.selectAll(".subgraph")
        .data(cols)

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

    graphEnter.append("text")
        .attr("class", "last")
        .attr("fill", function(d) { return colors(d) })
        .attr("x", 3)
        .attr("dy", ".35em")

    //Graphs update
    graphs.attr("transform", function(d) { return "translate(0," + graphPos(d) + ")"})
        .each(function(col, i) {
            var g = d3.select(this)
            var defined = data.filter(function(d) { return !isNaN(d[col]) })
            y.domain(y_domain(defined, col))
            g.select(".axis")
                .call(yAxis)

            line.y(function(d) { return y(d[col])})

            g.select(".line")
                .attr("d", line(defined))

            var last = defined[defined.length - 1]
            g.select(".last")
                .attr("transform", "translate(" + x(last[index]) + "," + y(last[col]) + ")")
                .text(last[col])
        })
}

function y_domain(data, col) {
    var extent = d3.extent(data, function(d) { return d[col]})
    if(extent[0] == extent[1]) {
       extent[1] += 1; 
    }
    return extent
}
