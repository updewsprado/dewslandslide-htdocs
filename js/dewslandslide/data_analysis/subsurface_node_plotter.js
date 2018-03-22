$(document).ready(() => {
    initializeNodeSelector();
    const input = {
    	column_name: "agbta",
    	start_date: "2016-01-15",
    	end_date: "2016-01-21",
    	node: "1-3-5"
    }
    initializeSubsurfaceNode(input);
    initializeOnNodeClicked();
    initializeNodeSummaryDurationOnDropdownClick();
    // initializeOnNodePlot();
});

function initializeNodeSelector () {
	const column_name = "barta";
	getSiteNodeNumber(column_name)
	.done((sources) => {
		createNodes(sources);
	})
	clearNodes();
;}

function initializeOnNodeClicked () {
	let hasEdit = false;
	let nodes = [], event_ids = [];
    $("body").on("click", "#node-list.dropdown-menu a", ({ target }) => {

    	var $target = $(target),
    	val = $target.attr( 'data-value' ),
        event_id = $target.attr( 'data-event' ),
        $inp = $target.find( 'input' ),
        idx;
    	console.log(val);

    	if ( ( idx = nodes.indexOf( val ) ) > -1 ) 
        {
            nodes.splice( idx, 1 ); event_ids.splice(idx, 1);
            setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
        } else {
            nodes.push( val ); event_ids.push( event_id );
            setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
        }

        $( target ).blur();
        var str = nodes.toString();
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        str = str.replaceAll("," , ", ");
        $("#nodes").val(str);

        if( event_ids.length > 0 )
        {
      //   	const nodes_selected = event_ids.join("-");
    		// // initializeOnNodePlot(nodes_selected);
    		// plotSubsurfaceNode(nodes_selected);
      //       console.log(nodes_selected);
        }

        return false;
    	
	});
}

function initializeOnNodePlot () {
	$("#plot-node-level").click(function(){
		const nodes = $("#nodes").val();
		const formatted_nodes = node.join("-");
    	if (nodes_selected) {
    		plotSubsurfaceNode(nodes_selected);
    		// alert(nodes_selected);
    	}else {
    		alert("please select a node");
    	}
	});
}

function clearNodes() {
	$("#clear-nodes").click( function (argument) {
        $(".node-checkbox").prop("checked", false);
        $("#nodes").val("");
        
    });
}

function initializeSubsurfaceNode (input) {
	getPlotDataForNode(input)
    .done((subsurface_node_data) => {
        // console.log(datalist);
        subsurface_node_data.forEach(({ series_name, data }) => {
            if (series_name === "battery") createBatteryChart(data);
            else if (series_name === "x-accelerometer") createXAccelerometerChart(data);
            else if (series_name === "y-accelerometer") createYAccelerometerChart(data);
            else if (series_name === "z-accelerometer") createZAccelerometerChart(data);
        });
        $("#loading").modal("hide");
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function initializeNodeSummaryDurationOnDropdownClick () {
	$("#node-summary-duration li").click(({ target }) => {
        const { value, duration } = $(target).data();
        const parent_id = $(target).parents(".btn-group").prop("id");
        console.log($(target).data());
        $(`#${parent_id} li.active`).removeClass("active");
        $(target).parent().addClass("active");

        $(`#${parent_id}-btn`).empty()
        .append(`${value} ${duration}&emsp;<span class="caret"></span>`);

        const form = {
            column_name: "agbta",
            start_date: getStartDate(parent_id.replace("-duration", "")),
            end_date: moment($("#data_timestamp").val()).format("YYYY-MM-DDTHH:mm"),
            node: "1-3-5"
        };
        console.log(form);

        $("#loading").modal("show");

        if (parent_id === "node-summary-duration") {
            plotSubsurfaceNode(form);
        } //else plotSubsurfaceAnalysisCharts(form);
    });
}

function getSiteNodeNumber (column_name) {
    return $.getJSON(`../site_analysis/NodeNumberPerSite/${column_name}`)
    .catch(err => err);
}

function plotSubsurfaceNode (form){
	$("#battery-graph").empty();
	$("#x-accelerometer-graph").empty();
	$("#y-accelerometer-graph").empty();
	$("#z-accelerometer-graph").empty();
	// const input = {
 //    	column_name: "agbta",
 //    	start_date: "2016-01-15",
 //    	end_date: "2016-01-21",
 //    	node: sample_node
 //    }
    // console.log(sample_node);
    initializeSubsurfaceNode(form);
}

function createNodes (sources) {
	var node_count;
    sources.forEach(({ num_nodes }) => {
    	node_count = num_nodes;
    });
    appendNodes(node_count);
}

function appendNodes (node_count) {
	$subsurface_nodes = $("#node-list");
	$subsurface_nodes.empty();
	for (var counter = 0; counter < node_count; counter++) {
		const count = counter+1;
		$subsurface_nodes.append(
			'<li>'+
            '<a class="small" tabIndex="3" data-value="'+count+'" data-event="'+count+'">'+
            '<input type="checkbox" class="node-checkbox"/>&nbsp;Node '+count+''+
            '</a>'+
            '</li>'
		);
	}
}

function getPlotDataForNode ({
    column_name, start_date, end_date, node
}) {
	// const { event_ids: event_ids } = node;
    return $.getJSON(`../site_analysis/getPlotDataForNode/${column_name}/${start_date}/${end_date}/${node}`)
    .catch(err => err);
}

function createBatteryChart (battery_data) {
	$("#battery-graph").highcharts({
		series: battery_data,
		chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
		title: {
			text: "",
			// style: {
			// 	color: '#E0E0E3',
			// 	fontSize: '20px'
			// }
		},
		subtitle: {
			text: 'Source :  '
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%Y'
			},
			title: {
				text: 'Date'
			},
			// labels: {
			// 	style:{
			// 		color: 'white'
			// 	}

			// },
			// title: {
			// 	text: 'Date',
			// 	style:{
			// 		color: 'white'
			// 	}
			// },
			// events:{
			// 	afterSetExtremes:function(){
			// 		if (!this.chart.options.chart.isZoomed)
			// 		{                                         
			// 			var xMin = this.chart.xAxis[0].min;
			// 			var xMax = this.chart.xAxis[0].max;
			// 			var zmRange = 0.5;
			// 			zoomEvent(id,zmRange,xMin,xMax,'accel')
			// 		}
			// 	}
			// }
		},
		yAxis:{
			title: {
				text: 'Raw ADC Value'
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			split: true,
		},

		plotOptions: {
			series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
        	layout: 'vertical',
        	align: 'right',
        	verticalAlign: 'middle',
        	borderWidth: 0,
        	itemStyle: {
        		color: '#E0E0E3'
        	},
        	itemHoverStyle: {
        		color: '#FFF'
        	},
        	itemHiddenStyle: {
        		color: '#606063'
        	}
        },
        credits: {
        	enabled: false
        }
	});
}

function createXAccelerometerChart (x_accelerometer_data) {
	$("#x-accelerometer-graph").highcharts({
		series: x_accelerometer_data,
		chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
		title: {
			text: "",
			// style: {
			// 	color: '#E0E0E3',
			// 	fontSize: '20px'
			// }
		},
		subtitle: {
			text: 'Source :  '
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%Y'
			},
			title: {
				text: 'Date'
			},
			// labels: {
			// 	style:{
			// 		color: 'white'
			// 	}

			// },
			// title: {
			// 	text: 'Date',
			// 	style:{
			// 		color: 'white'
			// 	}
			// },
			// events:{
			// 	afterSetExtremes:function(){
			// 		if (!this.chart.options.chart.isZoomed)
			// 		{                                         
			// 			var xMin = this.chart.xAxis[0].min;
			// 			var xMax = this.chart.xAxis[0].max;
			// 			var zmRange = 0.5;
			// 			zoomEvent(id,zmRange,xMin,xMax,'accel')
			// 		}
			// 	}
			// }
		},
		yAxis:{
			title: {
				text: 'Raw ADC Value'
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			split: true,
		},

		plotOptions: {
			series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
        	layout: 'vertical',
        	align: 'right',
        	verticalAlign: 'middle',
        	borderWidth: 0,
        	itemStyle: {
        		color: '#E0E0E3'
        	},
        	itemHoverStyle: {
        		color: '#FFF'
        	},
        	itemHiddenStyle: {
        		color: '#606063'
        	}
        },
        credits: {
        	enabled: false
        }
	});
}

function createYAccelerometerChart (y_accelerometer_data) {
	$("#y-accelerometer-graph").highcharts({
		series: y_accelerometer_data,
		chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
		title: {
			text: "",
			// style: {
			// 	color: '#E0E0E3',
			// 	fontSize: '20px'
			// }
		},
		subtitle: {
			text: 'Source :  '
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%Y'
			},
			title: {
				text: 'Date'
			},
			// labels: {
			// 	style:{
			// 		color: 'white'
			// 	}

			// },
			// title: {
			// 	text: 'Date',
			// 	style:{
			// 		color: 'white'
			// 	}
			// },
			// events:{
			// 	afterSetExtremes:function(){
			// 		if (!this.chart.options.chart.isZoomed)
			// 		{                                         
			// 			var xMin = this.chart.xAxis[0].min;
			// 			var xMax = this.chart.xAxis[0].max;
			// 			var zmRange = 0.5;
			// 			zoomEvent(id,zmRange,xMin,xMax,'accel')
			// 		}
			// 	}
			// }
		},
		yAxis:{
			title: {
				text: 'Raw ADC Value'
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			split: true,
		},

		plotOptions: {
			series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
        	layout: 'vertical',
        	align: 'right',
        	verticalAlign: 'middle',
        	borderWidth: 0,
        	itemStyle: {
        		color: '#E0E0E3'
        	},
        	itemHoverStyle: {
        		color: '#FFF'
        	},
        	itemHiddenStyle: {
        		color: '#606063'
        	}
        },
        credits: {
        	enabled: false
        }
	});
}

function createZAccelerometerChart (z_accelerometer_data) {
	$("#z-accelerometer-graph").highcharts({
		series: z_accelerometer_data,
		chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
		title: {
			text: "",
			// style: {
			// 	color: '#E0E0E3',
			// 	fontSize: '20px'
			// }
		},
		subtitle: {
			text: 'Source :  '
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				month: '%e. %b %Y',
				year: '%Y'
			},
			title: {
				text: 'Date'
			},
			// labels: {
			// 	style:{
			// 		color: 'white'
			// 	}

			// },
			// title: {
			// 	text: 'Date',
			// 	style:{
			// 		color: 'white'
			// 	}
			// },
			// events:{
			// 	afterSetExtremes:function(){
			// 		if (!this.chart.options.chart.isZoomed)
			// 		{                                         
			// 			var xMin = this.chart.xAxis[0].min;
			// 			var xMax = this.chart.xAxis[0].max;
			// 			var zmRange = 0.5;
			// 			zoomEvent(id,zmRange,xMin,xMax,'accel')
			// 		}
			// 	}
			// }
		},
		yAxis:{
			title: {
				text: 'Raw ADC Value'
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			split: true,
		},

		plotOptions: {
			series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
        	layout: 'vertical',
        	align: 'right',
        	verticalAlign: 'middle',
        	borderWidth: 0,
        	itemStyle: {
        		color: '#E0E0E3'
        	},
        	itemHoverStyle: {
        		color: '#FFF'
        	},
        	itemHiddenStyle: {
        		color: '#606063'
        	}
        },
        credits: {
        	enabled: false
        }
	});
}