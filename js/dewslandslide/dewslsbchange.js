var column_plot_range;
var roll_period = 48;

function showLSBChange(frm) {
	showLSBChangeGeneral(frm, 'lsb-change-canvas');
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
							column_plot_range = me.xAxisRange();
                            roll_period = me.rollPeriod();	
						},

                        showRoller: true,
                        dateWindow: column_plot_range,
                        rollPeriod: roll_period,
                        colors: ['#284785', '#EE1111', '#006600'],
                        
                        underlayCallback: function(canvas, area, g2) {
                        
                            var c0 = g2.toDomCoords(g2.getValue(0,0), 0);
                            
                            canvas.fillStyle = '#FFB2B2';
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
    
    var url = "ajax/getLsbChangeFromPurged.php?site=" + frm.sitegeneral.value + "&node=" + frm.node.value;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}