
var nodeAlertJSON = 0;
var nodeStatusJSON = 0;
var maxNodesJSON = 0;
var alert_legend_active = 0;

// Set the dimensions of the canvas / graph
var cWidth = 0;
var cHeight = 0;

var margin = 0,
    width = 0,
    height = 0;

var graphDim = 0;
	
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
		alert = "<strong>Alerts:</strong> <span style='color:red'>" + 
		Number((d.xalert).toFixed(3)) + ", " + Number((d.yalert).toFixed(3)) + 
		", " + Number((d.zalert).toFixed(3)) +"</span><Br/>";
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
  
    return id_ts +
		"<strong>Site:</strong> <span style='color:#33cc33'>" + d.site + "</span><Br/>" +
		"<strong>Node ID:</strong> <span style='color:#ff9933'>" + d.node + "</span><Br/>" +
		alert + status + 
		"<strong>Flagger:</strong> <span style='color:red'>" + d.flagger + "</span><Br/>" +
		comment;
  });

//initialize dimensions
function init_dims() {
	cWidth = document.getElementById('alert-canvas').clientWidth - 10 ;
	cHeight = document.getElementById('alert-canvas').offsetHeight -20;
	
	//var margin = {top: 70, right: 20, bottom: 70, left: 90},
	margin = {top: cHeight * 0.001, right: cWidth * 0.01, bottom: cHeight* 0.50- cWidth , left: cWidth * 0.07};
	width = cWidth - margin.left - margin.right;
	height = cHeight - margin.top - margin.bottom;
	
	graphDim = {gWidth: width , gHeight: cHeight};		
	
	// Set the ranges
	x = d3.scale.linear().range([0, graphDim.gWidth]);
	y = d3.scale.linear().range([graphDim.gHeight, 0]);
	yOrd = d3.scale.ordinal()
					.rangeRoundBands([graphDim.gHeight, 0], 0.1);
					
	// Define the line
	yvalline = d3.svg.line()	
		//.interpolate("monotone")
	    .x(function(d) { return x(d.xval); })
	    .y(function(d) { return y(d.yval); });
	    
	// Adds the svg canvas
	svg = d3.select("#alert-canvas").append("svg")
			.attr("id", "svg-alert")
	        .attr("width", cWidth + 10)
	        .attr("height",  margin.left +margin.right +height+margin.bottom+5 )
			.append("g")
	        .attr("transform", 
	              "translate(" +  margin.left+ "," + margin.top + ")");
				  
	svg.call(tip);	
 
}

// Define the axes
/*
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
}*/

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
	svg2.selectAll(".legend").remove(); 
	svg.selectAll(".tick").remove();
	svg.selectAll(".axislabel").remove();
}

var siteMaxNodes = [];
var maxNode;

var tester = [];

function getSiteMaxNodes(xOffset) {
	var data = maxNodesJSON.slice();
	
	siteMaxNodes = data;
	
	//add node links to nodes with normal status
	var urlBase = "http://" + window.location.hostname + "/";
	var urlNodeExt = "data_analysis/node/";	
	var start = moment().subtract(7, 'days').format('YYYY-MM-DD'); 
	var end = moment().add(1, 'days').format('YYYY-MM-DD');
	
	maxNode = d3.max(siteMaxNodes, function(d) { return parseFloat(d.nodes); });
	
	// Scale the range of the data
	x.domain([1, d3.max(siteMaxNodes, function(d) { return parseFloat(d.nodes) + 1; })]);
	yOrd.domain(siteMaxNodes.map(function(d) { return d.site; }));
	
	var cellw = (graphDim.gWidth / maxNode) * 0.9;
	var cellh = yOrd.rangeBand(); //9;
	
	for (var i = 0; i < siteMaxNodes.length; i++) {
		
		for (var j = 1; j <= siteMaxNodes[i].nodes; j++) {
			tester.push(
				{site: siteMaxNodes[i].site, node: j }
			);
		}
	}
	
	svg.selectAll(".cell_default")
		.data(tester)
	.enter().append("rect")
		.attr("class", "cell_default")
		.attr('x', function(d){
			return x(d.node) + xOffset;
		})
		.attr('y', function(d){
			return yOrd(d.site);
		})
		.attr('width', cellw)
		.attr('height', cellh)
		.style("cursor", "pointer")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.on("click", function(d){
	        document.location.href =urlBase+urlNodeExt+d.site+'/'+d.node+'/'+start+'/'+end;
	    });	
	
}

var nodeStatuses = [];
function getNodeStatus(xOffset) {
	//url = "../temp/getNodeStatus.php";
	//url = "../d3graph/getNodeStatus.php";
	
	//d3.json(url, function(error, data) {
		var data = nodeStatusJSON.slice();
		
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
					var xStart = x(d.node) + xOffset +1;
					var yStart = yOrd(d.site);
					var xWidth = xStart + cellw * 1;
					var yHeight = yStart + cellh * 1;
					if(yStart == undefined){
						 yStart = 0;
					}else{
						 yStart = yOrd(d.site);
					}

					if(yHeight== NaN){
						 yHeight = 0;
					}else{
						 yHeight = yStart + cellh * 1;
					}
					var points = xStart + "," + yStart + "," +
								xWidth + "," + yStart + "," +
								xStart + "," + yHeight + "";
					return points;
				})  // x,y points 
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);	
	//});
}

var alertdata = [];
function generateAlertPlot(url, title, xOffset, isLegends, graphNum) {
	// Get the data
	var jsondata = [];
	getSiteMaxNodes(xOffset);
	
	var delay1 = 1000;//1 second

			var data = url.slice();
			
			jsondata = data;
	
			data.forEach(function(d) {
				d.node = parseInt(d.node);
				d.xalert = parseFloat(d.xalert);
				d.yalert = parseFloat(d.yalert);
				d.zalert = parseFloat(d.zalert);
			});
			
			alertdata = data;
			
			var horOff = xOffset + ((graphDim.gWidth / maxNode) * 0.9)/2;
				
			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + xOffset + ",0)")
				.call(make_yOrd_axis());
	
			var textMOver = function() {
				var text = d3.select(this);
				//text.attr("color", "steelblue" );
				text.attr("text-transform", "uppercase" );
			};
 
			var textMOut = function() {
				var text = d3.select(this);
				//text.attr("color", "black" );
				text.attr("text-transform", "lowercase" );
			};
	
			// Add hyperlinks to Y Axis ticks
			var urlBase = "http://" + window.location.hostname + "/";
			var urlExt = "data_analysis/site/";	
			var urlNodeExt = "data_analysis/node/";		
			var start = moment().subtract(7, 'days').format('YYYY-MM-DD'); 
			var end = moment().add(1, 'days').format('YYYY-MM-DD');

			d3.selectAll("text")
			    .filter(function(d){ return typeof(d) == "string"; })
			    .style("cursor", "pointer")
			    .on('mouseover', textMOver)
				.on('mouseout', textMOut)
			    .on("click", function(d){
			        document.location.href = urlBase + urlExt + d;
			    });
				
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
						var xdata, ydata, zdata, color;
					
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
							color = d3.rgb(r, 174, b);
							return color;
						}
						else {
							color = d3.rgb(3, 137, 156);
							return color;
						}
					})
					.attr('width', cellw)
					.attr('height', cellh)
					.style("cursor", "pointer")
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide)
					.on("click", function(d){
				        document.location.href = urlBase+urlNodeExt+d.site+'/'+d.node+'/'+start+'/'+end;
				    });	
	
			// Add the Legend
/*			if(isLegends){
				for (i = 0; i <= 3; i++) { 
					var desc;
					
					if (i <= 1) {
						desc = i + " axis alert";
					}
					else {
						desc = i + " axes alerts";
					}
		
					svg2.append("rect")
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
		
					svg2.append("text")
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
					
					svg2.append("polygon")
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
						
					svg2.append("text")
						.attr("class", "legend")    // style the legend
						.attr("x", i*(labelWidth)*1.5 + cellw * 1.5)  // space legend
						.attr("y", graphDim.gHeight + cellh * 2.5)
						.attr("transform", "translate(" + xOffset + ",0)")
						.style("fill", color)
						.text(desc); 					
				}
			}		*/		
	
	//Draw the node status symbol
	getNodeStatus(xOffset);	

}
/*
	d3.select(window).on("resize", resize2);

	function resize2() {
		
		cWidth = document.getElementById('alert-canvas').clientWidth;
		cHeight = document.getElementById('alert-canvas').clientHeight;
		
		width = cWidth - margin.left - margin.right;
		height = cHeight - margin.top - margin.bottom;
		
		graphDim = {gWidth: width * 0.95, gHeight: height};	
		
		// Set the ranges
		x = d3.scale.linear().range([0, graphDim.gWidth]);
		y = d3.scale.linear().range([graphDim.gHeight, 0]);
		yOrd = d3.scale.ordinal()
						.rangeRoundBands([graphDim.gHeight, 0], .1);
						
		d3.select("#alertcanvas")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
				
		yvalline.x(function(d) { return x(d.xval); })
				.y(function(d) { return y(d.yval); });	
		
		make_yOrd_axis();
		
		maxNode = d3.max(siteMaxNodes, function(d) { return parseFloat(d.nodes); });
	
		var cellw = (graphDim.gWidth / maxNode) * 0.9;
		var cellh = yOrd.rangeBand(); //9;
		
		svg.selectAll("rect")
			.attr('width', cellw)
			.attr('height', cellh);
			
		svg.selectAll("polygon")
			.attr("points", function(d){
					var xStart = x(d.node);
					var yStart = yOrd(d.site);
					var xWidth = xStart + cellw * 0.6;
					var yHeight = yStart + cellh * 0.6;
					var points = xStart + "," + yStart + "," +
								xWidth + "," + yStart + "," +
								xStart + "," + yHeight + "";
					return points;
				});
	}*/
	
function showData() {
	//generateAlertPlot("../temp/getAlert.php", "Accelerometer Movement Alert Map", 0, true, 1);
	//generateAlertPlot("../d3graph/getAlert.php", "Accelerometer Movement Alert Map", 0, true, 1);
	generateAlertPlot(nodeAlertJSON, "Accelerometer Movement Alert Map", 0, true, 1);
}

function initAlertPlot() {
	init_dims();
	showData();
}

function alertLegends(frm) {

	var alert_target = document.getElementById('alertLegend');
	var alert_target2 = document.getElementById('alertcanvaslegend');
	
	if(alert_legend_active === 0)
	{
		alert_legend_active = 1;
		alert_target.value = "Hide Legends";
		alert_target2.style.display = "block";
		alert_target2.style.visibility = "visible";
		alert_target2.style.position = "absolute";
		alert_target2.style.zIndex = 1;
		alert_target2.style.backgroundColor = "black";
		alert_target2.style.borderStyle = "solid";
		alert_target2.style.borderWidth = "thin";
		alert_target2.style.paddingLeft = "5px";
		alert_target2.style.paddingTop = "5px";
		alert_target2.style.paddingRight = "5px";
		alert_target2.style.left = (alert_target.offsetLeft - alert_target.scrollLeft + alert_target.clientLeft) + 'px';
		alert_target2.style.top = (alert_target.offsetTop - alert_target.scrollTop + alert_target.clientTop - 110) + 'px';
	}
	else
	{
		alert_legend_active = 0;
		alert_target.value = "Show Legends";
		alert_target2.style.display = "none";
		alert_target2.style.visibility = "hidden";
	}
}










