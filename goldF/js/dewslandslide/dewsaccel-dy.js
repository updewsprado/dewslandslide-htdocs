	var blockRedraw = false;
	var end_date = new Date();
	var start_date = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()-10);

	function setDate(fromDate, toDate) {
	    var end_date;
	    var from_date;

		if(toDate == "") {
			end_date = new Date();
		}
		else {
			end_date = new Date(toDate);
		}

		if(fromDate == "") {
			if (end_date.getMonth() == 0) {
				from_date = new Date(12 + '-' + end_date.getDate() + '-' + (end_date.getFullYear() - 1));
			}
			else{
				from_date = new Date((end_date.getMonth()) + '-' + end_date.getDate() + '-' + end_date.getFullYear());
			};
		}
		else {
			from_date = new Date(fromDate);
		}

		$(function() {
	    	$( "#datepicker" ).datepicker({ dateFormat: "yy-mm-dd" });
	        $( "#datepicker" ).datepicker("setDate", from_date);
		});

	    $(function() {
	    	$( "#datepicker2" ).datepicker({ dateFormat: "yy-mm-dd" });
	        $( "#datepicker2" ).datepicker("setDate", end_date);
		});
	}

	//setDate();
// 
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

	function JSON2CSV(objArray) {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

		var str = '';
		var line = '';
        var index_count = 0;

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
			str += line + '\n';
		}

		for (var i = 0; i < array.length; i++) {
			var line = '';
            var index_count = 0;
			if ($("#quote").is(':checked')) {
				for (var index in array[i]) {
					var value = array[i][index] + "";
					line += '"' + value.replace(/"/g, '""') + '",';
                    index_count += 1;


				}
			} else {
				for (var index in array[i]) {
					line += array[i][index] + ',';
                    index_count += 1;
				}
			}

			line = line.slice(0, -1);
			str += line + '\n';
		}
        return str;

	}

	// TO DO:
	function downloadData(frm) {

	  if (frm.dateinput.value == "") {
		document.getElementById("txtHint").innerHTML="";
		return;
	  }

	  if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	  } else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }

	  xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var siteData = JSON.parse(xmlhttp.responseText);
			var csv = JSON2CSV(siteData );
			var uri = 'data:text/csv;charset=utf-8,' + escape(csv);

			var link = document.createElement("a");
			link.href = uri;

			link.style = "visibility:hidden";
			link.download = frm.sites.value + ".csv";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	  };

	  var url = "/temp/getSenslopeData.php?accel3&from=" + frm.dateinput.value + "&to=" + frm.dateinput2.value + "&nid=" + frm.node.value + "&site=" + frm.sites.value + "&db=" + frm.dbase.value;
	  xmlhttp.open("GET",url,true);
	  xmlhttp.send();
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
	//var target = document.getElementById('demodiv');

    var rsiteid_prev = "";
    var g2 = 0;
	var gs = [];
    var roll_period = 1;

    function getXHR() {
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            return new XMLHttpRequest();
        }
        else { // code for IE6, IE5
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    function showData(frm) {

		var rsiteid = '';

		switch(frm.sites.value){
			case "blcb": rsiteid = "204"; break;
			case "blct": rsiteid = "204"; break;
			case "bolb": rsiteid = "1236"; break;
			case "gamt": rsiteid = "782"; break;
			case "gamb": rsiteid = "782"; break;
			case "humb": rsiteid = "789"; break;
			case "humt": rsiteid = "789"; break;
			case "labb": rsiteid = "389"; break;
			case "labt": rsiteid = "389"; break;
			case "lipb": rsiteid = "1236"; break;
			case "lipt": rsiteid = "1236"; break;
			case "mamb": rsiteid = "389"; break;
			case "mamt": rsiteid = "389"; break;
			case "oslb": rsiteid = "152"; break;
			case "oslt": rsiteid = "152"; break;
			case "plat": rsiteid = "789"; break;
			case "plab": rsiteid = "789"; break;
			case "pugb": rsiteid = "65"; break;
			case "pugt": rsiteid = "65"; break;
			case "sinb": rsiteid = "454"; break;
			case "sint": rsiteid = "454"; break;
			case "sinu": rsiteid = "454"; break;
		}

		if (frm.dateinput.value == "") {
			document.getElementById("txtHint").innerHTML="";
			return;
		}

		var urls = [
			"/temp/getSenslopeData.php?accel3&from=" + frm.dateinput.value + "&to=" + frm.dateinput2.value + "&nid=" + frm.node.value + "&site=" + frm.sites.value + "&db=" + frm.dbase.value,
			"http://weather.asti.dost.gov.ph/home/index.php/api/data/" + rsiteid + "/from/" + frm.dateinput.value + "/to/" + frm.dateinput2.value
		];
console.log(urls);
		var target = document.getElementById('accel-2');
        var spinner = new Spinner(opts).spin();
        target.appendChild(spinner.el);

		var vis = [
					[true, false, false, false],
					[false, true, false, false],
					[false, false, true, false],
					[false, false, false, true],
				];

		var xmlhttp_column = getXHR();
		var column_plot_range;
        xmlhttp_column.onreadystatechange = function () {
			if (xmlhttp_column.readyState == 4 && xmlhttp_column.status == 200) {

                var resp = xmlhttp_column.responseText;
                var siteData = JSON.parse(resp);
                if (siteData == null){
                    spinner.stop();
                    alert("No data retrieved. Please check input values.");
                    return;
                };

				var columndata = JSON2CSV(siteData);

				spinner.stop();

				//var blockRedraw = false;

				var labels = [
					'X (LSB)',
					'Y (LSB)',
					'Z (LSB)',
					'M (Hz)',
				];

                gs = [];
				for (var i = 1; i <= 4; i++) {
					gs.push(
						new Dygraph(
						document.getElementById("accel-" + i),
						columndata,
						{
							drawCallback: function(me, initial) {
								if (blockRedraw || initial) return;
								blockRedraw = true;
								column_plot_range = me.xAxisRange();
                                roll_period = me.rollPeriod();
								for (var j = 0; j < 4; j++) {
									if (gs[j] == me)
										continue;
									gs[j].updateOptions( {
										dateWindow: column_plot_range,
                                        rollPeriod: roll_period,
										visibility: vis[j],
									}
									);
								}

								if (g2!=0){
									g2.updateOptions( {
										dateWindow: column_plot_range,
										}
									);
								}
								blockRedraw = false;
							},
							visibility: vis[i-1],
							ylabel: labels[i-1],
							labelsDiv: '',
							axes: {
								x: {
									drawAxis: false
								}
							},
							labels: ['timestamp','X','Y','Z','M'],
							strokeWidth: 1.5,
							fillGraph: true,
							showRoller: true,
                            rollPeriod: roll_period,
                            colors: ['#284785', '#EE1111', '#006600', '#660066'],
						}
						)
					);
				};

			};
		};

		xmlhttp_column.open("GET",urls[0],true);
		xmlhttp_column.send();


        if (rsiteid_prev != rsiteid && frm.rain.value == "y"){

            var threshold = 0.0;
            switch(frm.sites.value){
                case "blcb": threshold = 130.00; break;
                case "blct": threshold = 130.00; break;
                case "bolb": threshold = 128.53; break;
                case "gamt": threshold = 183.85; break;
                case "gamb": threshold = 183.85; break;
                case "humb": threshold = 79.33;  break;
                case "humt": threshold = 79.33;  break;
                case "labb": threshold = 195.21; break;
                case "labt": threshold = 195.21; break;
                case "lipb": threshold = 129.65; break;
                case "lipt": threshold = 129.65; break;
                case "mamb": threshold = 208.54; break;
                case "mamt": threshold = 208.54; break;
                case "oslb": threshold = 179.41; break;
                case "oslt": threshold = 179.41; break;
                case "plat": threshold = 78.32;  break;
                case "plab": threshold = 78.32;  break;
                case "pugb": threshold = 191.95; break;
                case "pugt": threshold = 191.95; break;
                case "sinb": threshold = 235.03; break;
                case "sint": threshold = 235.03; break;
                case "sinu": threshold = 235.03; break;
            }


            rsiteid_prev = rsiteid;

            var target2 = document.getElementById('raindiv');
            var spinner2 = new Spinner(opts).spin();
            target2.appendChild(spinner2.el);

            var xmlhttp_rain = getXHR();
            var url = "getRainfall.php?rsite=" + rsiteid + "&fdate=" + frm.dateinput.value + "&tdate=" + frm.dateinput2.value;
            xmlhttp_rain.open("GET",url,true);

            xmlhttp_rain.onreadystatechange = function() {
                if (xmlhttp_rain.readyState == 4 && xmlhttp_rain.status == 200) {

                    var rdatacsv = JSON2CSV(xmlhttp_rain.responseText);

                    spinner2.stop();

                    //var blockRedraw = false;
                    g2 = new Dygraph(
                        document.getElementById("raindiv"),
                        rdatacsv,
                        {
                            ylabel: "Rain Intensity (mm)",
                            labels: ["Timestamp","24 hours","15 minutes"],
                            dateWindow: column_plot_range,
                            strokeWidth: 1.5,
                            dateWindow: gs[0].xAxisRange(),
                            showRoller: true,
                            fillGraph: true,

                            drawCallback: function(me, initial) {
								if (blockRedraw || initial) return;
                                if (!gs) return;
								blockRedraw = true;
								column_plot_range = me.xAxisRange();
                                for (var j = 0; j < 4; j++) {
									if (gs[j] == me)
										continue;
									gs[j].updateOptions( {
										dateWindow: column_plot_range,
                                        visibility: vis[j],
									}
									);
								}

								blockRedraw = false;
							},

                            underlayCallback: function(canvas, area, g2) {
                                var c1 = g2.toDomCoords(g2.getValue(0,0), threshold);
                                canvas.fillStyle = '#FF0000';
                                canvas.fillRect(area.x, c1[1], area.w, 1);

                                var c2 = g2.toDomCoords(g2.getValue(0,0), threshold/2);
                                canvas.fillStyle = '#FF9900';
                                canvas.fillRect(area.x, c2[1], area.w, 1);
                            },
                        }// options
                    );
                }
            };
            xmlhttp_rain.send();
        }
	}

function showAccel(frm) {
	var rsiteid = '';

	var dfrom = document.getElementById("formDate").dateinput.value;
	var dto = document.getElementById("formDate").dateinput2.value;
	var selectedSite = frm.sitegeneral.value;
	var domainName = window.location.hostname;

	if (domainName == "localhost") {
		var URL = "/temp/getSenslopeData.php?accel3&from=" + dfrom + "&to=" + dto + "&nid=" + frm.node.value + "&site=" + selectedSite + "&db=senslopedb";
	}
	else{
		var URL = "/ajax/getSenslopeData.php?accel3&from=" + dfrom + "&to=" + dto + "&nid=" + frm.node.value + "&site=" + selectedSite + "&db=senslopedb";
	}

	var URLfiltered = "/ajax/generateFilteredData.php?start=" + dfrom + "&end=" + dto + "&node=" + frm.node.value + "&site=" + selectedSite + "&showid=0&msgid=32";

	var target = document.getElementById('accel-2');
    //var spinner = new Spinner(opts).spin();
    var spinner = new Spinner(opts).spin();
    target.appendChild(spinner.el);

	var vis = [
				[true, false, false, false],
				[false, true, false, false],
				[false, false, true, false],
				[false, false, false, true],
			];

	var xmlhttp_column = getXHR();
	var column_plot_range;
    xmlhttp_column.onreadystatechange = function () {
		if (xmlhttp_column.readyState == 4 && xmlhttp_column.status == 200) {

            var resp = xmlhttp_column.responseText;
            var siteData = JSON.parse(resp);
            if (siteData == null){
                spinner.stop();
                alert("No data retrieved. Please check input values.");
                return;
            }

			var columndata = JSON2CSV(siteData);

			spinner.stop();

			//var blockRedraw = false;

			if (selectedSite.length == 4) {
				if(frm.dbase.value == "raw") {
					var labels = [
						'X (LSB)',
						'Y (LSB)',
						'Z (LSB)',
						'M (Hz)',
					];

					var labelAxis = ['timestamp','X','Y','Z','M'];
					var numSeparateGraphs = 4;
					var colorsLine = ['#284785', '#EE1111', '#006600', '#660066'];
				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
						'X (LSB)',
						'Y (LSB)',
						'Z (LSB)'
					];

					var labelAxis = ['timestamp','X','Y','Z'];
					var numSeparateGraphs = 3;
				}
			}
			else {
				if(frm.dbase.value == "raw") {
					var labels = [
						'X (LSB)',
						'Y (LSB)',
						'Z (LSB)',
						'V (Battery)'
					];

					var labelAxis = ['timestamp','X','Y','Z','V'];
					var numSeparateGraphs = 4;
					var colorsLine = ['#284785', '#EE1111', '#006600', ' #ff8000'];
				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
						'X (LSB)',
						'Y (LSB)',
						'Z (LSB)'
					];

					var labelAxis = ['timestamp','X','Y','Z'];
					var numSeparateGraphs = 3;
				}
			}

            gs = [];
			for (var i = 1; i <= numSeparateGraphs; i++) {
				gs.push(
					new Dygraph(
					document.getElementById("accel-" + i),
					columndata,
					{
						drawCallback: function(me, initial) {
							if (blockRedraw || initial)
								return;
							blockRedraw = true;
							column_plot_range = me.xAxisRange();
                            roll_period = me.rollPeriod();
							for (var j = 0; j < numSeparateGraphs; j++) {
								if (gs[j] == me)
									continue;
								gs[j].updateOptions( {
									dateWindow: column_plot_range,
                                    rollPeriod: roll_period,
									visibility: vis[j],
								}
								);
							}

							if (g2!=0){
								g2.updateOptions({
									dateWindow: column_plot_range,
								});
							}
							blockRedraw = false;
						},
						visibility: vis[i-1],
						ylabel: labels[i-1],
						labelsDiv: '',
						axes: {
								x: {
									drawAxis: false
								}
							},
						labels: labelAxis,
						strokeWidth: 1.5,
						fillGraph: true,
						showRoller: true,
                        rollPeriod: roll_period,
                        colors: colorsLine,
					}
					)
				);
			}
		}
	};

	if(frm.dbase.value == "raw") {
		xmlhttp_column.open("GET",URL,true);
	}
	else if(frm.dbase.value == "filtered"){
		xmlhttp_column.open("GET",URLfiltered,true);

		//data set 1 should always be shown first
		//function from "codeigniter/application/views/gold/dynode.php"
		toggleGraphView(1);
	}

	xmlhttp_column.send();
}

function showAccelSecond(frm) {
	var rsiteid = '';

	var dfrom = document.getElementById("formDate").dateinput.value;
	var dto = document.getElementById("formDate").dateinput2.value;
	var selectedSite = frm.sitegeneral.value;
	var domainName = window.location.hostname;
	var set = 2;

	if (domainName == "localhost") {
		var URL = "/temp/getSenslopeData.php?accel3&from=" + dfrom + "&to=" + dto + "&nid=" + frm.node.value + "&site=" + selectedSite + "&db=senslopedb" + "&dataset=" + set;
	}
	else{
		var URL = "/ajax/getSenslopeData.php?accel3&from=" + dfrom + "&to=" + dto + "&nid=" + frm.node.value + "&site=" + selectedSite + "&db=senslopedb" + "&dataset=" + set;
	}

	var URLfiltered = "/ajax/generateFilteredData.php?start=" + dfrom + "&end=" + dto + "&node=" + frm.node.value + "&site=" + selectedSite + "&showid=0&msgid=33";

	var target = document.getElementById('accel-22');
    //var spinner = new Spinner(opts).spin();
    var spinner = new Spinner(opts).spin();
    target.appendChild(spinner.el);

	var vis = [
				[true, false, false, false],
				[false, true, false, false],
				[false, false, true, false],
				[false, false, false, true],
			];

	var xmlhttp_column = getXHR();
	var column_plot_range;
    xmlhttp_column.onreadystatechange = function () {
		if (xmlhttp_column.readyState == 4 && xmlhttp_column.status == 200) {

            var resp = xmlhttp_column.responseText;
            var siteData = JSON.parse(resp);
            if (siteData == null){
                spinner.stop();
                alert("No data retrieved. Please check input values.");
                return;
            }

			var columndata = JSON2CSV(siteData);

			spinner.stop();

			//var blockRedraw = false;

			if (selectedSite.length == 4) {
				if(frm.dbase.value == "raw") {
					var labels = [
						'X2 (LSB)',
						'Y2 (LSB)',
						'Z2 (LSB)',
						'M2 (Hz)',
					];

					var labelAxis = ['timestamp','X','Y','Z','M'];
					var numSeparateGraphs = 4;
					var colorsLine = ['#284785', '#EE1111', '#006600', '#660066'];

				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
						'X2 (LSB)',
						'Y2 (LSB)',
						'Z2 (LSB)'
					];

					var labelAxis = ['timestamp','X','Y','Z'];
					var numSeparateGraphs = 3;
				}
			}
			else {
				if(frm.dbase.value == "raw") {
					var labels = [
						'X2 (LSB)',
						'Y2 (LSB)',
						'Z2 (LSB)',
						'V2 (Battery)'
					];

					var labelAxis = ['timestamp','X','Y','Z','V'];
					var numSeparateGraphs = 4;
					var colorsLine = ['#284785', '#EE1111', '#006600', ' #ff8000'];
				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
						'X2 (LSB)',
						'Y2 (LSB)',
						'Z2 (LSB)'
					];

					var labelAxis = ['timestamp','X','Y','Z'];
					var numSeparateGraphs = 3;
				}
			}

            gs = [];
			for (var i = 1; i <= numSeparateGraphs; i++) {
				gs.push(
					new Dygraph(
					document.getElementById("accel-2" + i),
					columndata,
					{
						drawCallback: function(me, initial) {
							if (blockRedraw || initial) return;
							blockRedraw = true;
							column_plot_range = me.xAxisRange();
                            roll_period = me.rollPeriod();
							for (var j = 0; j < numSeparateGraphs; j++) {
								if (gs[j] == me)
									continue;
								gs[j].updateOptions( {
									dateWindow: column_plot_range,
                                    rollPeriod: roll_period,
									visibility: vis[j],
								}
								);
							}

							if (g2!=0){
								g2.updateOptions({
									dateWindow: column_plot_range,
								});
							}
							blockRedraw = false;
						},
						visibility: vis[i-1],
						ylabel: labels[i-1],
						labelsDiv: '',
						axes: {
								x: {
									drawAxis: false
								}
							},
						labels: labelAxis,
						strokeWidth: 1.5,
						fillGraph: true,
						showRoller: true,
                        rollPeriod: roll_period,
                         colors: colorsLine,
					}
					)
				);
			}
		}
	};

	if(frm.dbase.value == "raw") {
		xmlhttp_column.open("GET",URL,true);
	}
	else if(frm.dbase.value == "filtered"){
		xmlhttp_column.open("GET",URLfiltered,true);
		//toggleGraphView(1);
	}
	xmlhttp_column.send();
}

function showAndClearField(frm){
  if (frm.dateinput.value == "")
	  alert("Hey! You didn't enter anything!");
  else
	  alert("The field contains the text: " + frm.dateinput.value);
  frm.dateinput.value = "";
}
