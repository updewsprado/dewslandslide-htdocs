$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

$(document).ready(function(e) {
	$('[data-toggle="popover"]').popover();   
	$('.crack_id_form').hide()
	$(".panel_alert").hide();
	$("#nav-tab-container").hide();
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
	submittedMeas()
	$('#submit').on('click',function(){
		if($("#sitegeneral").val() != ""){
			$(".panel_alert").hide();			
			var subSites =[];
			var curSite = $("#sitegeneral").val();
			var fromDate = $('#reportrange span').html().slice(0,10);
			var toDate = $('#reportrange span').html().slice(13,23);
			$("#nav-tab-container").slideDown();
			$("#graphS1").empty()
			$("#graphS4").empty()
			$("#alert_div").empty()
			$("#graphS1").append('<table id="ground_table" class="display table" cellspacing="0" width="100%"></table>');
			$('.crack_id_form').show()
			$("#popover_note").popover('show')
			$("#crackgeneral").empty();
			$("#analysisVelocity").hide();
			$("#analysisDisplacement").hide();
			$('.crackgeneral').change(function(e) {
				for (i = 1; i <  3; i++) {
					$('.graphS'+i+'-li' ).switchClass( "active", "nav-item");
					$('.graphS'+i+'' ).switchClass( "active", " ");
				}
				$('.graph1-li' ).switchClass( "nav-item", "active");
				$('.graph1' ).switchClass( "tab-pane", "tab-pane fade in active");
			}); 
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
			// piezometer(dataSubmit);
			$.post("/surficial_page/getDatafromGroundCrackName", {data : dataSubmit} ).done(function(data_result){ // <----------------- Data for crack name
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
				dataTableProcess(dataSubmit,crack_name)
				$("#crackgeneral").change(function () {
					var current_crack = $(this).find("option:selected").text();
					$("#analysisVelocity").show();
					$("#analysisDisplacement").show();
					$("#popover_note").popover('destroy')
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

	function dataTableProcess(dataSubmit,crack_name) {  

		$.post("/surficial_page/getDatafromGroundLatestTime", {data : dataSubmit} ).done(function(data_result){
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
			surficialGraph(dataTableSubmit)
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
			for (i = dataSubmit.last.length; i > 0; i--) { // <-- header date process
				if(dataSubmit.all_data_last[i-1].meas_type == "ROUTINE"){
					var color ="color:#4066e2"
				}else if(dataSubmit.all_data_last[i-1].meas_type == "EVENT"){
					var color ="color:#38bee6"
				}else{
					var color ="color:#30eab1"
				}	

				columns_date.push({title:'<center><span id="show-option"  style='+color+' aria-hidden="true" title="'+dataSubmit.all_data_last[i-1].weather+"/"
					+dataSubmit.all_data_last[i-1].meas_type+'">'+moment(dataSubmit.last[i-1]).format('D MMM YYYY HH:mm')+'</span></center>'});
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
			surficialDataTable(dataSubmit,dataTable_timestamp_2,columns_date)
			// gndmeasTableStats()
		});
	}

	function surficialDataTable(dataSubmit,totalSlice,columns_date) {  
		$.ajax({ 
			dataType: "json",
			url: "/api/last10GroundData/"+dataSubmit.site,  success: function(data_result) {
				var result = JSON.parse(data_result)
				var organize_ground_data = []
				var ground_data_all =[]
				var allgather_ground_data =[]
				var allts_data = []
				var table_id_list =[]
				var crackID_withData =[]
				for(var a = 0; a < result.length; a++){
					crackID_withData.push(result[a].crack_id)
					allgather_ground_data.push(result[a].crack_id)
					allts_data.push(result[a].crack_id)
					for(var b = dataSubmit.last.length; b > 0; b--){
						table_id_list.push(result[a].crack_id+b)
						allgather_ground_data.push(result[a][dataSubmit.last[b-1]])
						allts_data.push(dataSubmit.last[b-1])
					}
				}

				var total_crackID = dataSubmit.crack_name.length
				for(var c = 0; c < crackID_withData.length; c++){
					dataSubmit.crack_name.splice(dataSubmit.crack_name.indexOf(crackID_withData[c]), 1 ) 
				}

				for(var d = 0; d < dataSubmit.crack_name.length; d++){
					var no_Data_meas=[]
					no_Data_meas.push("<center>"+dataSubmit.crack_name[d]+"</center>")
					for(var e = 0; e < columns_date.length; e++){
						no_Data_meas.push("<center><i>nd</i></center>")
					}
					organize_ground_data.push(no_Data_meas)
				}

				var slice_num_meas=[]
				
				for(var e = 0; e < allgather_ground_data.length; e++){
					for(var f = 0; f < crackID_withData.length; f++){
						if(crackID_withData[f] == allgather_ground_data[e]){
							slice_num_meas.push(e)
						}
					}
				}
				
				var differnce =[];
				var ts_difference =[];
				var total_alert_per_ts=[];
				var hey=[];
				var color_alert = [];
				var id_null_data= [];
				var id_null_ts= [];
				for(var aa = allgather_ground_data.length-1; aa > 0; aa--){
					var d1 = allgather_ground_data[aa]
					var d2 = allgather_ground_data[aa-1]
					var diff = (d2-d1)
					differnce.push(allgather_ground_data[aa]+"-"+allgather_ground_data[aa-1]+"="+(allgather_ground_data[aa]-allgather_ground_data[aa-1]))
					var now = moment(allts_data[aa]);
					var end = moment(allts_data[aa-1]); 
					if((d2 == "nd" || d1 == "nd") || (d2 == "nd" && d1 == "nd") ){
						var roundoff2 = "nd"
					}else{
						var duration = moment.duration(now.diff(end));
						var hours = duration.asHours();
						ts_difference.push(allts_data[aa]+"-"+allts_data[aa-1]+"="+hours)
						var roundoff2 =Math.abs(Math.round((diff/hours)*1000)/1000);
					}
					total_alert_per_ts.push(roundoff2)
					hey.push(roundoff2+"/"+d2+"/"+d1+"/"+aa+"/"+allts_data[aa]+"-"+allts_data[aa-1])
					if(d1 == "nd"){
						id_null_data.push(aa)
						id_null_ts.push(allts_data[aa])
					}
				}
				
				var ground_data_insert =[]
				var ts_null_data = []
				for(var ab = 0; ab < result.length; ab++){
					ground_data_insert.push(result[ab].crack_id)
					ts_null_data.push(result[ab].crack_id)
					for(var bb = dataSubmit.last.length; bb > 0; bb--){
						ground_data_insert.push(result[ab][dataSubmit.last[bb-1]])
						ts_null_data.push({ts:dataSubmit.last[bb-1],meas:result[ab][dataSubmit.last[bb-1]]})
					}
				}
				total_alert_per_ts.reverse()


				for(var aaa = 0 ; aaa < id_null_data.length ; aaa++){
					for(var bb = id_null_data[aaa]; bb > (id_null_data[aaa]-5); bb--){
						if(ground_data_insert[bb] != "nd"){
							var gd2 = ground_data_insert[bb]
							var ts2 = moment(ts_null_data[bb].ts)
							var num_array = bb;
							(total_alert_per_ts[id_null_data[aaa]] = 
								Math.abs(Math.round((gd2-ground_data_insert[id_null_data[aaa]+1])/(moment(ts_null_data[bb].ts)-moment(ts_null_data[id_null_data[aaa]+1].ts)))))
							break;
						}	
					}
				}
				hey.reverse()
				for(var ac = 0; ac < ground_data_insert.length; ac++){
					ground_data_all.push('<center><b title="'+hey[ac-1]+'">'+ ground_data_insert[ac]+' </b></center>')
				}
				var ground_differnce = differnce;

				slice_num_meas.push(allgather_ground_data.length)
				for(var g = 0; g < slice_num_meas.length; g++){
					organize_ground_data.push(ground_data_all.slice(slice_num_meas[g],slice_num_meas[g+1]))
				}
				organize_ground_data.pop();
				

				$('#ground_table').DataTable({
					data: organize_ground_data,
					columns: columns_date,
					"processing": true ,
					"paging":   false,
					"searching": false, 
					"createdRow": function ( row, data, index ) {
						for(var a = dataSubmit.last.length; a > 1 ; a--){
							$('td', row).eq(a).attr('id', 'td-' + index +'-'+ a );
							$('tr', row).eq(a).attr('class', 'td-class-'+ a );
							$('td', row).eq(a).attr('data-container', 'body');
							$('td', row).eq(a).attr('data-toggle', 'tooltip');
							$('td', row).eq(a).attr('data-original-title', '');
							$('td', row).eq(a).attr('bgcolor', '');
							
						}
					}
				});
				var td_number_id =[]
				var tableId_withData = Math.abs(crackID_withData.length-total_crackID)
				for(var h = tableId_withData; h < total_crackID; h++){
					td_number_id.push(h)
				}
				var organiz_divId = []
				for(var i = 0 ; i < td_number_id.length ; i++){
					for(var j = 0  ; j < dataSubmit.last.length+1 ; j++){
						organiz_divId.push("td-"+td_number_id[i]+"-"+(j))
					}
				}
				organiz_divId.reverse()
				hey.reverse()
				total_alert_per_ts.reverse()
				var color_alert =[]
				for(var k = 0 ; k < total_alert_per_ts.length ; k++){
					if(total_alert_per_ts[k] >= 1.8 ){
						color_alert.push("#ff6666")
					}else if(total_alert_per_ts[k] >= 0.250 && total_alert_per_ts[k]<= 1.79 ){
						color_alert.push("#ffb366")
					}else if(total_alert_per_ts[k] <= 0.249 && total_alert_per_ts[k] >= 0  ){
						color_alert.push('#99ff99')
					}else if(total_alert_per_ts[k] == "nd"){
						color_alert.push('#fff')
					}else{
						color_alert.push('#fff')
						
					}
				}
				for(var l = 0 ; l < organiz_divId.length ; l++){	
					$('#'+organiz_divId[l]).attr('bgcolor',color_alert[l])
				}
				var color_label =[]
				for(var m = 0 ; m < slice_num_meas.length-1 ; m++){
					color_label.push(color_alert[(slice_num_meas[m])])
				}

				var color_alert_list=["#99ff99","#ffb366","#ff6666"]
				var label_color = removeDuplicates(color_label);
				
				for(var n = 0 ; n < label_color.length ; n++){
					if(label_color[n] == "#99ff99"){
						$("#A0").show();
						$("#A0").empty();
						$("#A0").append('<div class="panel-heading text-center"><strong>NO SIGNIFICANT GROUND MOVEMENT</strong></div>');
					}else if(label_color[n] == "#ffb366"){
						$("#A0").empty();
						$("#A0").hide();
						$("#A1").show();
						$("#A1").empty();
						$("#A1").append('<div class="panel-heading text-center"><strong><b> ALERT!! </b>SIGNIFICANT GROUND MOVEMENT OBSERVE IN THE LAST 24 HOURS</strong></div>');
					}else if(label_color[n] == "#ff6666"){
						$("#A0").empty();
						$("#A0").hide();
						$("#A1").empty();
						$("#A1").hide();
						$("#A2").show();
					}
				}
			}
		});	
}

// function gndmeasTableStats(site){

// }

function surficialGraph(dataTableSubmit) {  
	$.ajax({ 
		dataType: "json",
		url: "/api/GroundDataFromLEWSInRange/"+dataTableSubmit.site+"/"+dataTableSubmit.fdate+"/"+dataTableSubmit.tdate,  success: function(data_result) {
			var result = JSON.parse(data_result)
			var crackname_process = []
			for (var a = 0; a < result.length; a++) {
				crackname_process.push(result[a].crack_id)
			}
			var slice =[0];
			var data1 =[];
			var data =[];
			var opts = $('#crackgeneral')[0].options;

			var crack_name = removeDuplicates(crackname_process);
			
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
				series_data.push({name:crack_name[a],data:data.slice(slice[a],slice[a+1]),id:(crack_name[a]).replace(/ /g,"")})
			}

			chartProcess2('ground_graph',series_data,'Superimpose Surficial Graph')
			$("#tag_series").val(JSON.stringify(series_data))
			
		}
	});	
}
function surficialAnalysis(site,crack_id) {  
	$.ajax({ 
		dataType: "json",
		url: "/api/GroundVelocityDisplacementData/"+site+"/"+crack_id,success: function(result) {
			if(result.slice(0,1) != "I"){
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
				var a_time =[], v_time = [];
				var vatSeries=[];
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
					up.push([ground_analysis_data["av"].v_threshold[i],ground_analysis_data["av"].a_threshold_up[i],ground_analysis_data["av"].a_threshold_down[i]]);
					line.push([ground_analysis_data["av"].v_threshold[i],ground_analysis_data["av"].a_threshold_line[i]]);
				}
				
				for (var i = 0; i < ground_analysis_data["vat"].a_n.length; i++) {
					a_time.push([ground_analysis_data["vat"].ts_n[i],ground_analysis_data["vat"].a_n[i]])
					v_time.push([ground_analysis_data["vat"].ts_n[i],ground_analysis_data["vat"].v_n[i]])
				}
				vatSeries.push({name:'acceleration',data:a_time,id:'dataseries',type:'line'})
				vatSeries.push({name:'velocity',data:v_time,id:'dataseries',type:'line',yAxis: 1})
				chartProcessSurficialAnalysis2('analysisVAT',vatSeries,'Velocity and  Acceleration Vs Time Chart of '+crack_id,site)

				var series_data_name_vel =[vGraph,up,down,line,last];
				var series_name =["Data","Threshold","TL","LPoint"];
				series_data_vel.push({name:series_name[0],data:series_data_name_vel[0],id:'dataseries',type:'line'})
				series_data_vel.push({name:series_name[2],data:series_data_name_vel[3],type:'line'})
				series_data_vel.push({name:series_name[3],data:series_data_name_vel[4],type:'line',
					marker: { symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'} })
				series_data_vel.push({name:series_name[1],data:series_data_name_vel[1],type:'arearange', lineWidth: 0, fillOpacity: 0.2,zIndex: 0})

				// $('#surficialgeneral').val('analysisVelocity')
				// $('#surficialgeneral').selectpicker('refresh')
				chartProcessSurficialAnalysis3('analysisVelocity',series_data_vel,'Velocity Acceleration Chart of '+crack_id,site)
				series_data_dis.push({name:series_name[0],data:dvtgnd,type:'scatter'})
				series_data_dis.push({name:'Interpolation',data:dvt,marker:{enabled: true, radius: 0}})
				chartProcessSurficialAnalysis('analysisDisplacement',series_data_dis,' Displacement Interpolation Chart of '+crack_id,site)
			}else{
				$("#analysisVelocity").empty()
				$("#analysisVelocity").append('<div class="text-center"> <h3>No Data</h3> </div>')
				$("#analysisDisplacement").empty()
				$("#analysisDisplacement").append('<div class="text-center"> <h3>No Data</h3> </div>')
			}
		}
	});	
}

function piezometer(dataSubmit){
	$("#graphS4").append('<div id="fred_div"></div>');
	$("#graphS4").append('<div id="temp_div"></div>');
	$.ajax({
		dataType: "json",
		url: "/api/PiezometerAllData/ltesapzpz",success: function(result) { 
			var freq_data=[] , temp_data =[];
			var freqDataseries =[] ,tempDataseries =[];
			for(var i = 0; i < result.length; i++){
				var time = Date.parse(result[i].timestamp)
				var freq = [time,parseFloat(result[i].freq)]
				var temp = [time,parseFloat(result[i].temp)]
				freq_data.push(freq)
				temp_data.push(temp)
			}

			freqDataseries.push({name:'frequency',data:freq_data})
			tempDataseries.push({name:'Temperature',data:temp_data})
			chartProcess('fred_div',freqDataseries,'Piezometer frequency')
			chartProcess('temp_div',tempDataseries,'Piezometer Temperature')
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
				width:$("#analysisDisplacement").width()
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

function chartProcessSurficialAnalysis(id,data_series,name,site){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'spline',
			zoomType: 'x',
			panning: true,
			panKey: 'shift',
			width:750
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: '+ (site).toUpperCase()
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%b'
			},
			title: {
				text: 'Date'
			},
		},
		yAxis:{
			title: {
				text: 'Displacement(cm) '
			}
		},
		tooltip: {
			header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
			shared: true,
			crosshairs: true
		},
		plotOptions: {
			line: {
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
	$("#analysisVelocity").addClass("in");


}
function chartProcessSurficialAnalysis2(id,data_series,name,site){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'line',
			zoomType: 'x',
			panning: true,
			panKey: 'shift',
			width:750
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: '+ (site).toUpperCase()
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%b'
			},
			title: {
				text: 'Time(Days)'
			},
		},
		yAxis: [{ 

			title: {
				text: 'Velocity (cm/day)',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			}
		}, { 
			title: {
				text: 'Acceleration (cm/days^2)',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {

				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			opposite: true
		}],
		tooltip: {
			header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
			shared: true,
			crosshairs: true
		},
		plotOptions: {
			line: {
				marker: {
					enabled: false
				}
			}
		},
		credits: {
			enabled: false
		},
		series:data_series
	});
}
function chartProcessSurficialAnalysis3(id,data_series,name,site){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'spline',
			zoomType: 'x',
			panning: true,
			panKey: 'shift',
			width:750
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: '+ (site).toUpperCase()
		},
		xAxis: {
			title: {
				text: 'Velocity(cm/day)'
			},
		},
		yAxis:{
			title: {
				text: 'Acceleration(cm/day^2)'
			}
		},
		tooltip: {
			header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
			shared: true,
			crosshairs: true
		},
		plotOptions: {
			line: {
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
	var site = $('#sitegeneral').val();
	var fdate = $('#reportrange span').html().slice(0,10);
	var tdate = $('#reportrange span').html().slice(13,23);
	var date1 = moment(fdate);
	var date2 = moment(tdate);
	var duration = moment.duration(date2.diff(date1));
	var  list_dates =[];
	for (var i = 1; i < duration.asDays(); i++) {
		list_dates.push(site+((moment(fdate).add(i,'days').format('YYYY-MM-DD')).replace(/-/g, "")).slice(2,10))
	}
	let dataSubmit = { date:list_dates,table:'gndmeas'}
	// $.post("../node_level_page/getAllgintagsNodeTagIDTry/", {data : dataSubmit} ).done(function(data){
	// 	var result = JSON.parse(data)
	// 	var all_crack_id = []
	// 	for (var i = 0; i < result.length; i++) {
	// 		var remark_parse = ((result[i].remarks).split("/"))
	// 		all_crack_id.push(remark_parse[1])
	// 	}
	// 	var label_crack = removeDuplicates(all_crack_id);
	// 	var all_data_tag =[]
	// 	for (var a = 0; a < label_crack.length; a++) {
	// 		var collect =[]
	// 		for (var i = 0; i < result.length; i++) {
	// 			var remark_parse = ((result[i].remarks).split("/"))
	// 			if(remark_parse[1] == label_crack[a] ){
	// 				collect.push({x:parseFloat(remark_parse[3]),text:'',value:remark_parse[4],title:result[i].tag_name})
	// 			}
	// 		}
	// 		all_data_tag.push(collect)
	// 	}

	// 	for (var a = 0; a < label_crack.length; a++) {
	// 		data_series.push({name:'Tag',type:'flags',data:all_data_tag[a],onSeries:label_crack[a],width: 100,showInLegend: false,visible:true})
	// 	}
	// 	data_series.push({name:'Tag'})
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
					month: '%e. %b %Y',
					year: '%b'
				},
				title: {
					text: 'Date'
				},
			},
			tooltip: {
				split: true,
				crosshairs: true,
			},
			plotOptions: {
				spline: {
					marker: {
						enabled: true
					}
				},
				series: {
					marker: {
						radius: 3
					},
					cursor: 'pointer',
					point: {
						events: {
							click: function () {
								if(this.series.name == "Tag"){
									$("#tagModal").modal("show");
									$("#comment-model").empty();
									$("#comment-model").append('<small>REMARKS: </small>'+this.value)
								}else{
									$("#annModal").modal("show");
									$("#tag_value").hide();
									$("#tag_series").hide();
									$("#tag_version").hide();
									$("#tag_crack").hide();
									$('#tag_ids').tagsinput('removeAll');
									$("#tag_time").val(moment(this.x).format('YYYY-MM-DD HH:mm:ss'))
									$("#tag_value").val(this.y)
									$("#tag_crack").val(this.series.name)
									$("#tsAnnotation").attr('value',moment(this.category).format('YYYY-MM-DD HH:mm:ss'));
								}
							}
						}
					}
				},
			},
			credits: {
				enabled: false
			},
			series:data_series
		});
		var chart = $('#'+id).highcharts();
		$( ".highcharts-series-"+(data_series.length-1) ).click(function() {
			var series = chart.series[(data_series.length-1)];
			for (var i = 0; i < label_crack.length; i++) {
				if (series.visible) {
					(chart.series[((data_series.length-(i+1))-1)]).update({
						visible: true,
					});
				}else {
					(chart.series[((data_series.length-(i+1))-1)]).update({
						visible: false,
					});
				}
			}
			
		});
}

function submittedMeas(){

	$('#tag_submit').click(function(){
		var tag_name = $("#tag_ids").tagsinput("items");
		var tag_description = "ground analysis";
		var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
		var tagger = $("#current_user_id").val();
		var time = (($("#tag_time").val()).slice(2,10)).toString()
		var table_element_id = $("#sitegeneral").val()+(time.replace(/-/g, ""));
		var table_used = "gndmeas";
		var remarks = $("#sitegeneral").val()+"/"+($("#tag_crack").val()).replace(/ /g,"")+"/"+$("#tag_value").val()+"/"+moment($("#tag_time").val())+"/"+$("#comment").val();
		var dataSubmit = [];
		for (var i = 0; i < tag_name.length; i++) {
			dataSubmit.push({ 
				'tag_name' : tag_name[i], 
				'tag_description' : tag_description,
				'timestamp' : timestamp,
				'tagger' : tagger,
				'table_element_id' : table_element_id,
				'table_used' :  table_used,
				'remarks' : remarks
			})
		}

		var host = window.location.host;
		$.post("http://"+host+"/generalinformation/insertGinTags",{gintags: dataSubmit})
		.done(function(data) {
		})
		$("#graphS2").empty();
		$("#graphS2").append('<div id="ground_graph" ></div>');
		$("#annModal").modal("hide");
		var series_data_tag = JSON.parse($("#tag_series").val())
		chartProcess2('ground_graph',series_data_tag,'Superimpose Surficial Graph')
	});
}

});

var room = 1;
function education_fields() {

	room++;
	var objTo = document.getElementById('education_fields')
	var divtest = document.createElement("div");
	divtest.setAttribute("class", "form-group removeclass"+room);
	var rdiv = 'removeclass'+room;
	divtest.innerHTML = '<div class="col-sm-3 nopadding"><div class="form-group"> <input type="text" class="form-control" id="Schoolname" name="Schoolname[]" value="" placeholder="School name"></div></div><div class="col-sm-3 nopadding"><div class="form-group"> <input type="text" class="form-control" id="Major" name="Major[]" value="" placeholder="Major"></div></div><div class="col-sm-3 nopadding"><div class="form-group"> <input type="text" class="form-control" id="Degree" name="Degree[]" value="" placeholder="Degree"></div></div><div class="col-sm-3 nopadding"><div class="form-group"><div class="input-group"> <select class="form-control" id="educationDate" name="educationDate[]"><option value="">Date</option><option value="2015">2015</option><option value="2016">2016</option><option value="2017">2017</option><option value="2018">2018</option> </select><div class="input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields('+ room +');"> <span class="glyphicon glyphicon-minus" aria-hidden="true"></span> </button></div></div></div></div><div class="clear"></div>';

	objTo.appendChild(divtest)
}
function remove_education_fields(rid) {
	$('.removeclass'+rid).remove();
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

