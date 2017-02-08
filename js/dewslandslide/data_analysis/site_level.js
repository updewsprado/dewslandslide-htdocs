$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

$(document).ready(function(e) {

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
			var node = $ ("#node").val();
			var fromDate = $('#reportrange span').html().slice(0,10);
			var toDate = $('#reportrange span').html().slice(13,23);
			var urlExt = "gold/site/"+node+"/"+ curSite + "/" + fromDate + "/" + toDate ;
			$("#siteD").DataTable().clear();
			$("#siteD").DataTable().destroy();
			$("#mTable").DataTable().clear();
			$("#mTable").DataTable().destroy();
			document.getElementById("header-site").innerHTML = curSite.toUpperCase()+" Site Overview"
			for (i = 0; i <  per_site_name.length; i++) {
				var siteCode = per_site_name[i].slice(0,3)
				if( curSite == siteCode) {
					subSites.push(per_site_name[i])
				}
			}
			let dataSubmitAlertmini = { 
				site : subSites[0], 
			}
			let dataSubmit = { 
				site : curSite, 
				fdate : fromDate,
				tdate : toDate
			}
		
			$.post("../site_level_page/getDatafromSingleMaxNode", {data : dataSubmitAlertmini} ).done(function(data){ // <----------------- Data for alertmini

			});

			$.post("../site_level_page/getDatafromNodeStatus", {data : dataSubmitAlertmini} ).done(function(data){ // <----------------- Data for alertmini
			// getNodeStatus(data)
			});

			$.post("../site_level_page/getDatafromRainProps", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Rain gauge datas
				var result = JSON.parse(data);
				getRainSenslope(result[0].rain_senslope , fromDate ,toDate , result[0].max_rain_2year,'rain_senslope');
				getRainArq(result[0].rain_arq , fromDate ,toDate , result[0].max_rain_2year,'rain_arq');
				getDistanceRainSite(result[0].RG1, fromDate ,toDate , result[0].max_rain_2year ,'rain1');
				getDistanceRainSite(result[0].RG2, fromDate ,toDate , result[0].max_rain_2year,'rain2');
				getDistanceRainSite(result[0].RG3, fromDate ,toDate , result[0].max_rain_2year,'rain3');
			});

			$.post("../site_level_page/getDatafromSiteRainProps", {data : dataSubmit} ).done(function(data){ // <-----------------old site rain schema
			// console.log(data);
			});


			$.post("../site_level_page/getDatafromSiteMaintenance", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Maintenance History
				var result = JSON.parse(data);
				var site_maintenace = []
				for (i = 0; i < result.length; i++) {
					site_maintenace.push([result[i].sm_id,result[i].site,result[i].start_date , result[i].end_date , result[i].staff_name , result[i].activity , result[i].object, 
						result[i].remarks])
				}
				$('#mTable').DataTable( {
					data:  site_maintenace,
					"processing": true, 
				} );
			});

			$.post("../site_level_page/getDatafromSiteColumn", {data : dataSubmit} ).done(function(data){ // <------------ Data for Site Details
				var result = JSON.parse(data);
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
					chartProcess(series_data,id,'Senslope',site,max_rain,negative );
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
			var divname =["15mins","24hrs" ,"72hrs"];
			var all_raindata =[DataSeries24h,DataSeries72h,DataSeriesRain];
			var color =["red","blue","green"];
			var series_data = [];
			for (i = 0; i < divname.length; i++) {
				series_data.push({ name: divname[i],step: true, data: all_raindata[i],id : 'dataseries',fillOpacity: 0.4, zIndex: 0, lineWidth: 1, color: colors[i],zIndex:i+1})
			}
			chartProcess(series_data,id,'ARQ',site,max_rain,negative );

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
					chartProcess(series_data,id,'Noah',site,max_rain,negative );
				}
			})
		}
	}

	function chartProcess(series_data ,id , data_source ,site ,max ,negative ){

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


});
