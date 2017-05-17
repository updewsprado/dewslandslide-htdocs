$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

$(document).ready(function(e) {
	var values = window.location.href.split("/")
	var current_site = values[5];
	$("#soms_search_tool").hide()
	if(current_site != undefined && current_site != "Select"){
		columnSelect(current_site)
		ValueProcess(current_site)
		if(current_site.slice(3,4) == 's'){
			$("#soms_search_tool").slideDown()
		}else{
			$("#heatmap_li").hide()
		}
	}else{
		columnSelect("Select");
	}

});

function columnSelect(site_selected) {
	$.ajax({ 
		dataType: "json",
		url: "/site_level_page/getAllSiteNamesPerSite",success: function(result) {
			var all_sites = result;
			var names=[];
			for (i = 0; i <  all_sites.length; i++) {
				names.push(all_sites[i].name)
			}
			var select = document.getElementById('sitegeneral');
			names.splice(names.indexOf(site_selected.toLowerCase()), 1 )
			$("#sitegeneral").append('<option value="'+site_selected+'">'+site_selected.toUpperCase()+'</option>');
			var i;
			for (i = 0; i < names.length; i++) {
				var opt = names[i];
				var el = document.createElement("option");
				el.textContent = opt.toUpperCase();

				if(opt == "select") {
					el.value = "none";
				}
				else {
					el.value = opt;
				}

				select.appendChild(el);
			}
		}
	});
	submit();
}
function submit() {
	$('input[id="submit"]').on('click',function(){
		if($("#sitegeneral").val() != ""){
			var curSite = $("#sitegeneral").val();
			$("#soms_search_tool").slideDown()
			$("#siteD").DataTable().clear();
			$("#siteD").DataTable().destroy();
			$("#mTable").DataTable().clear();
			$("#mTable").DataTable().destroy();
			$("#com_graph").empty();
			$("#graph").empty();
			$(".header-site").hide()
			location = "/data_analysis/column/"+curSite;
		}else{
			$("#errorMsg").modal('show')
		}
	});

}
function ValueProcess(curSite) {
	document.getElementById("header-site").innerHTML = curSite.toUpperCase()+" Column Overview"
	showCommHealthPlotGeneral(curSite,'com_graph')
	getAlertmini(curSite,'graph')
	ColumnDataProcess(curSite)
	DataPresence(curSite)
	$(".soms_heatmap").append('<div class="col-md-12" id="heatmap_div"></div>')
	// $('.daygeneral').prop('disabled', true);
	var start = moment().subtract(2, 'days'); 
	$('input[name="datefilter3"]').daterangepicker({
		timePicker: true,
		autoUpdateInput: false,
		timePickerIncrement: 30,
		maxDate: new Date(),
		opens: "right",
		startDate: start,
		locale: {
			cancelLabel: 'Clear'
		},
		singleDatePicker: true,
		showDropdowns: true
	});

	$('input[name="datefilter3"]').on('apply.daterangepicker', function(ev, picker) {
		$("#heatmap_container").empty();
		var time = $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm'));
		var timevalue =time.context.value
		var tdate = timevalue.slice(0,10);
		var time = timevalue.slice(11,16);
		// $('.daygeneral').prop('disabled', false);
		$(".heatmapClass").empty()
		$(".heatmapClass").append('<label class="daygeneral">Days:&nbsp;</label>'+
			'<select class="daygeneral" id="daygeneral"> <option value="">...</option><option value="1d">1 Day</option> <option value="3d">3 Days</option><option value="30d">30 Days</option></select>')
		$('#daygeneral').on('change', function() {

			heatmapProcess(curSite,(tdate+"T"+time),this.value)
		})
	});

	$('input[name="datefilter2"]').on('cancel.daterangepicker', function(ev, picker) {
		$(this).val('Select Date');
	});
}
function removeDuplicates(num) {
	var x,
	len=num.length,
	out=[],
	obj={};

	for (x=0; x<len; x++) {
		obj[num[x]]=0;
	}
	for (x in obj) {
		out.push(x);
	}
	return out;
}


function getAlertmini(site,siteDiv){ 
	let dataSubmit = { site:site}
	$.ajax({url: "/node_level_page/getAllSingleAlertGet/"+site,
		dataType: "json",error: function(xhr, textStatus, errorThrown){
				submit()
				$("#errorMsg").modal('show')},
		success: function(data){
			console.log(data)
			var result = data;
			nodeAlertJSON = JSON.parse(result.nodeAlerts)
			maxNodesJSON = JSON.parse(result.siteMaxNodes)
			nodeStatusJSON = JSON.parse(result.nodeStatus)
			initAlertPlot(nodeAlertJSON,maxNodesJSON,nodeStatusJSON,siteDiv)
		}
	});
}

function ColumnDataProcess(site){
	$.ajax({url: "/site_level_page/getDatafromSiteColumnGet/"+site,
		dataType: "json",
		success: function(data){
			var result = data;
			var site_details = []
			for (i = 0; i < result.length; i++) {
				site_details.push([result[i].name ,result[i].version , 'logger' , result[i].date_install , result[i].date_activation , result[i].region , result[i].barangay , 
					result[i].municipality , result[i].province , 'network' ,'number'])
			}
			$('#siteD').DataTable( {
				data:  site_details,
				"processing": true,
				"paging":   false,
				"ordering": false,
				"info":     false,
				"filter":   false    
			} );
			
		}
	});
	$.ajax({url: "/site_level_page/getDatafromSiteMaintenancGet/"+site,
		dataType: "json",
		success: function(data){
			var result = data;
			var site_maintenace = []
			for (i = 0; i < result.length; i++) {
				site_maintenace.push([result[i].sm_id,result[i].site,result[i].start_date , result[i].end_date , result[i].staff_name , result[i].activity , result[i].object, 
					result[i].remarks])
			}
			$('#mTable').DataTable( {
				data:  site_maintenace,
				"processing": true, 
			} );
		}
	});

}


function DataPresence(site){
	var start = moment().subtract(1, 'days'); 
	var end = moment().add(1, 'days');
	// var start = moment('2016-04-05'); 
	// var end = moment('2016-04-06');
	$.ajax({url: "/site_level_page/getDatafromSiteDataPresence/"+site+"/"+start.format('YYYY-MM-DD')+"/"+end.format('YYYY-MM-DD'),
		dataType: "json",
		success: function(result){
			if(result.length != 0){
				var time_non_moment = []
				var time_index_obj =[]
				var time_data =[]
				var pattern = []
				for (a = 0; a < 48; a++) {
					var time = moment(result[0].timeslice).subtract(a*30, "minutes")
					time_non_moment.push(time.format('YYYY-MM-DD HH:mm:ss'))
				}
				time_non_moment.reverse()
				for (b = 0; b < 48; b++) {
					var time = moment(result[0].timeslice).subtract(a*30, "minutes")
					time_index_obj.push({index:b,time:time_non_moment[b]})
				}
				for (c = 0; c < time_non_moment.length; c++) {
					for (d = 0; d < result.length; d++) {
						if(time_non_moment[c] == result[d].timeslice){
							time_data.push(c)
						}
					}
				}


				colors = [ "#222", "#222"]
				for (e = 0; e < time_data.length; e++) {
					pattern.push({index_x:time_data[e],index_y:1,time:time_data[e],timestamp:time_non_moment[time_data[e]]})
				}
				var colorDomain = d3.extent(pattern, function(d) {
					return d.time;
				});

				var colorScale = d3.scale.linear()
				.domain(colorDomain)
				.range(colors);

				var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d) {
					return "<strong>timestamp:</strong> <span style='color:red'>"+d.timestamp+"</span>";
				}) 

				var svg = d3.select("#data_presence_div")
				.append("svg")
				.attr("width", ($("#data_presence_div").width()))
				.attr("height", 30);

				svg.call(tip);

				var rectangles = svg.selectAll("rect")
				.data(pattern)
				.enter().append("rect")

				rectangles.attr("x", function(d) {
					return d.index_x * ((($("#data_presence_div").width()/48)));})
				.attr("y", function(d) {
					return d.index_y * ((($("#data_presence_div").width()/48)));})
				.attr("width", ((($("#data_presence_div").width()/48)-2)))
				.attr("height", 15).
				style("fill", function(d) {
					return colorScale(d.index_x);})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)}
			}
		});
}



function heatmapProcess(site,tdate,day){		
	$.ajax({ 
		dataType: "json",
		url: "/api/heatmap/"+site+"/"+tdate+"/"+day,  success: function(data_result) {
			if(data_result.slice(0,1) != "E" || data_result.slice(0,1) != "i" ){
				$("#heatmap_container").empty()
				$("#heatmap_div").append('<div id="heatmap_container"></div>')
				var result = JSON.parse(data_result)
				var all_time =[]
				var all_nodes = []
				var pattern_time =[]
				for (a = 0; a < result.length; a++) {
					all_time.push(result[a].ts)
					all_nodes.push(result[a].id)
				}
				var list_time = removeDuplicates(all_time)
				var list_id = removeDuplicates(all_nodes)
				var number_all =[]
				for (b = 0; b < list_id.length; b++) {
					for (c = 0; c < list_time.length; c++) {
						pattern_time.push({id:list_id[b],ts:list_time[c],cval:""})
					}
				}
				var sorted_data_num =[]
				for (d = 0; d < pattern_time.length; d++) {
					number_all.push(d)
					for (e = 0; e < result.length; e++) {
						if((pattern_time[d].id == result[e].id) && (pattern_time[d].ts == result[e].ts) ){
							sorted_data_num.push(d)
						}
					}

				}	
				var remove_data = []
				for (f = 0; f < sorted_data_num.length; f++) {
					remove_data.push(number_all.splice(number_all.indexOf(sorted_data_num[f]), 1 ) )
				}

				for (f = 0; f < number_all.length; f++) {
					result.push(pattern_time[number_all[f]])
				}
				var sorted_time = []
				for (g = 0; g < list_time.length; g++) {
					for (h = 0; h < result.length; h++) {
						if(list_time[g] == result[h].ts){
							sorted_time .push(result[h])
						}
					}
				}

				var sorted_result_all = []
				for (g = 0; g < list_id.length; g++) {
					for (h = 0; h < result.length; h++) {
						if(list_id[g] == sorted_time[h].id){
							sorted_result_all.push(sorted_time[h])
						}
					}
				}
				var x_heatmap = []
				var y_heatmap =[]
				for (i = 0; i < list_id.length; i++) {
					for (j = 0; j < list_time.length; j++) {
						x_heatmap.push(i)
						y_heatmap.push(j)
					}
				}

				var series_data =[]
				for (k = 0; k < sorted_result_all.length; k++) {
					series_data.push({y:y_heatmap[k],x:x_heatmap[k],value:parseFloat(sorted_result_all[k].cval),
						ts:sorted_result_all[k].ts,id:sorted_result_all[k].id})
				}

				var obj_list_time=[]
				for (l = 0; l < list_time.length; l++) {
					obj_list_time.push({index:l,ts:list_time[l]})
				}

				var obj_list_id=[]
				for (l = 0; l < list_id.length; l++) {
					obj_list_id.push({index:l,id:list_id[l]})
				}

				heatmapVisual(series_data,obj_list_time,obj_list_id)
				$("#heatmap_checkbox").empty()
				$("#heatmap_checkbox").append('<input id="heatmap_checkbox" type="checkbox" class="checkbox"><label for="heatmap_checkbox">Soms Heatmap</label>')
				$('#heatmap_checkbox').prop('checked', true);
				$('input[id="heatmap_checkbox"]').on('click',function () {
					if ($('#heatmap_checkbox').is(':checked')) {
						$("#heatmap_div").slideDown()
					}else{
						$("#heatmap_div").slideUp()
					}
				});
			}else{
				// $(".daygeneral").hide()
				$("#heatmap_div").empty()
				$("#heatmap_div").append('<div id="heatmap_container"><h3> NO DATA </h3></div>')
			}
		}
	});	
}

function heatmapVisual(series_data,list_time,list_id){
	for(var i=0;i<series_data.length;i++){
		if(series_data[i].id == "null" || series_data[i].value == NaN ){
			series_data.splice(i,1);
			i--;
		}
	}
	for(var i=0;i<list_id.length;i++){
		if(list_id[i].id== "null"){
			list_id.splice(i,1);
			i--;
		}
	}
	if(list_id.length != 0){
		times = d3.range(list_time.length);

		var margin = {
			top: 80,
			right: 50,
			bottom: 150,
			left: 50
		};

		var width = $("#svg-commhealth").width() - margin.left - margin.right - 20,
		gridSize = Math.floor(width / list_time.length),
		height = gridSize * (list_id.length+2);

		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Timestamp:</strong> <span style='color:red'>"+d.ts+"</span>"+
			"<br><strong>Value:</strong> <span style='color:red'>"+d.value+"</span>";
		}) 



		var svg = d3.select('#heatmap_container')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var newFontSize = width * 62.5 / 900;
		d3.select("html").style("font-size", newFontSize + "%");

		var colorScale = d3.scale.linear()
		.domain([0,255])
		.range([ "#ffffcc","#ff3300"])

		var x = d3.time.scale()
		.domain([Date.parse(list_time[0].ts),Date.parse(list_time[list_time.length-1].ts)])
		.range([0, width]);

		var xAxis = d3.svg.axis()
		.scale(x);

		
		var dayLabels = svg.selectAll(".dayLabel")
		.data(list_id)
		.enter().append("text")
		.text(function (d) { return d.id; })
		.attr("x", 0)
		.attr("y", function (d, i) { return i * gridSize; })
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

		// var timeLabels = svg.selectAll(".timeLabel")
		// .data(times)
		// .enter().append("text")
		// .text(function(d) { return d; })
		// .attr("x", function(d, i) { return i * gridSize; })
		// .attr("y", 0)
		// .style("text-anchor", "middle")
		// .attr("transform", function(d) {
		// 	return "rotate(-65)" 
		// })
		// .attr("class", function(d, i) { return ((i >= 8 && i <= 17) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

		svg.call(tip);
		var heatMap = svg.selectAll(".hour")
		.data(series_data)
		.enter().append("rect")
		.attr("x", function(d) { return (d.y ) * gridSize; })
		.attr("y", function(d) { return (d.x ) * gridSize; })
		.attr("class", "hour bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("stroke", "white")
		.style("fill", function(d) { return colorScale(d.value); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.append("g");

		// svg.append("g")
		// .attr("class", "x axis")
		// .attr("transform", "translate(0," + (gridSize * list_time.length + 120) + ")")
		// .call(xAxis)
		// .selectAll("text")
		// .attr("y", 0)
		// .attr("x", 9)
		// .attr("dy", ".35em")
		// .attr("transform", "rotate(-90)")
		// .style("text-anchor", "middle");

		svg.append("text")
		.attr("class", "title")
		.attr("x", width/2)
		.attr("y", -40)
		.style("text-anchor", "middle")
		.text("Soms Heatmap");


		var countScale = d3.scale.linear()
		.domain([0, 255])
		.range([0, width])

		var numStops = 10;
		countRange = countScale.domain();
		countRange[2] = countRange[1] - countRange[0];
		countPoint = [];
		for(var i = 0; i < numStops; i++) {
			countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
		}


		svg.append("defs")
		.append("linearGradient")
		.attr("id", "legend-traffic")
		.attr("x1", "0%").attr("y1", "0%")
		.attr("x2", "100%").attr("y2", "0%")
		.selectAll("stop") 
		.data(d3.range(numStops))                
		.enter().append("stop") 
		.attr("offset", function(d,i) { 
			return countScale( countPoint[i] )/width;
		})   
		.attr("stop-color", function(d,i) { 
			return colorScale( countPoint[i] ); 
		});



		var legendWidth = Math.min(width*0.8, 400);

		var legendsvg = svg.append("g")
		.attr("class", "legendWrapper")
		.attr("transform", "translate(" + (width/2) + "," + (gridSize * list_id.length + 120) + ")");


		legendsvg.append("rect")
		.attr("class", "legendRect")
		.attr("x", -legendWidth/2)
		.attr("y", 0)
		.attr("width", legendWidth)
		.attr("height", 10)
		.style("fill", "url(#legend-traffic)");


		legendsvg.append("text")
		.attr("class", "legendTitle")
		.attr("x", 0)
		.attr("y", -10)
		.style("text-anchor", "middle")
		.text("Soms Scale");


		var xScale = d3.scale.linear()
		.range([-legendWidth/2, legendWidth/2])
		.domain([ 0, 255] );


		var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(5)
		.scale(xScale);


		legendsvg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (10) + ")")
		.call(xAxis);
	}else{
		// $(".daygeneral").hide();
		$("#heatmap_div").empty()
		$("#heatmap_div").append('<div id="heatmap_container"><h3 style="text-align: center"> NO DATA </h3></div>')
	}
}