

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
	        $( "#datepicker2" ).datepicker("setDate", '+1');
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

	  // var url1 = "/temp/somsfull.php?&fdate=" + frm.dateinput.value  + "&tdate=" + frm.dateinput2.value  + "&site=" + frm.sites.value "&db=" + frm.dbase.value;
	  var url = "/temp/getSenslopeData.php?accel3&from=" + frm.dateinput.value + "&to=" + frm.dateinput2.value + "&nid=" + frm.node.value + "&site=" + frm.sites.value + "&db=" + frm.dbase.value;
	  xmlhttp.open("GET",url,true);
	  // xmlhttp.open("GET",url1,true);
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
             // console.log(siteData);
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
					var colorsLine = ['#284785', '#EE1111', '#006600', '#660066'];
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
					var colorsLine = ['#284785', '#EE1111', '#006600', ' #ff8000'];
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
					var colorsLine = ['#284785', '#EE1111', '#006600', '#660066'];
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
					var colorsLine = ['#284785', '#EE1111', '#006600', '#660066'];
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

function showSoms(frm) {
	var rsiteid = '';

	var dfrom = document.getElementById("formDate").dateinput.value;
	var dto = document.getElementById("formDate").dateinput2.value;
	var selectedSite = frm.sitegeneral.value;
	var domainName = window.location.hostname;
	var version =document.getElementById("header-site").innerHTML;
	var newVersion = version.substr(8, version.length-25);
	
if (newVersion == 2){
		var URL = "/temp/somsV2.php?site="+selectedSite+"&fdate=" + dfrom  +"&tdate=" + dto  + "&nid=" + frm.node.value ;
		if (domainName == "localhost") {

			var URL ="/temp/somsV2.php?site="+selectedSite+"&fdate=" + dfrom  +"&tdate=" + dto  + "&nid=" + frm.node.value;
		}
		else{
			var URL = "/ajax/somsV2.php?site="+selectedSite+"&fdate=" + dfrom  +"&tdate=" + dto  + "&nid=" + frm.node.value;
	}
		var URLfiltered = "/ajax/somsV2.php?site="+selectedSite+"&fdate=" + dfrom  +"&tdate=" + dto  + "&nid=" + frm.node.value;
	} else  {
		var msgid1 = "110";
		var m ="m";
	console.log(msgid1);
		if (domainName == "localhost") {

			var URL ="/temp/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto + "&ms1=" +msgid1  + "&nid=" + frm.node.value ;
		}
		else{
			var URL = "/ajax/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto  + "&ms1=" +msgid1 + "&nid=" + frm.node.value;
		}
		var URLfiltered = "/ajax/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto  + "&ms1=" +msgid1 + "&nid=" + frm.node.value;
	}
console.log(msgid1);
	var target = document.getElementById('accel-2');
    //var spinner = new Spinner(opts).spin();
    var spinner = new Spinner(opts).spin();
    target.appendChild(spinner.el);
    console.log(URL);
	 
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



			if (selectedSite.length == 2) {
				if(frm.dbase.value == "raw") {
					var labels = [
						' (Hz)',
					];

					var labelAxis = ['timestamp','raw'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#DAA520', '#004e4e'];

				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
							' (Hz)',
							

					];

					var labelAxis = ['timestamp','raw'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#DAA520', '#004e4e'];

				}
			}
			else {
				if(frm.dbase.value == "raw") {
					var labels = [
							' (Hz)',
							
					];

					var labelAxis = ['timestamp','raw'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#DAA520', '#004e4e'];

				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
							'(Hz)',
							
					];

					var labelAxis = ['timestamp','raw'];
					var numSeparateGraphs = 2;
					var colorsLine = ['#DAA520', '#004e4e'];

				}
			}
			// console.log(columndata);
			console.log(URL);
                             gs = [];
			for (var i = 1; i <= numSeparateGraphs; i++) {
				gs.push(
					new Dygraph(
					document.getElementById("accel-v" + i),
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

function showSoms2(frm) {
	var rsiteid = '';

	var dfrom = document.getElementById("formDate").dateinput.value;
	var dto = document.getElementById("formDate").dateinput2.value;
	var selectedSite = frm.sitegeneral.value;
	var domainName = window.location.hostname;
	var version =document.getElementById("header-site").innerHTML;
	var newVersion = version.substr(8, version.length-25);
	
	var m ="m";
	if (newVersion == 2){
		var msgid1 = "112";
	} else  {
		var msgid1 = "113";
	} 
	console.log(msgid1);
	if (domainName == "localhost") {
		var m ="m";
		var URL ="/temp/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto + "&ms1=" +msgid1  + "&nid=" + frm.node.value ;
	}
	else{
		var URL = "/ajax/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto  + "&ms1=" +msgid1 + "&nid=" + frm.node.value;
}
	var URLfiltered = "/ajax/soms.php?site="+selectedSite+m+"&fdate=" + dfrom  +"&tdate=" + dto  + "&ms1=" +msgid1 + "&nid=" + frm.node.value;

	var target = document.getElementById('accel-2');
    //var spinner = new Spinner(opts).spin();
    var spinner = new Spinner(opts).spin();
    target.appendChild(spinner.el);
    console.log(URL);
	 
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



			if (selectedSite.length == 1) {
				if(frm.dbase.value == "raw") {
					var labels = [
						'(Hz)',
					];

					var labelAxis = ['timestamp','cal'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#DAA520', '#004e4e'];

				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
							'(Hz)',
					];

					var labelAxis = ['timestamp','cal'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#004e4e'];

				}
			}
			else {
				if(frm.dbase.value == "raw") {
					var labels = [
							'(Hz)',
					];

					var labelAxis = ['timestamp','cal'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#004e4e'];

				}
				else if(frm.dbase.value == "filtered"){
					var labels = [
							'(Hz)',
					];

					var labelAxis = ['timestamp','cal'];
					var numSeparateGraphs = 1;
					var colorsLine = ['#004e4e'];

				}
			}
			// console.log(columndata);
			console.log(URL);
                             gs = [];
			for (var i = 1; i <= numSeparateGraphs; i++) {
				gs.push(
					new Dygraph(
					document.getElementById("accel-v1" + i),
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

