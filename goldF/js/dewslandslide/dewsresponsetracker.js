$(document).ready(function(e) {

	var persons = [];
	var chatStamps = [];
	var series_value = [];
	var column_value = [];
	var point_lbl_value = [];
	var series_data = [];
	var period_range = [];
	var chart_category = [];
	var data = {};

    $(document).ajaxStart(function () {
    	$('#loading').modal('toggle');
    });

    $(document).ajaxStop(function () {
    	$('#loading').modal('toggle');
    });


    $('#confirm-filter-btn').click(function(){

    	resetVariables();

    	if ($('#category-selection').val() != null &&  $('#period-selection').val() != null) {
			data['filterKey'] = $('#filter-key').val();
			data['category'] = $('#category-selection').val();
			data['period'] = $('#period-selection').val();
			data['current_date'] = moment().format('YYYY-MM-DD HH:mm:ss');
			// Minus the period on the current date
			switch(data['period'].charAt(1)) {
			    case "m":
			        data['period'] = moment().subtract(data['period'].charAt(0),"months").format('YYYY-MM-DD HH:mm:ss');
			        break;
			    case "w":
			        data['period'] = moment().subtract(7*data['period'].charAt(0),"days").format('YYYY-MM-DD HH:mm:ss');
			        break;
			    case "y":
			        data['period'] = moment().subtract(1,"years").format('YYYY-MM-DD HH:mm:ss');
			        break;
			}
    		if ($('#category-selection').val() == 'allsites') {
    			getAnalyticsAllSites(data);
	    	} else if ($('#category-selection').val() == 'site' && $('#filter-key').val() != ""  && $('#filter-key').val() != null){
	    		getAnalyticsSite(data);
	    	} else if ($('#category-selection').val() == 'person' && $('#filter-key').val() != ""  && $('#filter-key').val() != null) {
	    		getAnalyticsPerson(data);
	    	} else {
	    		alert('Invalid Request, Please recheck inputs');
	    	}
    	} else {
    		alert('Invalid Request, Please recheck inputs');
    	}
    	
	});


	// Analytics Section
	function getAnalyticsPerson(data){
		$.post( "../responsetracker/analyticsPerson", {person: JSON.stringify(data)})
			.done(function(response) {
				var data = JSON.parse(response);
				sites = [];
				for (var i = 0; i < Object.keys(data).length;i++){
					chatStamps = [];
					for (var x = 0;x < data[Object.keys(data)[i]].length;x++) {
						chatStamps.push(data[Object.keys(data)[i]][x]);
					}


					sites.push({
						number: Object.keys(data)[i],
						values: chatStamps
					});
				}

				series_data = analyzeNumberOfReplies(sites);
				averagedelay_data = analyzeAverageDelayReply(sites);
				titleAndCategoryConstructors();

				Highcharts.setOptions({
				  global: {
				    useUTC: false
				  }
				});
				changePanelResolution();
				$('#reliability-chart-container').highcharts({
		            chart: {
		                zoomType: 'xy'
		            },
			        title: {
			            text: 'Percent of Reply for '+$('#filter-key').val(),
			            x: -20 //center
			        },
			        subtitle: {
			            text: period_range['percentReply'],
			            x: -20
			        },
			        xAxis: {
		            	type: 'datetime'
			        },
			        yAxis: {
			            title: {
			                text: '% of Replies'
			            },
			            plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
			        },
			        tooltip: {
			            valueSuffix: '%'
			        },
			        legend: {
			            layout: 'vertical',
			            align: 'right',
			            verticalAlign: 'middle',
			            borderWidth: 0
			        },
			        series: series_value
			    });

			     $('#average-delay-container').highcharts({
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Average delay of Reply'
			        },
			        subtitle: {
			            text: period_range['percentReply']
			        },
			        xAxis: {
			            type: 'category'
			        },
			        yAxis: {
			            title: {
			                text: 'Total time delay'
			            }
			        },
			        legend: {
			            enabled: false
			        },
			        plotOptions: {
			            series: {
			                borderWidth: 0,
			                dataLabels: {
			                    enabled: true,
			                    format: '{point.y:.0f} Minutes'
			                }
			            }
			        },

			        tooltip: {
			            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.summary}</b> Average<br/>',
			        },

			        series: [{
			            name: 'Time',
			            colorByPoint: true,
			            data: column_value
			        }]

			    });

			});
	}

	function getAnalyticsAllSites(data){
		$.post( "../responsetracker/analyticsAllSites", {allsites: JSON.stringify(data)})
			.done(function(response) {
				var data = JSON.parse(response);
				sites = [];
				var obj = data[0];

				for (var i=0;i < Object.keys(obj).length;i++){
					chatStamps = [];
					for (var x = 0; x < obj[Object.keys(obj)[i]].length; x++){
						chatStamps.push(obj[Object.keys(obj)[i]][x]);
					}
					sites.push({
						number: Object.keys(obj)[i],
						values: chatStamps
					})
					// console.log(obj[Object.keys(obj)[i]]);
				}

				series_data = analyzeNumberOfReplies(sites);
				averagedelay_data = analyzeAverageDelayReply(sites);
				titleAndCategoryConstructors();

				Highcharts.setOptions({
				  global: {
				    useUTC: false
				  }
				});

				changePanelResolution();
				$('#reliability-chart-container').highcharts({
		            chart: {
		                zoomType: 'xy'
		            },
			        title: {
			            text: 'Percent of Reply for All Sites',
			            x: -20 //center
			        },
			        subtitle: {
			            text: period_range['percentReply'],
			            x: -20
			        },
			        xAxis: {
		            	type: 'datetime'
			        },
			        yAxis: {
			            title: {
			                text: '% of Replies'
			            },
			            plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
			        },
			        tooltip: {
			            valueSuffix: '%'
			        },
			        legend: {
			            layout: 'vertical',
			            align: 'right',
			            verticalAlign: 'middle',
			            borderWidth: 0
			        },
			        series: series_value
			    });

			     $('#average-delay-container').highcharts({
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Average delay of Reply'
			        },
			        subtitle: {
			            text: period_range['percentReply']
			        },
			        xAxis: {
			            type: 'category'
			        },
			        yAxis: {
			            title: {
			                text: 'Total time delay'
			            }
			        },
			        legend: {
			            enabled: false
			        },
			        plotOptions: {
			            series: {
			                borderWidth: 0,
			                dataLabels: {
			                    enabled: true,
			                    format: '{point.y:.0f} Minutes'
			                }
			            }
			        },

			        tooltip: {
			            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.summary}</b> Average<br/>',
			        },

			        series: [{
			            name: 'Time',
			            colorByPoint: true,
			            data: column_value
			        }]

			    });
		});
	}

	function getAnalyticsSite(data){
		$.post( "../responsetracker/analyticsSite", {site: JSON.stringify(data)})
			.done(function(response) {
				var data = JSON.parse(response);
				// Converts object to Array
				persons = [];
				for (var i = 0; i < Object.keys(data).length;i++){
					chatStamps = [];
					for (var x = 0;x < data[Object.keys(data)[i]].length;x++) {
						chatStamps.push(data[Object.keys(data)[i]][x]);
					}


					persons.push({
						number: Object.keys(data)[i],
						values: chatStamps
					});
				}

				series_data = analyzeNumberOfReplies(persons);
				averagedelay_data = analyzeAverageDelayReply(persons);
				titleAndCategoryConstructors();
				// console.log(series_value);

				Highcharts.setOptions({
				  global: {
				    useUTC: false
				  }
				});

				changePanelResolution();
				$('#reliability-chart-container').highcharts({
		            chart: {
		                zoomType: 'xy'
		            },
			        title: {
			            text: 'Percent of Reply for '+$('#filter-key').val(),
			            x: -20 //center
			        },
			        subtitle: {
			            text: period_range['percentReply'],
			            x: -20
			        },
			        xAxis: {
		            	type: 'datetime'
			        },
			        yAxis: {
			            title: {
			                text: '% of Replies'
			            },
			            plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
			        },
			        tooltip: {
			            valueSuffix: '%'
			        },
			        legend: {
			            layout: 'vertical',
			            align: 'right',
			            verticalAlign: 'middle',
			            borderWidth: 0
			        },
			        series: series_value
			    });

			    $('#average-delay-container').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: 'Average delay of Reply'
		        },
		        subtitle: {
		            text: period_range['percentReply']
		        },
		        xAxis: {
		            type: 'category'
		        },
		        yAxis: {
		            title: {
		                text: 'Total time delay'
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        plotOptions: {
		            series: {
		                borderWidth: 0,
		                dataLabels: {
		                    enabled: true,
		                    format: '{point.y:.0f} Minutes'
		                }
		            }
		        },

		        tooltip: {
		            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.summary}</b> Average<br/>',
		        },

		        series: [{
		            name: 'Time',
		            colorByPoint: true,
		            data: column_value
		        }]

		    });
		});
	}

	$('#category-selection').on('change',function(){
		// Disables the filter key input if the selected category is All sites
		if ($('#category-selection').val() == "allsites") {
			$("#filter-key").prop('disabled', true);
			$('#filter-key').val("");
		} else {
			$("#filter-key").prop('disabled', false);
			$.get( "../responsetracker/get"+$('#category-selection').val(), function( data ) {
				var dataFetched = {};
				dataFetched = JSON.parse(data);
				if (dataFetched.type == "person") {
					datalistPredictionPerson(dataFetched.data);
				} else if (dataFetched.type == "site") {
					datalistPredictionSite(dataFetched.data);
				} else {
					console.log('Invalid Request');
				}
			});
		}
	})

	function datalistPredictionPerson(data) {
		var datalist = document.getElementById('filterlist');
		while (datalist.hasChildNodes()) {
			datalist.removeChild(datalist.lastChild);
		}
		$('#filter-key').val("");
		for (var counter=0;counter < data.length;counter++){
			var opt = document.createElement('option');

			var constructedFullname = data[counter].lastname+','+ data[counter].firstname
			+','+ data[counter].number;

			opt.value = constructedFullname;
			opt.innerHTML = constructedFullname;
			datalist.appendChild(opt);
		}
	}

	function datalistPredictionSite(data) {
		var datalist = document.getElementById('filterlist');
		while (datalist.hasChildNodes()) {
			datalist.removeChild(datalist.lastChild);
		}
		$('#filter-key').val("");
		for (var counter=0;counter < data.length;counter++){
			var opt = document.createElement('option');
			opt.value = data[counter];
			opt.innerHTML = data[counter];
			datalist.appendChild(opt);
		}
	}

	function resetVariables(){
		persons = [];
		chatStamps = [];
		series_value = [];
		series_data = [];
		period_range = [];
		chart_category = [];
		data = {};
	}

	function changePanelResolution(){
    	if ($('#filter-key').val() == ""){
    		$("#reliability-pane").attr('class', 'col-md-12');
    		$("#adp-pane").attr('class', 'col-md-12');
    		$("#detailed-pane").attr('class', 'col-md-12');

    	} else {
			var chart = $('#reliability-chart-container').highcharts();
    		$("#reliability-pane").attr('class', 'col-md-8');
    		$("#adp-pane").attr('class', 'col-md-6');
    		$("#detailed-pane").attr('class', 'col-md-6');
    	}
	}

	function analyzeNumberOfReplies(data){
		var sent = 0;
		var replies = 0;
		var reply_stats = 0;
		var tempDay = "";
		var data_hc = [];

		for (var i=0;i<data.length;i++){
			// Resets the statistics
			sent = 0;
			replies = 0;
			reply_stats = 0;
			tempDay = "";
			data_hc = [];

			for (var x = 0;x<data[i].values.length;x++){
				if (tempDay == "" || tempDay == null){
					// Check if the Key is empty
					// If empty the category is for all sites
					if ($('#filter-key').val() == "") {
						for (var o = 0; o < data[i].values[x].length;o++){
							tempDay = data[i].values[x][o].timestamp.substring(8,11);
							if (data[i].values[x][o].user == "You") {
								sent++;
							} else {
								replies++;
							}

							if (replies > sent) {
								// If the Replies are greater than the sent messages
								// it is automatically 100%
								reply_stats = 100;
							} else {
								reply_stats = (replies / sent)*100;
							}
							if (data[i].values[x].length == 1) {
								reply_stats_with_dates = [moment(data[i].values[x][0].timestamp.substring(0,9)).valueOf(),reply_stats];
								data_hc.push(reply_stats_with_dates);
							}
						}

					} else {
						tempDay = data[i].values[x].timestamp.substring(8,11);
						if (data[i].values[x].user == "You") {
							sent++;
						} else {
							replies++;
						}

						if (replies > sent) {
							// If the Replies are greater than the sent messages
							// it is automatically 100%
							reply_stats = 100;
						} else {
							reply_stats = (replies / sent)*100;
						}
						
						if (data[i].values.length == 1) {
							reply_stats_with_dates = [moment(data[i].values[x].timestamp.substring(0,9)).valueOf(),reply_stats];
							data_hc.push(reply_stats_with_dates);
						}
					}

				} else {
					// Check if the Key is empty
					// If empty the category is for all sites
					if ($('#filter-key').val() == "") {
						for (var o = 0; o < data[i].values[x].length;o++){
							if (tempDay == data[i].values[x][o].timestamp.substring(8,11)) {

								if (data[i].values[x][o].user == "You") {
									sent++;
								} else {
									replies++;
								}

								if (replies > sent) {
									// If the Replies are greater than the sent messages
									// it is automatically 100%
									reply_stats = (reply_stats + 100)/2;
								} else {
									reply_stats = (reply_stats + ((replies / sent)*100))/2;
								}

							} else {
								reply_stats_with_dates = [moment(data[i].values[x][o].timestamp).valueOf(),reply_stats];
								data_hc.push(reply_stats_with_dates);
								sent = 0;
								replies = 0;
								tempDay = data[i].values[x][o].timestamp.substring(8,11);

								if (data[i].values[x][o].user == "You") {
									sent++;
								} else {
									replies++;
								}

								if ( replies > sent) {
								// If the Replies are greater than the sent messages
								// it is automatically 100%
									reply_stats = 100;
								} else {
									reply_stats = (replies / sent)*100;	
								}
							}
						}
					} else {

						if (tempDay == data[i].values[x].timestamp.substring(8,11)) {

							if (data[i].values[x].user == "You") {
								sent++;
							} else {
								replies++;
							}

							if (replies > sent) {
								// If the Replies are greater than the sent messages
								// it is automatically 100%
								reply_stats = (reply_stats + 100)/2;
							} else {
								reply_stats = (reply_stats + ((replies / sent)*100))/2;
							}

						} else {
							reply_stats_with_dates = [moment(data[i].values[x].timestamp).valueOf(),reply_stats];
							data_hc.push(reply_stats_with_dates);
							sent = 0;
							replies = 0;
							tempDay = data[i].values[x].timestamp.substring(8,11);

							if (data[i].values[x].user == "You") {
								sent++;
							} else {
								replies++;
							}

							if ( replies > sent) {
							// If the Replies are greater than the sent messages
							// it is automatically 100%
								reply_stats = 100;
							} else {
								reply_stats = (replies / sent)*100;	
							}
						}
					}
				}
			}

			var name_hc = data[i].number;
			// Sort the dates Asc order

			doSortDates(data_hc);

			series_stats = {
				name: name_hc,
				data: data_hc
			};
			series_value.push(series_stats);
		}
	}

	function analyzeAverageDelayReply(data){
		column_value = [];
		for (var i=0;i<data.length;i++){
			var chatterbox_date = "";
			var sender_date = "";
			var date_arr = [];
			var average_delay = "";
			for (var x = 0;x<data[i].values.length;x++){
				//If the filterkey is empty, the category is ALL SITES
				if ($('#filter-key').val() == "") {
					for (var o = 0; o < data[i].values[x].length;o++){
						if (chatterbox_date == "" || sender_date == "") {
							if (data[i].values[x][o].user == "You") {
								chatterbox_date = data[i].values[x][o].timestamp;
							} else {
								sender_date = data[i].values[x][o].timestamp;
							}
						}

						//Computes the delay and push it to an array.
						if (chatterbox_date != "" && sender_date != ""){
							if (moment(chatterbox_date) > moment(sender_date)) {
								var date1 = moment(chatterbox_date);
								var date2 = moment(sender_date);
								var diff = date1.diff(date2,'minutes');
								date_arr.push(diff);
								chatterbox_date = "";
								sender_date = "";
							} else {
								var date1 = moment(chatterbox_date);
								var date2 = moment(sender_date);
								var diff = date2.diff(date1,'minutes');
								date_arr.push(diff);
								chatterbox_date = "";
								sender_date = "";
							}
						}
					}
				} else {

					if (chatterbox_date == "" || sender_date == "") {
						if (data[i].values[x].user == "You") {
							chatterbox_date = data[i].values[x].timestamp;
						} else {
							sender_date = data[i].values[x].timestamp;
						}
					}

					//Computes the delay and push it to an array.
					if (chatterbox_date != "" && sender_date != ""){
						if (moment(chatterbox_date) > moment(sender_date)) {
							var date1 = moment(chatterbox_date);
							var date2 = moment(sender_date);
							var diff = date1.diff(date2,'minutes');
							date_arr.push(diff);
							chatterbox_date = "";
							sender_date = "";
						} else {
							var date1 = moment(chatterbox_date);
							var date2 = moment(sender_date);
							var diff = date2.diff(date1,'minutes');
							date_arr.push(diff);
							chatterbox_date = "";
							sender_date = "";
						}
					}
				}
			}

			var tot = 0;
			for (var y = 0;y < date_arr.length;y++) {
				tot = tot + date_arr[y];
			}

			tot = tot/date_arr.length-1;
			column_value.push({
				name: data[i].number,
				y: tot,
				summary: getTimeFromMins(tot)
			});

			tot = 0;
			date_arr = [];
			chatterbox_date = "";
			sender_date = "";
		}
	}

	function getTimeFromMins(mins) {
		MINS_PER_YEAR = 24 * 365 * 60
	    MINS_PER_MONTH = 24 * 30 * 60
	    MINS_PER_WEEK = 24 * 7 * 60
	    MINS_PER_DAY = 24 * 60
	    MINS_PER_HOUR = 60
	    minutes = mins;
	    years = Math.floor(minutes / MINS_PER_YEAR);
	    minutes = minutes - years * MINS_PER_YEAR;
	    months = Math.floor(minutes / MINS_PER_MONTH);
	    minutes = minutes - months * MINS_PER_MONTH;
	    weeks = Math.floor(minutes / MINS_PER_WEEK);
	    minutes = minutes - weeks * MINS_PER_WEEK;
	    days = Math.floor(minutes / MINS_PER_DAY);
	    minutes = minutes - days * MINS_PER_DAY;
	    hours = Math.floor(minutes / MINS_PER_HOUR);
	    minutes = minutes % MINS_PER_HOUR;
	    return years + " year(s) " + months + " month(s) " + weeks + " week(s) " + days + " day(s) "+ hours + " hour(s) " + Math.round(minutes) + " minute(s)"

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

	function titleAndCategoryConstructors(){
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
						'August', 'September', 'October', 'November', 'December'];
		var date_start = months[data['period'].substring(5,7)-1];
		var date_end = months[data['current_date'].substring(5,7)-1];
		period_range['percentReply'] = "Percent of Reply from "+date_start+" "+data['period'].substring(8,11)+" "+data['period'].substring(0,4) +
										" to "+date_end+" "+data['current_date'].substring(8,11)+" "+data['current_date'].substring(0,4);
		period_range['averageDelay'] = "Average Delay of Reply from "+date_start+" "+data['period'].substring(8,11)+" "+data['period'].substring(0,4) +
										" to "+date_end+" "+data['current_date'].substring(8,11)+" "+data['current_date'].substring(0,4);
	}
	// End of Analytics Section

	$('#from-date').datepicker({
	});

	$('#to-date').datepicker({
	});

	// Resets the Period selector to default if the from-to function is used
	$('#from-date').on('change',function(){
	   	$('#period-selection option').prop('selected', function() {
	        return this.defaultSelected;
	    });
	});

	// Resets the Period selector to default if the from-to function is used
	$('#to-date').on('change',function(){
	   	$('#period-selection option').prop('selected', function() {
	        return this.defaultSelected;
	    });
	});

	$('#period-selection').on('change',function(){
		$('#to-date').val('');
		$('#from-date').val('');
	});

 });