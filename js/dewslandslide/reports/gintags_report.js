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

		debugger;
		var data_set = [];
		var total_population = 0;
		for (var counter = 0; counter < response.length; counter++) {
			var name = Object.keys(response[counter]);
			var tags_count = Object.values(response[counter])[0].length;
			temp = name[0];
			var piece = {
				'name': temp,
				'y': tags_count
			}
			total_population = total_population+tags_count;
			data_set.push(piece);
		}
		console.log(total_population);
		console.log(data_set);
	});
}