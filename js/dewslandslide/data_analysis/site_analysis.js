// $(document).ajaxStart(function () {
// 	$('#loading').modal('toggle');
// });
// $(document).ajaxStop(function () {
// 	$('#loading').modal('toggle');
// });

$(document).ready(function(e) {
	dropdowlistAppendValue()
	$('#sitegeneral').selectpicker();
	$('#columngeneral-tr').hide();
	$('#nodegeneral-tr').hide();
	$('.daterange-tr').hide();
	$('.charts-graphs-tr').hide();
	var start = moment().subtract(2, 'days'); 
	var end = moment().add(1, 'days');

	$('#reportrange').daterangepicker({
		maxDate: new Date(),
		autoUpdateInput: true,
		cancelLabel: 'Clear',
		startDate: start,
		endDate: end,
		opens: "right",
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		}
	}, cb);

	cb(start, end);

	function cb(start, end) {
		$('#reportrange span').html(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));   
	}

	$.get("../site_level_page/getAllSiteNames").done(function(data){
		var per_site = JSON.parse(data);
		for (a = 0; a <  per_site.length; a++) {
			dropdowlistAppendValue(per_site[a].name, (per_site[a].name).toUpperCase(),'#sitegeneral');
		}
	})

	$("#sitegeneral").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selecte_site = $(this).find('option').eq(clickedIndex).text();
		$('#columngeneral-tr').show();
		$('#columngeneral-tr').empty();
		$('#columngeneral-tr').append('<th> Column: </th><td><select class="selectpicker"  id="columngeneral" data-live-search="true"></td>');
		$('#columngeneral').selectpicker();
		$('#columngeneral').append('<option >Select Column</option>');
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
			zoom: 10,
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
		$( "#container-nav ").switchClass( "container", "container-fluid");
		$( "#container-nav-size ").switchClass( "col-sm-3", "col-sm-2");
		$( "#divData").switchClass( "col-sm-9", "col-sm-12");
		$("#divData").empty()
		$("#divData").append('<h1 id="site_info"></h1>')
		$("#divData").append('<h3 id="site_info_sub"></h3>')
		$("#divData").append('<h4 id="site_info_sub_sub"></h4>')
		$("#divData").append('<div class = "col-sm-3" id="map-canvas" style="height:'+$("#site_details").height()+'"></div>')
		$("#divData").append('<div class="col-sm-9"><ul class="nav nav-tabs" id="divData-ul"><li id="site_details_li" class="active"><a data-toggle="tab" href="#site_details">Site Details</a></li></ul>'+'<div class="tab-content  id="divData-tab-content"><div id="site_details" class="tab-pane fade in active"></div></div></div>')
		
		var selecte_column = $(this).find('option').eq(clickedIndex).text();
		SiteInfo(selecte_column)
		NodeSumary(selecte_column,'node_summary_div')
		mapGenerator(selecte_column)
		siteMaintenance(selecte_column)
		showCommHealthPlotGeneral(selecte_column,'healthbars')
		CheckBoxSiteLevel(selecte_site,selecte_column)
		$(".tab-content").append('<div id="rainfall_data" class="tab-pane fade rainfall_data">'+
			'</div><div id="surficial_measurement_data" class="tab-pane fade surficial_measurement_data"></div>')
		$("#divData-ul").append('<li id="rainfall_data_li"><a data-toggle="tab" href="#rainfall_data">Rain Graphs</a></li>'+
			'<li id="surficial_measurement_data_li"><a data-toggle="tab" href="#surficial_measurement_data">Surficial Measurement</a></li>')
		$('#rainfall_data_li').hide()
		$('#rainfall_data').hide()
		$('#surficial_measurement_data_li').hide()
		$('#surficial_measurement_data').hide()
		$(".rainfall_data").append('<br><h3><span class="glyphicon glyphicon-chevron-down"></span><b>Rainfall Graphs</b></h3><div id="rain_arq" ></div><br><div id="rain_senslope"></div><br><div id="rain1"></div><br><div id="rain2" ></div><br><div id="rain3" ></div><br>')
		$(".surficial_measurement_data").append('<br><h3><span class="glyphicon glyphicon-chevron-down"></span><b>Surficial Measurements</b></h3><div id="rain_arq"><br>')
		$( "#rain_graph_checkbox" ).prop( "checked", false );
		$('#nodegeneral-tr').show();
		$('#nodegeneral').selectpicker();
		$.ajax({url: "/api/NodeNumberPerSite/"+selecte_column , dataType: "json",success: function(result){
			for (c = 0; c <  result.length; c++) {
				for (d = 0; d <  result[c].num_nodes; d++) {
					dropdowlistAppendValue((d+1),(d+1),'#nodegeneral');
				}
			}
			$('.daterange-tr').show();
			$('.charts-graphs-tr').show();
			SelectedNodes(selecte_site,selecte_column)
		}
	})
	});
}

function siteMaintenance(curSite) {
	let dataSubmit = {site : curSite}
	$("#site_details").append('<br><hr><h3><span class="glyphicon glyphicon-chevron-down"></span><b>Site Maintenance</b></h3><table id="mTable" class="display table" cellspacing="0" width="100%"></table>')

	$.post("../site_level_page/getDatafromSiteMaintenance", {data : dataSubmit} ).done(function(data){
		var result = JSON.parse(data);
		var site_maintenace = []
		for (i = 0; i < result.length; i++) {
			site_maintenace.push([result[i].sm_id,result[i].site,result[i].start_date , result[i].end_date , result[i].staff_name , result[i].activity , result[i].object, 
				result[i].remarks])
		}
		$('#mTable').DataTable({
			data:  site_maintenace,
			columns:[{ title: "ID" },
			{ title: "Site Name" },
			{ title: "Start Date" },
			{ title: "End Date" },
			{ title: "Personel" },
			{ title: "Activity" },
			{ title: "Objects" },
			{ title: "Remarks" }
			],
			"processing": true, 
			"lengthMenu": [ 5,10, 25, 50, 75, 100 ]
		} );
	});
}

function NodeSumary(site,siteDiv){ 
	let dataSubmit = { site:site}
	$("#site_details").append('<br><div class="col-sm-9 row" id="node_summary_div" style="height: 18px; width:'+ ($("#container-nav-size").width()*2.8)+'px"><h3><span class="glyphicon glyphicon-chevron-down"></span><b> Node Summary</b><h3></div><br>')
	$("#site_details").append('<br><hr><h3><span class="glyphicon glyphicon-chevron-down"></span><b>Communication Health</b><h5><input type="button" id="show" onclick="showLegends(this.form)" value="Show Legends" /></h5></h3><div width="250px" id="legends" style="visibility:hidden; display:none;">'+
			'<input type="button" onclick="barTransition("red")" style="background-color:red; padding-right:5px;" /><strong><font color=colordata[170]>Last 7 Days</font> </strong><br/>'+
			'<input type="button" onclick="barTransition("blue")" style="background-color:blue; padding-right:5px;" /><strong><font color=colordata[170]>Last 30 Days</font></strong><br/>'+
			'<input type="button" onclick="barTransition("green")" style="background-color:green; padding-right:5px;" /><strong><font color=colordata[170]>Last 60 Days</font></strong>'+
			'</div><div class="row" id="healthbars" style=" height: 150px;width:'+ ($("#container-nav-size").width()*3.5)+'px"></div>')
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
		$("#site_info").append(result[0].name.toUpperCase()+"(v"+result[0].version+")")
		$("#site_info_sub").append(result[0].barangay+" "+result[0].municipality+" "+result[0].province)
		$("#site_info_sub_sub").append("Date install("+result[0].date_install +") / Date Activation("+result[0].date_activation+")")
	});
}
function SelectedNodes(selecte_site,selecte_column){
	$('#nodegeneral').on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedText = $(this).find('option').eq(clickedIndex).text();
	});
}
function CheckBoxSiteLevel(selecte_site,selecte_column){
	// var ckbox = $('#rain_graph_checkbox');
	var ckbox = $('#ground_measurement_checkbox');

	// $('input').on('click',function () {
	// 	if (ckbox.is(':checked')) {
	// 		$('#rainfall_data_li').show()
	// 		$('#rainfall_data').show()
	// 		RainFallProcess(selecte_site)
	// 	}else{
	// 		$('#rainfall_data_li').hide()
	// 		$('#rainfall_data').hide()
	// 	}
	// });

	$('input').on('click',function () {
		if (ckbox.is(':checked')) {
			$('#surficial_measurement_data_li').show()
			$('#surficial_measurement_data').show()
			RainFallProcess(selecte_site)
		}else{
			$('#surficial_measurement_data_li').hide()
			$('#surficial_measurement_data').hide()
		}
	});

}
function RainFallProcess(curSite){
	
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

			}
		})
	}
}

function getRainNoah(site,fdate,tdate,max_rain,id) {
	if(site != null){
		var rain_noah_numeber = site.slice(10,20)
		$.ajax({
			url:"/api/RainNoah/"+rain_noah_numeber+"/"+fdate+"/"+tdate,
			dataType: "json",
			success: function(data)
			{
				var jsonRespo = JSON.parse(data);
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

function SurficialProcess() {

}

