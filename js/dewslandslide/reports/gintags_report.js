$(document).ready(function() {
    let gintag_table = $('#gintag_table').DataTable();
	$.get( "../gintagshelper/getAllGintagDetails", function( data ) {
		console.log(data);
	});
});