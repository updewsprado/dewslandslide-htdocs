$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
	$(".bootstrap-select").click(function () {
		$(this).addClass("open");
	});
	$("body").tooltip({ selector: '[data-toggle=tooltip]' }); 
	$("body").popover({ selector: '[data-toggle=popover]' });  

});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
	$(".bootstrap-select").click(function () {
		$(this).addClass("open");
	});
});

$(document).ready(function(e) {
	$(".bootstrap-select").click(function () {
		$(this).addClass("open");
	});
	dropdowlistAppendValue()
	$('#sitegeneral').selectpicker();
	$('.checkbox').prop('disabled', true);
	$('.site-panel').hide();
	$('.column-panel').hide();
	$('.node-panel').hide();
	$('.crackgeneral').hide()
	dateselection();
});


function dropdowlistAppendValue(newitemnum, newitemdesc ,id) {
	$(id).append('<option val="'+newitemnum+'">'+newitemdesc+'</option>');
	$(id).selectpicker('refresh'); 
}


function dateselection() {
	var start = moment().subtract(30, 'days'); 
	var end = moment();

	$('#reportrange0').daterangepicker({
		singleDatePicker: true,
		startDate: end,
	}, cb);

	cb(start, end);

	
	$('#collapseSite' ).switchClass( "collapse", "in");

	
}

function cb(start, end) {
	$('#reportrange0 span').html(end.format('YYYY-MM-DD'));
	var parse_time = $('#reportrange0 span').text();
	var fromDate = start.format('YYYY-MM-DD');
	var toDate = moment(parse_time).add(1,'days').format('YYYY-MM-DD');
	$('.site-panel').slideDown();
	$('.sitegeneral').empty();
	$('.sitegeneral').append('<label for="sitegeneral">Site</label><br><select class="selectpicker"  id="sitegeneral" data-live-search="true"></select>');
	$('#sitegeneral').selectpicker();
	$('#sitegeneral').append('<option >Select Site</option>')
	$.get("../site_level_page/getAllSiteNames").done(function(data){
		var per_site = JSON.parse(data);
		for (a = 0; a <  per_site.length; a++) {
			dropdowlistAppendValue(per_site[a].name, (per_site[a].name).toUpperCase(),'#sitegeneral');
		}
	})
	SelectedSite(fromDate,toDate);

}

function daysOption(id) {
	var day_list_text=["7 days","2 weeks","1 month","3 months","6 months","1 year"];
	var day_list_val =["7d","2w","1m","3m","6m","1y"];
	
	$('#'+id+'_days').selectpicker();
	for (var j = 0; j < day_list_text.length; j++) {
		dropdowlistAppendValue(day_list_val[j], day_list_text[j] ,'#'+id+'_days')
	}
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

/************************/
/***SITE LEVEL PROCESS***/
/************************/

function SelectedSite(from,to) {
	$("#sitegeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_site = ($(this).find('option').eq(clickedIndex).text()).toLowerCase();
		var panel_div_name =["site","column","node"];
		var panel_name=["Site","Column","Node"]
		$("#analysis_panel_body").empty();
		for(var a = 0; a < panel_div_name.length; a++){
			$("#analysis_panel_body").append('<div class=" panel panel-info '+panel_div_name[a]+'_collapse"><div class="panel-heading"><h1 class="header_right_level">'+panel_name[a]+' Overview</h1>'+
				'<h3 id="info_'+panel_div_name[a]+'"></h3></div><div id="'+panel_div_name[a]+'_collapse" class="panel-body '+panel_div_name[a]+'_level "></div></div>')
			$('.'+panel_div_name[a]+'_collapse').hide()
		}
		var panel_alert_colors =['panel-success','panel-warning','panel-danger']
		var alert_note =[('<strong>No Significant ground movement</strong>').toUpperCase(),'<strong>ALERT!! </b> Significant ground movement observer in the last 24 hours</strong>',
		'<strong><b>ALERT!! </b> Critical ground movement observed in the last 48 hours; landslide may be imminent</strong>']
		for(var b = 0; b < panel_alert_colors.length; b++){
			$(".site_level").append(' <div id="panel_alert" class="panel '+panel_alert_colors[b]+'"><div class="panel-heading text-center">'+alert_note[b]+'</div></div>')
			$("."+panel_alert_colors[b]).hide();
		}
		$(".site_level").append('<div class="col-md-12" id="surficial_graph"></div>')
		$("#surficial_graph").empty()
		$("#surficial_graph").append('<h4><span class="glyphicon "></span><b>Superimpose Surficial Graph <select class="selectpicker pull-right" id="surperimpose_days">'+
			'</select></b></h4><br><div id="ground_graph"><div>')
		daysOption('surperimpose')
		$(".ground_table").empty()
		$(".ground_table").append(' <table id="ground_table" class="display table" cellspacing="0"></table>')
		$("#analysis_panel").empty();
		$('.site_collapse').slideDown()
		$('.column_collapse').slideUp()
		$('.node_collapse').slideUp()
		$('#analysis_panel_body' ).switchClass( "original", "change");
		$('.column-panel').slideDown();
		$('#collapseColumn' ).switchClass( "collapse", "in");
		$('#collapseNode' ).switchClass( "in", "collapse");
		$('#surperimpose_days').val('3 months')
		$('#surperimpose_days').selectpicker('refresh');
		$('.column_checkbox').prop('checked', false);
		$('.column_checkbox').prop('disabled', true);
		$('.node-panel').hide();

		SelectdaysOption('surperimpose')
		CheckBoxSite(selected_site,from,to)
		RainFallProcess(selected_site,from,to)
		$.ajax({url: "/api/SiteDetails/"+selected_site , dataType: "json",success: function(result){
			$('.columngeneral').empty();
			$('.columngeneral').append('<label for="columngeneral">Column</label><br><select class="selectpicker"  id="columngeneral" data-live-search="true"></select>');
			$('#columngeneral').selectpicker();
			$('#columngeneral').append('<option value="">Select Column</option>')
			for (b = 0; b <  result.length; b++) {
				if(selected_site == "lab" && result[b].name == "plab" ){
				// dropdowlistAppendValue(result[b].name, (result[b].name).toUpperCase(),'#columngeneral');
			}else{
				dropdowlistAppendValue(result[b].name, (result[b].name).toUpperCase(),'#columngeneral');	
			}
		}
		SelectedColumn(selected_site,from,to);
	}
})
		let dataSubmit = {
			site : (selected_site).toLowerCase(),
			fdate : from,
			tdate : to
		}
		$.post("../surficial_page/getDatafromGroundCrackName", {data : dataSubmit} ).done(function(data_result){
			$('.crackgeneral').empty();
			$('.crackgeneral').append('<label for="crackgeneral">Cracks</label><br><select class="selectpicker"  id="crackgeneral" data-live-search="true"></select>');
			$('#crackgeneral').selectpicker();
			$('#crackgeneral').append('<option value="">Select Crack</option>')
			var result= JSON.parse(data_result)
			var crack_name= [];
			for (i = 0; i <  result.length; i++) {
				dropdowlistAppendValue(result[i].crack_id, ((result[i].crack_id).toUpperCase()),'#crackgeneral');
				crack_name.push(result[i].crack_id)
			}
			dataTableProcess(dataSubmit,crack_name)

		});
	});
}

function CheckBoxSite(site,from,to){
	$('.site_checkbox').empty()
	$('.crackgeneral').slideUp()
	$('#piezo_checkbox').prop('checked', false);
	$('#sub_surface_analysis_checkbox').prop('checked', false);
	$('#piezo_checkbox').prop('disabled', true);
	$('#sub_surface_analysis_checkbox').prop('disabled', true);
	var list_checkbox =["ground_measurement","ground_table","rain_graph","surficial_velocity"];
	var name_checkbox =["Surficial Measurement Graph","Surficial Measurement Data Table","Rainfall Graph","Surficial Analysis Graph"];
	for (a = 0; a <  list_checkbox.length; a++) {
		$("."+list_checkbox[a]+"_checkbox").append('<input class="site_checkbox" id="'+list_checkbox[a]+'_checkbox" type="checkbox"><label for="'+list_checkbox[a]+'_checkbox">'+name_checkbox[a]+'</label>')
	}

	$('#'+list_checkbox[0]+'_checkbox').prop('checked', true);
	$('input[id="'+list_checkbox[0]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[0]+'_checkbox').is(':checked')) {
			$('#surficial_graph').slideDown()

		}else{
			$('#surficial_graph').slideUp()
		}
	});
	$('input[id="'+list_checkbox[1]+'_checkbox"]').on('click',function () {
		if ($('#ground_table_checkbox').is(':checked')) {
			$('#groundModal').modal({backdrop: 'static', keyboard: false})  
			$("#groundModal").modal('show')
		}else{
			$("#groundModal").modal('hide')
		}
		
	});
	$('.close').on('click',function () {
		$('#'+list_checkbox[1]+'_checkbox').prop('checked', false);
	});

	$('input[id="'+list_checkbox[3]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[3]+'_checkbox').is(':checked')) {
			$('.crackgeneral').slideDown()
			$(".site_level").append('<div class="col-md-12 surficial_graphs_VD" id="surficial_graphs_VD"></div>')
			$("#surficial_graphs_VD").empty()
			$("#surficial_graphs_VD").append('<br><h4><span class=""></span><b>Surficial Analysis Graph </b><select class="selectpicker pull-right surficialgeneral"  id="surficialgeneral" multiple><option value="analysisVelocity">Surficial Velocity</option><option value="analysisDisplacement">Surficial Displacement</option></select></h4>')
			$("#surficial_graphs_VD").append('<div id="analysisVelocity" class="collapse"></div> <br> <div id="analysisDisplacement" class="collapse"></div> ')
			$("#surficialgeneral").selectpicker('refresh')
			$(".surficialgeneral").hide();
			$("#crackgeneral").change(function () {
				var current_crack = $(this).find("option:selected").text();
				if(current_crack !="Select Crack"){
					surficialAnalysis(site,current_crack);
					$(".surficialgeneral").slideDown();
				}
			});
		}else{
			$('.crackgeneral').slideUp()
			$("#surficial_graphs_VD").slideUp()
		}
	});
}

function SurficialOnSelect() {
	var name = ['Surficial Velocity','Surficial Displacement']
	var id = ['analysisVelocity','analysisDisplacement']
	$("#surficialgeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_surficial =($(this).find('option').eq(clickedIndex).val());
		for (a = 0; a < name.length; a++) {
			if(selected_surficial ==  id[a]){
				var div1 = document.getElementById(id[a]);
				var collapse_id = div1.getAttribute("class");
				if( collapse_id == "in"){
					$("#"+id[a]).switchClass("in" , "collapse");
				}else{
					$("#"+id[a]).switchClass("collapse" , "in");
				}
			}
		}
	})
}

function SelectdaysOption(id) {
	$("#"+id+"_days").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_days = ($(this).find('option').eq(clickedIndex).val()).toLowerCase();
		var fdate;
		if(selected_days == "7 days"){
			fdate = moment().subtract(7,'days').format('YYYY-MM-DD')
		}else if(selected_days == "2 weeks"){
			fdate = moment().subtract(14,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 month"){
			fdate = moment().subtract(30,'days').format('YYYY-MM-DD')
		}else if(selected_days == "3 months"){
			fdate = moment().subtract(90,'days').format('YYYY-MM-DD')
		}else if(selected_days == "6 months"){
			fdate = moment().subtract(120,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 year"){
			fdate = moment().subtract(1,'year').format('YYYY-MM-DD')
		}

		var site = $("#sitegeneral").val();
		var tdate = moment().add(1,'days').format('YYYY-MM-DD');
		
		let dataTableSubmit = { 
			site : site, 
			fdate : fdate,
			tdate : tdate
		}
		if(id == "surperimpose"){
			surficialGraph(dataTableSubmit)
		}else if(id ==  "rainfall" ){
			RainFallProcess(site,fdate,tdate)
			$('#rainfall_days').val(selected_days)
			$('#rainfall_days').selectpicker('refresh')
		}
		
		
	})
}

function RainFallProcess(curSite,fromDate,toDate){
	$('#rainfallgeneral').selectpicker();
	$('#rainfall_days').selectpicker();
	$(".site_level").append('<div class="col-md-12" id="raincharts"></div>')
	$("#raincharts").empty()
	$("#raincharts").append('<h4><b>Rain Fall Graph</b><select class="selectpicker pull-right rainfall_select"  id="rainfall_days"></select><select class="selectpicker pull-right rainfall_select"  id="rainfallgeneral" multiple ></select></h4><ol class="breadcrumb rain-breadcrumb" id="rain-breadcrumb"></ol><br>')
	$('.rainfall_select').selectpicker('refresh')
	daysOption('rainfall')
	SelectdaysOption('rainfall')
	$(".rain-breadcrumb").hide()
	let dataSubmit = { 
		site : (curSite).toLowerCase(), 
		fdate : fromDate,
		tdate : toDate
	}
	$('.rain_graph_checkbox').empty()
	$.post("../site_level_page/getDatafromRainProps", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Rain gauge datas
		var result = JSON.parse(data);
		getRainSenslope(result[0].rain_senslope , fromDate ,toDate , result[0].max_rain_2year,'rain_senslope');
		getRainArq(result[0].rain_arq , fromDate ,toDate , result[0].max_rain_2year,'rain_arq');
		getDistanceRainSite(result[0].RG1, fromDate ,toDate , result[0].max_rain_2year ,'rain1');
		getDistanceRainSite(result[0].RG2, fromDate ,toDate , result[0].max_rain_2year,'rain2');
		getDistanceRainSite(result[0].RG3, fromDate ,toDate , result[0].max_rain_2year,'rain3');
		$('.rain_graph_checkbox').append('<input id="rain_graph_checkbox" type="checkbox" class="checkbox"><label for="rain_graph_checkbox">Rainfall Graphs</label>')
		$('#rain_graph_checkbox').prop('checked', true);
		$('input[id="rain_graph_checkbox"]').on('click',function () {
			if ($('#rain_graph_checkbox').is(':checked')) {
				$("#raincharts").slideDown()
			}else{
				$("#raincharts").slideUp()
			}
		});	
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
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div></div>')
						dropdowlistAppendValue(id,site.toUpperCase(),'#rainfallgeneral');
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
							// if(jsonRespo[i].hrs24 == null){
							// 	if(jsonRespo[i-1].hrs24 != null && jsonRespo[i].hrs24 == null ){
							// 		nval.push(i);
							// 	}
							// 	if(jsonRespo[i+1].hrs24 != null && jsonRespo[i].hrs24 == null ){
							// 		nval.push(i);

							// 	}else{
							// 		nval.push(i);
							// 		break;
							// 	}
							// }
						}
						for (var i = 0; i < nval.length; i=i+2) {
							var n = nval[i];
							var n2 = nval[i+1];
							negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
						}
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] ,id: 'dataseries',fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
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
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div></div>')
						dropdowlistAppendValue(id,site.toUpperCase(),'#rainfallgeneral');
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
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i],id : 'dataseries',fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
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
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo = JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12"><div id="'+id+'" class="collapse"></div><div>')
						dropdowlistAppendValue(id,site.toUpperCase(),'#rainfallgeneral');
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
							// if(jsonRespo[i].hrs24 == null){
							// 	if(jsonRespo[i-1].hrs24 != null && jsonRespo[i].hrs24 == null ){
							// 		nval.push(i);
							// 	}
							// 	if(jsonRespo[i+1].hrs24 != null && jsonRespo[i].hrs24 == null ){
							// 		nval.push(i);
							// 	}
							// }
						}
						for (var i = 0; i < nval.length; i=i+2) {
							var n = nval[i];
							var n2 = nval[i+1];
							negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
						}
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] , id: 'dataseries', fillOpacity: 0.4 , zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
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
	RainFallOnSelect()
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
			panning: true,
			panKey: 'shift',
			height: 300,
			width:($(".site_collapse").width()-80),
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
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
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
			plotBands: [{
				value: max/2,
				color: colors[1],
				dashStyle: 'shortdash',
				width: 2,
				zIndex: 0,
				label: {
					text: '24hrs threshold (' + max/2 +')',
					style: { color: '#fff',}
				}
			},{
				value: max,
				color: colors[2],
				dashStyle: 'shortdash',
				width: 2,
				zIndex: 0,
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
				
			},
			area: {
				marker: {
					lineWidth: 3,
					lineColor: null 
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
	var show_div =($(".rain-breadcrumb").html()).split("\"")
	var div_rainfall_name = (show_div[10].toString()).split("<")
	var filtered_rain_name = (div_rainfall_name[0].toString()).split(">")
	var rain_name =(filtered_rain_name[1]).toString()
	var div_data_show = show_div[7].toString()
	if(div_data_show== "#rain_arq"){
		$("#rain_arq").addClass("in");
		$('#rainfallgeneral').val(rain_name)
	}else if(div_data_show== "#rain_senslope"){
		$("#rain_senslope").addClass("in");
		$('#rainfallgeneral').val(rain_name)
	}else{
		$(div_data_show).addClass("in");
		$('#rainfallgeneral').val(rain_name)
	}

	$('#rainfallgeneral').selectpicker('refresh')

}

function RainFallOnSelect(){
	var separators = [' ','>','<','/','"'];
	var show_div =($(".rain-breadcrumb").html()).split((new RegExp('[' + separators.join('') + ']', 'g')))
	var all_rain_name = [show_div[21],show_div[51],show_div[81],show_div[111],show_div[141]]
	var all_rain_id = [show_div[14],show_div[44],show_div[74],show_div[104],show_div[131]]
	$("#rainfallgeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_rain =($(this).find('option').eq(clickedIndex).val());
		for (a = 0; a < all_rain_name.length; a++) {
			if(selected_rain ==  all_rain_name[a]){
				var div1 = document.getElementById((all_rain_id[a]).slice(1,15));
				var collapse_id = div1.getAttribute("class");
				if( collapse_id == "in"){
					$(all_rain_id[a]).switchClass("in" , "collapse");
				}else{
					$(all_rain_id[a]).switchClass("collapse" , "in");
				}
			}
		}
	})
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
		var fdate = moment().subtract(90,'days').format('YYYY-MM-DD');
		let dataTableSubmit1 = { 
			site : dataSubmit.site, 
			fdate : fdate,
			tdate : dataSubmit.tdate,
			crack_name:crack_name,
			last:last_goodData,
			all_data_last:result,
		}
		surficialMeasurement(dataTableSubmit)
		surficialGraph(dataTableSubmit1)

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
			var panel_alert_colors =['panel-success','panel-danger','panel-warning']

			for(var n = 0 ; n < label_color.length ; n++){
				if(label_color[n] == "#99ff99"){
					$('.'+panel_alert_colors[0]).show()
					$('.'+panel_alert_colors[0]).empty()
					$('.'+panel_alert_colors[0]).append('<div class="panel-heading text-center"><strong>NO SIGNIFICANT GROUND MOVEMENT</strong></div>')
					$('.'+panel_alert_colors[1]).empty()
					$('.'+panel_alert_colors[1]).hide()
					$('.'+panel_alert_colors[2]).empty()
					$('.'+panel_alert_colors[2]).hide()
				}else if(label_color[n] == "#ffb366"){
					$('.'+panel_alert_colors[0]).empty()
					$('.'+panel_alert_colors[0]).hide()
					$('.'+panel_alert_colors[2]).show()
					$('.'+panel_alert_colors[2]).empty()
					$('.'+panel_alert_colors[2]).append('<div class="panel-heading text-center"><strong><b> ALERT!! </b>SIGNIFICANT GROUND MOVEMENT OBSERVE IN THE LAST 24 HOURS</strong></div>')
					$('.'+panel_alert_colors[1]).empty()
					$('.'+panel_alert_colors[1]).hide()
				}else if(label_color[n] == "#ff6666"){
					$('.'+panel_alert_colors[0]).empty()
					$('.'+panel_alert_colors[0]).hide()
					$('.'+panel_alert_colors[2]).empty()
					$('.'+panel_alert_colors[2]).hide()
					$('.'+panel_alert_colors[1]).show()
					$('.'+panel_alert_colors[1]).empty()
					$('.'+panel_alert_colors[1]).append('<div class="panel-heading text-center"><strong><b> ALERT!! </b>Critical ground movement observed in the last 48 hours; landslide may be imminent</strong></div>')

				}
			}

		}

	});	
}
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
			panning: true,
			panKey: 'shift',
			height: 400,
			width:$("#ground_graph").width()
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
			header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
			shared: true,
			crosshairs: true,
			split: true,
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
				var series_data_name_vel =[vGraph,up,down,line,last];
				var series_name =["Data","Threshold","TL","LPoint"];
				series_data_vel.push({name:series_name[0],data:series_data_name_vel[0],id:'dataseries',type:'line'})
				series_data_vel.push({name:series_name[2],data:series_data_name_vel[3],type:'line'})
				series_data_vel.push({name:series_name[3],data:series_data_name_vel[4],type:'line',
					marker: { symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'} })
				series_data_vel.push({name:series_name[1],data:series_data_name_vel[1],type:'arearange', lineWidth: 0, fillOpacity: 0.2,zIndex: 0})

				$('#surficialgeneral').val('analysisVelocity')
				$('#surficialgeneral').selectpicker('refresh')
				chartProcessSurficialAnalysis('analysisVelocity',series_data_vel,'Velocity Chart of '+crack_id)
				series_data_dis.push({name:series_name[0],data:dvtgnd,type:'scatter'})
				series_data_dis.push({name:'Interpolation',data:dvt,marker:{enabled: true, radius: 0}})
				chartProcessSurficialAnalysis('analysisDisplacement',series_data_dis,' Displacement Chart of '+crack_id)
				$(".surficial_velocity_checkbox").empty()
				$(".surficial_velocity_checkbox").append('<input id="surficial_velocity_checkbox" type="checkbox" class="checkbox">'
					+'<label for="surficial_velocity_checkbox"> Surficial Analysis Graph</label>')
				$('#surficial_velocity_checkbox').prop('checked', true);
				$('input[id="surficial_velocity_checkbox"]').on('click',function () {
					if ($('#surficial_velocity_checkbox').is(':checked')) {
						$("#surficial_graphs_VD").slideDown()
						$(".crackgeneral").slideDown()
					}else{
						$("#surficial_graphs_VD").slideUp()
						$(".crackgeneral").slideUp()
					}
				});	

			}else{
				$("#analysisVelocity").empty()
				$("#analysisVelocity").append('<div class="text-center"> <h3>No Data</h3> </div>')
			}
		}
	});	
}

function chartProcessSurficialAnalysis(id,data_series,name){
	SurficialOnSelect()
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
	$("#analysisVelocity").addClass("in");
}

/************************/
/**COLUMN LEVEL PROCESS**/
/************************/

function SelectedColumn(site,from,to) {
	$("#columngeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_column = ($(this).find('option').eq(clickedIndex).text()).toLowerCase();
		CheckBoxColumn(site,selected_column,from,to)
		$('.column_collapse').slideDown()
		$('.node-panel').slideDown();
		$('.node_collapse').slideUp()
		$('.collapseSite' ).switchClass( "in", "collapse");
		$('#collapseNode' ).switchClass( "collapse", "in");
		$(".column_level").empty()
		SiteInfo(selected_column)
		DataPresence(selected_column,'data_presence')
		NodeSumary(selected_column,'node_summary_div')
		mapGenerator(selected_column)
		// // siteMaintenance(selecte_column)
		$('#communication_health_checkbox').prop('checked', true);
		showCommHealthPlotGeneral(selected_column,'healthbars')
		


		$.ajax({url: "/api/NodeNumberPerSite/"+selected_column , dataType: "json",success: function(result){
			$('.nodegeneral').empty();
			$('.nodegeneral').append('<label for="nodegeneral" class="pull-left">Node</label><select class="selectpicker"  id="nodegeneral" multiple data-live-search="true">'+
				'</select><br><button  id="node_sumbit" type="button" class="node_sumbit btn btn-success btn-xs" style="padding-top: 1px;margin-top: 10px;width: 137px;">Submit</button>');
			$('.node_sumbit').hide();
			$('.node_checkbox').hide();
			$('#nodegeneral').selectpicker();
			$(".bootstrap-select").click(function () {
				$(this).addClass("open");
			});
			for (c = 0; c <  result.length; c++) {
				for (d = 0; d <  result[c].num_nodes; d++) {
					dropdowlistAppendValue((d+1),(d+1),'#nodegeneral');
				}
			}
			SelectedNode(site,selected_column,to)
		}
	})
	});
}

function CheckBoxColumn(site,column,from,to){
	$('.column_checkbox').empty()
	$('.crackgeneral').slideUp()
	var list_checkbox =["data_presence","sub_surface_analysis","communication_health","node_summary","heatmap","piezo"];
	var name_checkbox =["Data Presence","SubSurface Analysis Graph","Communication Health","Node Summary","Soms Heatmap","Piezometer Graph"];
	for (a = 0; a <  list_checkbox.length; a++) {
		$("."+list_checkbox[a]+"_checkbox").append('<input class="column_checkbox" id="'+list_checkbox[a]+'_checkbox" type="checkbox"><label for="'+list_checkbox[a]+'_checkbox">'+name_checkbox[a]+'</label>')
	}

	if(column.slice(3,4) != "s"){
		$("."+list_checkbox[4]+"_checkbox").hide()
	}else{
		$("."+list_checkbox[4]+"_checkbox").show()
	}

	$('#'+list_checkbox[0]+'_checkbox').prop('checked', true);
	$('input[id="'+list_checkbox[0]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[0]+'_checkbox').is(':checked')) {
			$('#data_presence').slideDown()

		}else{
			$('#data_presence').slideUp()
		}
	});

	$('input[id="'+list_checkbox[1]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[1]+'_checkbox').is(':checked')) {
			$(".selectpicker").selectpicker()
			$(".column_level").append('<div class="col-md-12 subsurface_analysis_div" id="subsurface_analysis_div"></div>')
			$("#subsurface_analysis_div").append('<br><h4><b>Sub-Surface Analysis Graph </b>'+
				'<select class="sub_days selectpicker pull-right" id="sub_days"><option value="3d">3 Days </option><option value="5d">5 Days</option><option value="7d">1 Week </option></select>'+
				'<select class="selectpicker pull-right" id="subgeneral" multiple><option value="column_sub">Column</option><option value="dis_sub">Displacement</option><option value="velocity_sub">Velocity</option></select></h4>')
			$("#subgeneral").val('column_sub')
			$(".selectpicker").selectpicker('refresh')
			var title = ["Column","Displacement","Velocity"]
			var id_title =["column","dis","velocity"]
			var id_div=[["colspangraph","colspangraph2"],["dis1","dis2"],["velocity1","velocity2"]]
			for(var a = 0; a < title.length; a++){
				$("#subsurface-breadcrumb").append('<li class="breadcrumb-item" ><b class="breadcrumb-item" data-toggle="collapse" data-target="#'+id_title[a]+'_sub">'+title[a]+' Position</b></li>')
				$("#subsurface_analysis_div").append('<div class="col-md-12"><div id="'+id_title[a]+'_sub" class="collapse">'+
					'<div class="col-md-6"><div id="'+id_div[a][0]+'"></div></div><div class="col-md-6"><div id="'+id_div[a][1]+'"></div></div></div>')
			}
			allSensorPosition(column,(moment(to).subtract(3, 'days')).format('YYYY-MM-DD'),to)
			SubOnSelect()
		}else{
			$(".subsurface_analysis_div").empty()
		}
	});
	$('#'+list_checkbox[2]+'_checkbox').prop('checked', true);
	$('input[id="'+list_checkbox[2]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[2]+'_checkbox').is(':checked')) {
			$('#commhealth_div').slideDown()
			$('#map-canvas').slideDown()
		}else{
			$('#commhealth_div').slideUp()
			$('#map-canvas').slideUp()
		}
	});
	$('#'+list_checkbox[3]+'_checkbox').prop('checked', true);
	$('input[id="'+list_checkbox[3]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[3]+'_checkbox').is(':checked')) {
			$('#node_summary_div').slideDown()

		}else{
			$('#node_summary_div').slideUp()
		}
	});
	$('#'+list_checkbox[4]+'_checkbox').prop('checked', false);
	$('input[id="'+list_checkbox[4]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[4]+'_checkbox').is(':checked')) {
			var start = moment().format('MM-DD-YYYY HH:mm');
			$("#daygeneral").selectpicker();
			$(".column_level").append('<div class="col-md-12" id="heatmap_header"></div>')
			$("#heatmap_header").empty();
			$("#heatmap_header").append('<br><h4><b>Soms Heatmap </b></h4>'+
				'<div class="pull-right"><input id="reportrange3" class="reportrange3 pull-center" type="text" name="datefilter3" style="height: 34px;"value="'+start+'" placeholder="Select Timestamp"/></div>'+
				'<select class="daygeneral pull-right selectpicker" id="daygeneral"><option value="1d">1 Day</option> <option value="3d">3 Days</option><option value="30d">30 Days</option></select><div id="heatmap_div"></div>')
			$("#reportrange3").hide();
			$("#daygeneral").val('3d');
			$("#daygeneral").selectpicker('refresh');
			var time = moment().add(1,"days").format('MM-DD-YYYY');
			heatmapProcess(column,time+'T00:00','3d')
			// HeatmapOnSelect(column)
			HeatmapOnSelectDay(column)
		}
	});
	$('#'+list_checkbox[5]+'_checkbox').prop('checked', false);
	$('input[id="'+list_checkbox[5]+'_checkbox"]').on('click',function () {
		if ($('#'+list_checkbox[5]+'_checkbox').is(':checked')) {
			$(".column_level").append('<div class="col-md-12" id="piezometer_div"></div>')
			$("#piezometer_div").empty()
			$("#piezometer_div").append('<br><h4><span class=""></span><b>Piezometer Graph </b><select class="selectpicker pull-right"  id="piezogeneral" multiple></select></h4><ol class="breadcrumb piezo-breadcrumb" id="piezo-breadcrumb"></ol>')
			piezometer(column)
		}else{
			$("#piezometer_div").empty()
		}
	});

}
function piezometer(curSite){
	$.ajax({
		dataType: "json",
		url: "/api/PiezometerAllData/"+curSite+"pzpz",error: function(xhr, textStatus, errorThrown){
			console.log(textStatus);
			$("#piezo-breadcrumb").append('<h3> NO DATA </h3>')
			$(".piezo_checkbox").empty()
			$(".piezo_checkbox").append('<input id="piezo_checkbox" type="checkbox" class="checkbox">'
				+'<label for="piezo_checkbox"> Piezometer Graph</label>')
			$('#piezo_checkbox').prop('checked', true);
			$('input[id="piezo_checkbox"]').on('click',function () {
				if ($('#piezo_checkbox').is(':checked')) {
					$("#piezometer_div").slideDown()
				}else{
					$("#piezometer_div").slideUp()
				}
			});},
			success: function(result) { 
				$("#piezometer_div").append('<div class="col-md-12"><div id="freq_div"  class="in"></div></div></div><div class="col-md-12"><div class="collapse" id="temp_div"></div></div></div>')
				dropdowlistAppendValue('#freq_div','Frequency','#piezogeneral');
				dropdowlistAppendValue('#temp_div','Temperature','#piezogeneral');
				$("#piezogeneral").val('Frequency');
				$("#piezogeneral").selectpicker('refresh');
				PiezoOnSelect()
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
				$(".piezo_checkbox").empty()
				$(".piezo_checkbox").append('<input id="piezo_checkbox" type="checkbox" class="checkbox">'
					+'<label for="piezo_checkbox"> Piezometer Graph</label>')
				$('#piezo_checkbox').prop('checked', true);
				$('input[id="piezo_checkbox"]').on('click',function () {
					if ($('#piezo_checkbox').is(':checked')) {
						$("#piezometer_div").slideDown()
					}else{
						$("#piezometer_div").slideUp()
					}
				});	
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
			panning: true,
			panKey: 'shift',
				// height: 800,
				width:750
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
function PiezoOnSelect() {
	var name = ['Frequency','Temperature']
	var id = ['freq_div','temp_div']
	$("#piezogeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_piezo =($(this).find('option').eq(clickedIndex).val());
		for (a = 0; a < name.length; a++) {
			if(selected_piezo ==  name[a]){
				var div1 = document.getElementById(id[a]);
				var collapse_id = div1.getAttribute("class");
				if(collapse_id == "in"){
					$("#"+id[a]).switchClass("in" , "collapse");
				}else{
					$("#"+id[a]).switchClass("collapse" , "in");
				}
			}
		}
	})
}

function allSensorPosition(site,fdate,tdate) {
	$.ajax({url: "/api/SensorAllAnalysisData/"+site+"/"+fdate+"/"+tdate,
		dataType: "json",
		success: function(result){
			SubOnSelectDay(site,tdate)
			var data = JSON.parse(result);
			columnPosition(data[0].c)
			displacementPosition(data[0].d,data[0].v)
			$("#reportrange2").popover('hide')
			$("#sub_title").popover('show')
			$(".sub_surface_analysis_checkbox").empty()
			$(".sub_surface_analysis_checkbox").append('<input id="sub_surface_analysis_checkbox" type="checkbox" class="checkbox">'
				+'<label for="sub_surface_analysis_checkbox"> Sub-Surface Analysis Graph</label>')
			$('#sub_surface_analysis_checkbox').prop('checked', true);
			$('input[id="sub_surface_analysis_checkbox"]').on('click',function () {
				if ($('#sub_surface_analysis_checkbox').is(':checked')) {
					$("#subsurface_analysis_div").slideDown()
				}else{
					$("#subsurface_analysis_div").slideUp()
				}
			});	
		}
	});
}
function columnPosition(data_result) {
	if(data_result!= "error"){
		var data = data_result;
		var AlllistId = [] ,  AlllistDate = [];
		var listId = [] , listDate = [];
		var fdatadown= [] , fnum= [] ,fAlldown =[] ,fseries=[] ;
		var fseries2=[] , fdatalat= [],fAlllat =[] ;
		for(var i = 0; i < data.length; i++){
			AlllistId.push(data[i].id);
		}
		for(var i = 0; i < data.length; i++){
			AlllistDate.push(data[i].ts);
			if(data[i].id == data[i+1].id){
				listDate.push(data[i].ts)
			}else{
				listDate.push(data[i].ts)
				break;
			}
		}
		for(var i = 0; i < AlllistId.length; i++){
			if(AlllistId[i] != AlllistId[i+1]){
				listId.push(AlllistId[i])
			}
		}
		for(var i = 0; i < listDate.length; i++){
			for(var a = 0; a < data.length; a++){
				if(listDate[i] == data[a].ts){
					fdatadown.push([data[a].downslope,data[a].depth])
					fdatalat.push([data[a].latslope,data[a].depth])
				}
			}
		}

		for(var a = 0; a < fdatadown.length; a++){
			var num = fdatadown.length-(listId.length*a);
			if(num >= 0 ){
				fnum.push(num);
			}
		}
		for(var a = fnum.length-1; a >= 0; a--){
			if(fnum[a+1] != undefined){
				fAlldown.push(fdatadown.slice(fnum[a+1],fnum[a]))
				fAlllat.push(fdatalat.slice(fnum[a+1],fnum[a]))
			}
		}
		for(var a = 0; a < fAlldown.length; a++){
			fseries.push({name:listDate[a], data:fAlldown[a]})
			fseries2.push({name:listDate[a],  data:fAlllat[a]})
		}
		chartProcessInverted("colspangraph",fseries,"Horizontal Displacement, downslope(mm)")
		chartProcessInverted("colspangraph2",fseries2,"Horizontal Displacement, across slope(mm)")
		$("#column_sub").switchClass("collapse","in");
	}     
}

function displacementPosition(data_result,data_result_v) {
	if(data_result != "error"){
		
		var data = data_result;
		var totalId =[] , listid = [0] ,allTime=[] ,allId=[] , totId = [];
		var fixedId =[] , alldata=[], alldata1=[] , allIdData =[];
		var disData1 = [] , disData2 = [];
		var fseries = [], fseries2 = [];
		var d1= [] , d2 =[];
		for(var i = 0; i < data.length; i++){
			if(data[i].ts == data[i+1].ts ){
				totalId.push(data[i]);
			}else{
				totalId.push(data[i]);
				break;
			}
		}
		for(var i = 1; i < totalId.length +1 ; i++){
			for(var a = 0; a < data.length; a++){
				if(i == data[a].id){
					fixedId.push(data[a]);
				}
			}
		}
		for(var i = 1; i < fixedId.length-1; i++){
			if(fixedId[i].id != fixedId[i+1].id){
				allIdData.push(i)
			}
			if(fixedId[i-1].id == fixedId[i].id){
				totId.push(fixedId[i].id)
			}else{
				totId.push(fixedId[i].id)
				break;
			}
		}

		for(var i = fixedId.length - 1; i >= 0 ; i--){
			var num = fixedId.length-(totId.length*i);
			if(num >= 0 ){
				listid.push(num);
			}
		}

		for(var a = 1; a < (listid.length-1); a++){
			if(listid[a] != undefined){
				disData1.push(fixedId.slice(listid[a],listid[a+1]));
				disData2.push(fixedId.slice(listid[a],listid[a+1])); 
			}
		}
		for(var a = 0; a < disData1.length; a++){
			for(var i = 0; i < disData1[0].length; i++){
				d1.push([Date.parse(disData1[a][i].ts) ,disData1[a][i].downslope])
				d2.push([Date.parse(disData1[a][i].ts) ,disData1[a][i].latslope])
			}
		}
		for(var a = 1; a < disData1.length+1; a++){
			fseries.push({name:(a), data:d1.slice(listid[a],listid[a+1])})
			fseries2.push({name:(a), data:d2.slice(listid[a],listid[a+1])})
		}
		velocityPosition(data_result_v,totalId.length,disData1[0]); 
		chartProcessDis("dis1",fseries,"Displacement, downslope")
		chartProcessDis("dis2",fseries2,"Displacement , across slope")

	}     

}
function velocityPosition(data_result,id,date) {
	if(data_result != "error"){
		var data = data_result;
		var allTime = [] , dataset= [] , sliceData =[];
		var fseries = [], fseries2 = [] ;
		var l2 =[] , l3=[] , alldataNotSlice=[];

		if(data[0].L2.length != 0){
			var catNum=[1];
			for(var a = 0; a < data[0].L2.length; a++){
				allTime.push(data[0].L2[a].ts)
				l2.push([Date.parse(data[0].L2[a].ts) , ((id+1)-data[0].L2[a].id)])
			}
			var symbolD = 'url(http://downloadicons.net/sites/default/files/triangle-exclamation-point-warning-icon-95041.png)';
			for(var a = 0; a < data[0].L2.length; a++){
				fseries.push({ type: 'scatter', zIndex:5, name:'L2',marker:{symbol:symbolD,width: 25,height: 25} , data:l2})
				fseries2.push({type: 'scatter', zIndex:5 ,name:'L2',marker:{symbol:symbolD,width: 25,height: 25} , data:l2})
			}
			for(var a = 0; a < data[0].L3.length; a++){
				allTime.push(data[0].L3[a].ts)
				l3.push([Date.parse(data[0].L3[a].ts) , ((id+1)-data[0].L2[a].id)]);
			}
			var symbolD1 = 'url(http://en.xn--icne-wqa.com/images/icones/1/3/software-update-urgent-2.png)';
			for(var a = 0; a < data[0].L3.length; a++){
				fseries.push({ type: 'scatter', zIndex:5 , name:'L3',marker:{symbol:symbolD1,width: 25,height: 25} , data:l3})
				fseries2.push({type: 'scatter', zIndex:5,name:'L3',marker:{symbol:symbolD1,width: 25,height: 25} , data:l3})
			}
			for(var i = 0; i < id; i++){
				for(var a = 0; a < allTime.length; a++){
					dataset.push([Date.parse(allTime[a]) , i+1])
				}
			}
			for(var a = 0; a < dataset.length; a++){
				for(var i = 0; i < id; i++){
					if(dataset[a][1] == i){
						alldataNotSlice.push(dataset[a])
					}
				}
			}

			for(var i = alldataNotSlice.length - 1; i >= 0 ; i--){
				var num = alldataNotSlice.length-(allTime.length*i);
				if(num >= 0 ){
					sliceData.push(num);
				}
			}
			for(var a = 0; a < sliceData.length; a++){
				catNum.push((sliceData.length-1)-(a+1)+2)
				fseries.push({name:catNum[a], data:dataset.slice(sliceData[a],sliceData[a+1])})
				fseries2.push({name:catNum[a], data:dataset.slice(sliceData[a],sliceData[a+1])})
			}
		}else{
			var catNum=[];
			for(var a = 0; a < id ; a++){
				for(var i = 0; i < date.length; i++){
					dataset.push([Date.parse(date[i].ts),a]);
				}
			}

			for(var i = dataset.length - 1; i >= 0 ; i--){
				var num = dataset.length-(date.length*i);
				if(num >= 0 ){
					sliceData.push(num);
				}
			}

			for(var a = 0; a < sliceData.length-1; a++){
				catNum.push((sliceData.length-2)-(a+1)+2)
				fseries.push({name:(a+1), data:dataset.slice(sliceData[a],sliceData[a+1])})
				fseries2.push({name:(a+1), data:dataset.slice(sliceData[a],sliceData[a+1])})
			}					
		}
		chartProcessbase("velocity1",fseries,"Velocity Alerts, downslope")
		chartProcessbase("velocity2",fseries2,"Velocity Alerts, across slope")   
	}  
}
function chartProcessDis(id,data_series,name){
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
			height: 800,
			width:375
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
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0,
			itemStyle: {
				color: '#0000'
			},
			itemHoverStyle: {
				color: '#0000'
			},
			itemHiddenStyle: {
				color: '#222'
			}
		},
		series:data_series
	});
}

function chartProcessInverted(id,data_series,name){
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
			height: 600,
			width: 375
		},
		title: {
			text: name,
		},
		tooltip: {
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
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0,
			itemStyle: {
				color: '#222'
			},
			itemHoverStyle: {
				color: '#E0E0E3'
			},
			itemHiddenStyle: {
				color: '#606063'
			}
		},
		credits: {
			enabled: false
		},
		series:data_series
	});
}

function chartProcessbase(id,data_series,name){
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
			height: 500,
			width: 375
		},
		title: {
			text: name
		},

		tooltip: {
			headerFormat: '{point.key}',
			pointFormat: ' ',
			crosshairs: true
		},

		credits: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e. %b %Y',
				year: '%b'
			},
			title: {
				text: 'Date'
			}
		},
		legend: {
			enabled: false
		},
		yAxis: {
			title: {
				text: 'Values'
			},

		},
		series:data_series
	});
}

function SubOnSelect() {
	var name = ["Column","Displacement","Velocity"]
	var id=["column","dis","velocity"]
	$("#subgeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_sub =($(this).find('option').eq(clickedIndex).val());

		for (a = 0; a < name.length; a++) {
			if(selected_sub ==  (id[a]+"_sub")){
				var div1 = document.getElementById(id[a]+"_sub");
				var collapse_id = div1.getAttribute("class");
				if(collapse_id == "in"){
					$("#"+id[a]+"_sub").switchClass("in" , "collapse");
				}else{
					$("#"+id[a]+"_sub").switchClass("collapse" , "in");
				}
			}
		}
	})
}
function SubOnSelectDay(column,tdate) {
	$("#sub_days").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_day =($(this).find('option').eq(clickedIndex).val());
		if(selected_day =="3d"){
			var fdate = (moment().subtract(3,'days')).format('YYYY-MM-DD');
		}else if(selected_day =="5d"){
			var fdate = (moment().subtract(5,'days')).format('YYYY-MM-DD');
		}else if(selected_day =="7d"){
			var fdate = (moment().subtract(7,'days')).format('YYYY-MM-DD');
		}
		allSensorPosition(column,fdate,tdate)
	})
}
function HeatmapOnSelect(column) {
	$("#daygeneral").selectpicker();
	var start = moment().add(1,'days').format('MM-DD-YYYY HH:mm'); 
	$('input[name="datefilter3"]').daterangepicker({
		timePicker: true,
		timePickerIncrement: 30,
		autoUpdateInput: false,
		maxDate: new Date(),
		opens: "right",
		drops: "up",
		startDate: start,
		locale: {
			cancelLabel: 'Clear'
		},
		singleDatePicker: true,
		showDropdowns: true
	});
	$('input[name="datefilter3"]').on('apply.daterangepicker', function(ev, picker) {
		var time = $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm'));
		var timevalue =time.context.value
		var tdate = timevalue.slice(0,10);
		var time = timevalue.slice(11,16);
		var day = $("#daygeneral").val();
		$("#heatmap_div").empty();
		heatmapProcess(column,(tdate+"T"+time),day)

	})
}


function HeatmapOnSelectDay(column) {
	$("#daygeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_day = ($(this).find('option').eq(clickedIndex).text()).toLowerCase();
		var timevalue = $("#reportrange3").val();
		var tdate = timevalue.slice(0,10);
		var time = timevalue.slice(11,16);
		if(selected_day == "1 day"){
			var day = '1d'
		}else if( selected_day == "3 days"){
			var day = '3d'
		}else if( selected_day == "30 days"){
			var day = '30d'
		}
		heatmapProcess(column,(moment(tdate).format("MM-DD-YYYY")+"T00:00"),day)
	})
}


function DataPresence(site){
	$('#data_presence_checkbox').prop('checked', true);
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
				.attr("width", ($(".container").width()-$("#info_site").width())+200)
				.attr("height", 100);

				svg.call(tip);

				var rectangles = svg.selectAll("rect")
				.data(pattern)
				.enter().append("rect")

				rectangles.attr("x", function(d) {
					return d.index_x * (((($(".container").width()-$("#info_site").width())+200)/48));})
				.attr("y", function(d) {
					return d.index_y * (((($(".container").width()-$("#info_site").width())+200)/48));})
				.attr("width", (((($(".container").width()-$("#info_site").width())+200)/48)-2))
				.attr("height", 15).
				style("fill", function(d) {
					return colorScale(d.index_x);})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)}
			}
		});
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

function siteMaintenance(curSite) {
	let dataSubmit = {site : (curSite).toLowerCase()}
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
	$('#node_summary_checkbox').prop('checked', true);
	let dataSubmit = { site:site.toLowerCase()}
	$(".column_level").append('<div class="col-md-12" id="data_presence"><div id="data_presence_div"><h4><span class=""></span><b> Data Presence</b></h4></div></div>')
	$(".column_level").append('<br><br><br><div class="col-md-10"><div  id="node_summary_div"><h4><span class=""></span><b> Node Summary</b></h4></div></div>')
	$(".column_level").append('<div class ="col-md-3 map-canvas" id="map-canvas"></div>')
	$(".column_level").append('<br><div class="col-md-8 " id="commhealth_div"><h4><span class=""></span><b>Communication Health</b><h5><input type="button" id="show" onclick="showLegends(this.form)" value="Show Legends" /></h5></h4><div  id="legends" style="visibility:hidden; display:none;">'+
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
	let dataSubmit = { site:(site).toLowerCase()}
	$.post("../site_level_page/getDatafromSiteColumn", {data : dataSubmit} ).done(function(data){
		var result = JSON.parse(data); 
		$("#info_site").empty();
		$("#info_column").empty();
		$("#info_site").append(result[0].barangay+" "+result[0].municipality+" "+result[0].province+"("+result[0].name.toUpperCase().slice(0,3)+")")
		$("#info_column").append(result[0].name.toUpperCase()+"(v"+result[0].version+")")
		// $("#info_column").append(result[0].name.toUpperCase()+"(v"+result[0].version+")<br>Date install("+result[0].date_install +") <br> Date Activation("+result[0].date_activation+")")
	});
}

function heatmapProcess(site,tdate,day){
	// console.log("/api/heatmap/"+site+"/"+tdate+"/"+day)
	$.ajax({ 
		dataType: "json",
		url: "/api/heatmap/"+site+"/"+tdate+"/"+day,  success: function(data_result) {
			// HeatmapOnSelect(site)
			HeatmapOnSelectDay(site)
			$("#heatmap_checkbox").empty()
			$("#heatmap_checkbox").append('<input id="heatmap_checkbox" type="checkbox" class="checkbox"><label for="heatmap_checkbox">Soms Heatmap</label>')
			$('#heatmap_checkbox').prop('checked', true);
			$('input[id="heatmap_checkbox"]').on('click',function () {
				if ($('#heatmap_checkbox').is(':checked')) {
					$("#heatmap_header").slideDown()
				}else{
					$("#heatmap_header").slideUp()
				}
			});
			if(data_result.slice(0,1) != "E"){
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
						pattern_time.push({id:list_id[b],ts:list_time[c],cval:"null"})
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

		var width = (($(".container").width()-$("#info_site").width())+450) - margin.left - margin.right - 20,
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
		$("#heatmap_div").empty()
		$("#heatmap_div").append('<div id="heatmap_container"><h3 style="text-align: center"> NO DATA </h3></div>')
	}
}

/************************/
/**NODE LEVEL PROCESS**/
/************************/

function SelectedNode(site,column,to) {
	if( $('.nodegeneral').val() == ""){
		$('input[name="datefilter"]').val('');
		$('#reportrange').prop('disabled', true);
	}
	$('.nodegeneral').change(function(e) {
		$('.node_collapse').slideDown();
		var selected = $(e.target).val();
		if(selected != null){
			$('#reportrange').prop('disabled', false);
			$('.node_sumbit').slideDown();
		}else{
			$('#reportrange').prop('disabled', true);
		}
	});
	CheckBoxNode(site,column,to)
	$("#accel_dropdown_days").selectpicker()
	$(".node_level").append('<div class="col-md-12"><h3>Node Analysis<select class="selectpicker pull-right" id="accel_dropdown_days"></select></h3></div>')
	daysOption('accel_dropdown')
	$("#accel_dropdown_days").selectpicker('refresh')
}

function CheckBoxNode(site,column,to){
	$('.node_checkbox').empty()
	var list_checkbox =["x_accel","y_accel","z_accel","soms","batt"];
	var name_checkbox =["X Accel Graph","Y Accel Graph","Z Accel Graph","Soms Graph"," Battery Graph"];
	for (a = 0; a <  list_checkbox.length; a++) {
		$("."+list_checkbox[a]+"_checkbox").append('<input id="'+list_checkbox[a]+'_checkbox" type="checkbox"><label for="'+list_checkbox[a]+'_checkbox">'+name_checkbox[a]+'</label>')
	}
	$(".header_node").append('<label>&nbsp; NODE CHARTS and GRAPHS</label>')
	$('#node_sumbit').on('click',function(){
		$('#collapseColumn' ).switchClass( "in", "collapse");
		$('#collapseSite' ).switchClass( "in", "collapse");
		var fdate = (moment().subtract(7,'days')).format('YYYY-MM-DD');
		var tdate = (moment().add(2,'days')).format('YYYY-MM-DD');
		var node =  $('#nodegeneral').val();
		var node_id = node
		let dataSubmit = { 
			site : (column).toLowerCase(), 
			fdate : fdate,
			tdate : tdate,
			node:node_id
		}
		NodeProcess(dataSubmit,list_checkbox);
		NodeOnSelectDay(column,tdate)
		$('.node_collapse').slideDown();
	});
}

function NodeProcess(data,list_checkbox){
	var id =["accel-1","accel-2","accel-3","accel-v","accel-r","accel-c"]
	var node_div_ID =["x","y","z","m","c","r"];
	for (i = 0; i < node_div_ID.length; i++) {
		$("#"+node_div_ID[i]+"_div").empty()
	}
	for (i = 8; i < list_checkbox.length; i++) {
		$('#'+list_checkbox[i]+'_checkbox').prop('checked', false);
	}
	
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/getDatafromSiteColumn/"+data.site,error: function(xhr, textStatus, errorThrown){
			console.log(errorThrown)},success: function(result) {
				$('.node_checkbox').slideDown();
				if(result[0].version != 1 ){
					if( result[0].version == 2){
						var ms_id = 32;
						var mode =["1"]
						var soms_id =[112];
						if(data.site.substring(3,4) == "s"){
							let dataSubmit = { 
								site : data.site, 
								fdate : data.fdate,
								tdate : data.tdate,
								node: data.node,
								id:id
							}
							somsV2(dataSubmit,'0',list_checkbox);
						}
						if(data.site == "nagsa"){
							var mode =["1"]
							var soms_id =[23];
						}
					}else if (result[0].version == 3){
						var ms_id = 11;
						var mode =["0","1"]
						var soms_id =[110 , 113];
					}
					let dataSubmit = { 
						site : data.site, 
						fdate : data.fdate,
						tdate : data.tdate,
						node: data.node,
						msgid: ms_id,
						version: result[0].version,
						id: id
					}
					accel1(dataSubmit,list_checkbox);
					accel1filtered(dataSubmit,list_checkbox)
					if(data.site.slice(3,4) == "s"){
						for (i = 0; i < soms_id.length; i++) {
							somsUnfiltered(dataSubmit,soms_id[i],id[4+i],mode[i]);
						}
					}
				}else{
					accelVersion1Filtered(data.site,data.node,data.fdate,data.tdate,id,list_checkbox);
					$("#accel-c").hide();
					$("#accel-r").hide();
				}

			}
		});
}

function accelVersion1Filtered(site,node,fdate,tdate,id,list){
	let dataVersion1= { 
		site : site, 
		fdate : fdate,
		tdate : tdate,
		nid: node
	}
	$.post("../node_level_page/getAllAccelVersion1In", {data : dataVersion1} ).done(function(data){
		var result = JSON.parse(data);
		var seperated_num =[]
		for (a = 0; a < node.length; a++) {
			var result_seperated =[];
			var mDataSeries=[] ;
			for (b = 0; b < result.length; b++) {
				if(node[a] == result[b].id){	
					var mData=[]  ;
					var time =  Date.parse(result[b].timestamp);
					mData.push(time, parseFloat(result[b].mvalue));
					mDataSeries.push(mData);
				}
			}
			result_seperated.push(mDataSeries);
			seperated_num.push(result_seperated)
		}


		var series_data = [];
		for (a = 0; a < node.length; a++) {
			var series_collection =[]
			series_collection.push({ name: "mvalue(n"+node[a]+")" ,step: true, data:seperated_num[a][0] ,id: 'dataseries'})
			series_data.push(series_collection)
		}	
		var series_filtered =[]
		for (b = 0; b < series_data[0].length; b++) {
			var series_sorted=[]
			for (c = 0; c < series_data.length; c++) {
				series_sorted.push(series_data[c][b])
			}
			series_filtered.push(series_sorted)
		}
		var color_series = ["#ccf9e8","#89e794","#eaba26","#e58610","#c12040","#df39ff","#465cff","#7ab9e7","#7bf9d6","#8cf097"]
		$(".node_level").append('<div class="col-md-12" id="batt_div"></div>')
		$("#batt_div").append('<br><div id="'+id[3]+'"></div>')
		chartProcessbattSoms(id[3],series_filtered[0],"Battery",color_series,'batt')
	});
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredVersion1In/"+site+"/"+fdate+"/"+tdate+"/"+node.toString().replace(/,/g, "-"),  success: function(data) {
			var result = JSON.parse(data);
			var seperated_num =[]
			for (a = 0; a < node.length; a++) {
				var result_seperated =[];
				var xDataSeries=[] , yDataSeries=[] , zDataSeries=[];
				for (b = 0; b < result.length; b++) {
					if(node[a] == result[b].id){	
						var xData=[] , yData=[] ,zData = [] ;
						var time =  Date.parse(result[b].ts);
						xData.push(time, parseFloat(result[b].x));
						yData.push(time, parseFloat(result[b].y));
						zData.push(time, parseFloat(result[b].z));
						xDataSeries.push(xData);
						yDataSeries.push(yData);
						zDataSeries.push(zData);
					}
				}
				result_seperated.push(xDataSeries);
				result_seperated.push(yDataSeries);
				result_seperated.push(zDataSeries);
				seperated_num.push(result_seperated)

			}


			var series_data = [];

			var series_id = [xDataSeries,yDataSeries,zDataSeries];
			var series_name = ["X-accelerometer Graph","Y-accelerometer Graph","Z-accelerometer Graph"];
			var node_series_name =["x","y","z"]
			for (a = 0; a < node.length; a++) {
				var series_collection =[]
				for (i = 0; i < series_id.length; i++) {
					series_collection.push({ name: node_series_name[i]+"(n"+node[a]+")" ,step: true, data:seperated_num[a][i] ,id: 'dataseries'})
				}
				series_data.push(series_collection)
			}	
			var series_filtered =[]
			for (b = 0; b < series_data[0].length; b++) {
				var series_sorted=[]
				for (c = 0; c < series_data.length; c++) {
					series_sorted.push(series_data[c][b])
				}
				series_filtered.push(series_sorted)
			}
			var color_series = ["#ccf9e8","#89e794","#eaba26","#e58610","#c12040","#df39ff","#465cff","#7ab9e7","#7bf9d6","#8cf097"]
			for (a= 0; a < series_name.length; a++) {
				$(".node_level").append('<div class="col-md-12" id="'+node_series_name[a]+'_div"></div>')
				$("#"+node_series_name[a]+"_div").append('<br><div id="'+id[a]+'"></div>')
				chartProcessAccel(id[a],series_filtered[a],series_name[a],color_series,node_series_name[a])
			}
		}
	});	
}
function accel1(data,list){
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/AccelUnfilteredDataIn/"+(data.site).toLowerCase()+"/"+data.fdate+"/"+data.tdate+"/"+data.node.toString().replace(/,/g, "-")+"/"+data.msgid,  success: function(result) {
			var seperated_num =[]
			for (a = 0; a < data.node.length; a++) {
				var result_seperated =[];
				var mDataSeries=[] ;
				for (b = 0; b < result.length; b++) {
					if(data.node[a] == result[b].id){	
						var mData=[]  ;
						var time =  Date.parse(result[b].timestamp);
						mData.push(time, parseFloat(result[b].batt));
						mDataSeries.push(mData);
					}
				}
				result_seperated.push(mDataSeries);
				seperated_num.push(result_seperated)
			}
			var series_data = [];
			for (a = 0; a < data.node.length; a++) {
				var series_collection =[]

				series_collection.push({ name: "Node #"+data.node[a]+"("+data.msgid+")" ,step: true, data:seperated_num[a][0] ,id: 'dataseries'})

				series_data.push(series_collection)
			}	
			var series_filtered =[]

			for (b = 0; b < series_data[0].length; b++) {
				var series_sorted=[]
				for (c = 0; c < series_data.length; c++) {
					series_sorted.push(series_data[c][b])
				}
				series_filtered.push(series_sorted)
			}

			if(data.version == 2){
				var ms_id = '33';
			}else{
				var ms_id = '12'
			}

			accel2(data,series_filtered,ms_id,list)
		}
	});	
}

function accel2(data,series,msgid,list){
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/AccelUnfilteredDataIn/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node.toString().replace(/,/g, "-")+"/"+msgid,  success: function(result) {
			var seperated_num =[]
			for (a = 0; a < data.node.length; a++) {
				var result_seperated =[];
				var mDataSeries=[] ;
				for (b = 0; b < result.length; b++) {
					if(data.node[a] == result[b].id){	
						var mData=[]  ;
						var time =  Date.parse(result[b].timestamp);
						mData.push(time, parseFloat(result[b].batt));
						mDataSeries.push(mData);
					}
				}
				result_seperated.push(mDataSeries);
				seperated_num.push(result_seperated)
			}


			var series_data = [];
			for (a = 0; a < data.node.length; a++) {
				var series_collection =[]
				series_collection.push({ name: "Node #"+data.node[a]+"("+msgid+")" ,step: true, data:seperated_num[a][0] ,id: 'dataseries'})
				series_data.push(series_collection)
			}	
			var series_filtered =[]

			for (b = 0; b < series_data[0].length; b++) {
				
				for (c = 0; c < series_data.length; c++) {
					series_filtered.push(series[0][c])
					series_filtered.push(series_data[c][b])
				}
			}
			var color_series = ["#ccf9e8","#89e794","#eaba26","#e58610","#c12040","#df39ff","#465cff","#7ab9e7","#7bf9d6","#8cf097"]
			$(".node_level").append('<div class="col-md-12" id="batt_div"></div>')
			$("#batt_div").append('<br><div id="'+data.id[3]+'"></div>')
			chartProcessbattSoms(data.id[3],series_filtered,"Battery",color_series,"batt")
		}
	});	
}

function accel1filtered(data,list){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredDataIn/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node.toString().replace(/,/g, "-")+"/"+data.msgid,  success: function(data_result) {
			
			var result = JSON.parse(data_result);
			var seperated_num =[]
			for (a = 0; a < data.node.length; a++) {
				var result_seperated =[];
				var xDataSeries=[],yDataSeries=[],zDataSeries=[] ;
				for (b = 0; b < result.length; b++) {
					if(data.node[a] == result[b].id){	
						var xData=[],yData=[],zData=[]  ;
						var time =  Date.parse(result[b].ts);
						xData.push(time, parseFloat(result[b].x));
						yData.push(time, parseFloat(result[b].y));
						zData.push(time, parseFloat(result[b].z));
						xDataSeries.push(xData);
						yDataSeries.push(yData);
						zDataSeries.push(zData);
					}
				}
				result_seperated.push(xDataSeries);
				result_seperated.push(yDataSeries);
				result_seperated.push(zDataSeries);
				seperated_num.push(result_seperated)
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries];
			var series_data = [];
			var node_series_name =["x","y","z"]
			for (a = 0; a < data.node.length; a++) {
				var series_collection =[]
				for (i = 0; i < series_id.length; i++) {
					series_collection.push({ name:"Node #"+data.node[a]+"("+data.msgid+")" ,step: true, data:seperated_num[a][i] ,id: 'dataseries'})
				}
				series_data.push(series_collection)
			}	

			if(data.version == 2){
				var ms_id = '33';
			}else{
				var ms_id = '12'
			}
			
			accel2filtered(data,series_data,ms_id,list)
		}
	});	
}

function accel2filtered(data,series,msgid,list){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredDataIn/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node.toString().replace(/,/g, "-")+"/"+msgid,  success: function(data_result) {
			var result = JSON.parse(data_result);
			var seperated_num =[]
			for (a = 0; a < data.node.length; a++) {
				var result_seperated =[];
				var xDataSeries=[] , yDataSeries=[] , zDataSeries=[];
				for (b = 0; b < result.length; b++) {
					if(data.node[a] == result[b].id){	
						var xData=[] , yData=[] ,zData = [] ;
						var time =  Date.parse(result[b].ts);
						xData.push(time, parseFloat(result[b].x));
						yData.push(time, parseFloat(result[b].y));
						zData.push(time, parseFloat(result[b].z));
						xDataSeries.push(xData);
						yDataSeries.push(yData);
						zDataSeries.push(zData);
					}
				}
				result_seperated.push(xDataSeries);
				result_seperated.push(yDataSeries);
				result_seperated.push(zDataSeries);
				seperated_num.push(result_seperated)

			}
			var series_data = [];

			var series_id = [xDataSeries,yDataSeries,zDataSeries];
			var series_name = ["X-accelerometer Graph","Y-accelerometer Graph","Z-accelerometer Graph"];
			var node_series_name =["x","y","z"]
			for (a = 0; a < data.node.length; a++) {
				var series_collection =[]
				for (i = 0; i < series_id.length; i++) {
					series_collection.push({ name: "Node #"+data.node[a]+"("+msgid+")" ,step: true, data:seperated_num[a][i] ,id: 'dataseries'})
				}
				series_data.push(series_collection)
			}	
			var series_filtered =[]
			for (b = 0; b < series_data[0].length; b++) {
				var series_sorted=[]
				for (c = 0; c < series_data.length; c++) {
					series_sorted.push(series[c][b])
					series_sorted.push(series_data[c][b])
				}
				series_filtered.push(series_sorted)
			}
			var color_series = ["#ccf9e8","#89e794","#eaba26","#e58610","#c12040","#df39ff","#465cff","#7ab9e7","#7bf9d6","#8cf097"]
			for (a= 0; a < series_name.length; a++) {
				$(".node_level").append('<div class="col-md-12" id="'+node_series_name[a]+'_div"></div>')
				$("#"+node_series_name[a]+"_div").append('<br><div id="'+data.id[a]+'"></div>')
				chartProcessAccel(data.id[a],series_filtered[a],series_name[a],color_series,node_series_name[a])
			}
		}
	});	
}

function somsV2(data,mode){
	var mode= "0";
	var name= ["Raw","Raw(filtered)"];
	var id_name = "Soms(raw)"
	let dataSoms= { 
		mode : mode, 
		name : name,
		id_name : id_name,
		id:data.id[4]
	}
	somsfiltered(data,dataSoms,"rawDataSeries")
}

function somsUnfiltered(data,soms_msgid,name,mode){
	var somsDataSeries =[];
	if(mode == "0"){
		var name= ["Raw","Raw(filtered)"];
		var id_name = "Soms(raw)"
		var id = data.id[4]
	}else{
		var name= ["Cal","Cal(filtered)"];
		var id_name = "Soms(cal)"
		var id = data.id[5]
	}
	let dataSoms= { 
		mode : mode, 
		name : name,
		id_name : id_name,
		id:id
	}
	somsfiltered(data,dataSoms,somsDataSeries)
}
function somsfiltered(data,dataSoms,series){
	$.ajax({ 
		dataType: "json",
		url: "/api/SomsfilteredDataIn/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+dataSoms.mode,  success: function(data_result) {
			if(data_result.length != 0){
				if(data_result[0].length >= 35){
					var result = JSON.parse(data_result);
					var seperated_num =[]
					for (a = 0; a < data.node.length; a++) {
						var result_seperated =[];
						var DataSeries=[];
						for (b = 0; b < result.length; b++) {
							if(data.node[a] == result[b].id){	
								var Data=[] ;
								var time =  Date.parse(result[b].ts);
								Data.push(time, parseFloat(result[b].mval1));
								DataSeries.push(Data);
							}
						}
						result_seperated.push(DataSeries);
						seperated_num.push(result_seperated)
					}
					var series_id = [DataSeries];
					var series_data = [];
					for (a = 0; a < data.node.length; a++) {
						var series_collection =[]
						series_collection.push({ name:"Node #"+data.node[a] ,step: true, data:seperated_num[a][0] ,id: 'dataseries'})
						series_data.push(series_collection)
					}	
					var series_filtered =[]
					for (b = 0; b < series_data[0].length; b++) {
						var series_sorted=[]
						for (c = 0; c < series_data.length; c++) {
							series_sorted.push(series_data[c][b])
						}
						series_filtered.push(series_sorted)
					}
					var color_series = ["#ccf9e8","#89e794","#eaba26","#e58610","#c12040","#df39ff","#465cff","#7ab9e7","#7bf9d6","#8cf097"]
					$(".node_level").append('<div class="col-md-12" id="soms_div"></div>')
					$("#soms_div").append('<br><div id="'+dataSoms.id+'"></div>')
					chartProcessbattSoms(dataSoms.id,series_filtered[0],dataSoms.id_name,color_series,'soms',data.site)
					
				}
			}
		}
	});	
}

function chartProcessAccel(id,data_series,name,color,list){
	$("."+list+"_accel_checkbox").empty()
	$("."+list+"_accel_checkbox").append('<input id="'+list+'_accel_checkbox" type="checkbox" class="checkbox">'
		+'<label for="'+list+'_accel_checkbox">'+list.toUpperCase()+' Accel Graph</label>')
	$('#'+list+'_accel_checkbox').prop('checked', true);
	$('input[id="'+list+'_accel_checkbox"]').on('click',function () {
		if ($('#'+list+'_accel_checkbox').is(':checked')) {
			$("#"+list+"_div").slideDown()
		}else{
			$("#"+list+"_div").slideUp()
		}
	});
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
		colors: color,
	});

	$("#"+id).highcharts({
		chart: {
			type: 'line',
			zoomType: 'x',
			panning: true,
			panKey: 'shift',
			height: 300,
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#2a2a2b'],
				[1, '#3e3e40']
				]
			},
		},
		title: {
			text: name.toUpperCase(),
			style: {
				color: '#E0E0E3',
				fontSize: '20px'
			}
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
                        credits: {
                        	enabled: false
                        },
                        series:data_series
                    }
                    );
}
function chartProcessbattSoms(id,data_series,name,color,list,column){
	$("."+list+"_checkbox").empty()
	if(list == "batt"){
		var list_name ="Battery"
	}else {
		var list_name = "Soms"
	}
	$("."+list+"_checkbox").append('<input class="'+list+'_checkbox" id="'+list+'_checkbox" type="checkbox" class="checkbox">'
		+'<label for="'+list+'_checkbox">'+list_name+'  Graph</label>')
	$('#'+list+'_checkbox').prop('checked', true);
	$('input[id="'+list+'_checkbox"]').on('click',function () {
		if ($('#'+list+'_checkbox').is(':checked')) {
			$("#"+list+"_div").slideDown()
		}else{
			$("#"+list+"_div").slideUp()
		}
	});
	if(column == undefined){
		$(".soms_checkbox").hide()
	}else{
		$(".soms_checkbox").show()
	}
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
		colors: color,
	});
	
	
	$("#"+id).highcharts({
		chart: {
			type: 'line',
			zoomType: 'x',
			panning: true,
			panKey: 'shift',
			height: 300,
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#2a2a2b'],
				[1, '#3e3e40']
				]
			},
		},
		title: {
			text: name.toUpperCase(),
			style: {
				color: '#E0E0E3',
				fontSize: '20px'
			}
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
                        credits: {
                        	enabled: false
                        },
                        series:data_series
                    }
                    );
}

function NodeOnSelectDay(column,tdate) {
	var list_checkbox =["x_accel","y_accel","z_accel","soms","batt"];
	var node =  $('#nodegeneral').val();
	var node_id = node


	$("#accel_dropdown_days").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selected_days =($(this).find('option').eq(clickedIndex).val());
		if(selected_days == "7 days"){
			fdate = moment().subtract(7,'days').format('YYYY-MM-DD')
		}else if(selected_days == "2 weeks"){
			fdate = moment().subtract(14,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 month"){
			fdate = moment().subtract(30,'days').format('YYYY-MM-DD')
		}else if(selected_days == "3 months"){
			fdate = moment().subtract(90,'days').format('YYYY-MM-DD')
		}else if(selected_days == "6 months"){
			fdate = moment().subtract(120,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 year"){
			fdate = moment().subtract(1,'year').format('YYYY-MM-DD')
		}
		let dataSubmit = { 
			site : (column).toLowerCase(), 
			fdate : fdate,
			tdate : tdate,
			node:node_id
		}
		NodeProcess(dataSubmit,list_checkbox)
	})
}