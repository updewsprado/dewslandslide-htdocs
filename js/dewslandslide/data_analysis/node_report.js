$(document).ready(function(e) {
	$(function() {
		$('#date-discovered').daterangepicker({
			singleDatePicker: true,
			showDropdowns: true
		}, 
		function(start, end, label) {

		});
	});
	$('input[name="submit"]').on('click',function(){
		var site_column = $('#site-column-name').val();
		var node_id = $('#node-id').val();
		var date_discovered = $('#date-discovered').val();
		var post_ts = moment().format('YYYY-MM-DD HH:mm:ss');
		var flagger_name = $('#flagger').val();
		var status = $('#status-select').val();
		var comment = $('#comment-text').val();
		
		let dataSubmit = { 
			post_timestamp : post_ts, 
			date_of_identification : date_discovered,
			flagger : flagger_name,
			site : site_column,
			node : node_id,
			status : status,
			comment : comment,
		}
		console.log(dataSubmit)
		$.post("../node_report_page/getAllSubmitData",dataSubmit).done(function(data){ // <------------ Data for Site Maintenance History
				
				// var result = JSON.parse(data);
				// var site_maintenace = []
				// for (i = 0; i < result.length; i++) {
				// 	site_maintenace.push([result[i].sm_id,result[i].site,result[i].start_date , result[i].end_date , result[i].staff_name , result[i].activity , result[i].object, 
				// 		result[i].remarks])
				// }
				// $('#mTable').DataTable( {
				// 	data:  site_maintenace,
				// 	"processing": true, 
				// } );
		});
	});
});
