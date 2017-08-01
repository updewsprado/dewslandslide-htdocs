$(document).ready(function(e) {
	var start = moment().subtract(60, 'days');
	var end = moment();
	var category_set = ['rain','subsurface','surficial'];
	for (var i = 0; i < category_set.length; i++) {
		datetimeProcess(category_set[i],start,end)
	}
	RainFallProcess('mag',start,end)


})

function removeSpecificArray(array, element) {
	const index = array.indexOf(element);
	array.splice(index, 1);
}

function bouncer(arr) {
	return arr.filter(Boolean);
}

function deleteNan(arr) {
	return arr.filter(function(item){ 
		return typeof item == "string" || (typeof item == "number" && item);
	});
}


function datetimeProcess(category,start,end){
	$('#reportrange'+category).daterangepicker({
		maxDate: moment(),
		autoUpdateInput: true,
		startDate: start,
		endDate: end,
		opens: "left",
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);

	cb(start,end);

	
}

function cb(start,end) {
		// if( ca =='rain'){
			$('#reportrangerain span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD')); 
		// }else if(ca == 'surficial'){
			$('#reportrangesurficial span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD')); 
		// }else if (ca == 'subsurface'){
			$('#reportrangesubsurface span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD')); 
		// }
		
}

/*RAINFALL*/

function RainFallProcess(curSite,fromDate,toDate){

	let dataSubmit = { 
		site : (curSite).toLowerCase(), 
		fdate : fromDate,
		tdate : toDate
	}

	$.ajax({
		url:"/site_level_page/getDatafromRainPropsUrl/"+curSite.toLowerCase(),
		dataType: "json",error: function(xhr, textStatus, errorThrown){
			console.log(errorThrown)},
			success: function(data)
			{
				var result = data;
				var threshold_data = Math.round( parseFloat(result[0].max_rain_2year) * 10 ) / 10
				getRainSenslope(result[0].rain_senslope , dataSubmit, threshold_data ,'rain_senslope',result[0].rain_senslope);
				getRainArq(result[0].rain_arq , dataSubmit, threshold_data ,'rain_arq',result[0].rain_arq);
				getDistanceRainSite(result[0].RG1, dataSubmit, threshold_data ,'rain1',result[0].RG1+" ( "+result[0].d_RG1+"km )");
				getDistanceRainSite(result[0].RG2, dataSubmit , threshold_data,'rain2',result[0].RG2+" ( "+result[0].d_RG2+"km )");
				getDistanceRainSite(result[0].RG3, dataSubmit , threshold_data,'rain3',result[0].RG3+" ( "+result[0].d_RG3+"km )");

				var ids1 = ['rain_senslope','rain_arq','rain1','rain2','rain3']
				var ids2 = [result[0].rain_senslope,result[0].rain_arq,result[0].RG1,result[0].RG2,result[0].RG3]
				for (var i = 0; i < ids1.length; i++) {
					if( ids2[i] == null){
						removeSpecificArray(ids1, ids1[i]);
						removeSpecificArray(ids2, ids2[i]);
					}
				}
				
				for (var i = 0; i < ids1.length; i++) {
					$("#rainfallGraph").append('<div class="col-md-6 rainGraph "><div  id="'+ids1[i]+'2" class="collapse in"></div></div><div class="col-md-6 rainGraph"><div id="'+ids1[i]+'" class="collapse in"></div><div>')
					
				}
				$("#rainfallGraph").append('<div class="maxPlot" id="cumulativeMax">'+ids1.length+'</div>');
				$("#rainfallGraph").append('<div class="maxPlot" id="cumulativeTime"></div>');
				$(".maxPlot").hide();
			}
		});	

}

function getDistanceRainSite(site,dataSubmit,max_rain,id,distance) { 
	if(site.slice(0,1) == "r" ){
		getRainNoah(site, dataSubmit , max_rain,id,distance);
	}else if(site.length == 4){
		getRainSenslope(site, dataSubmit , max_rain,id,distance);
	}else if(site.length == 6){
		getRainArq(site, dataSubmit , max_rain,id,distance);
	}
}
function getRainSenslope(site,dataSubmit,max_rain,id,distance) {
	if(site != null){
		$.ajax({
			url:"/api/RainSenslope/"+site+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
					
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var max_array_data = [];
					var all_cummulative=[];
					var all_ts=[];
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						var colors= ["#0000FF","#FF0000","#0000"]
						for (i = 0; i < jsonRespo.length; i++) {
							var Data24h=[] ,Datarain=[] ,Data72h=[];
							var time =  Date.parse(jsonRespo[i].ts);
							all_ts.push(time)
							all_cummulative.push(parseFloat(jsonRespo[i].rval))
							max_array_data.push(parseFloat(jsonRespo[i].hrs72))
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
						$('#cumulativeTime').append(","+Math.max.apply(null,bouncer(deleteNan(all_ts))))
						$('#cumulativeMax').append(","+Math.max.apply(null,bouncer(deleteNan(all_cummulative))))
						var max_value = (Math.max.apply(null, bouncer(max_array_data)))
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
						var series_data2 = [];
						for (i = 0; i < divname.length-1; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] ,id: divname[i],fillOpacity: 0.4, zIndex:  (divname.length-1)-i, lineWidth: 1, color: colors[i]})
						}
						series_data2.push({ name: divname[2],step: true, data: all_raindata[2],id : divname[2],fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[2]})
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						setTimeout(function(){
							chartProcessRain(series_data,id,'Senslope',site,max_rain,dataTableSubmit,distance,max_value);
							if(all_raindata[2].length != 0){
								chartProcessRain2(series_data2,id,'Senslope',site,max_rain,negative,dataTableSubmit,distance);
							}else{
								chartProcessRain2(undefined,id,'Senslope',site,max_rain,negative,dataTableSubmit,distance);
								chartProcessRain(undefined,id,'Senslope',site,max_rain,dataTableSubmit,distance,max_value);
							}
							
						}, 1000);
					}else{
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'Senslope',site,max_rain,dataTableSubmit,distance,max_value);
						chartProcessRain2(series_data2,id,'Senslope',site,max_rain,negative,dataTableSubmit,distance);
					}
				}
			})
		
	}
}

function getRainArq(site,dataSubmit,max_rain,id,distance) {
	if(site != null){
		$.ajax({
			url:"/api/RainARQ/"+site+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var max_array_data = [];
					var all_cummulative=[];
					var all_ts=[];
					if(data.length != 0){
						var jsonRespo =JSON.parse(data);
						var colors= ["#0000FF","#FF0000","#0000"]
						for (i = 0; i < jsonRespo.length; i++) {
							var Data24h=[] ,Datarain=[] ,Data72h=[];
							var time =  Date.parse(jsonRespo[i].ts);
							all_ts.push(time)
							all_cummulative.push(parseFloat(jsonRespo[i].rval))
							max_array_data.push(parseFloat(jsonRespo[i].hrs72));
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
						$('#cumulativeTime').append(","+Math.max.apply(null,bouncer(deleteNan(all_ts))))
						$('#cumulativeMax').append(","+Math.max.apply(null,bouncer(deleteNan(all_cummulative))))
						var max_value = (Math.max.apply(null, bouncer(max_array_data)))
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
						var series_data2 = [];
						for (i = 0; i < divname.length-1; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i],id : divname[i],fillOpacity: 0.4, zIndex: (divname.length-1)-i, lineWidth: 1, color: colors[i]})
						}
						series_data2.push({ name: divname[2],step: true, data: all_raindata[2],id : divname[2],fillOpacity: 0.4, zIndex: 1, lineWidth: 1, color: colors[2],})
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						setTimeout(function(){
							chartProcessRain(series_data,id,'ARQ',site,max_rain,dataTableSubmit,distance,max_value );
							
							if(all_raindata[2].length != 0){
								chartProcessRain2(series_data2,id,'ARQ',site,max_rain,negative,dataTableSubmit,distance );
							}else{
								chartProcessRain2(undefined,id,'ARQ',site,max_rain,negative,dataTableSubmit,distance);
								chartProcessRain(undefined,id,'ARQ',site,max_rain,dataTableSubmit,distance,max_value );
							}
						}, 1000);
					}else{
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'ARQ',site,max_rain,dataTableSubmit,distance,max_value );
						chartProcessRain2(series_data2,id,'ARQ',site,max_rain,negative,dataTableSubmit,distance );
					}

				}
			})
	}
}

function getRainNoah(site,dataSubmit,max_rain,id,distance) {
	if(site != null){
		var rain_noah_number = site.slice(10,20)
		$.ajax({
			url:"/api/RainNoah/"+rain_noah_number+"/"+dataSubmit.fdate+"/"+dataSubmit.tdate,
			dataType: "json",error: function(xhr, textStatus, errorThrown){
				console.log(errorThrown)},
				success: function(data)
				{
					$("#rain-breadcrumb").append('<li class="breadcrumb-item"><a class="breadcrumb-item" data-toggle="collapse in" data-target="#'+id+'"><button type="button">'+site.toUpperCase()+'</button></a></li>')
					var DataSeries24h=[] , DataSeriesRain=[] , DataSeries72h=[] , negative=[] , nval=[];
					var max = max_rain;
					var max_array_data = [];
					var all_cummulative=[];
					var all_ts=[];
					if(data.length != 0){
						var jsonRespo = JSON.parse(data);
						var colors= ["#0000FF","#FF0000","#0000"]
						for (i = 0; i < jsonRespo.length; i++) {
							var Data24h=[] ,Datarain=[] ,Data72h=[];
							var time =  Date.parse(jsonRespo[i].ts);
							all_ts.push(time)
							all_cummulative.push(parseFloat(jsonRespo[i].rval))
							max_array_data.push(parseFloat(jsonRespo[i].hrs72));
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
						$('#cumulativeTime').append(","+Math.max.apply(null,bouncer(deleteNan(all_ts))))
						$('#cumulativeMax').append(","+Math.max.apply(null,bouncer(deleteNan(all_cummulative))))
						var max_value = (Math.max.apply(null, bouncer(max_array_data)))
						var divname =["24hrs","72hrs" ,"15mins"];
						var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
						var color =["red","blue","green"];
						var series_data = [];
						var series_data2 =[];
						for (i = 0; i < divname.length-1; i++) {
							series_data.push({ name: divname[i],step: true, data: all_raindata[i] , id: divname[i], fillOpacity: 0.4 , zIndex: (divname.length-1)-i, lineWidth: 1, color: colors[i]})
						}
						series_data2.push({ name: divname[2],step: true, data: all_raindata[2] , id: divname[2], fillOpacity: 0.4 , zIndex: 1, lineWidth: 1, color: colors[2]})
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						setTimeout(function(){
							chartProcessRain(series_data,id,'Noah',site,max_rain,dataTableSubmit,distance,max_value );
							if(all_raindata[2].length != 0){
								chartProcessRain2(series_data2,id,'Noah',site,max_rain,negative,dataTableSubmit,distance );
							}else{
								chartProcessRain2(undefined,id,'Noah',site,max_rain,negative,dataTableSubmit,distance);
								chartProcessRain(undefined,id,'Noah',site,max_rain,dataTableSubmit,distance,max_value );
							}
							
						}, 1000);
					}else{
						let dataTableSubmit = { 
							site : site, 
							fdate : dataSubmit.fdate,
							tdate : dataSubmit.tdate,
							current_site : dataSubmit.site
						}
						chartProcessRain(series_data,id,'Noah',site,max_rain,dataTableSubmit,distance,max_value );
						chartProcessRain2(series_data2,id,'Noah',site,max_rain,negative,dataTableSubmit,distance );
					}
				}
			})
	}
}

function chartProcessRain(series_data ,id , data_source ,site ,max,dataTableSubmit,distance,max_value ){
	$("#with_data").append(id+',')
	// console.log($("#with_data").val())
	var fdate = dataTableSubmit.fdate;
	var tdate = dataTableSubmit.tdate;
	var date1 = moment(fdate);
	var date2 = moment(tdate);
	var duration = moment.duration(date2.diff(date1));
	var  list_dates =[];
	for (var i = 1; i < duration.asDays(); i++) {
		list_dates.push(site.slice(0,3)+((moment(fdate).add(i,'days').format('YYYY-MM-DD')).replace(/-/g, "")).slice(2,10))
	}
	var cumulative_time = ($('#cumulativeTime').text()).split(",")
	var max_plot_time = [];
	for (var i = 1; i < cumulative_time.length; i++) {
		if(Number(cumulative_time[i]) != NaN){
			max_plot_time.push(cumulative_time[i])
		}
	}
	let dataSubmit = { date:list_dates,table:site}

	if(max_value != -Infinity){
		var maxValue = Math.max(0,(max_value-parseFloat(max)))+parseFloat(max)
	}else{
		if( series_data != undefined){
			var maxValue = Math.max(0,(max_value-parseFloat(max)))+parseFloat(max)
		}else{
			var maxValue = undefined
		}
	}
	

	var colors= ["#EBF5FB","#0000FF","#FF0000"]
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
			height: 300,

		},
		title: {
			text:' <b>Rainfall Data </b>',
			style: {
				fontSize: '15px'
			}
		},
		subtitle: {
			text: 'Source : <b>'+  (distance).toUpperCase()+'</b>',
			style: {
				fontSize: '10px'
			}
		},
		xAxis: {
			max:Math.max.apply(null,bouncer(deleteNan(max_plot_time))),
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e %b %Y',
				year: '%b'
			},
			title: {
				text: 'Date'
			},
			title: {
				text: 'Date',
			}
		},

		yAxis:{
			title: {
				text: 'Value (mm)',
			},
			max: maxValue,
			min: 0,
			plotBands: [{
				value: Math.round( parseFloat(max/2) * 10 ) / 10,
				color: colors[1],
				dashStyle: 'shortdash',
				width: 2,
				zIndex: 0,
				label: {
					text: '24hrs threshold (' + max/2 +')',

				}
			},{
				value: max,
				color: colors[2],
				dashStyle: 'shortdash',
				width: 2,
				zIndex: 0,
				label: {
					text: '72hrs threshold (' + max +')',

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
			enabled: false
		},
		credits: {
			enabled: false
		},
		series:series_data
	});


}



function chartProcessRain2(series_data ,id , data_source ,site ,max ,negative,dataTableSubmit,distance ){
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
	Highcharts.setOptions({
		global: {
			timezoneOffset: -8 * 60
		}
	});
	var cumulative_time = ($('#cumulativeTime').text()).split(",")
	var max_plot_time = [];
	var cumulative_max = ($('#cumulativeMax').text()).split(",")
	var max_plot_cumulative = [];
	for (var i = 1; i < cumulative_max.length; i++) {
		if(Number(cumulative_max[i]) != NaN){
			max_plot_cumulative.push(cumulative_max[i])
			max_plot_time.push(cumulative_time[i-1])
		}
	}
	$("#"+id+"2").highcharts({
		chart: {
			type: 'column',
			zoomType: 'x',
			panning: true,
			height: 300,
		},
		title: {
			text:' <b>Rainfall Data </b>',
			style: {
				fontSize: '15px'
			}
		},
		subtitle: {
			text: 'Source : <b>'+(distance).toUpperCase()+'</b>',
			style: {
				fontSize: '10px'
			}
		},
		xAxis: {
			max:Math.max.apply(null,bouncer(deleteNan(max_plot_time))),
			plotBands: negative,
			type: 'datetime',
			dateTimeLabelFormats: { 
				month: '%e %b %Y',
				year: '%b'
			},
			title: {
				text: 'Date'
			},

		},
		yAxis: {
			max: Math.max.apply(null,bouncer(deleteNan(max_plot_cumulative))),
			min: 0,
			title: {
				text: 'Value (mm)'
			},

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
			enabled: false
		},
		credits: {
			enabled: false
		},
		series:series_data
	});


	// setTimeout(function(){
	// 	svgChart('rain') 
	// }, 5000);
	

}
