$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

$(document).ready(function(e) {
	$('.crack_id_form').hide()
	$.get("../site_level_page/getAllSiteNames").done(function(data){
		var all_sites = JSON.parse(data);
		var names=[];
		for (i = 0; i <  all_sites.length; i++) {
			names.push(all_sites[i].name)
		}

		var select = document.getElementById('sitegeneral');
		$("#sitegeneral").append('<option value="">SELECT</option>');
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
	})
	var per_site_name=[];
	$.get("../site_level_page/getAllSiteNamesPerSite").done(function(data){
		var per_site = JSON.parse(data);
		for (i = 0; i <  per_site.length; i++) {
			per_site_name.push(per_site[i].name)
		}
	})
	$('#searchtool input[id="submit"]').on('click',function(){
		if($("#sitegeneral").val() != ""){
			var subSites =[];
			var curSite = $("#sitegeneral").val();
			var fromDate = $('#reportrange span').html().slice(0,10);
			var toDate = $('#reportrange span').html().slice(13,23);
			// $("#ground_table").DataTable().clear();
			// $("#ground_table").DataTable().destroy();
			$('.crack_id_form').show()
			$("#crackgeneral").empty();
			$("#analysisVelocity").hide();
			$("#analysisDisplacement").hide();
			document.getElementById("header-site").innerHTML = curSite.toUpperCase()+" Site Overview"
			for (i = 0; i <  per_site_name.length; i++) {
				var siteCode = per_site_name[i].slice(0,3)
				if( curSite == siteCode) {
					subSites.push(per_site_name[i])
				}
			}
			let dataSubmit = { 
				site : curSite, 
				fdate : fromDate,
				tdate : toDate
			}
			$.post("../surficial_page/getDatafromGroundCrackName", {data : dataSubmit} ).done(function(data_result){ // <----------------- Data for crack name
				var result= JSON.parse(data_result)
				var crack_name= [];
				for (i = 0; i <  result.length; i++) {
					crack_name.push((result[i].crack_id).toUpperCase())
				}

				var select = document.getElementById('crackgeneral');
				$("#crackgeneral").append('<option value="">Select Crack</option>');
				var i;
				for (i = 0; i < crack_name.length; i++) {
					var opt = crack_name[i];
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
				surficialGraph(curSite,crack_name)
				dataTableProcess(dataSubmit,crack_name)
				$("#crackgeneral").change(function () {
					var current_crack = $(this).find("option:selected").text();
					$("#analysisVelocity").show();
					$("#analysisDisplacement").show();
					surficialAnalysis(curSite,current_crack)
				});
			});
		}else{
			$("#errorMsg").modal('show')
		}
	});
	var start = moment().subtract(7, 'days'); 
	var end = moment().add(1, 'days');

	$('#reportrange').daterangepicker({
		maxDate: new Date(),
		autoUpdateInput: true,
		startDate: start,
		endDate: end,
		opens: "rigth",
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);

	cb(start, end);

	function cb(start, end) {
		$('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));   

	}


	function dataTableProcess(dataSubmit,crack_name) {  

		$.post("../surficial_page/getDatafromGroundLatestTime", {data : dataSubmit} ).done(function(data_result){
			var result= JSON.parse(data_result);
			var last_goodData =[];
			for (i = 0; i < result.length; i++) {
				last_goodData.push(result[i].timestamp)
			}
			let dataTableSubmit = { 
				site : dataSubmit.site, 
				fdate : dataSubmit.fdate,
				tdate : dataSubmit.tdate,
				crack_name:crack_name,
				last:last_goodData,
				all_data_last:result,
			}
			surficialMeasurement(dataTableSubmit)
		});

	}

	function surficialMeasurement(dataSubmit) {  
		$.post("../surficial_page/getDatafromGroundData", {data : dataSubmit} ).done(function(data_result){
			var result= JSON.parse(data_result);
			$( "#show-option" ).tooltip({
				show: {
					effect: "slideDown",
					delay: 150
				}
			});
			var result= JSON.parse(data_result);
			var columns_date =[]; // <-- header timestamp
			var columns_date_tooltip =[]; // <-- header tooltip data

			columns_date.push({title:'Crack ID'});
			for (i = dataSubmit.last.length-1; i > 0; i--) { // <-- header date process
				if(dataSubmit.all_data_last[i].meas_type == "ROUTINE"){
					var color ="color:#4066e2"
				}else if(dataSubmit.all_data_last[i].meas_type == "EVENT"){
					var color ="color:#38bee6"
				}else{
					var color ="color:#30eab1"
				}	

				columns_date.push({title:'<span id="show-option"  style='+color+' aria-hidden="true" title="'+dataSubmit.all_data_last[i-1].weather+"/"
					+dataSubmit.all_data_last[i-1].meas_type+'">'+moment(dataSubmit.last[i-1]).format('D MMM YYYY HH:mm')+'</span>'});
			}

			var dataTable_process_1 = []
			var dataTable_process_1result =[]
			var dataTable_process_1result_time =[]
			for (a = 0; a < dataSubmit.crack_name.length; a++) {
				for (b = 0; b < result.length; b++) {
					if(dataSubmit.crack_name[a] == result[b].crack_id){
						dataTable_process_1.push(result[b].crack_id)
						dataTable_process_1result_time.push(result[b].timestamp)
						dataTable_process_1result.push(result[b])
					}
				}
			}


			var dataTable_timestamp_1=[]
			for (aa = 0; aa < dataSubmit.crack_name.length; aa++) {
				for (bb = 0; bb < dataSubmit.last.length; bb++) {
					 dataTable_timestamp_1.push([dataSubmit.last[bb],dataSubmit.crack_name[aa]])
				}
			}
			
			var dataTable_timestamp_2 = []
			for (cc = dataSubmit.crack_name.length; cc > 0; cc--) {
				 dataTable_timestamp_2.push( dataTable_timestamp_1.length-(cc*dataSubmit.last.length))
			}		

			var dataTable_timestamp_3= []
			for (dd = 0; dd < dataTable_timestamp_2.length; dd++) {
				 dataTable_timestamp_3.push(dataTable_timestamp_1.slice(dataTable_timestamp_2[dd],dataTable_timestamp_2[dd+1]))
			}
			console.log(dataTable_timestamp_3)

			var dataTable_process_2 = [0]
			for (c = 0; c < dataTable_process_1.length; c++) {
				if( dataTable_process_1[c] != dataTable_process_1[c+1]){
					dataTable_process_2.push(c+1)
				}
			}
			var dataTable_process_3result = []
			for(var d = 0; d < dataTable_process_2.length-1; d++){
				dataTable_process_3result.push(dataTable_process_1result.slice(dataTable_process_2[d],dataTable_process_2[d+1]))
			}

			var dataTable_process_4result = []
			var dataTable_process_4 = []
			for(var e = 0; e < dataTable_process_3result.length; e++){
				if( dataTable_process_3result[e].length != dataSubmit.last.length){
					var length = dataTable_process_3result[e].length
					dataTable_process_4.push(dataTable_process_3result[e])
				}else{
					dataTable_process_4result.push(dataTable_process_3result[e])
				}
			}

			surficialDataTable(dataSubmit,dataTable_process_4result,columns_date)
			
			// for(var aaa = 0; aaa < dataTable_timestamp_3.length; aaa++){
			// 	if( dataTable_timestamp_3)

			// }
			
		});
	}

	function surficialDataTable(dataSubmit,data,columns_date) {  
		var data_process_2 =[]
		var crack_with_data = []
		// var sorted_crack =[];
		for(var a = 0; a < data.length; a++){
			var data_process_1 =[]
			data_process_1.push(data[a][0].crack_id)
			crack_with_data.push(data[a][0].crack_id)
			for(var b = data[0].length -1; b > 0; b--){
				data_process_1.push(data[a][b-1].meas)
			}
			data_process_2.push(data_process_1)
		}
		for(var c = 0; c< crack_with_data.length; c++){
			dataSubmit.crack_name.splice( dataSubmit.crack_name.indexOf(crack_with_data[c]), 1 ) 
		}
		for(var d = 0; d< dataSubmit.crack_name.length; d++){
			var data_process_3=[]
			data_process_3.push(dataSubmit.crack_name[d])
			for(var e = 0; e < columns_date.length; e++){
				data_process_3.push(" ")
			}
			data_process_2.push(data_process_3)
		}
		$('#ground_table').DataTable( {
			data: data_process_2 ,
			columns: columns_date,
			"processing": true,
			 
		});
	}
	function surficialGraph(site,crack_name) {  
		$.ajax({ 
			dataType: "json",
			url: "/api/GroundDataFromLEWS/"+site,  success: function(data_result) {
				var result = JSON.parse(data_result)
				var slice =[0];
				var data1 =[];
				var data =[];
				for (var a = 0; a < crack_name.length; a++) {
					var all = []
					for (var i = 0; i < result.length; i++) {
						if(crack_name[a] == result[i].crack_id){
							data1.push(crack_name[a]);
							data.push([Date.parse(result[i].ts) , result[i].meas] );
						}
					}
				}
				for(var a = 0; a < data1.length; a++){
					if(data1[a]!= data1[a+1]){
						slice.push(a+1)
					}
				}
				var series_data=[]
				for(var a = 0; a < crack_name.length; a++){
					series_data.push({name:crack_name[a],data:data.slice(slice[a],slice[a+1]),})
				}
				chartProcess2('ground_graph',series_data,'Superimpose Surficial Graph')
			}
		});	
	}
	function surficialAnalysis(site,crack_id) {  
		$.ajax({ 
			dataType: "json",
			url: "/api/GroundVelocityDisplacementData/"+site+"/"+crack_id,success: function(result) {
				var ground_analysis_data = JSON.parse(result)
				var dvt = [];
				var vGraph =[] ;
				var dvtgnd = [];
				var dvtdata = ground_analysis_data["dvt"];
				var catdata= [];
				var up =[];
				var down =[];
				var line = [];
				var series_data_vel =[];
				var series_data_dis =[];
				for(var i = 0; i < dvtdata.gnd["surfdisp"].length; i++){
					dvtgnd.push([dvtdata.gnd["ts"][i],dvtdata.gnd["surfdisp"][i]]);
					catdata.push(i);
				}
				for(var i = 0; i < dvtdata.interp["surfdisp"].length; i++){
					dvt.push([dvtdata.interp["ts"][i],dvtdata.interp["surfdisp"][i]]);
				}
				var last =[];
				for(var i = 0; i < ground_analysis_data["av"].v.length; i++){
					var data = [];
					data.push( ground_analysis_data["av"].v[i] , ground_analysis_data["av"].a[i]);
					vGraph.push(data);
				}

				for(var i = ground_analysis_data["av"].v.length-1; i < ground_analysis_data["av"].v.length; i++){
					last.push([ground_analysis_data["av"].v[i],ground_analysis_data["av"].a[i]]);
				}

				for(var i = 0; i < ground_analysis_data["av"].v_threshold.length; i++){
					up.push([ground_analysis_data["av"].v_threshold[i],ground_analysis_data["av"].a_threshold_up[i]]);
					down.push([ground_analysis_data["av"].v_threshold[i],ground_analysis_data["av"].a_threshold_down[i]]);
					line.push([ground_analysis_data["av"].v_threshold[i],ground_analysis_data["av"].a_threshold_line[i]]);
				}

				var series_data_name_vel =[vGraph,up,down,line,last];
				var series_name =["Data","TU","TD","TL","LPoint"];
				series_data_vel.push({name:series_name[0],data:series_data_name_vel[0],id:'dataseries'})
				series_data_vel.push({name:series_name[3],data:series_data_name_vel[3],type:'line'})
				series_data_vel.push({name:series_name[4],data:series_data_name_vel[4],type:'scatter',
					marker: { symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'} })
				for(var i = 1; i < series_data_name_vel.length-2; i++){
					series_data_vel.push({name:series_name[i],data:series_data_name_vel[i],type:'line',dashStyle:'shotdot'})
				}
				chartProcess('analysisVelocity',series_data_vel,'Velocity Chart of '+crack_id)

				series_data_dis.push({name:series_name[0],data:dvtgnd,type:'scatter'})
				series_data_dis.push({name:'Interpolation',data:dvt,marker:{enabled: true, radius: 0}})
				chartProcess('analysisDisplacement',series_data_dis,' Displacement Chart of '+crack_id)
			}
		});	
	}
	function chartProcess(id,data_series,name){
		Highcharts.setOptions({
			global: {
				timezoneOffset: -8 * 60
			},
		});
		$("#"+id).highcharts({
			chart: {
				type: 'spline',
				zoomType: 'x',
				// height: 800,
				width:750
			},
			title: {
				text: name,
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: { 
					month: '%e. %b',
					year: '%b'
				},
				title: {
					text: 'Date'
				},
			},
			tooltip: {
				header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
				shared: true,
				crosshairs: true
			},
			plotOptions: {
				spline: {
					marker: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series:data_series
		});
	}
	function chartProcess2(id,data_series,name){
		Highcharts.setOptions({
			global: {
				timezoneOffset: -8 * 60
			},
		});
		$("#"+id).highcharts({
			chart: {
				type: 'spline',
				zoomType: 'x',
				height: 800,
				width:1100
			},
			title: {
				text: name,
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: { 
					month: '%e. %b',
					year: '%b'
				},
				title: {
					text: 'Date'
				},
			},
			tooltip: {
				header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
				shared: true,
				crosshairs: true
			},
			plotOptions: {
				spline: {
					marker: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series:data_series
		});
	}
});

