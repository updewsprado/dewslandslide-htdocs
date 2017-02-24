// $(document).ajaxStart(function () {
// 	$('#loading').modal('toggle');
// });
// $(document).ajaxStop(function () {
// 	$('#loading').modal('toggle');
// });
$(document).ready(function(){
	$("body").tooltip({ selector: '[data-toggle=tooltip]' });   
	$("body").tooltip({ selector: '[data-toggle=popover]' });   

});
$(document).ready(function(e) {
	dropdowlistAppendValue()
	$('#sitegeneral').selectpicker();
	$('.checkbox').prop('disabled', true);
	$.get("../site_level_page/getAllSiteNames").done(function(data){
		var per_site = JSON.parse(data);
		for (a = 0; a <  per_site.length; a++) {
			dropdowlistAppendValue(per_site[a].name, (per_site[a].name).toUpperCase(),'#sitegeneral');
		}
	})

	$("#sitegeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selecte_site = $(this).find('option').eq(clickedIndex).text();

		var start = moment().subtract(2, 'days'); 
		var end = moment().add(1, 'days');

		$('input[name="datefilter"]').daterangepicker({
			autoUpdateInput: false,
			maxDate: new Date(),
			opens: "right",
			startDate: start,
			endDate: end,
			locale: {
				cancelLabel: 'Clear'
			}
		});

		$('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
			var time = $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
			alert(time.context.value)
		});

		$('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
			$(this).val('Select Date');
		});

		$('.columngeneral').empty();
		$('.crackgeneral').empty();
		$('.columngeneral').append('<label for="columngeneral">Column</label><br><select class="selectpicker"  id="columngeneral" data-live-search="true"></select>');
		$('.crackgeneral').append('<label for="crackgeneral">Cracks</label><br><select class="selectpicker"  id="crackgeneral" data-live-search="true" ></select>');
		$('#crackgeneral').attr('disabled',true)
		$('#columngeneral').selectpicker();
		$('#crackgeneral').selectpicker();
		$('#columngeneral').append('<option >Select Column</option>');
		$('#crackgeneral').append('<option >Select Crack</option>');
		$.ajax({url: "/api/SiteDetails/"+selecte_site , dataType: "json",success: function(result){
			for (b = 0; b <  result.length; b++) {
				dropdowlistAppendValue(result[b].name, (result[b].name).toUpperCase(),'#columngeneral');

			}
			SelectedColumn(selecte_site);
		}
	})
	});
});

function dropdowlistAppendValue(newitemnum, newitemdesc ,id) {
	$(id).append('<option val="'+newitemnum+'">'+newitemdesc+'</option>');
	$(id).selectpicker('refresh'); 
}

function mapGenerator(site) {
	$.ajax({url: "/api/SiteDetails/"+site , dataType: "json",success: function(result){
		var map = new google.maps.Map(document.getElementById('map-canvas'), {
			zoom: 7,
			center: new google.maps.LatLng(parseFloat(result[0].lat),parseFloat(result[0].lon)),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(parseFloat(result[0].lat),parseFloat(result[0].lon)),
			map: map
		});
	}
})
}

function SelectedColumn(selecte_site) {
	$("#columngeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		$( "#analysis_panel_body").empty();
		$(".ground_table").empty()
		var selecte_column = $(this).find('option').eq(clickedIndex).text();
		CheckBoxSiteLevel(selecte_site,selecte_column);
		$('.checkbox').prop('disabled', false);
		$('#ground_measurement_checkbox').prop('checked', true);
		$('#data_presence_checkbox').prop('checked', true);
		$('#communication_health_checkbox').prop('checked', true);
		$('#node_summary_checkbox').prop('checked', true);
		$(".ground_table").append(' <table id="ground_table" class="display table" cellspacing="0"></table>')
		$( "#analysis_panel_body").append('<small id="small_header"><b>&nbsp;&nbsp;&nbsp;'+selecte_site.toUpperCase()+'&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;'
			+selecte_column.toUpperCase()+'</b></small><div class="panel panel-default "><div class="panel-body"><div class="col-md-12" id="divData"></div> </div></div>');
		$("#divData").append('<h1 id="site_info"></h1>')
		$("#divData").append('<h3 id="site_info_sub"></h3>')
		$("#divData").append('<h4 id="site_info_sub_sub"></h4><hr>')
		var panel_div_name =["site","column","node"];
		var panel_name=["Site","Column","Node"]
		for(var a = 0; a < panel_div_name.length; a++){
			$("#divData").append('<div class="panel panel-default"><div class="panel-heading"><h2 class="header_right_level"><a data-toggle="collapse"  href="#'+panel_div_name[a]+'_collapse">'+panel_name[a]+' Level Overview</a></h2>'+
				'</div><div id="'+panel_div_name[a]+'_collapse" class="panel-body '+panel_div_name[a]+'_level panel-collapse collapse in"></div></div>')
		}
		$(".site_level").append('<div class = "col-md-3 map-canvas" id="map-canvas"></div>')
		$(".site_level").append('<div class="col-md-8 " id="data_presence"><div id="data_presence_div"><h4><span class=""></span><b> Data Presence</b></h4></div></div>')
		$(".site_level").append('<br><br><br><div class="col-md-8" ><div id="surficial_graph"><h4><span class="glyphicon "></span><b>Superimpose Surficial Graph</b>'+
			'&nbsp;<a id="tooltip_surficial" data-toggle="tooltip" data-placement="right" title="Surficial Measurement Data Table"><span class="glyphicon glyphicon-calendar" aria-hidden="true" data-toggle="modal" data-target="#groundModal"></span></a>'+
			'</h4><br><div id="alert_div"></div><div id="ground_graph"></div><div>')

		SiteInfo(selecte_column)
		DataPresence(selecte_column,'data_presence_div')
		NodeSumary(selecte_column,'node_summary_div')
		mapGenerator(selecte_column)
		// siteMaintenance(selecte_column)
		showCommHealthPlotGeneral(selecte_column,'healthbars')
		
		$('.nodegeneral').empty();
		$('.nodegeneral').append('<label for="nodegeneral">Node</label><select class="selectpicker"  id="nodegeneral" multiple data-live-search="true"></select>');
		$('#nodegeneral').selectpicker();
		let dataSubmit = {
			site : selecte_site
		}
		$.post("../surficial_page/getDatafromGroundCrackName", {data : dataSubmit} ).done(function(data_result){ // <----------------- Data for crack name
			var result= JSON.parse(data_result)
			var crack_name= [];
			for (i = 0; i <  result.length; i++) {
				dropdowlistAppendValue(result[i].crack_id, ((result[i].crack_id).toUpperCase()),'#crackgeneral');
				crack_name.push(result[i].crack_id)
			}
			dataTableProcess(dataSubmit,crack_name)
			
		});
		$.ajax({url: "/api/NodeNumberPerSite/"+selecte_column , dataType: "json",success: function(result){
			for (c = 0; c <  result.length; c++) {
				for (d = 0; d <  result[c].num_nodes; d++) {
					dropdowlistAppendValue((d+1),(d+1),'#nodegeneral');
				}
			}
			SelectedNodes(selecte_site,selecte_column)
		}
	})
	});
}

function CheckBoxSiteLevel(selecte_site,selecte_column){
	$('.checkbox').empty()
	var list_checkbox =["data_presence","ground_measurement","rain_graph","surficial_velocity",
	"piezo","sub_surface_analysis","communication_health","node_summary","x_accel","y_accel",
	"z_accel","soms_raw","soms_cal","batt"];
	var name_checkbox =["Data Presence","Surficial Measurement Graph/Data Table","Rainfall Graph","Surficial Analysis Graph",
	"Piezometer Graph","SubSurface Analysis Graph","Communication Health","Node Summary","X Accel Graph","Y Accel Graph",
	"Z Accel Graph","Soms Raw Graph","Soms Cal Graph","Battery Graph"]
	for (a = 0; a <  list_checkbox.length; a++) {
		$("."+list_checkbox[a]+"_checkbox").append('<input id="'+list_checkbox[a]+'_checkbox" type="checkbox"><label for="'+list_checkbox[a]+'_checkbox">'+name_checkbox[a]+'</label>')
	}
	
	$('input[id="'+list_checkbox[0]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[0]+'_checkbox').is(':checked')) {
			$('#data_presence').show()
		}else{
			$('#data_presence').hide()
		}
	});
	$('input[id="'+list_checkbox[1]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[1]+'_checkbox').is(':checked')) {
			$('#surficial_graph').show()
		}else{
			$('#surficial_graph').hide()
		}
	});
	$('input[id="'+list_checkbox[6]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[6]+'_checkbox').is(':checked')) {
			$('#commhealth_div').show()
		}else{
			$('#commhealth_div').hide()
		}
	});
	$('input[id="'+list_checkbox[7]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[7]+'_checkbox').is(':checked')) {
			$('#node_summary_div').show()
		}else{
			$('#node_summary_div').hide()
		}
	});
	$('input[id="'+list_checkbox[2]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[2]+'_checkbox').is(':checked')) {
			$(".site_level").append('<div class="col-md-12" id="raincharts"></div>')
			$("#raincharts").empty()
			RainFallProcess(selecte_site)
		}else{
			$("#raincharts").empty()
		}
	});	
	$('input[id="'+list_checkbox[3]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[3]+'_checkbox').is(':checked')) {
			$('#crackgeneral').attr('disabled',false)
			$('#crackgeneral').selectpicker('refresh')
			$(".site_level").append('<div class="col-md-12" id="surficial_graphs_VD"></div>')
			$("#crackgeneral").change(function () {
				var current_crack = $(this).find("option:selected").text();
				surficialAnalysis(selecte_site,current_crack)
			});
			$("#surficial_graphs_VD").empty()
			$("#surficial_graphs_VD").append('<br><h4><span class=""></span><b>Surficial Analysis Graph </b></h4><ol class="breadcrumb surficial-breadcrumb" id="surficial-breadcrumb"></ol>')
		}else{
			$("#surficial_graphs_VD").empty()
			$("#crackgeneral").prop('selectedIndex',0);
			$('#crackgeneral').selectpicker('refresh')
			$('#crackgeneral').attr('disabled',true)
			$('#crackgeneral').selectpicker('refresh')
		}
	});
	$('input[id="'+list_checkbox[4]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[4]+'_checkbox').is(':checked')) {
			$(".site_level").append('<div class="col-md-12" id="piezometer_div"></div>')
			$("#piezometer_div").empty()
			$("#piezometer_div").append('<br><h4><span class=""></span><b>Piezometer Graph </b></h4><ol class="breadcrumb piezo-breadcrumb" id="piezo-breadcrumb"></ol>')
			piezometer(selecte_column)
		}else{
			$("#piezometer_div").empty()
		}
	});	

}

function siteMaintenance(curSite) {
	let dataSubmit = {site : curSite}
	$("#site_maintenance").append('<br><h4><span class=""></span><b>Site Maintenance</b></h4><table id="mTable" class="display table" cellspacing="0" width="100%">'+
		'<thead><tr><th>ID</th><th>Site Name</th>th>Start Date</th><th>End Date</th><th>Personel</th><th>Activity</th><th>Object(s)</th><th>Remarks</th></tr> </thead><tbody> </tbody></table>')
	$.post("../site_level_page/getDatafromSiteMaintenance", {data : dataSubmit} ).done(function(data){
		var result = JSON.parse(data);
		var site_maintenace = []
		for (i = 0; i < result.length; i++) {
			site_maintenace.push([result[i].sm_id,result[i].site,result[i].start_date , result[i].end_date , result[i].staff_name , result[i].activity , result[i].object, 
				result[i].remarks])
		}
		$('#mTable').DataTable({
			data:  site_maintenace,
			"processing": true, 
			"lengthMenu": [ 10, 25, 50, 75, 100 ]
		} );
	});
}

function NodeSumary(site,siteDiv){ 
	let dataSubmit = { site:site}
	$(".node_level").append('<div class="col-md-9"><div  id="node_summary_div"><h4><span class=""></span><b> Node Summary</b></h4></div></div>')
	$(".column_level").append('<div class="col-md-12 " id="commhealth_div"><h4><span class=""></span><b>Communication Health</b><h5><input type="button" id="show" onclick="showLegends(this.form)" value="Show Legends" /></h5></h4><div  id="legends" style="visibility:hidden; display:none;">'+
		'<input type="button" onclick="barTransition("red")" style="background-color:red; padding-right:5px;" /><strong><font color=colordata[170]>Last 7 Days</font> </strong><br/>'+
		'<input type="button" onclick="barTransition("blue")" style="background-color:blue; padding-right:5px;" /><strong><font color=colordata[170]>Last 30 Days</font></strong><br/>'+
		'<input type="button" onclick="barTransition("green")" style="background-color:green; padding-right:5px;" /><strong><font color=colordata[170]>Last 60 Days</font></strong>'+
		'</div><div class="row" id="healthbars" style=" height: 300px;width:auto"></div></div>')
	$.post("../node_level_page/getAllSingleAlert", {data : dataSubmit} ).done(function(data){
		var result = JSON.parse(data);
		nodeAlertJSON = JSON.parse(result.nodeAlerts)
		maxNodesJSON = JSON.parse(result.siteMaxNodes)
		nodeStatusJSON = JSON.parse(result.nodeStatus)
		initAlertPlot(nodeAlertJSON,maxNodesJSON,nodeStatusJSON,siteDiv)
	});
}

function SiteInfo(site){ 
	let dataSubmit = { site:site}
	$.post("../site_level_page/getDatafromSiteColumn", {data : dataSubmit} ).done(function(data){
		var result = JSON.parse(data); 
		$("#site_info").append("Overview")
		$("#site_info_sub").append(result[0].barangay+" "+result[0].municipality+" "+result[0].province+"("+result[0].name.toUpperCase()+")")
		$("#site_info_sub_sub").append("Date install("+result[0].date_install +") / Date Activation("+result[0].date_activation+")")
	});
}
function DataPresence(site,siteDiv){
	$.ajax({url: "/site_level_page/getDatafromSiteDataPresence/"+site+"/2016-04-20/2016-04-21",
		dataType: "json",
		success: function(result){
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

			var svg = d3.select("#"+siteDiv)
			.append("svg")
			.attr("width", ($(".container").width()-$("#site_info").width())+200)
			.attr("height", 100);

			svg.call(tip);

			var rectangles = svg.selectAll("rect")
			.data(pattern)
			.enter().append("rect")

			rectangles.attr("x", function(d) {
				return d.index_x * (((($(".container").width()-$("#site_info").width())+200)/48));})
			.attr("y", function(d) {
				return d.index_y * (((($(".container").width()-$("#site_info").width())+200)/48));})
			.attr("width", (((($(".container").width()-$("#site_info").width())+200)/48)-2))
			.attr("height", 15).
			style("fill", function(d) {
				return colorScale(d.index_x);})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
		}
	});
}
function SelectedNodes(selecte_site,selecte_column){
	$('#nodegeneral').on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedText = $(this).find('option').eq(clickedIndex).text();
	});
}

function RainFallProcess(curSite){
	$("#raincharts").append('<br><h4><span class=""></span><b>Rain Fall Graph</b></h4><ol class="breadcrumb rain-breadcrumb" id="rain-breadcrumb"></ol>')
	// var fromDate =  $('#reportrange span').html().slice(0,10)
	// var toDate =  $('#reportrange span').html().slice(13,23)
	var fromDate =  '2016-10-10'
	var toDate =  '2016-11-11'
	let dataSubmit = { 
		site : curSite, 
		fdate : fromDate,
		tdate : toDate
	}
	$.post("../site_level_page/getDatafromRainProps", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Rain gauge datas
		var result = JSON.parse(data);
		getRainSenslope(result[0].rain_senslope , fromDate ,toDate , result[0].max_rain_2year,'rain_senslope');
		getRainArq(result[0].rain_arq , fromDate ,toDate , result[0].max_rain_2year,'rain_arq');
		getDistanceRainSite(result[0].RG1, fromDate ,toDate , result[0].max_rain_2year ,'rain1');
		getDistanceRainSite(result[0].RG2, fromDate ,toDate , result[0].max_rain_2year,'rain2');
		getDistanceRainSite(result[0].RG3, fromDate ,toDate , result[0].max_rain_2year,'rain3');
	});
}

function getDistanceRainSite(site,fdate,tdate,max_rain,id) { 
	if(site.slice(0,1) == "r" ){
		getRainNoah(site, fdate ,tdate , max_rain,id);
	}else if(site.length == 4){
		getRainSenslope(site, fdate ,tdate , max_rain,id);
	}else if(site.length == 6){
		getRainArq(site, fdate ,tdate , max_rain,id);
	}

}
function getRainSenslope(site,fdate,tdate,max_rain,id) {
	if(site != null){
		$.ajax({
			url:"/api/RainSenslope/"+site+"/"+fdate+"/"+tdate,
			dataType: "json",
			success: function(data)
			{
				var jsonRespo =JSON.parse(data);
				if(jsonRespo.length != 0){
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'">'+site.toUpperCase()+'</b></li>')
					$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div></div>')
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var colors= ["#EBF5FB","#82b1ff","#448aff"]
					for (i = 0; i < jsonRespo.length; i++) {
						var Data24h=[] ,Datarain=[] ,Data72h=[];
						var time =  Date.parse(jsonRespo[i].ts);
						Data72h.push(time, parseFloat(jsonRespo[i].hrs72));
						Data24h.push(time, parseFloat(jsonRespo[i].hrs24));
						Datarain.push(time, parseFloat(jsonRespo[i].rval));
						DataSeries72h.push(Data72h);
						DataSeries24h.push(Data24h);
						DataSeriesRain.push(Datarain);
						if(jsonRespo[i].hrs24 == null){
							if(jsonRespo[i-1].hrs24 != null && jsonRespo[i].hrs24 == null ){
								nval.push(i);
							}
							if(jsonRespo[i+1].hrs24 != null && jsonRespo[i].hrs24 == null ){
								nval.push(i);

							}else{
								nval.push(i);
								break;
							}
						}
					}
					for (var i = 0; i < nval.length; i=i+2) {
						var n = nval[i];
						var n2 = nval[i+1];
						negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
					}
					var divname =["15mins","24hrs" ,"72hrs"];
					var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
					var color =["red","blue","green"];
					var series_data = [];
					for (i = 0; i < divname.length; i++) {
						series_data.push({ name: divname[i],step: true, data: all_raindata[i] ,id: 'dataseries',fillOpacity: 0.4, zIndex: 0, lineWidth: 1, color: colors[i],zIndex:i+1})
					}
					chartProcessRain(series_data,id,'Senslope',site,max_rain,negative );
				}else{
					$('#'+id).hide()
					
				}
			}
		})
		
	}
}

function getRainArq(site,fdate,tdate,max_rain,id) {
	if(site != null){
		$.ajax({
			url:"/api/RainARQ/"+site+"/"+fdate+"/"+tdate,
			dataType: "json",
			success: function(data)
			{
				var jsonRespo =JSON.parse(data);
				if(jsonRespo.length != 0){
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'">'+site.toUpperCase()+'</b></li>')
					$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div></div>')
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var colors= ["#EBF5FB","#82b1ff","#448aff"]
					for (i = 0; i < jsonRespo.length; i++) {
						var Data24h=[] ,Datarain=[] ,Data72h=[];
						var time =  Date.parse(jsonRespo[i].ts);
						Data72h.push(time, parseFloat(jsonRespo[i].hrs72));
						Data24h.push(time, parseFloat(jsonRespo[i].hrs24));
						Datarain.push(time, parseFloat(jsonRespo[i].rval));
						DataSeries72h.push(Data72h);
						DataSeries24h.push(Data24h);
						DataSeriesRain.push(Datarain);
					}
					for (var i = 0; i < nval.length; i=i+2) {
						var n = nval[i];
						var n2 = nval[i+1];
						negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
					}
					var divname =["15mins","24hrs" ,"72hrs"];
					var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
					var color =["red","blue","green"];
					var series_data = [];
					for (i = 0; i < divname.length; i++) {
						series_data.push({ name: divname[i],step: true, data: all_raindata[i],id : 'dataseries',fillOpacity: 0.4, zIndex: 0, lineWidth: 1, color: colors[i],zIndex:i+1})
					}
					chartProcessRain(series_data,id,'ARQ',site,max_rain,negative );
				}else{
					$('#'+id).hide()
					
				}
			}
		})
	}
}

function getRainNoah(site,fdate,tdate,max_rain,id) {
	if(site != null){
		var rain_noah_number = site.slice(10,20)
		$.ajax({
			url:"/api/RainNoah/"+rain_noah_number+"/"+fdate+"/"+tdate,
			dataType: "json",
			success: function(data)
			{
				var jsonRespo = JSON.parse(data);
				if(jsonRespo.length != 0){
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'">'+site.toUpperCase()+'</b></li>')
					$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div><div>')
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var colors= ["#EBF5FB","#82b1ff","#448aff"]
					for (i = 0; i < jsonRespo.length; i++) {
						var Data24h=[] ,Datarain=[] ,Data72h=[];
						var time =  Date.parse(jsonRespo[i].ts);
						Data72h.push(time, parseFloat(jsonRespo[i].hrs72));
						Data24h.push(time, parseFloat(jsonRespo[i].hrs24));
						Datarain.push(time, parseFloat(jsonRespo[i].rval));
						DataSeries72h.push(Data72h);
						DataSeries24h.push(Data24h);
						DataSeriesRain.push(Datarain);
						if(jsonRespo[i].hrs24 == null){
							if(jsonRespo[i-1].hrs24 != null && jsonRespo[i].hrs24 == null ){
								nval.push(i);
							}
							if(jsonRespo[i+1].hrs24 != null && jsonRespo[i].hrs24 == null ){
								nval.push(i);
							}
						}
					}
					for (var i = 0; i < nval.length; i=i+2) {
						var n = nval[i];
						var n2 = nval[i+1];
						negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
					}
					var divname =["15mins","24hrs" ,"72hrs"];
					var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
					var color =["red","blue","green"];
					var series_data = [];
					for (i = 0; i < divname.length; i++) {
						series_data.push({ name: divname[i],step: true, data: all_raindata[i] , id: 'dataseries', fillOpacity: 0.4 , zIndex: 0, lineWidth: 1, color: colors[i],zIndex:i+1})
					}
					chartProcessRain(series_data,id,'Noah',site,max_rain,negative );
				}else{
					$('#'+id).hide()
					
				}
			}
		})
	}
}

function chartProcessRain(series_data ,id , data_source ,site ,max ,negative ){

	var colors= ["#EBF5FB","#82b1ff","#448aff"]
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		}
	});

	$("#"+id).highcharts({
		chart: {
			type: 'area',
			zoomType: 'x',
			height: 300,
			width:$(".breadcrumb").width(),
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#2a2a2b'],
				[1, '#3e3e40']
				]
			},
		},
		title: {
			text:' <b>Rainfall Data ' + data_source +'('+site+')</b>',
			style: {
				color: '#E0E0E3',
				fontSize: '20px'
			}
		},
		xAxis: {
			plotBands: negative,
			type: 'datetime',
                                    dateTimeLabelFormats: { // don't display the dummy year
                                    month: '%e. %b',
                                    year: '%b'
                                },
                                title: {
                                	text: 'Date'
                                },
                                labels: {
                                	style:{
                                		color: 'white'
                                	}

                                },
                                title: {
                                	text: 'Date',
                                	style:{
                                		color: 'white'
                                	}
                                }
                            },

                            yAxis:{
                 plotBands: [{ // visualize the weekend
                 	value: max/2,
                 	color: colors[1],
                 	dashStyle: 'shortdash',
                 	width: 2,
                 	label: {
                 		text: '24hrs threshold (' + max/2 +')',
                 		style: { color: '#fff',}
                 	}
                 },{
                 	value: max,
                 	color: colors[2],
                 	dashStyle: 'shortdash',
                 	width: 2,
                 	label: {
                 		text: '72hrs threshold (' + max +')',
                 		style: { color: '#fff',}
                 	}
                 }]

             },

             tooltip: {
             	shared: true,
             	crosshairs: true
             },

             plotOptions: {
             	series: {
             		marker: {
             			radius: 3
             		},
             		cursor: 'pointer',
             		point: {
             			events: {
             				click: function () {
             					if(this.series.name =="Comment"){

             						$("#anModal").modal("show");
             						$("#link").append('<table class="table"><label>'+this.series.name+' Report no. '+ this.text+'</label><tbody><tr><td><label>Site Id</label><input type="text" class="form-control" id="site_id" name="site_id" value="'+selectedSite+'" disabled= "disabled" ></td></tr><tr><td><label>Timestamp</label><div class="input-group date datetime" id="entry"><input type="text" class="form-control col-xs-3" id="tsAnnotation" name="tsAnnotation" placeholder="Enter timestamp (YYYY-MM-DD hh:mm:ss)" disabled= "disabled" value="'+moment(this.x).format('YYYY-MM-DD HH:mm:ss')+'" style="width: 256px;"/><div> </td></tr><tr><td><label>Report</label><textarea class="form-control" rows="3" id="comment"disabled= "disabled">'+this.report+'</textarea></td></tr><tr><td><label>Flagger</label><input type="text" class="form-control" id="flaggerAnn" value="'+this.flagger+'"disabled= "disabled"></td></tr></tbody></table>');
             					}else if(this.series.name =="Alert" ){

             						$("#anModal").modal("show");
             						$("#link").append('For more info:<a href="http://www.dewslandslide.com/gold/publicrelease/event/individual/'+ this.text+'">'+this.series.name+' Report no. '+ this.text+'</a>'); 

             					}else if(this.series.name =="Maintenace"){

             						$("#anModal").modal("show");
             						$("#link").append('For more info:<a href="http://www.dewslandslide.com/gold/sitemaintenancereport/individual/'+ this.text+'">'+this.series.name+' Report no. '+ this.text+'</a>'); 
             					}
             					else {
             						$("#annModal").modal("show");
             						$("#tsAnnotation").attr('value',moment(this.category).format('YYYY-MM-DD HH:mm:ss')); 
             					}
             				}
             			}
             		}
             	},
             	area: {
             		marker: {
             			lineWidth: 3,
                                        lineColor: null // inherit from series
                                    }
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
                            series:series_data
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

function dataTableProcess(dataSubmit,crack_name) {  
	$('#tooltip_surficial').tooltip('show')
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
					$("#alert_div").append('<div class="panel-heading" id="A0">No Significant ground movement</div><br>');
				}else if(label_color[n] == "#ffb366"){
					$("#A0").empty()
					$("#alert_div").append("<div class='panel-heading' id='A1' ><b>ALERT!! </b> Significant ground movement observer in the last 24 hours </div><br>");
				}else if(label_color[n] == "#ff6666"){
					$("#A0").empty()
					$("#A1").empty()
					$("#alert_div").append("<div class='panel-heading' id='A2'><b>ALERT!! </b> Critical ground movement observed in the last 48 hours; landslide may be imminent</div><br>");
				}
			}


		}

	});	
}
function surficialGraph(dataTableSubmit) {  
	$.ajax({ 
		dataType: "json",
		url: "/api/GroundDataFromLEWS/"+dataTableSubmit.site,  success: function(data_result) {

			var result = JSON.parse(data_result)
			var slice =[0];
			var data1 =[];
			var data =[];
			var opts = $('#crackgeneral')[0].options;

			var array = $.map(opts, function(elem) {
				return (elem.value || elem.text);
			});
			array.shift()
			var crack_name = array
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
			chartProcessSurficial('ground_graph',series_data,'Superimpose Surficial Graph')
		}
	});	
}
function chartProcessSurficial(id,data_series,name){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'spline',
			zoomType: 'x',
			height: 400,
			width:550
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
function surficialAnalysis(site,crack_id) {  
	$.ajax({ 
		dataType: "json",
		url: "/api/GroundVelocityDisplacementData/"+site+"/"+crack_id,success: function(result) {
			$("#surficial-breadcrumb").append('<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#analysisVelocity">Surficial Velocity</b></li>'+
				'<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#analysisDisplacement">Surficial Displacement</b></li>')
			$("#surficial_graphs_VD").append('<div id="analysisVelocity" class="collapse"></div> <br> <div id="analysisDisplacement" class="collapse"></div> ')
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
			chartProcessSurficialAnalysis('analysisVelocity',series_data_vel,'Velocity Chart of '+crack_id)

			series_data_dis.push({name:series_name[0],data:dvtgnd,type:'scatter'})
			series_data_dis.push({name:'Interpolation',data:dvt,marker:{enabled: true, radius: 0}})
			chartProcessSurficialAnalysis('analysisDisplacement',series_data_dis,' Displacement Chart of '+crack_id)
		}
	});	
}

function chartProcessSurficialAnalysis(id,data_series,name){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'spline',
			zoomType: 'x',
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

function piezometer(curSite){
	$("#piezo-breadcrumb").append('<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#freq_div">Frequency</b></li>'+
		'<li class="breadcrumb-item"><b class="breadcrumb-item" data-toggle="collapse" data-target="#temp_div">Temperature</b></li>')
	$("#piezometer_div").append('<div class="col-md-12"><div id="freq_div"></div></div></div><div class="col-md-12"><div id="temp_div"></div></div></div>')
	$.ajax({
		dataType: "json",
		url: "/api/PiezometerAllData/"+curSite+"pzpz",success: function(result) { 
			console.log(result.length)
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
			chartProcessPiezo('freq_div',freqDataseries,'Piezometer frequency')
			chartProcessPiezo('temp_div',tempDataseries,'Piezometer Temperature')
		} 
	});	
}
function chartProcessPiezo(id,data_series,name){
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