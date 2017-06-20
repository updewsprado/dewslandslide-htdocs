$(document).ready(function() {
	$.get( "../gintagshelper/getAllGintagDetails", function( data ) {
		var response = JSON.parse(data);
		var dataset = [];
		var dataraw= [];

		for (var counter = 0; counter < response.length; counter++) {
			var dataraw = $.map(response[counter], function(value, index) {
				return [value];
			});
			dataset.push(dataraw);
		}

		$('#gintag_table').DataTable( {
			"searching": false,
			data: dataset,
			columns: [
			{ title: "Gintag ID" },
			{ title: "Tagger ID" },
			{ title: "Table Element ID" },
			{ title: "Table Used." },
			{ title: "Timestamp date" },
			{ title: "Remarks" },
			{ title: "Tag name" },
			{ title: "Tag Description" }
			]
		});
	});

	$('#date-start,#date-end').datetimepicker({
		locale: 'en',
		format: 'YYYY-MM-DD'
	});

	$('#go_search').on('click',function(){
		var data = {
			'start_date': $('#start_date').val(),
			'end_date': $('#end_date').val(),
			'gintags': $('#gintags').val()
		}
		loadAnalytics(data);
		$('#page-wrapper .container').switchClass('container','container-fluid',1000,'easeInOutQuad');
		$('#table-rows').switchClass('col-md-12','col-md-7');
		if ($('#analytics-section').is(':visible')) {
			$('#chart-container').css('width','100%');
			$('#chart-container').css('height','100%');
			$('#chart-container').css('margin','0px');
		} else {
			$('#chart-container').css('width','35%');
			$('#chart-container').css('height','45%');
			$('#chart-container').css('margin','0px');
		}
		$('#analytics-section').show(500);
	});

	$('#gintags').tagsinput({
		typeahead: {
			displayKey: 'text',
			source: function (query) {
				var tagname_collection = [];
				$.ajax({
					url : "../../../gintagshelper/getAllGinTags",
					type : "GET",
					async: false,
					success : function(data) {
						var data = JSON.parse(data);
						for (var counter = 0; counter < data.length; counter ++) {
							tagname_collection.push(data[counter].tag_name);
						}
					}
				});
				return tagname_collection;
			}
		} 
	});
});

function isFieldEmpty() {
	
}

function loadSearchedGintag(data) {
	$.post('../gintagshelper/getSearchedGintag',{search_values: JSON.stringify(data)}).done(function(data){
		var response = JSON.parse(data);
		var arrayed_response = $.map(response, function(value, index) {
			return [value];
		});

		var counter_duplicate = [];
		var counter_table_used = [];
		for (var counter = 0;counter < arrayed_response[0].length;counter++) {
			if ($.inArray(arrayed_response[0][counter].table_element_id,counter_duplicate) === -1) {
				counter_duplicate.push(arrayed_response[0][counter].table_element_id);
			}

			if ($.inArray(arrayed_response[0][counter].table_used,counter_table_used) === -1) {
				if (arrayed_response[0][counter].table_used != "") {
					counter_table_used.push(arrayed_response[0][counter].table_used);
				}
			}
		}

		var sms_data = {
			'database': counter_table_used,
			'data': counter_duplicate
		}

		$.post("../gintagshelper/getAllSms", {sms_data : JSON.stringify(sms_data)}).done(function(data) {

			var response = JSON.parse(data);
			var dataset = [];
			var datacolumn = [];
			var dataraw= [];

			for (var counter = 0; counter < response.sms.length; counter++) {
				var dataraw = $.map(response.sms[counter], function(value, index) {
					return [value];
				});
				dataset.push(dataraw);
			}

			for (var counter = 0; counter < response.columns.length;counter++) {
				var title = {
					title: response.columns[counter].Field
				}
				datacolumn.push(title);
			}
			
			$('#summary_table').DataTable({
				destroy: true,
				data: dataset,
				"scrollY": 300,
				"scrollX": true,
				columns: datacolumn
			});
			$('#tag_summary').modal('toggle');
		});
	})
}

function loadAnalytics(data_searched) { 
	$.post("../generalinformation/getanalytics",{data : JSON.stringify(data_searched)}).done(function(data){
		var response = JSON.parse(data);
		var data_set = [];
		var total_population = 0;
		var tag_details = [];

		for (var counter =0; counter < response.length; counter++) {
			var pop_count = Object.values(response[counter])[counter].length;
			total_population = total_population+pop_count;
		}

		for (var counter = 0; counter < response.length; counter++) {
			var name = Object.keys(response[counter]);
			var tags_count = Object.values(response[counter])[counter].length;
			temp = name[counter];
			var piece = {
				'name': temp,
				'y': (tags_count/total_population)*100,
				'count': tags_count
			}

			var tag_raw = {
				'tag_name': temp,
				'count': tags_count
			}

			tag_details.push(tag_raw);
			data_set.push(piece);
		}
		$('#analytics-container').empty();
		$('#analytics-container').append("<h5>Total tag count : <b>"+total_population+"</b></h5>");

		var title_details = {
			'start_date': $('#start_date').val(),
			'end_date': $('#end_date').val(),
			'tags': $('#gintags').val()
		}

		Highcharts.chart('chart-container', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: generateChartTitle(title_details)
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>'+
				'Tag count: <b>{point.count}</b>'
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				name: 'Tags',
				colorByPoint: true,
				data: data_set,
				point: {
					events: {
						click: function() {
							var data = {
								'start_date': $('#start_date').val(),
								'end_date': $('#end_date').val(),
								'gintags': "#"+this.name
							}
							$('#tag_summary .modal-title').text('Tag summary for #'+this.name);
							loadSearchedGintag(data);
						}
					}
				}
			}]
		});
	});
}

function generateChartTitle(title_details) {
	var construct_title = title_details.tags+" tag as of "+title_details.start_date+" to "+title_details.end_date;
	return construct_title;
}