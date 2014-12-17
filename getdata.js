sheet = {data : [], index : "", cols : [], comments : []}

if(window.location.hash.length < 2) {
    display_error("No key specified")
} else {
    var key = window.location.hash.slice(1)
    var url = "http://dev.axw.se/gdocs/" + key
    d3.csv(url, function(error, csv){
        if(error) {
            display_error("Could not get data from " + url)
            return
        } else if (csv.length == 0) {
            display_error("Could not fetch any rows")
            return
        }
        parse_sheet(csv);
        draw(sheet)
    })
}

function parse_sheet(csv) {
    // Find index col
    var index;
    var first = csv[0];
    for (var key in first) {
        if(/[-\/\\:]+/.test(first[key]) && !isNaN(Date.parse(first[key]))) {
            index = key
        }
    }
    if (index === undefined) {
        display_error("Could not find any date column")
        return
    }

    // Convert strings and list columns
    var colset =  {}
    var comments = []
    csv.forEach(function(d) {
        d[index] = new Date(d[index])
        for(var key in d) {
            if (key !== index) {
                if(/^\s*[0-9\.,\+\-]+\s*$/gm.test(d[key])) {
                    colset[key] = true
                    d[key] = parseFloat(d[key])
                } else {
                    if(d[key].length > 0) {
                        comments.push({index: d[index], value: d[key]})
                    }
                    d[key] = NaN
                }
            }
        }
    })

    // Remove empty columns
    for(var col in colset) {
        if(csv.every(function(row) { return isNaN(row[col]) })) {
            delete colset[col];
        }
    }
    // Sort data
    csv.sort(function(a,b) {return a[index].getTime() - b[index].getTime()})
    comments.sort(function(a,b) {return b.index.getTime() - a.index.getTime()})

    // Create sheet
    sheet = {data : csv, index : index, cols : Object.keys(colset), comments: comments}
}

function display_error(error) {
    alert(error);
}

d3.select(window).on('resize', function() { draw(sheet) })
