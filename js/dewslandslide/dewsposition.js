/**
 * @author PradoArturo
 */

var prevIntvl = -1;
var prevSite = -1;

var positionPlot = new function() {
    this.cWidth = 0;
    this.cHeight = 0;

	this.margin = 0;
	this.width = 0;
	this.height = 0;
	
	this.graphDim = 0;
	
	this.labelHeight = 16;
		
	this.graphCount = 0;
		
	// Parse the xval / time
	this.parseDate = d3.time.format("%b %Y").parse;
	
	this.x, this.y;
	
	this.yvalline;
	this.svg;
	
	this.init_dims = function() {
		// Set the dimensions of the canvas / graph
		this.cWidth = document.getElementById('position-canvas').offsetWidth;
		this.cHeight = document.getElementById('position-canvas').offsetHeight;
		
		this.margin = {top: 70, right: 20, bottom: 70, left: 50},
		this.width = this.cWidth - this.margin.left - this.margin.right,
		this.height = this.cHeight - this.margin.top - this.margin.bottom;
		
		this.graphDim = {gWidth: this.width * 0.4, gHeight: this.height};	
		
		// Set the ranges
		this.x = d3.scale.linear().range([0, this.graphDim.gWidth]);
		this.y = d3.scale.linear().range([this.graphDim.gHeight, 0]);
		
		// Define the line
		this.yvalline = d3.svg.line()	
			//.interpolate("monotone")
		    .x(function(d) { return this.x(d.xval); })
		    .y(function(d) { return this.y(d.yval); });
		    
		// Adds the svg canvas
		this.svg = d3.select("#position-canvas")
		    .append("svg")
		        .attr("width", this.width + this.margin.left + this.margin.right)
		        .attr("height", this.height + this.margin.top + this.margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + this.margin.left + "," + this.margin.top + ")");
		
		this.svg.call(this.tip);		
    };
    
    // Define the axes
	this.make_x_axis = function () {        
	    return d3.svg.axis()
	        .scale(this.x)
	        .orient("bottom")
	        .ticks(5);
	};
	
	this.make_y_axis = function () {        
	    return d3.svg.axis()
	        .scale(this.y)
	        .orient("left")
	        .ticks(5);
	};

	// Tip that displays node info
	this.tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<strong>Date:</strong> <span style='color:red'>" + d.date + "</span><Br/>"
			+ "<strong>Node ID:</strong> <span style='color:red'>" + d.node + "</span><Br/>"
			+ "<strong>X:</strong> <span style='color:red'>" + d.xval + " m</span>"
			+ "<strong>Y:</strong> <span style='color:red'>" + d.yval + " m</span>";
	  });		  
				
	this.clearData = function () {
		this.graphCount = 0;
		this.svg.selectAll(".dot").remove();
		this.svg.selectAll(".dot1").remove();
		this.svg.selectAll(".dot2").remove();
		this.svg.selectAll(".line").remove();
		this.svg.selectAll(".legend").remove();
		this.svg.selectAll(".tick").remove();
		this.svg.selectAll(".axislabel").remove();
	};
	
	// Get the data
	this.jsondata = [];
	this.generatePlotData = function (url, title, xOffset, isLegends, graphNum) {		
		d3.json(url, function(error, data) {
			this.jsondata = data;
		});
	};	

	this.showData = function (frm) {
		// Clear the canvas area first
		this.clearData();
	
		// Generate the XY Graph
		//urlXY = "temp/getPosPlot.php?site=" + frm.sites1.value + "&interval=" + frm.interval.value;
		urlXY = "d3graph/getPosPlot.php?site=" + frm.sites1.value + "&interval=" + frm.interval.value;
		titleXY = frm.sites1.value + " XY Column Position";
		this.generatePlotData(urlXY, titleXY, 0, true, 1);
		
		// Generate the XZ Graph
		//urlXZ = "temp/getPosPlot.php?xz&site=" + frm.sites1.value + "&interval=" + frm.interval.value;
		urlXZ = "d3graph/getPosPlot.php?xz&site=" + frm.sites1.value + "&interval=" + frm.interval.value;
		titleXZ = frm.sites1.value + " XZ Column Position";
		this.generatePlotData(urlXZ, titleXZ, this.width * 0.6, false, 2);
	};
	
	this.options = ["blcb", "blct", "bolb", "gamb", "gamt",
					"humb", "humt", "labb", "labt", "lipb",
					"lipt", "mamb", "mamt", "oslb", "oslt",
					"plab", "plat", "pugb", "pugt", "sinb",
					"sinu"];
	
	this.popDropDown = function () {
		var select = document.getElementById('selectPositionSite');
		var i;
		for (i = 0; i < this.options.length; i++) {
			var opt = this.options[i];
			var el = document.createElement("option");
			el.textContent = opt;
			el.value = opt;
			select.appendChild(el);
		}
	};
	
	this.showAlert = function () {
		alert("Hello! I am an alert box!!");
	};
	
};

// Get the data
jsondata = [];
function generatePlotData (url, title, xOffset, isLegends, graphNum) {		
	d3.json(url, function(error, data) {
		positionPlot.jsondata = data;

		data.forEach(function(d) {
			d.xval = parseFloat(d.xval);
			d.yval = parseFloat(d.yval);
		});
		
		// Scale the range of the data
		positionPlot.x.domain(d3.extent(data, function(d) { return parseFloat(d.xval); }));
		positionPlot.y.domain(d3.extent(data, function(d) { return parseFloat(d.yval); }));

		// Nest the entries by date
		var dataNest = d3.nest()
			.key(function(d) {return d.date;})
			.entries(data);

		var color = d3.scale.category10();   // set the colour scale

		positionPlot.legendSpace = positionPlot.width/dataNest.length; // spacing for the legend

		// Add the X Axis
		positionPlot.svg.append("g")
			.attr("class", "x axis")
			//.attr("transform", "translate(0," + height + ")")
			.attr("transform", "translate(" + xOffset + "," + positionPlot.height + ")")
			.call(positionPlot.make_x_axis());

		// Graph Label
		positionPlot.svg.append("text")      // text label for the x axis
			.attr("class", "axislabel")
			.attr("x", xOffset + (positionPlot.graphDim.gWidth / 2))
			.attr("y", 0 -(positionPlot.margin.top/2))
			.text(title);
			
		// X axis Label
		positionPlot.svg.append("text")      // text label for the x axis
			.attr("class", "axislabel")
			.attr("x", xOffset + (positionPlot.graphDim.gWidth / 2))
			.attr("y", positionPlot.height + (positionPlot.margin.bottom/2) + 5)
			.text("Horizontal Displacement (meters)");
			
		// Add the Y Axis
		positionPlot.svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + xOffset + ",0)")
			.call(positionPlot.make_y_axis());
		
		// Y axis Label
		positionPlot.svg.append("text")		// text label for the y axis
			.attr("class", "axislabel")
			.attr("transform", "rotate(-90)")
			.attr("y", xOffset -5 - (positionPlot.margin.left / 2))
			.attr("x", 0 - (positionPlot.height / 2))
			.text("Vertical Displacement (meters)");
		
		// Add the Grids
		positionPlot.svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(" + xOffset + "," + positionPlot.height + ")")
			.call(positionPlot.make_x_axis()
				.tickSize(-positionPlot.height, 0, 0)
				.tickFormat("")
			);

		positionPlot.svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(" + xOffset + ",0)")
			.call(positionPlot.make_y_axis()
				.tickSize(-positionPlot.graphDim.gWidth, 0, 0)
				.tickFormat("")
			);		
		
		// Loop through each date / key
		dataNest.forEach(function(d,i) { 

			positionPlot.svg.selectAll(".dot" + graphNum + "")
					.data(data)
				.enter().append("circle")
					.attr("class", "dot" + graphNum + "")
					//.attr("transform", "translate(" + xOffset + ",0)")
					.attr("r", 5)
					.attr("cx", function(d) { return positionPlot.x(d.xval) + xOffset; })
					.attr("cy", function(d) { return positionPlot.y(d.yval); })
					.on('mouseover', positionPlot.tip.show)
					.on('mouseout', positionPlot.tip.hide);
		
			positionPlot.svg.append("path")
				.attr("class", "line")
				.attr("transform", "translate(" + xOffset + ",0)")
				.style("stroke", function() { // Add the colours dynamically
					return d.color = color(d.key); })
				.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
				.attr("d", positionPlot.yvalline(d.values));
				
			// Add the Legend
			if(isLegends){
				positionPlot.svg.append("text")
					.attr("x", positionPlot.graphDim.gWidth + positionPlot.margin.right)  // space legend
					.attr("y", i*(positionPlot.labelHeight + 5))
					.attr("transform", "translate(" + xOffset + ",0)")
					.attr("class", "legend")    // style the legend
					.style("fill", function() { // Add the colours dynamically
						return d.color = color(d.key); })
					.on("click", function(){
						// Determine if current line is visible 
						var active   = d.active ? false : true,
						newOpacity = active ? 0 : 1; 
						// Hide or show the elements based on the ID
						d3.select("#tag"+d.key.replace(/\s+/g, ''))
							.transition().duration(100) 
							.style("opacity", newOpacity); 
						// Upxval whether or not the elements are active
						d.active = active;
						})  
					.text(d.key); 
			}
		});
	});
};	

function showPositionPlot(frm) {
	// Clear the canvas area first
	positionPlot.clearData();

	// Generate the XY Graph
	//urlXY = "temp/getPosPlot.php?site=" + frm.sites1.value + "&interval=" + frm.interval.value;
	urlXY = "d3graph/getPosPlot.php?site=" + frm.sites1.value + "&interval=" + frm.interval.value;
	titleXY = frm.sites1.value + " XY Column Position";
	generatePlotData(urlXY, titleXY, 0, true, 1);
	
	// Generate the XZ Graph
	//urlXZ = "temp/getPosPlot.php?xz&site=" + frm.sites1.value + "&interval=" + frm.interval.value;
	urlXZ = "d3graph/getPosPlot.php?xz&site=" + frm.sites1.value + "&interval=" + frm.interval.value;
	titleXZ = frm.sites1.value + " XZ Column Position";
	generatePlotData(urlXZ, titleXZ, positionPlot.width * 0.6, false, 2);
};

function showPositionPlotGeneral(frm) {
	var dayIntvl = document.getElementById("formPosition").interval.value;

	// Clear the canvas area first
	positionPlot.clearData();

	// Generate the XY Graph
	//urlXY = "temp/getPosPlot.php?site=" + frm.sitegeneral.value + "&interval=6";
	urlXY = "d3graph/getPosPlot.php?site=" + frm.sitegeneral.value + "&interval=" + dayIntvl;
	titleXY = frm.sitegeneral.value + " XY Column Position";
	generatePlotData(urlXY, titleXY, 0, true, 1);
	
	// Generate the XZ Graph
	//urlXZ = "temp/getPosPlot.php?xz&site=" + frm.sitegeneral.value + "&interval=6";
	urlXZ = "d3graph/getPosPlot.php?xz&site=" + frm.sitegeneral.value + "&interval=" + dayIntvl;
	titleXZ = frm.sitegeneral.value + " XZ Column Position";
	generatePlotData(urlXZ, titleXZ, positionPlot.width * 0.6, false, 2);
};
















