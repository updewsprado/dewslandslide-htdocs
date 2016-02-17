/**
 * @author PradoArturo
 */

function JSON2CSV(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

	var str = '';
	var line = '';

	if ($("#labels").is(':checked')) {
		var head = array[0];
		if ($("#quote").is(':checked')) {
			for (var index in array[0]) {
				var value = index + "";
				line += '"' + value.replace(/"/g, '""') + '",';
			}
		} else {
			for (var index in array[0]) {
				line += index + ',';
			}
		}

		line = line.slice(0, -1);
		str += line + '\r\n';
	}

	for (var i = 0; i < array.length; i++) {
		var line = '';

		if ($("#quote").is(':checked')) {
			for (var index in array[i]) {
				var value = array[i][index] + "";
				line += '"' + value.replace(/"/g, '""') + '",';
			}
		} else {
			for (var index in array[i]) {
				line += array[i][index] + ',';
			}
		}

		line = line.slice(0, -1);
		str += line + '\r\n';
	}
	return str;
	
}

// Set the dimensions of the canvas / graph
var cWidth = 0;
var cHeight = 0;

var margin = 0,
    width = 0,
    height = 0;

var graphDim = 0;
	
var labelHeight = 16;
var labelWidth = 130;
	
var graphCount = 0;
	
// Parse the xval / time
var parseDate = d3.time.format("%b %Y").parse;

var x, y, yOrd;

var yvalline;
var svg;

// Tip that displays node info
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
	var alert,status,id_ts,comment;
	
	if((parseFloat(d.xalert) > 0) || (parseFloat(d.yalert) > 0) || (parseFloat(d.zalert) > 0)) {
		alert = "<strong>Alerts:</strong> <span style='color:red'>" + Number((d.xalert).toFixed(3)) 
				+ ", " + Number((d.yalert).toFixed(3)) 
				+ ", " + Number((d.zalert).toFixed(3)) +"</span><Br/>";
	}
	else {
		alert = "";
	}
	
	if(typeof d.status === 'undefined'){
		status = "";
	}
	else {
		status = "<strong>Status:</strong> <span style='color:red'>" + d.status +"</span><Br/>";
	}
	
	if((d.date_of_identification === "0000-00-00") || (typeof d.date_of_identification === 'undefined')) {
		id_ts = "";
	}
	else {
		id_ts = "<strong>Date Discovered:</strong> <span style='color:red'>" + d.date_of_identification + "</span><Br/>";
	}
  
	if((d.comment == "NULL") || (typeof d.comment === 'undefined')) {
		comment = "";
	}
	else {
		comment = "<strong>Comment:</strong> <span style='color:red'>" + d.comment + "</span>";
	}  
  
    return id_ts 
		+ "<strong>Site:</strong> <span style='color:red'>" + d.site + "</span><Br/>"
		+ "<strong>Node ID:</strong> <span style='color:red'>" + d.node + "</span><Br/>"
		+ alert + status + comment;
  });

//initialize dimensions
function init_dims() {
	cWidth = document.getElementById('alert-canvas').offsetWidth;
	cHeight = document.getElementById('alert-canvas').offsetHeight;
	
	//var margin = {top: 70, right: 20, bottom: 70, left: 90},
	margin = {top: cHeight * 0, right: cWidth * 0.005, bottom: cHeight * 0.10, left: cWidth * 0.065};
	width = cWidth - margin.left - margin.right;
	height = cHeight - margin.top - margin.bottom;
	
	graphDim = {gWidth: width * 0.95, gHeight: height};	
	
	// Set the ranges
	x = d3.scale.linear().range([0, graphDim.gWidth]);
	y = d3.scale.linear().range([graphDim.gHeight, 0]);
	yOrd = d3.scale.ordinal()
					.rangeRoundBands([graphDim.gHeight, 0], .1);
					
	// Define the line
	yvalline = d3.svg.line()	
		//.interpolate("monotone")
	    .x(function(d) { return x(d.xval); })
	    .y(function(d) { return y(d.yval); });
	    
	// Adds the svg canvas
	svg = d3.select("#alert-canvas")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");
	
	svg.call(tip);	
}

// Define the axes
function make_x_axis() {        
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(40);
}

function make_x_axis2(tick) {        
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(tick);
}

function make_y_axis() {        
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);
}

function make_yOrd_axis() {        
    return d3.svg.axis()
        .scale(yOrd)
        .orient("left")
        .ticks(1);
}		  
			
function clearData() {
	graphCount = 0;
	svg.selectAll(".dot").remove();
	svg.selectAll(".dot1").remove();
	svg.selectAll(".dot2").remove();
	svg.selectAll(".line").remove();
	svg.selectAll(".legend").remove();
	svg.selectAll(".tick").remove();
	svg.selectAll(".axislabel").remove();
}

var siteMaxNodes = [];
var maxNode;
function getSiteMaxNodes(xOffset) {
	//url = "../temp/getSiteMaxNodes.php";
	url = "../d3graph/getSiteMaxNodes.php";
	d3.json(url, function(error, data) {
		siteMaxNodes = data;
		
		maxNode = d3.max(data, function(d) { return parseFloat(d.nodes); });
		
		// Scale the range of the data
		x.domain([1, d3.max(data, function(d) { return parseFloat(d.nodes) + 1; })]);
		yOrd.domain(data.map(function(d) { return d.site; }));
		
		var cellw = (graphDim.gWidth / maxNode) * 0.9;
		var cellh = yOrd.rangeBand(); //9;
		
		for (i = 0; i < siteMaxNodes.length; i++) { 
			//text += siteMaxNodes[i] + "<br>";
			
			for (j = 1; j <= siteMaxNodes[i].nodes; j++) { 
				svg.append("rect")
					.attr("class", "cell_default")
					.attr('x', function(){
						return x(j) + xOffset;
					})
					.attr('y', function(){
						return yOrd(siteMaxNodes[i].site);
					})
					.attr('width', cellw)
					.attr('height', cellh);
			}
		}
	});
}

var nodeStatuses = [];
function getNodeStatus(xOffset) {
	//url = "../temp/getNodeStatus.php";
	url = "../d3graph/getNodeStatus.php";
	d3.json(url, function(error, data) {
		nodeStatuses = data;
		
		var cellw = (graphDim.gWidth / maxNode) * 0.9;
		var cellh = yOrd.rangeBand();
			
		svg.selectAll(".triangle")
				.data(nodeStatuses)
			.enter().append("polygon")
				.attr("class", "triangle")
				.style("stroke", "none")  // colour the line
				.style("fill", function(d){
					if(d.status == "Not OK") {
						return "#EA0037";	//Red
					}
					else if(d.status == "Special Case") {
						return "#0A64A4";
					}
					else if(d.status == "Use with Caution") {
						return "#FFF500";
					}
				})     // remove any fill colour		
				.attr("points", function(d){
					var xStart = x(d.node) + xOffset;
					var yStart = yOrd(d.site);
					var xWidth = xStart + cellw * 0.6;
					var yHeight = yStart + cellh * 0.6;
					var points = xStart + "," + yStart + "," +
								xWidth + "," + yStart + "," +
								xStart + "," + yHeight + "";
					return points;
				})  // x,y points 
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);	
	});
}

var alertdata = [];
function generateAlertPlot(url, title, xOffset, isLegends, graphNum) {
	// Get the data
	var jsondata = [];
	getSiteMaxNodes(xOffset);
	
	var delay1 = 1000;//1 second
    setTimeout(function(){

		d3.json(url, function(error, data) {
			jsondata = data;
	
			data.forEach(function(d) {
				d.node = parseInt(d.node);
				d.xalert = parseFloat(d.xalert);
				d.yalert = parseFloat(d.yalert);
				d.zalert = parseFloat(d.zalert);
			});
			
			alertdata = data;
			
			var horOff = xOffset + ((graphDim.gWidth / maxNode) * 0.9)/2;
			
			/*
			// Add the X Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(" + horOff + "," + height + ")")
				.call(make_x_axis2(maxNode));
				
			
			// Graph Label
			svg.append("text")      // text label for the x axis
				.attr("class", "axislabel")
				.attr("x", xOffset + (graphDim.gWidth / 2))
				.attr("y", 0 -(margin.top/2))
				.text(title);	
					
			// X axis Label
			svg.append("text")      // text label for the x axis
				.attr("class", "axislabel")
				.attr("x", xOffset + (graphDim.gWidth / 2))
				.attr("y", height + (margin.bottom/2) + 5)
				.text("Nodes");
			*/	
				
			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + xOffset + ",0)")
				.call(make_yOrd_axis());
	
			/*
			// Y axis Label
			svg.append("text")		// text label for the y axis
				.attr("class", "axislabel")
				.attr("transform", "rotate(-90)")
				.attr("y", xOffset -5 - (margin.left / 2))
				.attr("x", 0 - (height / 2))
				.text("Column/Site");		
			*/	
				
			var cellw = (graphDim.gWidth / maxNode) * 0.9;
			var cellh = yOrd.rangeBand(); //9;
	
			svg.selectAll(".cell")
					.data(data)
				.enter().append("rect")
					.attr("class", "cell")
					.attr('x', function(d){
						return x(d.node) + xOffset;
					})
					.attr('y', function(d){
						return yOrd(d.site);
					})
					.attr('fill', function(d){
						var xdata, ydata, zdata;
					
						if((d.xalert > 0) || (d.yalert > 0) || (d.zalert > 0)) {
							if(d.xalert > 0)
								xdata = 1;
							else
								xdata = 0;
								
							if(d.yalert > 0)
								ydata = 1;
							else
								ydata = 0;
								
							if(d.zalert > 0)
								zdata = 1;
							else
								zdata = 0;
						
							var r = 85 * (xdata + ydata + zdata);
							var b = 255 - (xdata + ydata + zdata) * 80;					
							return color = d3.rgb(r, 174, b);
						}
						else {
							return color = d3.rgb(3, 137, 156);
						}
					})
					.attr('width', cellw)
					.attr('height', cellh)
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);		
	
			// Add the Legend
			if(isLegends){
				for (i = 0; i <= 3; i++) { 
					var desc;
					
					if (i <= 1) {
						desc = i + " axis alert";
					}
					else {
						desc = i + " axes alerts";
					}
		
					svg.append("rect")
						.attr("class", "cell")
						.attr("x", i*(labelWidth))
						.attr("y", graphDim.gHeight + cellh * 0.25)
						.attr("transform", "translate(" + xOffset + ",0)")
						.attr('width', cellw)
						.attr('height', cellh)
						.style("fill", function() { // Add the colours dynamically
							if(i > 0) {
								var r = 85 * i;
								var b = 255 - i * 80;							
								return color = d3.rgb(r, 174, b);
							}
							else {
								return color = d3.rgb(3, 137, 156);
							}
						});
		
					svg.append("text")
						.attr("class", "legend")    // style the legend
						.attr("x", i*(labelWidth) + cellw * 1.5)
						.attr("y", graphDim.gHeight + cellh * 1.25)
						.attr("transform", "translate(" + xOffset + ",0)")
						.style("fill", function() { // Add the colours dynamically
							if(i > 0) {
								var r = 85 * i;
								var b = 255 - i * 80;							
								return color = d3.rgb(r, 174, b);
							}
							else {
								return color = d3.rgb(3, 137, 156);
							}
						})
						.text(desc); 
				}
				
				//Status Triangles
				var jctr = 0;
				for (i = jctr; i <= jctr + 2; i++) { 
					var desc, color;
					
					if (i == jctr) {
						desc = "Use with Caution";	//Yellow
						color = "#FFF500";
					}
					else if (i == jctr + 1) {
						desc = "Not OK";	//Red
						color = "#EA0037";
					}
					else if (i == jctr + 2) {
						desc = "Special Case";	//Blue
						color = "#0A64A4";
					}
					
					svg.append("polygon")
						.attr("class", "triangle")
						.style("stroke", "none")  // colour the line
						.style("fill", color)
						.attr("transform", "translate(" + xOffset + ",0)")
						.attr("points", function() {
							var xStart = i*(labelWidth)*1.5;
							var yStart = graphDim.gHeight + cellh * 1.5;
							var xWidth = xStart + cellw * 0.6;
							var yHeight = yStart + cellh * 0.6;
							var points = xStart + "," + yStart + "," +
										xWidth + "," + yStart + "," +
										xStart + "," + yHeight + "";
							return points;
						});
						
					svg.append("text")
						.attr("class", "legend")    // style the legend
						.attr("x", i*(labelWidth)*1.5 + cellw * 1.5)  // space legend
						.attr("y", graphDim.gHeight + cellh * 2.5)
						.attr("transform", "translate(" + xOffset + ",0)")
						.style("fill", color)
						.text(desc); 					
				}
			}				
		});
	
    },delay1); 
	
	var delay2 = 2000;//3 seconds
    setTimeout(function(){
		//Draw the node status symbol
		getNodeStatus(xOffset);	
	},delay2); 
}
		
function showData() {
	//generateAlertPlot("../temp/getAlert.php", "Accelerometer Movement Alert Map", 0, true, 1);
	generateAlertPlot("../d3graph/getAlert.php", "Accelerometer Movement Alert Map", 0, true, 1);
}

function initAlertPlot() {
	init_dims();
	showData();
}

//window.onload = initPosPlot();









