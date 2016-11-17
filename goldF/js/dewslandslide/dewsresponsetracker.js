$(document).ready(function(e) {

	var persons = [];
	var sites = [];
	var chatStamps = [];
	var series_value = [];
	var column_value = [];
	var series_data = [];
	var period_range = [];
	var chart_category = [];
	var resolution = [];
	var detailedInformation = [];
	var data = {};
	var data_resolution = ['hh','dd','ww','mm'];
	var total_message_and_response = [];
	var groupedSiteFlagger = false;

	$(document).ajaxStart(function () {
		$('#loading').modal('toggle');
	});

	$(document).ajaxStop(function () {
		$('#loading').modal('toggle');
	});


	$('#confirm-filter-btn').click(function(){

		resetVariables();
		if ($('#category-selection').val() != null) {
			data['filterKey'] = $('#filter-key').val();
			data['category'] = $('#category-selection').val();
			if ($('#period-selection').val() != null && $('#period-selection').val() != ""){
				data['period'] = $('#period-selection').val();
				data['current_date'] = moment().format('YYYY-MM-DD HH:mm:ss');
			} else {
				if ($('#from-date').val() != "" && $('#to-date').val() != ""){
					var from_period = $('#from-date').val();
					var to_period = $('#to-date').val();
					if (from_period < to_period){
						data['period'] = from_period+" 23:59:59";
						data['current_date'] = to_period+" 23:59:59";		
					} else {
						alert('Invalid Request, From-date date must be less than to To-date');
						return;
					}
				} else {
					alert('Invalid Request, Please recheck inputs');
					return;
				}
			}
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
					zoomType: 'x'
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
	    	//Generates Detailed information for each Node
	    	detailedInfoGenerator();
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

						series_data = analyzeNumberOfRepliesAllSites(sites);
						averagedelay_data = analyzeAverageDelayReply(sites);
						titleAndCategoryConstructors();

						Highcharts.setOptions({
							global: {
								useUTC: false
							}
						});
				    	//Generates Detailed information for each Node
				    	detailedInfoGenerator();
				    	changePanelResolution();
				    	$('#reliability-chart-container').highcharts({
				    		chart: {
				    			zoomType: 'x'
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
						averagedelay_data = analyzeAverageDelayReply(persons)
						var replyAsgroup = analyzeReplyGroupPerSite(persons);
						

						titleAndCategoryConstructors();

						Highcharts.setOptions({
							global: {
								useUTC: false
							}
						});

						changePanelResolution();
						$('#reliability-chart-container').highcharts({
							chart: {
								zoomType: 'x'
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
		    	//Generates Detailed information for each Node
		    	detailedInfoGenerator();
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
		column_value = [];
		series_data = [];
		period_range = [];
		chart_category = [];
		total_message_and_response = [];
		detailedInformation = [];
		data = {};
	}

	function changePanelResolution(){
		if ($('#filter-key').val() == ""){
			$("#reliability-pane").attr('class', 'col-md-12');
			$("#adp-pane").attr('class', 'col-md-12');
			$("#detailed-pane").attr('class', 'col-md-12');
			$(".panel-group").attr('class', 'panel-group col-md-4');

		} else {
			var chart = $('#reliability-chart-container').highcharts();
			$("#reliability-pane").attr('class', 'col-md-8');
			$("#adp-pane").attr('class', 'col-md-6');
			$("#detailed-pane").attr('class', 'col-md-6');
			$(".panel-group").attr('class', 'panel-group');
		}
	}

	function analyzeNumberOfRepliesAllSites(data,resolution){
		var timestamp_users = [];
		var reconstructed_data = [];
		var temp_date = "";
		var sent = 0;
		var reply = 0;
		var data_hc = [];
		var total_sent_message = 0;
		var total_response_message = 0;
		//Check if resolution is null
		//If null the resolution will be per day.
		if (typeof(resolution)==='undefined'){
			var resolution = [];
			resolution[0] = '8';
			resolution[1] = '11';
		}

		for (var x = 0; x < data.length;x++){
			for (var i = 0; i < data[x].values.length;i++){
				for (var j =  0; j < data[x].values[i].length;j++) {
					timestamp_users.push({
						timestamp: data[x].values[i][j].timestamp,
						user: data[x].values[i][j].user
					});
				}
			}
			reconstructed_data.push({
				number: data[x].number,
				data: timestamp_users
			});
			timestamp_users = [];
		}
		sortForAllSite(reconstructed_data);
		for (var x = 0; x < reconstructed_data.length; x++){
			for (var i = 0; i < reconstructed_data[x].data.length; i++){
				if (temp_date == "" || temp_date == null) {
					temp_date = reconstructed_data[x].data[i].timestamp.substring(resolution[0],resolution[1]);
					if (reconstructed_data[x].data[i].user == 'You') {
						sent++;
					} else {
						reply++;
					}
				} else {
					if (temp_date == reconstructed_data[x].data[i].timestamp.substring(resolution[0],resolution[1])){
						if (reconstructed_data[x].data[i].user == 'You'){
							sent++;
						} else {
							reply++;
						}
					} else {

						var stats;
						if (reply > sent || sent == 0){
							stats = 100;
						} else {
							stats = (reply/sent)*100;
						}
						if (i != 0) {
							var store_dates = [moment(reconstructed_data[x].data[i-1].timestamp).valueOf(),Math.round(stats)];
						} else {
							var store_dates = [moment(reconstructed_data[x].data[i].timestamp).valueOf(),Math.round(stats)];
						}
						total_sent_message = total_sent_message + sent;
						total_response_message = total_response_message + reply;
						data_hc.push(store_dates);
						sent = 0;
						reply = 0;
						temp_date = reconstructed_data[x].data[i].timestamp.substring(resolution[0],resolution[1]);
						if (reconstructed_data[x].data[i].user == 'You') {
							sent++;
						} else {
							reply++;
						}
					}
				}
			}
			series_value.push({
				name: reconstructed_data[x].number,
				data: data_hc
			});
			data_hc = [];
			mes_res = {
				total_response: total_response_message,
				total_message: total_sent_message
			}
			total_message_and_response.push(mes_res);
			total_response_message = 0;
			total_sent_message = 0;
		}
	}

	function sortForAllSite(dates){
		var swapped;
		do {
			swapped = false;
			for (var x = 0; x < dates.length; x++){
				for (var i=0; i < dates[x].data.length-1; i++) {
					if (dates[x].data[i].timestamp > dates[x].data[i+1].timestamp) {
						var temp = dates[x].data[i];
						dates[x].data[i] = dates[x].data[i+1];
						dates[x].data[i+1] = temp;
						swapped = true;
					}
				}
			}
		} while (swapped);
	}

	function analyzeNumberOfReplies(data,resolution){
		//Check if resolution is null
		//If null the resolution will be per day.
		if (typeof(resolution)==='undefined'){
			var resolution = [];
			resolution[0] = '8';
			resolution[1] = '11';
		}

		var sent = 0;
		var total_sent_message = 0;
		var total_response_message = 0;
		var replies = 0;
		var reply_stats = 0;
		var tempDay = "";
		var data_hc = [];
		var luser = "";
		var lmessage = "";
		var lmtimestamp = "";
		var lreply = "";
		var lrtimestamp = "";
		var end_dates = [31,28,31,31,31,30,31,31,30,31,30,31];

		for (var i=0;i<data.length;i++){
			// Resets the statistics
			sent = 0;
			replies = 0;
			reply_stats = 0;
			total_sent_message = 0;
			total_response_message = 0;
			tempDay = "";
			data_hc = [];

			for (var x = 0;x<data[i].values.length;x++){
				if (tempDay == "" || tempDay == null){
					tempDay = data[i].values[x].timestamp.substring(resolution[0],resolution[1]); // Daily for weekly -7 Days

					if (data[i].values[x].user == "You") {
						sent++;
					} else {
						replies++;
					}

				} else {

					if (tempDay == data[i].values[x].timestamp.substring(resolution[0],resolution[1])) {

						if (data[i].values[x].user == "You") {
							sent++;
						} else {
							replies++;
						}

					} else {
						if (replies > sent) {
							// If the Replies are greater than the sent messages
							// it is automatically 100%
							reply_stats = 100;
						} else {
							reply_stats = (reply_stats + ((replies / sent)*100))/2;
						}

							reply_stats_with_dates = [moment(data[i].values[x-1].timestamp).valueOf(),reply_stats];
							total_sent_message = total_sent_message+sent;
							total_response_message = total_response_message+replies;
							data_hc.push(reply_stats_with_dates);
							sent = 0;
							replies = 0;
							reply_stats = 0;
							tempDay = data[i].values[x].timestamp.substring(resolution[0],resolution[1]);
							if (data_resolution[$('#data-resolution').val()-1] == 'ww') {
								tempDay = parseInt(tempDay)+7;
							}
							if (data[i].values[x].user == "You") {
								sent++;
							} else {
								replies++;
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

			mes_res = {
				total_response: total_response_message,
				total_message: total_sent_message
			}

			total_message_and_response.push(mes_res);
			series_value.push(series_stats);
		}
	}

	function DoSortDateForGroupSite(dates){
		var swapped;
		do {
			swapped = false;
			for (var i=0; i < dates.length-1; i++) {
				if (dates[i].timestamp > dates[i+1].timestamp) {
					var temp = dates[i];
					dates[i] = dates[i+1];
					dates[i+1] = temp;
					swapped = true;
				}
			}
		} while (swapped);
	}

	function analyzeReplyGroupPerSite(data,resolution){
		var test_reconstructed_data = [];
		var data_hc = [];
		var sent = 0;
		var reply = 0;
		var temp_date = "";
		var total_sent_message = 0;
		var total_response_message = 0;
		if (typeof(resolution)==='undefined'){
			var resolution = [];
			resolution[0] = '8';
			resolution[1] = '11';
		}

		for (var i = 0; i < data.length;i++){
			for (var x = 0; x < data[i].values.length;x++){
				test_reconstructed_data.push({
					user: data[i].values[x].user,
					timestamp: data[i].values[x].timestamp
				});
			}
		}

		DoSortDateForGroupSite(test_reconstructed_data);
		groupedSiteFlagger = true;
		analyzeAverageDelayReply([{
			number: $('#filter-key').val(),
			values: test_reconstructed_data
		}]);
		for (var x = 0; x < test_reconstructed_data.length;x++){

			if (temp_date == "" || temp_date == null) {
				temp_date = test_reconstructed_data[x].timestamp.substring(resolution[0],resolution[1]);
				// debugger;
				if ( test_reconstructed_data[x].user == 'You'){
					sent++;
				} else {
					reply++;
				}
			} else {
				if (temp_date == test_reconstructed_data[x].timestamp.substring(resolution[0],resolution[1])) {
					if ( test_reconstructed_data[x].user == 'You'){
						sent++;
					} else {
						reply++;
					}
				} else {
					var stats;
					if (reply > sent || sent == 0){
						stats = 100;
					} else {
						stats = (reply/sent)*100;
					}
					if (x != 0) {
						var store_dates = [moment(test_reconstructed_data[x-1].timestamp).valueOf(),Math.round(stats)];
					} else {
						var store_dates = [moment(test_reconstructed_data[x].timestamp).valueOf(),Math.round(stats)];
					}
					data_hc.push(store_dates);
					total_sent_message = total_sent_message + sent;
					total_response_message = total_response_message + reply;
					sent = 0;
					reply = 0;
					temp_date = test_reconstructed_data[x].timestamp.substring(resolution[0],resolution[1]);
					if ( test_reconstructed_data[x].user == 'You'){
						sent++;
					} else {
						reply++;
					}
				}
			}
		}

		series_value.push({
			name: $('#filter-key').val(),
			data: data_hc
		});

		mes_res = {
			total_response: total_response_message,
			total_message: total_sent_message
		}

		total_message_and_response.push(mes_res);

		groupedSiteFlagger = false;
	}

	function analyzeAverageDelayReply(data){
		if (groupedSiteFlagger == false){
			column_value = [];
		}
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


			//Get's the shortest reply time. 
			var minimum = Math.min.apply(Math, date_arr);
			var uniqueArray = [];
			if (minimum == 0) {
				var intArray = date_arr.map(Number);
				// sorts the array
				var second = intArray.sort(function(a,b){return b-a});
				uniqueArray = second.filter(function(item, pos) {
					return second.indexOf(item) == pos;
				})
				minimum = uniqueArray[uniqueArray.length-2];
			} else if (minimum == Infinity) {
				minimum = "NaN";
			}

			//Get's the average reply time. 
			var tot = 0;
			for (var y = 0;y < date_arr.length;y++) {
				tot = tot + date_arr[y];
			}
			tot = tot/date_arr.length-1;
			//Get's the Maximum / Longest reply delay
			var maximum = Math.max.apply(Math, date_arr);
			if (maximum == -Infinity || maximum == Infinity) {
				maximum = "NaN";
			}
			//Get's the standard deviation
			var mean = tot;
			var steptwo = 0;
			var toDeviation = [];
			for (var q = 0; q < date_arr.length;q++){
				steptwo = Math.pow((date_arr[q] - mean),2);
				toDeviation.push(steptwo);
			}

			var tot_todeviation = 0;
			for (var l = 0; l < toDeviation.length;l++){
				tot_todeviation = tot_todeviation + toDeviation[l];
			}

			var toBeSquared = tot_todeviation/toDeviation.length;
			var standard_deviation = Math.sqrt(toBeSquared);

			column_value.push({
				name: data[i].number,
				y: tot,
				summary: getTimeFromMins(tot)
			});


			detailedInformation.push({
				min: minimum,
				ave: tot,
				max: maximum,
				deviation: standard_deviation
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

	//Detailed Info Section
	function detailedInfoGenerator(){
		$('#ntc-data-resolution').css("display", "block");
		$('#div-data-resolution').css("opacity", "1");
		var myNode = document.getElementById("detailed-info-container");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}

		for (var x = 0; x < series_value.length;x++){
			var detail_info_container = document.getElementById('detailed-info-container');
			var panel_group = document.createElement('div');
			panel_group.className = 'panel-group';
			var panel_default = document.createElement('div');
			panel_default.className = 'panel panel-default';
			var panel_heading = document.createElement('div');
			panel_heading.className = 'panel-heading';
			var panel_title = document.createElement('h4');
			panel_title.className = 'panel-title';
			var toggle_link = document.createElement('a');
			toggle_link.innerHTML = series_value[x].name;
			var trimmed_id = series_value[x].name.replace(/ /g,'');
			toggle_link.setAttribute("data-toggle", "collapse");
			toggle_link.setAttribute("href", "#"+trimmed_id);

			var panel_collapse = document.createElement('div');
			panel_collapse.className = 'panel-collapse collapse';
			panel_collapse.id = trimmed_id;
			var panel_body = document.createElement('div');
			panel_body.className = 'panel-body';
			var min_reply_delay = document.createElement('h5');
			min_reply_delay.innerHTML = "<strong>Fastest Response Delay: </strong>"+Math.round(detailedInformation[x].min)+"<strong> (Minutes)</strong>";
			var ave_reply_delay = document.createElement('h5');
			ave_reply_delay.innerHTML = "<strong>Average Response Delay: </strong>"+Math.round(detailedInformation[x].ave)+"<strong> (Minutes)</strong>";
			var max_reply_delay = document.createElement('h5');
			max_reply_delay.innerHTML = "<strong>Slowest Response Delay: </strong>"+Math.round(detailedInformation[x].max)+"<strong> (Minutes)</strong>";
			var deviation = document.createElement('h5');
			deviation.innerHTML = "<strong>Standard Deviation: </strong>"+Math.round(detailedInformation[x].deviation)+"<strong> (Minutes)</strong>";
			var total_res = document.createElement('h5');
			total_res.innerHTML = "<strong>Total Response Count: </strong> "+total_message_and_response[x].total_response+" <strong> Message(s)</strong>";
			var total_mes = document.createElement('h5');
			total_mes.innerHTML = "<strong>Total Dynaslope Message Count: </strong> "+total_message_and_response[x].total_message+" <strong> Message(s)</strong>";

			panel_body.appendChild(min_reply_delay);
			panel_body.appendChild(ave_reply_delay);
			panel_body.appendChild(max_reply_delay);
			panel_body.appendChild(deviation);
			panel_body.appendChild(total_res);
			panel_body.appendChild(total_mes);

			panel_title.appendChild(toggle_link);
			panel_heading.appendChild(panel_title);
			panel_default.appendChild(panel_heading);
			panel_collapse.appendChild(panel_body);
			panel_default.appendChild(panel_collapse);  
			panel_group.appendChild(panel_default);
			detail_info_container.appendChild(panel_group); 
		}
	}

	//Adjusts the Data resolution
	$('#data-resolution').change(function(){
		resolution = [];
		if (data_resolution[$('#data-resolution').val()-1] == "hh") {
			resolution[0] = "11";
			resolution[1] = "13";
		} else if (data_resolution[$('#data-resolution').val()-1] == "dd"){
			resolution[0] = "8";
			resolution[1] = "11";
		} else if (data_resolution[$('#data-resolution').val()-1] == "ww") {
			resolution[0] = "8";
			resolution[1] = "11";
		} else if (data_resolution[$('#data-resolution').val()-1] == "mm"){
			resolution[0] = "5";
			resolution[1] = "7";
		} else {
			console.log("Invalid Request");
		}
		series_value = [];
		if ($('#category-selection').val() == "allsites"){
			analyticsChartAllSite(sites,resolution);
		} else if ($('#category-selection').val() == "site"){
			analyticsChartSite(persons,resolution);
		} else if ($('#category-selection').val() == "person"){
			analyticsChartPerson(sites,resolution);
		} else {
			console.log('Invalid Request');
		}
	});

	function analyticsChartSite(data,resolution){
		analyzeNumberOfReplies(data,resolution);
		$('#reliability-chart-container').highcharts({
			chart: {
				zoomType: 'x'
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
		//Generates Detailed information for each Node
		detailedInfoGenerator();
	}

	function analyticsChartAllSite(data,resolution){
		analyzeNumberOfReplies(data,resolution);
		$('#reliability-chart-container').highcharts({
			chart: {
				zoomType: 'x'
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
		//Generates Detailed information for each Node
		detailedInfoGenerator(data,resolution);
	}

	function analyticsChartPerson(data,resolution){
		analyzeNumberOfReplies(data,resolution);
		$('#reliability-chart-container').highcharts({
			chart: {
				zoomType: 'x'
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
		//Generates Detailed information for each Node
		detailedInfoGenerator();
	}


	$('#from-date').datepicker({
		format: 'yyyy-mm-dd'
	});

	$('#to-date').datepicker({
		format: 'yyyy-mm-dd'
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