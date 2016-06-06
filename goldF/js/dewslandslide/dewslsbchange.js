var column_plot_range;
var roll_period_lsb = 48;

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

function showLSBChange(frm) {
	showLSBChangeGeneral(frm, 'lsb-change-canvas');
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function showLSBChangeGeneral(frm, e) {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	    // code for IE7+, Firefox, Chrome, Opera, Safari
	    xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
	    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}	
	
    xmlhttp.abort();
    var target = document.getElementById(e);
	var spinner = new Spinner().spin(target);
	//target.appendChild(spinner.el);
  
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var datajson = xmlhttp.responseText;
            
            if (datajson == ""){
                spinner.stop();
                alert("No data retrieved. Please check input values.");
                return;
            }

            var node_vel_data = JSON2CSV(datajson);
            
            g2 = new Dygraph(
                    target,
                    node_vel_data,
                    {
                        ylabel: "LSB Velocity (LSB/6hours)",
                        labels: ["Timestamp","X","Y","Z"],
                        strokeWidth: 1.5,
                        
                        labelsDivWidth: 300,
                        rightgap: 500,
                        legend: "always",
                        labelsDivStyles: {
                            'text-align': 'right',
                            'font-family': 'Lato',
                            'background': 'none',
                            'height': '20px',
                        },
                        
                        highlightSeriesOpts: {
                          strokeWidth: 3,
                          strokeBorderWidth: 1,
                          highlightCircleSize: 5,
                        },
                        fillGraph: true,
                        
                        drawCallback: function(me, initial) {
                            //--- PANB - commented out coz it causes statid plot range
							//column_plot_range = me.xAxisRange();
                            roll_period_lsb = me.rollPeriod();	
						},

                        showRoller: true,
                        dateWindow: column_plot_range,
                        rollPeriod: roll_period_lsb,
                        colors: ['#284785', '#EE1111', '#006600'],
                        
                        underlayCallback: function(canvas, area, g2) {
                        
                            var c0 = g2.toDomCoords(g2.getValue(0,0), 0);
                            
                            canvas.fillStyle = 'red';
                            canvas.fillRect(area.x, area.y, area.w, area.h);
                            
                            var c1 = g2.toDomCoords(g2.getValue(0,0), 1);
                            canvas.fillStyle = '#FFFFCC';
                            canvas.fillRect(area.x, c1[1], area.w, 2*(c0[1]-c1[1]));
                        
                            var c2 = g2.toDomCoords(g2.getValue(0,0), 0.25);
                            canvas.fillStyle = '#D1FFD1';
                            canvas.fillRect(area.x, c2[1], area.w, 2*(c0[1]-c2[1]));
                        },
                    }// options
                );
            
        }
    };
    
    var dfrom = document.getElementById("formDate").dateinput.value;
    var dto = document.getElementById("formDate").dateinput2.value;

    //var url = "/ajax/getLsbChangeFromPurged.php?site=" + frm.sitegeneral.value + "&node=" + frm.node.value;
    var d = new Date();
    var url = "http://www.dewslandslide.com/ajax/getLsbChangeFromPurged.php?site=" + frm.sitegeneral.value + "&node=" + frm.node.value + "&start=" + dfrom + "&end=" + dto + "+" + addZero(d.getHours()) + ":" + addZero(d.getMinutes());
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}