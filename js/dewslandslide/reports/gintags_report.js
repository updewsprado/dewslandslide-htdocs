$(document).ready(function() {
	$.get( "../gintagshelper/getAllGintagDetails", function( data ) {
		var response = JSON.parse(data);
		var dataset = [];
		var dataraw= [];
        response.forEach(function(raw) {
        	for (var i = 0; i < Object.keys(raw).length; i) {
        		// dataraw.push();
        		console.log(raw.Object.keys(raw));
        	}
        });
		var sample_data = [["HEY","HEY","HEY","HEY","HEY","HEY","HEY","HEY"]];
		console.log(sample_data);
		    $('#gintag_table').DataTable( {
		        data: data,
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