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
});