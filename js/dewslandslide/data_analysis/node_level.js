$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});


$(document).ready(function(e) {
	var values = window.location.href.split("/")
	var current_site = values[5]
	var currrent_node = values[6]
	var currrent_fdate = values[7]
	var currrent_tdate =values[8]
	if(current_site != undefined ){
		var curSite = current_site.toLowerCase();
		var node_id = currrent_node;
		var fromDate = currrent_fdate;
		var toDate = currrent_tdate;
		var start = moment(currrent_fdate); 
		var end = moment(currrent_tdate);
		$("#sitegeneral").empty()
		$("#nodetable").empty()
		$("#nodetable").append('<input class="form-control" name="node" id="node" type="number" min="1" max="41"  maxlength="2" size="2" value="'+currrent_node+'"></td>')
		var id =["accel-1","accel-2","accel-3","accel-v","accel-r","accel-c"]
		let dataSubmit = { 
			site : curSite, 
			fdate : fromDate,
			tdate : toDate,
			node:node_id
		}
		nodeSummary(dataSubmit)
		initialProcessGraph(dataSubmit,id)
		sites(current_site.toUpperCase())
		Time(start,end)
		$('#sitegeneral').val($("#sitegeneral option:contains('"+current_site+"')").val());

	}else{
		var start = moment().subtract(7, 'days'); 
		var end = moment().add(1, 'days');
		Time(start,end)
		sites("Select")
		submit()
	} 
});

function sites(site_selected){
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
			$("#sitegeneral").append('<option value="'+site_selected+'">'+site_selected+'</option>');
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
function Time(start,end){
	

	$('#reportrange').daterangepicker({
		maxDate: moment().add(1, 'days'),
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
}

function submit(){
	$('#searchtool input[id="submit"]').on('click',function(){
		if($("#sitegeneral").val() != "" && $("#node").val() != "" ){	
			if( $("#node").val() <= 40 ){
				$('.mini-alert-canvas div:first').remove(); 
				var curSite = $("#sitegeneral").val();
				var node = $ ("#node").val();
				var fromDate = $('#reportrange span').html().slice(0,10);
				var toDate = $('#reportrange span').html().slice(13,23);
				location = "/data_analysis/node/"+curSite+"/"+node+"/"+fromDate+"/"+toDate
			}else{
				$("#errorMsg2").modal('show')
			}
		}else{
			$("#errorMsg").modal('show')
		}
	});
}

function nodeSummary(data){
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/getAllSingleAlertwithSite/"+data.site,success: function(result) {
			nodeAlertJSON = JSON.parse(result.nodeAlerts)
			maxNodesJSON = JSON.parse(result.siteMaxNodes)
			nodeStatusJSON = JSON.parse(result.nodeStatus)
			$( ".mini-alert-canvas" ).append('<div id="mini-alert-canvas" style="width:'+(($("#header-site").width()-$(".col-lg-4").width())-180)+'px;height:'+
				($(".panel-heading").height()-35)+'px"></div>' );
			initAlertPlot(nodeAlertJSON,maxNodesJSON,nodeStatusJSON,"mini-alert-canvas")
		}
	});
}

function initialProcessGraph(data,id){
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/getDatafromSiteColumn/"+data.site,success: function(result) {
			document.getElementById("header-site").innerHTML = data.site.toUpperCase()+" v"+ result[0].version +" (node "+ data.node +") Overview"
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
						somsV2(dataSubmit,'0');
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
				accel1(dataSubmit);
				if(data.site.slice(3,4) == "s"){
					for (i = 0; i < soms_id.length; i++) {
						somsUnfiltered(dataSubmit,soms_id[i],id[4+i],mode[i]);
					}
				}
			}else{
				accelVersion1(data.site,data.node,data.fdate,data.tdate,id);
				$("#accel-c").hide();
				$("#accel-r").hide();
			}
			
		}
	});
}
function accelVersion1(curSite,node,fromDate,toDate,id){
	$.ajax({ 
		dataType: "json",
		url: "/node_level_page/getAllAccelVersion1/"+curSite+"/"+fromDate+"/"+toDate+"/"+node,  success: function(data) {
			console.log("/node_level_page/getAllAccelVersion1/"+curSite+"/"+fromDate+"/"+toDate+"/"+node)
			var result = data;
			var series_data = [];
			var xDataSeries=[] , yDataSeries=[] , zDataSeries=[] , mDataSeries=[];
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [] ,mData = [];
				var time =  Date.parse(result[i].timestamp);
				xData.push(time, parseFloat(result[i].xvalue));
				yData.push(time, parseFloat(result[i].yvalue));
				zData.push(time, parseFloat(result[i].zvalue));
				mData.push(time, parseFloat(result[i].mvalue));
				xDataSeries.push(xData);
				yDataSeries.push(yData);
				zDataSeries.push(zData);
				mDataSeries.push(mData);
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries,mDataSeries];
			var series_name = ["xvalue","yvalue","zvalue","mvalue"];
			var color_series = [["#3362ff"],["#9301f1"],["#fff"],["#01f193"]]
			for (i = 0; i < series_id.length; i++) {
				series_data.push([{ name: series_name[i] ,step: true, data:series_id[i] ,id: 'dataseries'}])
			}
			chartProcess(id[3],series_data[3],series_name[3],color_series[3])
			series_id.pop()
			accelVersion1Filtered(data,series_id,id)
		}
	});
}

function accelVersion1Filtered(data,series_data,id){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredVersion1/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node,  success: function(result) {
			var xDataSeriesfilterd=[] , yDataSeriesfilterd=[] , zDataSeriesfilterd=[] ;
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [];
				var time =  Date.parse(result[i].ts);
				xData.push(time, parseFloat(result[i].x));
				yData.push(time, parseFloat(result[i].y));
				zData.push(time, parseFloat(result[i].z));
				xDataSeriesfilterd.push(xData);
				yDataSeriesfilterd.push(yData);
				zDataSeriesfilterd.push(zData);
			}
			var series_id = [xDataSeriesfilterd,yDataSeriesfilterd,zDataSeriesfilterd];
			var series_name_data = ["x1(raw)","y1(raw)","z1(raw)"];
			var series_name_id = ["x1(filterd)","y1(filterd)","z1(filterd)"];
			var series_name=["Xvalue","Yvalue","Zvalue"]
			var dataseries=[]
			for (i = 0; i < series_data.length; i++) {
				var data_push = []
				data_push.push({ name: series_name_data[i] ,step: true, data:series_data[i] ,id: 'dataseries'})	
				data_push.push({ name: series_name_id[i] ,step: true, data:series_id[i] ,id: 'dataseries'})	
				dataseries.push(data_push)
			}

			var color_series = [["#5ff101","#fff"],["#3362ff","#fff"],["#ff4500","#fff"]]
			for (i = 0; i < dataseries.length; i++) {
				chartProcess(id[i],dataseries[i],series_name[i],color_series[i])
			}
		}
	});	
}

function accel1(data){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelUnfilteredData/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+data.msgid,  success: function(result) {
			var xDataSeries=[] , yDataSeries=[] , zDataSeries=[] , mDataSeries=[];
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [] ,mData = [];
				var time =  Date.parse(result[i].timestamp);
				xData.push(time, parseFloat(result[i].xvalue));
				yData.push(time, parseFloat(result[i].yvalue));
				zData.push(time, parseFloat(result[i].zvalue));
				mData.push(time, parseFloat(result[i].batt));
				xDataSeries.push(xData);
				yDataSeries.push(yData);
				zDataSeries.push(zData);
				mDataSeries.push(mData);
			}
			if(data.version == 2){
				var ms_id = '33';
			}else{
				var ms_id = '12'
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries,mDataSeries];
			accel2(data,series_id,ms_id)
		}
	});	
}

function accel2(data,series,msgid){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelUnfilteredData/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+msgid,  success: function(result) {
			var xDataSeries=[] , yDataSeries=[] , zDataSeries=[] , mDataSeries=[];
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [] ,mData = [];
				var time =  Date.parse(result[i].timestamp);
				xData.push(time, parseFloat(result[i].xvalue));
				yData.push(time, parseFloat(result[i].yvalue));
				zData.push(time, parseFloat(result[i].zvalue));
				mData.push(time, parseFloat(result[i].batt));
				xDataSeries.push(xData);
				yDataSeries.push(yData);
				zDataSeries.push(zData);
				mDataSeries.push(mData);
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries,mDataSeries];
			var series_name =["batt1","batt2"]
			var dataseries = []
			dataseries.push(series)
			dataseries.push(series_id)
			accel1filtered(data,dataseries)

			var batt_series = [];
			var dataseries_batt =[];
			batt_series.push(series[3])
			batt_series.push(series_id[3])
			var visibility =[true,false]
			for (i = 0; i < batt_series.length; i++) {
				dataseries_batt.push({ name: series_name[i],data:batt_series[i] ,id: 'dataseries',visible:visibility[i]});
			}
			var color_series = ["#d48a3b","#fff"]
			chartProcess(data.id[3],dataseries_batt,"Batt",color_series)
		}
	});	
}

function accel1filtered(data,series){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredData/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+data.msgid,  success: function(data_result) {
			var result = JSON.parse(data_result);
			var xDataSeries=[] , yDataSeries=[] , zDataSeries=[];
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [];
				var time =  Date.parse(result[i].ts);
				xData.push(time, parseFloat(result[i].x));
				yData.push(time, parseFloat(result[i].y));
				zData.push(time, parseFloat(result[i].z));
				xDataSeries.push(xData);
				yDataSeries.push(yData);
				zDataSeries.push(zData);
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries]
			if(data.version == 2){
				var ms_id = '33';
			}else{
				var ms_id = '12'
			}
			series.push(series_id)
			accel2filtered(data,series,ms_id)
		}
	});	
}

function accel2filtered(data,series,msgid){
	$.ajax({ 
		dataType: "json",
		url: "/api/AccelfilteredData/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+msgid,  success: function(data_result) {
			var result = JSON.parse(data_result);
			var series_data = [];
			var xDataSeries=[] , yDataSeries=[] , zDataSeries=[] ,mDataSeries;
			for (i = 0; i < result.length; i++) {
				var xData=[] , yData=[] ,zData = [];
				var time =  Date.parse(result[i].ts);
				xData.push(time, parseFloat(result[i].x));
				yData.push(time, parseFloat(result[i].y));
				zData.push(time, parseFloat(result[i].z));
				xDataSeries.push(xData);
				yDataSeries.push(yData);
				zDataSeries.push(zData);
			}
			var series_id = [xDataSeries,yDataSeries,zDataSeries];
			var series_title = ["xvalue","yvalue","zvalue","batt"]
			var series_name = ["x1(raw)","x2(raw)","x1(filterd)","x2(filterd)",
			"y1(raw)","y2(raw)","y1(filterd)","y2(filterd)","z1(raw)","z2(raw)","z1(filterd)","z2(filterd)"];
			var visibility =[true,false,false,false,true,false,false,false,true,false,false,false]
			var color_series = [["#5ff101","#9301f1","#fff","#01f193"],["#3362ff","#9301f1","#fff","#01f193"],["#ff4500","#9301f1","#fff","#01f193"],["#d48a3b","#fff",'#ff8000',"#ffbf00"]]
			series.push(series_id)
			var process_dataseries = []; // sorthing by dataseries
			for (i = 0; i < series.length-1; i++) {
				for (a = 0; a < series[0].length; a++) {
					process_dataseries.push(series[a][i])
				}
			}
			var temp = "";
			var plot_data = [];
			for (i = 0; i < process_dataseries.length; i++) { 
				if (temp == "") {
					temp = series_name[i].substring(0,1);
					plot_data.push({ name: series_name[i],data:process_dataseries[i] ,id: 'dataseries',visible:visibility[i]});
				} else {
					if (temp == series_name[i].substring(0,1)) {
						plot_data.push({ name: series_name[i],data:process_dataseries[i] ,id: 'dataseries',visible:visibility[i]});
					} else {
						series_data.push(plot_data);
						temp = series_name[i].substring(0,1);
						plot_data = [];
						plot_data.push({ name: series_name[i],data:process_dataseries[i] ,id: 'dataseries',visible:visibility[i]});
					}
				}
			}
			series_data.push(plot_data);
			plot_data = [];

			for (i = 0; i < series_data.length; i++) { 
				chartProcess(data.id[i] , series_data[i] , series_title[i],color_series[i])
			}

		}
	});	
}

function somsV2(data,mode){
	$.ajax({ 
		dataType: "json",
		url: "/api/SomsVS2/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/0",  success: function(data_result) {
			var result = JSON.parse(data_result);
			var rawDataSeries =[];
			for (i = 0; i < result.length; i++) {
				var rawData=[] ;
				var time = Date.parse(result[i].ts);
				rawData.push(time,  parseFloat(result[i].mval1));
				rawDataSeries.push(rawData);
			}
			var mode= "0";
			var name= ["Raw","Raw(filtered)"];
			var id_name = "Soms(raw)"
			let dataSoms= { 
				mode : mode, 
				name : name,
				id_name : id_name,
				id:data.id[4]
			}
			somsfiltered(data,dataSoms,rawDataSeries)
		}
	});	
}

function somsUnfiltered(data,soms_msgid,name,mode){
	$.ajax({ 
		dataType: "json",
		url: "/api/SomsUnfilteredData/"+data.site+"m/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+soms_msgid,  success: function(data_result) {
			var result = data_result
			var somsDataSeries =[];
			for (i = 0; i < result.length; i++) {
				var somsData=[] ;
				var time = Date.parse(result[i].timestamp);
				somsData.push(time,  parseFloat(result[i].mval1));
				somsDataSeries.push(somsData);
			}

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
			var color_series = ["#00a09e" ,"#fff"];
			somsfiltered(data,dataSoms,somsDataSeries,color_series)
		}
	});	
}
function somsfiltered(data,dataSoms,series){
	$.ajax({ 
		dataType: "json",
		url: "/api/SomsfilteredData/"+data.site+"/"+data.fdate+"/"+data.tdate+"/"+data.node+"/"+dataSoms.mode,  success: function(data_result) {
			if(data_result.length != 0){
				var result = JSON.parse(data_result);
				var filterDataSeries =[];
				var series_data=[] , data_series=[];
				for (i = 0; i < result.length; i++) {
					var filterData=[];
					var time =  Date.parse(result[i].ts);
					filterData.push(time,  parseFloat(result[i].mval1));
					filterDataSeries.push(filterData);
				}
				series_data.push(series)
				series_data.push(filterDataSeries)
				var visibility =[true,false]
				for (i = 0; i < series_data.length; i++) {
					data_series.push({ name:dataSoms.name[i],data:series_data[i] ,id: 'dataseries',visible:visibility[i]});
					console.log({ name:dataSoms.name[i],data:series_data[i] ,id: 'dataseries',visible:visibility[i]})
				}	
				var color_series =["#00ff80" ,"#ffff00"];
				chartProcess(dataSoms.id,data_series,dataSoms.id_name,color_series)
			}else{
				var series_data=[] , data_series=[];
				series_data.push(series)
				var visibility =[true,false]
				for (i = 0; i < series_data.length; i++) {
					data_series.push({ name:dataSoms.name[i],data:series_data[i] ,id: 'dataseries',visible:visibility[i]});
				}	
				var color_series =["#00ff80" ,"#ffff00"];
				chartProcess(dataSoms.id,data_series,dataSoms.id_name,color_series)
			}
		}
	});	
}

function chartProcess(id,data_series,name,color){

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
                        credits: {
                        	enabled: false
                        },
                        series:data_series
                    }
                    );
}