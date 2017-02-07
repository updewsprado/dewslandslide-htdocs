$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

$(document).ready(function(e) {

	$.get("../site_level_page/getAllSiteNamesPerSite").done(function(data){
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

			allSensorPosition(dataSubmit)
		}else{
			$("#errorMsg").modal('show')
		}
	});
	var start = moment().subtract(2, 'days'); 
	var end = moment().add(1, 'days');

	$('#reportrange').daterangepicker({
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

	function allSensorPosition(data_result) {
		$.ajax({url: "/api/SensorAllAnalysisData/"+data_result.site+"/"+data_result.fdate+"/"+data_result.tdate,
			dataType: "json",
			success: function(result){
			var data = JSON.parse(result);
			columnPosition(data[0].c)
			displacementPosition(data[0].d,data[0].v)
			}
		});
	}
	function columnPosition(data_result) {
		if(data_result== "error"){
			$("#graph").hide();
			$("#errorMsg").append('<center>Select new timestamp</h1></center>');
		}else{
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
			// console.log(bubble_Sort(fseries2));
		}     
	}

	function displacementPosition(data_result,data_result_v) {
		if(data_result == "error"){
			$("#graph1").hide();
		}else{
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
			chartProcess("dis1",fseries,"Displacement, downslope")
			chartProcess("dis2",fseries2,"Displacement , across slope")

		}     
		
	}
	function velocityPosition(data_result,id,date) {
		if(data_result == "error"){
			$("#graph2").hide();
		}else{
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
	function chartProcess(id,data_series,name){
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
				type: 'spline',
				zoomType: 'x',
				height: 700,
				width: 550
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
				height: 500,
				width: 1100
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
					month: '%e. %b',
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




});
