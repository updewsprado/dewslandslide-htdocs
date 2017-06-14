$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
	$(".bootstrap-select").click(function () {
		$(this).addClass("open");
	});
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
	$(".bootstrap-select").click(function () {
		$(this).addClass("open");
	});
});


$(document).ready(function(e) {

	var values = window.location.href.split("/")
	var category = values[5]
	var from = values[6]
	var to = values[7]
	var site = values[8]
	var column = values[9]
	
	dropdowlistAppendValue()
	if(category == "rain"){
		RainFallProcess(site,from,to)
	}else  if(category == "surficial"){
		let dataSubmit = { 
			site : (site).toLowerCase(), 
			fdate : from,
			tdate : to
		}
		$.ajax({
			url:"/surficial_page/getDatafromGroundCrackNameUrl/"+site,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					$('.selectpicker').selectpicker();
					$('.graphGenerator').append('<select class="selectpicker"  id="crackgeneral" data-live-search="true"></select>');
					$(".graphGenerator").append('<h4><span class="glyphicon "></span><b>Superimpose Surficial Graph <select class="selectpicker pull-right" id="surperimpose_days">'+
						'</select></b></h4><br><div id="ground_graph"><div>')
					daysOption('surperimpose')
					SelectdaysOption('surperimpose')
					$('#surperimpose_days').val('2 weeks')
					$('#surperimpose_days').selectpicker('refresh');
					$('#crackgeneral').append('<option value="">Select Crack</option>')
					$('#crackgeneral').selectpicker('hide')
					var result= data
					var crack_name= [];
					for (i = 0; i <  result.length; i++) {
						dropdowlistAppendValue(result[i].crack_id, ((result[i].crack_id).toUpperCase()),'#crackgeneral');
						crack_name.push(result[i].crack_id)
					}
				}
			});
		
		surficialGraph(dataSubmit)
	}else if(category == "subSurface"){
		$(".graphGenerator").append('<div class="col-md-12 subsurface_analysis_div" id="subsurface_analysis_div"></div>')
		$("#subgeneral").val('column_sub')
		$(".selectpicker").selectpicker('refresh')
		var title = ["Column","Displacement","Velocity"]
		var id_title =["column","dis","velocity"]
		var id_div=[["colspangraph","colspangraph2"],["dis1","dis2"],["velocity1","velocity2"]]
		for(var a = 0; a < title.length; a++){
			$("#subsurface-breadcrumb").append('<li class="breadcrumb-item" ><b class="breadcrumb-item" data-toggle="collapse" data-target="#'+id_title[a]+'_sub">'+title[a]+' Position</b></li>')
			$("#subsurface_analysis_div").append('<div class="col-md-12 sub"><div id="'+id_title[a]+'_sub" class="collapse in">'+
				'<div class="col-md-12" style="padding-left: 0px;padding-right: 0px;"><div id="'+id_div[a][0]+'"><br></div></div><div class="col-md-12" style="padding-left: 0px;padding-right: 0px;"><div id="'+id_div[a][1]+'"></div></div></div>')
		}
		allSensorPosition(column,from,to)
	}

});

function SelectdaysOption(id) {
	$("#"+id+"_days").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var values = window.location.href.split("/")
		var site = values[8]
		var from = values[6]
		var selected_days = ($(this).find('option').eq(clickedIndex).val()).toLowerCase();
		var fdate;
		if(selected_days == "7 days"){
			fdate = moment(from).subtract(7,'days').format('YYYY-MM-DD')
		}else if(selected_days == "10 days"){
			fdate = moment(from).subtract(10,'days').format('YYYY-MM-DD')
		}else if(selected_days == "2 weeks"){
			fdate = moment(from).subtract(14,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 month"){
			fdate = moment(from).subtract(30,'days').format('YYYY-MM-DD')
		}else if(selected_days == "3 months"){
			fdate = moment(from).subtract(90,'days').format('YYYY-MM-DD')
		}else if(selected_days == "6 months"){
			fdate = moment(from).subtract(120,'days').format('YYYY-MM-DD')
		}else if(selected_days == "1 year"){
			fdate = moment(from).subtract(1,'year').format('YYYY-MM-DD')
		}else if(selected_days == "ALL"){
			fdate = moment(from).subtract(5,'year').format('YYYY-MM-DD')
		}


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
function doSortDates(dates){
	var swapped;
	do {
		swapped = false;
		for (var i=0; i < dates.length-1; i++) {
			if (dates[i][0] > dates[i+1][0]) {
				var temp = dates[i][0];
				dates[i][0] = dates[i+1][0];
				dates[i+1][0] = temp;
				swapped = true;
			}
		}
	} while (swapped);
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



function dropdowlistAppendValue(newitemnum, newitemdesc ,id) {
	$(id).append('<option val="'+newitemnum+'">'+newitemdesc+'</option>');
	$(id).selectpicker('refresh'); 
}

function daysOption(id) {
	var day_list_text=["7 days","10 days","2 weeks","1 month","3 months","6 months","1 year","ALL"];
	var day_list_val =["7d","10d","2w","1m","3m","6m","1y","all"];
	
	$('#'+id+'_days').selectpicker();
	for (var j = 0; j < day_list_text.length; j++) {
		dropdowlistAppendValue(day_list_val[j], day_list_text[j] ,'#'+id+'_days')
	}
}
function RainFallProcess(curSite,fromDate,toDate){
	console.log(curSite,fromDate,toDate)
	$('#rainfallgeneral').selectpicker();
	$('#rainfall_days').selectpicker();
	$(".graphGenerator").append('<div class="col-md-12" id="raincharts"></div>')
	$("#raincharts").empty()
	$("#raincharts").append('<ol class="breadcrumb rain-breadcrumb" id="rain-breadcrumb"></ol>')
	$("#raincharts").append('<h4><b>Rain Fall Graph</b><select class="selectpicker pull-right rainfall_select"  id="rainfall_days"></select></h4><ol class="breadcrumb rain-breadcrumb" id="rain-breadcrumb"></ol><br>')
	$('.rainfall_select').selectpicker('refresh')
	daysOption('rainfall')
	SelectdaysOption('rainfall')
	$('#rainfall_days').val('10 days')
	$('#rainfall_days').selectpicker('refresh');
	$(".rain-breadcrumb").hide()
	let dataSubmit = { 
		site : (curSite).toLowerCase(), 
		fdate : fromDate,
		tdate : toDate
	}
	$('.rain_graph_checkbox').empty()
	// console.log(dataSubmit)
	// $.post("../site_level_page/getDatafromRainProps", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Rain gauge datas
		console.log("/site_level_page/getDatafromRainPropsUrl/"+curSite.toLowerCase())
		$.ajax({
			url:"/site_level_page/getDatafromRainPropsUrl/"+curSite.toLowerCase(),
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					var result = data;
					console.log(result)
					getRainSenslope(result[0].rain_senslope , dataSubmit, result[0].max_rain_2year,'rain_senslope');
					getRainArq(result[0].rain_arq , dataSubmit, result[0].max_rain_2year,'rain_arq');
					getDistanceRainSite(result[0].RG1, dataSubmit, result[0].max_rain_2year ,'rain1');
					getDistanceRainSite(result[0].RG2, dataSubmit , result[0].max_rain_2year,'rain2');
					getDistanceRainSite(result[0].RG3, dataSubmit , result[0].max_rain_2year,'rain3');
	// 	$('.rain_graph_checkbox').append('<input id="rain_graph_checkbox" type="checkbox" class="checkbox"><label for="rain_graph_checkbox">Rainfall Graphs</label>')
	// 	$('#rain_graph_checkbox').prop('checked', true);
	// 	$('input[id="rain_graph_checkbox"]').on('click',function () {
	// 		if ($('#rain_graph_checkbox').is(':checked')) {
	// 			$("#raincharts").slideDown()
	// 		}else{
	// 			$("#raincharts").slideUp()
}
});	
	// });

}

function getDistanceRainSite(site,dataSubmit,max_rain,id) { 
	if(site.slice(0,1) == "r" ){
		getRainNoah(site, dataSubmit , max_rain,id);
	}else if(site.length == 4){
		getRainSenslope(site, dataSubmit , max_rain,id);
	}else if(site.length == 6){
		getRainArq(site, dataSubmit , max_rain,id);
	}
}
function getRainSenslope(site,dataSubmit,max_rain,id) {
	if(site != null){
		$.ajax({
			url:"/api/RainSenslope/"+site+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12 rainGraph"><div id="'+id+'" class="collapse in"></div></div>')
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
							if(jsonRespo[i].rval == null){
								if(jsonRespo[i-1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);
								}
								if(jsonRespo[i+1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);

								}else{
									nval.push(i);
								}
							}
						}
						for (var i = 0; i < nval.length-1; i=i+2) {
							var n = nval[i];
							var n2 = nval[i+1];
							if(n2 < nval.length){
								negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
							}
						}
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] ,id: divname[i],fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
						}
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'Senslope',site,max_rain,negative,dataTableSubmit);
					}else{
						$('#'+id).hide()

					}
				}
			})
		
	}
}

function getRainArq(site,dataSubmit,max_rain,id) {
	if(site != null){
		$.ajax({
			url:"/api/RainARQ/"+site+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12 rainGraph"><div id="'+id+'" class="collapse in"></div></div>')
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
							if(jsonRespo[i].rval == null){
								if(jsonRespo[i-1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);
								}
								if(jsonRespo[i+1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);

								}else{
									nval.push(i);
								}
							}
						}
						for (var i = 0; i < nval.length-1; i=i+2) {
							var n = nval[i];
							var n2 = nval[i+1];
							if(n2 < nval.length){
								negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
							}
						}						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i],id : divname[i],fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
						}
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'ARQ',site,max_rain,negative,dataTableSubmit );
					}else{
						$('#'+id).hide()

					}
				}
			})
	}
}

function getRainNoah(site,dataSubmit,max_rain,id) {
	if(site != null){
		var rain_noah_number = site.slice(10,20)
		$.ajax({
			url:"/api/RainNoah/"+rain_noah_number+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					if(data.length != 0){
						var jsonRespo = JSON.parse(data);
						$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
						$("#raincharts").append('<div class="col-md-12 rainGraph"><div id="'+id+'" class="collapse in"></div><div>')
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
							if(jsonRespo[i].rval == null){
								if(jsonRespo[i-1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);
								}
								if(jsonRespo[i+1].rval != null && jsonRespo[i].rval == null ){
									nval.push(i);

								}else{
									nval.push(i);
								}
							}
						}
						for (var i = 0; i < nval.length-1; i=i+2) {
							var n = nval[i];
							var n2 = nval[i+1];
							if(n2 < nval.length){
								negative.push( {from: Date.parse(jsonRespo[n].ts), to: Date.parse(jsonRespo[n2].ts), color: 'rgba(68, 170, 213, .2)'})
							}		
						}
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						for (i = 0; i < divname.length; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] , id: divname[i], fillOpacity: 0.4 , zIndex: 1, lineWidth: 1, color: colors[i],zIndex:i+1})
						}
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'Noah',site,max_rain,negative,dataTableSubmit );
					}else{
						$('#'+id).hide()

					}
				}
			})
	}
}

function chartProcessRain(series_data ,id , data_source ,site ,max ,negative,dataTableSubmit ){
	// submittedMeas(dataTableSubmit);
	var fdate = dataTableSubmit.fdate;
	var tdate = dataTableSubmit.tdate;
	var date1 = moment(fdate);
	var date2 = moment(tdate);
	var duration = moment.duration(date2.diff(date1));
	var  list_dates =[];
	for (var i = 1; i < duration.asDays(); i++) {
		list_dates.push(site.slice(0,3)+((moment(fdate).add(i,'days').format('YYYY-MM-DD')).replace(/-/g, "")).slice(2,10))
	}
	let dataSubmit = { date:list_dates,table:site}
	// $.post("../node_level_page/getAllgintagsNodeTagIDTry/", {data : dataSubmit} ).done(function(data){
	// 	var result = JSON.parse(data);
	// 	var result_filtered = [];
	// 	for (var i = 0; i < result.length; i++) {
	// 		if(site == result[i].table_used){
	// 			result_filtered.push(result[i])
	// 		}
	// 	}
	// 	var label_crack = ["24hrs","72hrs","15mins"]
	// 	var all_data_tag =[]
	// 	for (var a = 0; a < label_crack.length; a++) {
	// 		var collect =[]
	// 		for (var i = 0; i < result_filtered.length; i++) {
	// 			var remark_parse = ((result_filtered[i].remarks).split("/"))

	// 			if(remark_parse[1] == label_crack[a] ){
	// 				collect.push({x:parseFloat(remark_parse[3]),text:'',value:remark_parse[4],title:result_filtered[i].tag_name})
	// 			}
	// 		}

	// 		all_data_tag.push(collect)

	// 	}

	// 	for (var a = 0; a < label_crack.length; a++) {
	// 		series_data.push({name:'Tag',type:'flags',data:all_data_tag[a],onSeries:label_crack[a],width: 100,showInLegend:false,visible:true})
	// 	}
	// 	series_data.push({name:'Tag'})
		// console.log(series_data)

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
				width: 1000,
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
			subtitle: {
				text: 'Source :  '+(dataTableSubmit.current_site).toUpperCase()
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
					point: {
						events: {
							click: function () {
								if(this.series.name == "Tag"){
									$("#tagModal").modal("show");
									$("#comment-model").empty();
									$("#comment-model").append('<small>REMARKS: </small>'+this.value)
								}else{
									$("#annModal").modal("show");
									$(".tag").hide();
									$('#tag_ids').tagsinput('removeAll');
									$("#tag_time").val(moment(this.x).format('YYYY-MM-DD HH:mm:ss'))
									$("#tag_value").val(this.y)
									$("#tag_crack").val(this.series.name)
									$("#tag_description").val('rain analysis')
									$("#tag_tableused").val(site)
									$("#tsAnnotation").attr('value',moment(this.category).format('YYYY-MM-DD HH:mm:ss'));
								}
							}
						}
					}

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
			credits: {
				enabled: false
			},
			series:series_data
		});
		var chart = $('#'+id).highcharts();
		$( ".highcharts-series-"+(series_data.length-1) ).click(function() {
			var series = chart.series[(series_data.length-1)];
			for (var i = 0; i < label_crack.length; i++) {
				if (series.visible) {
					(chart.series[((series_data.length-(i+1))-1)]).update({
						visible: true,
					});
				}else {
					(chart.series[((series_data.length-(i+1))-1)]).update({
						visible: false,
					});
				}
			}
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

		svgChart()

	}




	function surficialGraph(dataTableSubmit) {  
		console.log( "/api/GroundDataFromLEWSInRange/"+dataTableSubmit.site+"/"+dataTableSubmit.fdate+"/"+dataTableSubmit.tdate)
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
				$('#ground_graph').empty();
				chartProcessSurficial('ground_graph',series_data,'Superimpose Surficial Graph',dataTableSubmit)
				$("#tag_series").val(JSON.stringify(series_data))
			}
		});	
	}
	function chartProcessSurficial(id,data_series,name,dataTableSubmit){
		var site = $('#sitegeneral').val();
		var fdate = dataTableSubmit.fdate;
		var tdate = dataTableSubmit.tdate;
		var date1 = moment(fdate);
		var date2 = moment(tdate);
		var duration = moment.duration(date2.diff(date1));
		var  list_dates =[];
		for (var i = 1; i < duration.asDays(); i++) {
			list_dates.push(site+((moment(fdate).add(i,'days').format('YYYY-MM-DD')).replace(/-/g, "")).slice(2,10))
		}
		let dataSubmit = { date:list_dates,table:'gndmeas'}
	// $.post("../node_level_page/getAllgintagsNodeTagIDTry/", {data : dataSubmit} ).done(function(data){
	// 	var result_unfiltered = JSON.parse(data)
	// 	var result = [];
	// 	for (var i = 0; i < result_unfiltered.length; i++) {
	// 		if (result_unfiltered[i].tag_description == "ground analysis") {
	// 			result.push(result_unfiltered[i])
	// 		}
	// 	}
	// 	$('#'+id).empty();
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
			panning: true,
			panKey: 'shift',
			height: 800,
			width:1000
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: ' + (dataTableSubmit.site).toUpperCase()
		},
		yAxis:{
			title: {
				text: 'Displacement (cm)'
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
								$(".tag").hide();
								$('#tag_ids').tagsinput('removeAll');
								$("#tag_time").val(moment(this.x).format('YYYY-MM-DD HH:mm:ss'))
								$("#tag_value").val(this.y)
								$("#tag_crack").val(this.series.name)
								$("#tag_description").val('ground analysis')
								$("#tag_tableused").val('gndmeas')
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

	var name_site = ((($( "tspan" ).text()).split('.')))
	var extracted_name = (name_site[0]).split(' ');
	$( ".highcharts-contextbutton" ).attr( "visibility", "hidden" );
	$( "#pdfsvg" ).empty();

	svgChart()
}


function allSensorPosition(site,fdate,tdate) {
	console.log("/api/SensorAllAnalysisData/"+site+"/"+fdate+"/"+tdate)
	$.ajax({url: "/api/SensorAllAnalysisData/"+site+"/"+fdate+"/"+tdate,
		dataType: "json",
		success: function(result){
			var data = JSON.parse(result);
			columnPosition(data[0].c,site)
			displacementPosition(data[0].d,data[0].v,site)
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
function columnPosition(data_result,site) {
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
			var color = parseInt((255 / fAlldown.length)*(a+1))
			fseries.push({name:listDate[a].slice(0,16), data:fAlldown[a] ,color:inferno[color]})
			fseries2.push({name:listDate[a].slice(0,16),  data:fAlllat[a],color:inferno[color]})
			// console.log(inferno[color] ,color)
		}
		chartProcessInverted("colspangraph",fseries,"Horizontal Displacement, downslope(mm)",site)
		chartProcessInverted("colspangraph2",fseries2,"Horizontal Displacement, across slope(mm)",site)
		$("#column_sub").switchClass("collapse","in");
	}     
}

function displacementPosition(data_result,data_result_v,site) {
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
				d1.push([Date.parse(disData1[a][i].ts) ,disData1[a][i].downslope*1000])
				d2.push([Date.parse(disData1[a][i].ts) ,disData1[a][i].latslope*1000])
			}
		}
		for(var a = 1; a < disData1.length+1; a++){
			var color = parseInt((255 / disData1.length)*(a))
			fseries.push({name:(a), data:d1.slice(listid[a],listid[a+1]),color:inferno[color]})
			fseries2.push({name:(a), data:d2.slice(listid[a],listid[a+1]),color:inferno[color]})
		}
		velocityPosition(data_result_v,totalId.length,disData1[0],site); 
		fseries.push({name:'unselect'})
		fseries2.push({name:'unselect'})
		chartProcessDis("dis1",fseries,"Displacement, downslope",site)
		chartProcessDis("dis2",fseries2,"Displacement , across slope",site)

	}     

}
function velocityPosition(data_result,id,date,site) {
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
				l3.push([Date.parse(data[0].L3[a].ts) , ((id+1)-data[0].L3[a].id)]);
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
				var color = parseInt((255 / sliceData.length)*(a+1))
				fseries.push({name:catNum[a], data:dataset.slice(sliceData[a],sliceData[a+1]),color :inferno[color]})
				fseries2.push({name:catNum[a], data:dataset.slice(sliceData[a],sliceData[a+1]),color :inferno[color]})
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
				var color = parseInt((255 / sliceData.length)*(a+1))
				fseries.push({name:(a+1), data:dataset.slice(sliceData[a],sliceData[a+1]),color :inferno[color]})
				fseries2.push({name:(a+1), data:dataset.slice(sliceData[a],sliceData[a+1]),color :inferno[color]})
			}					
		}
		var sorted_fseries =[]
		for (var counter = 0; counter < fseries.length;counter++){
			sorted_fseries.push(doSortDates(fseries[counter].data));

		}

		chartProcessbase("velocity1",fseries,"Velocity Alerts, downslope",site)
		chartProcessbase("velocity2",fseries2,"Velocity Alerts, across slope",site)   
	}  
}
function chartProcessDis(id,data_series,name,site){
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
			width: 1000
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: ' + (site).toUpperCase()
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
				text: 'Relative Displacement (mm)'
			}
		},
		tooltip: {
			header:'{point.x:%Y-%m-%d}: {point.y:.2f}',
			split: true,
			// crosshairs: true
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
	var chart = $('#'+id).highcharts();
	$( ".highcharts-series-"+(data_series.length-1) ).click(function() {
		var series = chart.series[(data_series.length-1)];
		for (var i = 0; i < data_series.length-1; i++) {
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

function chartProcessInverted(id,data_series,name,site){
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		},
	});
	$("#"+id).highcharts({
		chart: {
			type: 'line',
			zoomType: 'x',
			height: 800,
			width: 500
		},
		title: {
			text: name,
		},
		subtitle: {
			text: 'Source: '+(site).toUpperCase()
		},
		tooltip: {
			// crosshairs: true,
			split: true,
		},
		xAxis:{
			gridLineWidth: 1,
			
		},
		yAxis:{
			title: {
				text: 'Depth (m)'
			}
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
		// legend: {
		// 	layout: 'vertical',
		// 	align: 'right',
		// 	verticalAlign: 'middle',
		// 	borderWidth: 0,
		// 	itemStyle: {
		// 		color: '#222'
		// 	},
		// 	itemHoverStyle: {
		// 		color: '#E0E0E3'
		// 	},
		// 	itemHiddenStyle: {
		// 		color: '#606063'
		// 	}
		// },
		credits: {
			enabled: false
		},
		series:data_series
	});

}

function chartProcessbase(id,data_series,name,site){
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
			width: 1000
		},
		title: {
			text: name
		},
		subtitle: {
			text: 'Source: ' + (site).toUpperCase()
		},
		tooltip: {
			split: true,
			// crosshairs: true
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
				text: 'Depth (m)'
			},

		},
		series:data_series
	});
	svgChart()
	
}


function svgChart() {
	var name_site = ((($( "tspan" ).text()).split('.')))
	var extracted_name = (name_site[0]).split(' ');
	$( ".highcharts-contextbutton" ).attr( "visibility", "hidden" );
	$( "#pdfsvg" ).empty();

	var all_data=[]
	var ids = $('.highcharts-container').map(function() {
		return this.id;
	}).get();
	for (var i = 0; i < ids.length; i++) {
		all_data.push($('#'+ids[i]).html());
	}
	if($('#heatmap_container').html() != undefined){
		all_data.push($('#heatmap_container').html())
	}	
	
	console.log(all_data)

	// $.post("/Eos_modal/getAllEos",{data : JSON.stringify(all_data)}).done(function(data_result){

	// },
	// function(data, status){
	// 	console.log(data)
	// });
}