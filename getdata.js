var sheet = {data : [], index : "", cols : []}

if(window.location.hash.length < 2) {
    display_error("No key specified")
} else {
    var key = window.location.hash.slice(1)
    var url = "http://dev.axw.se/gdocs/" + key
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
        if(error) {
            display_error("Could not get data from " + url)
        } else {
            var index = "Date"
            var cols = ["kH", "Ca", "Mg"]
            var data = d.sort(function(a,b) {return a[index].getTime() - b[index].getTime()})
            sheet = {data : data, index : index, cols : cols}
            draw(sheet)
        }
    })
}

function display_error(error) {
    alert(error);
}

d3.select(window).on('resize', function() { draw(sheet) })
