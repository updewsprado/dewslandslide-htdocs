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

	$('#start_date,#end_date').datetimepicker({
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
		$('#analytics-section').show(500);
	});
});

function loadAnalytics(data) {
	$.post("../generalinformation/getanalytics",{data : JSON.stringify(data)}).done(function(data){
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
		        data: data_set
		    }]
		});
	});
}

function generateChartTitle(title_details) {
	var construct_title = "Difference of "+title_details.tags+" from "+title_details.start_date+" to "+title_details.end_date;
	return construct_title;
}