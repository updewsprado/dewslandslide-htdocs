	var opacity1 = 0,
		opacity2 = 0,
		opacity3 = 0,
		opacity1_s,
		opacity2_s,
		opacity3_s,
		legendactive = 0,
		active = 0;
				
	var options = ["blcb", "blct", "bolb", "gamb", "gamt",
						"humb", "humt", "labb", "labt", "lipb",
						"lipt", "mamb", "mamt", "oslb", "oslt",
						"plab", "plat", "pugb", "pugt", "sinb",
						"sinu"];

	function showLegends(frm) {
		
	if (legendactive == 1) {
		target3 = document.getElementById('show');
		target4 = document.getElementById('legends');
		
		if (active == 0){
		target3.value = "Hide Legends";
		target4.style.visibility = "visible";
		active = 1;
			}
		else {
		target3.value = "Show Legends";
		target4.style.visibility = "hidden";
		active = 0;
			}
		}
	else {
		alert("Create a bar chart first!");
	}
	}
	
	function popDropDown() {
		var select = document.getElementById('selectSite');
		var i;
		for (i = 0; i < options.length; i++) {
			var opt = options[i];
			var el = document.createElement("option");
			el.textContent = opt;
			el.value = opt;
			select.appendChild(el);
		}
	}

	var opts = {
		lines: 11, // The number of lines to draw
		length: 6, // The length of each line
		width: 3, // The line thickness
		radius: 8, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#000', // #rgb or #rrggbb or array of colors
		speed: 1.1, // Rounds per second
		trail: 58, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	};
	
	window.onload = popDropDown;	

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	  
	  var tooltip = "<strong>Node Number:</strong><span style='color:red'>" + d.node + "</span><br/>";
	  
	  if (d.y == d.all)
	  {
		tooltip += "<strong>Overall</strong> <span style='color:red'>" + d.all + "</span>"; }
	  else if (d.y == d.week)
	  {
		tooltip += "<strong>Past 7 Days:</strong><span style='color:red'>" + d.week + "</span>"; }	
	  else if (d.y == d.month)
	  {
		tooltip += "<strong>Past 30 Days:</strong><span style='color:red'>" + d.month + "</span>"; }
	  
	  return tooltip;
		});
		
	function showGraph(frm)
	{
		opacity1 = 0,
		opacity2 = 0,
		opacity3 = 0;
		target3 = document.getElementById('show');
		target3.value = "Show Legends";
		legendactive = 0;
		active = 0;
		target5 = document.getElementById('legends');
		target5.style.visibility = "hidden";
		
		var target = document.getElementById('barchart');
		var spinner = new Spinner(opts).spin();
        target.appendChild(spinner.el);
		
			d3.select("svg").remove();	
			
		var siteselect = document.getElementById('selected');
			siteselect.innerHTML = "<h2>Node Health: " + frm.sites.value + "</h2>";
				 
		var n = 3;
			
		var url = "getSenslopeData.php?health&site=" + frm.sites.value + "&db=" + frm.dbase.value;
		
		var margin = {top: 20, right: 50, bottom: 100, left: 75},
			width = parseInt(d3.select('#barchart').style('width'), 10) - margin.left - margin.right,
			height = parseInt(d3.select('#barchart').style('height'), 10) - margin.top - margin.bottom;
			
		d3.json(url, function (data){
			
			var svg = d3.select("#barchart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			svg.call(tip);

<!-- Bar Chart Formation -->			
			
			var headers = ["week", "month", "all"];
			var headers2 = ["Past 7 days", "Past 30 days", "Overall"];
			
			var layers = d3.layout.stack()(headers.map(function(days) {
				return data.map(function(d) {
				  return {x: d.node, all: d.all, month: d.month, week: d.week, node: d.node, y: +d[days] };
				});
			}));
						
			var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });

			var xScale = d3.scale.ordinal()
				.domain(layers[0].map(function(d) { return d.x; }))
				.rangeRoundBands([25, width], .08);

			var y = d3.scale.linear()
				.domain([0, yGroupMax])
				.range([height, 0]);
				
			var color = d3.scale.ordinal()
				.range(["red", "blue", "green"]);
		  
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.tickSize(0)
				.tickPadding(6)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			var layer = svg.selectAll(".layer")
				.data(layers)
				.enter().append("g")
				.attr("class", "layer")
				.style("fill", function(d, i) { return color(i); });

			var rect = layer.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("x", function(d, i, j) { return xScale(d.x) + xScale.rangeBand() / n * j; })
				.attr("width", xScale.rangeBand() / n)
				.attr("y", function(d) { return y(d.y); })
				.attr("height", function(d) { return height - y(d.y); })
				.attr("id", function(d){if (d.y == d.all) return "overall";
					else if (d.y == d.week) return "week";
					else if (d.y == d.month) return "month"; })
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
		
<!-- For Resizing -->
		
			d3.select("svg")
				.attr("viewBox", "0 0 600 600")
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("preserveAspectRatio", "xMinYMin meet");	

<!-- Axes -->
			
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.style("font-size", "14px")
					.call(xAxis)
					.selectAll("text").style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", function(d) {
						  return "rotate(-45)"});
		
				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(20,0)")
					.style("font-size", "14px")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr({"x": -150, "y": -70})
					.attr("dy", ".75em")
					.style("text-anchor", "end")
					.style("font-size", "15px")
					.text("Communication Health Ratio");

				svg.append("text")      // text label for the x axis
					.attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
					.style("text-anchor", "middle")
					.style("font-size", "16px")
					.text("Node Number");
				
					  	spinner.stop();
		
						legendactive = 1;
		});
	

	
	}

	function barTransition(color){
		if(color == "green" && opacity1 == 0){
			d3.selectAll("#overall").transition().duration(500).style("opacity", opacity1);
			d3.selectAll("#overall").on("mouseover", tip.hide);
			opacity1s = opacity1;
			opacity1 = opacity1s ? 0 : 1;
		}
		
		else if(color == "green" && opacity1 == 1){
			d3.selectAll("#overall").transition().duration(500).style("opacity", opacity1);
			d3.selectAll("#overall").on("mouseover", tip.show);
			opacity1s = opacity1;
			opacity1 = opacity1s ? 0 : 1;
		}
		
		if (color == "red" && opacity2 == 0){
			d3.selectAll("#week").transition().duration(500).style("opacity", opacity2);
			d3.selectAll("#week").on("mouseover", tip.hide);
			opacity2s = opacity2;
			opacity2 = opacity2s ? 0 : 1;
		}
		
		else if (color == "red" && opacity2 == 1){
			d3.selectAll("#week").transition().duration(500).style("opacity", opacity2);
			d3.selectAll("#week").on("mouseover", tip.show);
			opacity2s = opacity2;
			opacity2 = opacity2s ? 0 : 1;
		}
		
		if (color == "blue" && opacity3 == 0){
			d3.selectAll("#month").transition().duration(500).style("opacity", opacity3);
			d3.selectAll("#month").on("mouseover", tip.hide);
			opacity3s = opacity3;
			opacity3 = opacity3s ? 0 : 1;
		}
		
		else if (color == "blue" && opacity3 == 1){
			d3.selectAll("#month").transition().duration(500).style("opacity", opacity3);
			d3.selectAll("#month").on("mouseover", tip.show);
			opacity3s = opacity3;
			opacity3 = opacity3s ? 0 : 1;
		}
}