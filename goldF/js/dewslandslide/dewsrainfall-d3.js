// Create the XHR object.
	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest != "undefined") {
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			// CORS not supported.
			xhr = null;
		}
		return xhr;
	}

	// Helper method to parse the title tag from the response.
	function getTitle(text) {
		return text.match('<title>(.*)?</title>')[1];
	}

	// Make the actual CORS request.
	function makeCorsRequest() {
		// All HTML5 Rocks properties support CORS.
		//var url = 'http://updates.html5rocks.com';
		//var url = 'http://noah.dost.gov.ph/';
		var url = 'http://senslopetest.comlu.com/';

		var xhr = createCORSRequest('GET', url);
		if (!xhr) {
			alert('CORS not supported');
			return;
		}

		// Response handlers.
		xhr.onload = function() {
			var text = xhr.responseText;
			var title = getTitle(text);
			alert('Response from CORS request to ' + url + ': ' + title);
		};

		xhr.onerror = function() {
			alert('Woops, there was an error making the request.');
		};

		xhr.send();
	}
	
	var g = 0;
	var isVisible = [true, true, true, true];
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
    
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
			
	function showRainGeneral() {
	
	d3.select("#svg-rainfall").remove();
	
	var rainfall_current;
		
		rainfall_current = document.getElementById("rainfall_24hr_timestamp");
		rainfall_current.innerHTML = "<b>Timestamp: </b>";
		rainfall_current = document.getElementById("rainfall_15min_timestamp");
		rainfall_current.innerHTML = "<b>Timestamp: </b>";
	
	var rainfall_cWidth = document.getElementById('rainfall_24hr').clientWidth;
		rainfall_cHeight = document.getElementById('rainfall_24hr').clientHeight;
		
	var rainfall_margin = {top: rainfall_cHeight * 0.03, right: rainfall_cWidth * 0.01, bottom: rainfall_cHeight * 0.05, left: rainfall_cWidth * 0.15},
		rainfall_width = rainfall_cWidth - rainfall_margin.left - rainfall_margin.right,
		rainfall_height = rainfall_cHeight - rainfall_margin.top - rainfall_margin.bottom;
			
	d3.selectAll("#svg-rainfall").remove();	 

	var rainfall_target = document.getElementById('rainfall_24hr');
	var rainfall_spinner1 = new Spinner(opts).spin();
        rainfall_target.appendChild(rainfall_spinner1.el);
        rainfall_target = document.getElementById('rainfall_15min');
        rainfall_spinner2 = new Spinner(opts).spin();
        rainfall_target.appendChild(rainfall_spinner2.el);
	
    var rainfall_url = "/test/rain/" + curSite + "/" + fromDate + "/" + toDate;
    
		rainfall_x1 = d3.time.scale()
		.range([0, rainfall_width]);

		rainfall_y1 = d3.scale.linear()
		.range([rainfall_height, 0]);
		
		rainfall_x2 = d3.time.scale()
		.range([0, rainfall_width]);

		rainfall_y2 = d3.scale.linear()
		.range([rainfall_height, 0]);

		rainfall_xAxis1 = d3.svg.axis()
		.scale(rainfall_x1)
		.orient("bottom")
		.ticks(4);

	var rainfall_yAxis1 = d3.svg.axis()
		.scale(rainfall_y1)
		.orient("left").ticks(4);
		
		rainfall_xAxis2 = d3.svg.axis()
		.scale(rainfall_x2)
		.orient("bottom").ticks(4);

	var rainfall_yAxis2 = d3.svg.axis()
		.scale(rainfall_y2)
		.orient("left").ticks(4);

		rainfall_area1 = d3.svg.area()
		.interpolate("linear")
		.x(function(d) { return rainfall_x1(d.timestamp); })
		.y0(function (d) {if(d.cummulative < 0){return 0;} else return rainfall_height})
		.y1(function(d) { return rainfall_y1(d.cummulative); });
		
		rainfall_area2 = d3.svg.area()
		.interpolate("linear")
		.x(function(d) { return rainfall_x2(d.timestamp); })
		.y0(function (d) {if(d.rain < 0){return 0;} else return rainfall_height})
		.y1(function(d) { return rainfall_y2(d.rain); });
		
		rainfall_svg1 = d3.select("#rainfall_24hr").append("svg")
		.attr("id", "svg-rainfall")
		.attr("width", rainfall_width + rainfall_margin.left + rainfall_margin.right)
		.attr("height", rainfall_height + rainfall_margin.top + rainfall_margin.bottom)
		.append("g")
		.attr("transform", "translate(" + rainfall_margin.left + "," + rainfall_margin.top + ")");
		
		rainfall_svg2 = d3.select("#rainfall_15min").append("svg")
		.attr("id", "svg-rainfall")
		.attr("width", rainfall_width + rainfall_margin.left + rainfall_margin.right)
		.attr("height", rainfall_height + rainfall_margin.top + rainfall_margin.bottom)
		.append("g")
		.attr("transform", "translate(" + rainfall_margin.left + "," + rainfall_margin.top + ")");
	
	rainfall_svg1.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", rainfall_width)
		.attr("height", rainfall_height);
		
	rainfall_svg2.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", rainfall_width)
		.attr("height", rainfall_height);	
	
	var rainfall_tool1 = rainfall_svg1.append("g")                                
		.style("display", null);   
		
	var rainfall_tool2 = rainfall_svg2.append("g")                               
		.style("display", null);  
		
	var rainfall_parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
	var rainfall_formatDate = d3.time.format("%Y-%m-%d %H:%M:%S");
	var rainfall_bisectDate = d3.bisector(function(d) { return d.timestamp; }).left;
	
	d3.json(rainfall_url, function (error, data){
			  
		//++PANB: Don't draw anything if there is no data
		if(!data) {
			rainfall_spinner1.stop();
	        rainfall_spinner2.stop();
			return;
		}	  
			  
		data.forEach(function(d){
			d.timestamp = rainfall_parseDate(d.timestamp);
			d.cummulative = +d.cumm;
			d.rain = +d.rval;
		});
		
<!-- 24 Hour Rain -->
		
		rainfall_x1.domain(d3.extent(data, function(d) { return d.timestamp; }));
		rainfall_y1.domain([d3.min(data, function(d) {return d.cummulative;}), d3.max(data, function(d) { return d.cummulative; })]);
		
		rainfall_svg1.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", rainfall_area1);

		rainfall_svg1.append("rect")
			.attr("width", rainfall_width)
			.attr("height", rainfall_height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { rainfall_tool1.style("display", null); })
			.on("mouseout", function() { rainfall_tool1.style("display", "none"); 
										 rainfall_current = document.getElementById("rainfall_24hr_timestamp");
										 rainfall_current.innerHTML = "<b>Timestamp: </b>";})
			.on("mousemove", rainfall_mousemove1);
		
		rainfall_svg1.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + rainfall_height + ")")
			  .style("font-size", "11px")
			  .call(rainfall_xAxis1);

		rainfall_svg1.append("g")
			  .attr("class", "y axis")  
			  .call(rainfall_yAxis1)
			  .append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", -45)
			  .attr("x", rainfall_height/-2 + rainfall_margin.top + rainfall_margin.bottom)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .style("font-size", "15px")
			  .text(" 24 Hours (mm)");
	
<!-- 15 Minute Rain -->
			  
		rainfall_x2.domain(d3.extent(data, function(d) { return d.timestamp; }));
		rainfall_y2.domain([d3.min(data, function(d) {return d.rain;}), d3.max(data, function(d) { return d.rain; })]);

		rainfall_svg2.append("path")
			.datum(data)
			.attr("class", "area2")
			.attr("d", rainfall_area2);
			
		rainfall_svg2.append("rect")
			.attr("width", rainfall_width)
			.attr("height", rainfall_height)
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function() { rainfall_tool2.style("display", null); })
			.on("mouseout", function() { rainfall_tool2.style("display", "none"); 
										 rainfall_current = document.getElementById("rainfall_15min_timestamp");
										 rainfall_current.innerHTML = "<b>Timestamp: </b>";})
			.on("mousemove", rainfall_mousemove2);
			
		rainfall_svg2.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + rainfall_height + ")")
			.style("font-size", "11px")
			.call(rainfall_xAxis2);  

		rainfall_svg2.append("g")
			.attr("class", "y axis")
			.call(rainfall_yAxis2)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -45)
			.attr("x", rainfall_height/-2 + rainfall_margin.top + rainfall_margin.bottom)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size", "15px")
			.text("15 min(mm)");  
			
<!-- Tooltips Circle -->

		rainfall_tool1.append("circle")                                 
			.attr("class", "y")                              
			.style("fill", "FCFF33")                          
			.style("stroke", "FCFF33")                         
			.attr("r", 2);  
			
		rainfall_tool2.append("circle")                                 
			.attr("class", "y")                              
			.style("fill", "FCFF33")                          
			.style("stroke", "FCFF33")                         
			.attr("r", 2);  	  
			  
<!-- Tooltips Function -->

		function rainfall_mousemove1() {                                 
        var x0 = rainfall_x1.invert(d3.mouse(this)[0]);              
            i = rainfall_bisectDate(data, x0, 1),                   
            d0 = data[i - 1],                              
            d1 = data[i],                                  
            d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;     

			rainfall_tool1.select("circle.y")  
				.style("fill", "#4E0012")
				.style("stroke", "#4E0012")
				.attr("transform",                           
					  "translate(" + (rainfall_x1(d.timestamp))  + "," +         
									 rainfall_y1((d.cummulative)) + ")");      
									 
			rainfall_current = document.getElementById("rainfall_24hr_timestamp");
			rainfall_current.innerHTML = "<b>Timestamp: </b>" + rainfall_formatDate(d.timestamp) + "<b>24h Rain: </b>" + d.cummulative;
			}
	
		function rainfall_mousemove2() {                                 
        var x0 = rainfall_x2.invert(d3.mouse(this)[0]);              
            i = rainfall_bisectDate(data, x0, 1),                   
            d0 = data[i - 1],                              
            d1 = data[i],                                  
            d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;     

			rainfall_tool2.select("circle.y")           
				.style("fill", "#4E0012")
				.style("stroke", "#4E0012")		
				.attr("transform",                           
					  "translate(" + (rainfall_x2(d.timestamp))  + "," +         
									 rainfall_y2((d.rain)) + ")");      
								 
			rainfall_current = document.getElementById("rainfall_15min_timestamp");
			rainfall_current.innerHTML = "<b>Timestamp: </b>" + rainfall_formatDate(d.timestamp) + "<b>15m Rain: </b>" + d.rain;
			}
		
		rainfall_spinner1.stop();
        rainfall_spinner2.stop();
		
		});
}