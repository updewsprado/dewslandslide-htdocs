var templateData = {};
var templateTable;
var tableId;
$(document).ready(function(e){

    templateTable = $('#template_table').DataTable( {
        "processing": true,
        "serverSide": false,
        "scrollX": true,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_lvl", title:"ALERT LEVEL"},
            { "data" : "internal_alert", title:"INTERNAL ALERT"},
            { "data" : "possible_scenario", title:"POSSIBLE SCENARIO"},
            { "data" : "recommended_response", title:"RECOMMENDED RESPONSE"},
            { "data" : "last_update_by", title:"LATEST MODIFICATION"},
            { "data" : "functions", title: "*"}
        ]
    });

    $('#add_template').on('click',function(){
    	$('form').trigger('reset');
    	$('#modal-title').text('Create Template');
    	$('#submit_template').text("CREATE");
    	$('#template_modal').modal('toggle');
    });

    $('#submit_template').on('click',function(){
    	templateData['alert_lvl'] = $('#alert_lvl').val();
    	templateData['internal_alert'] = $('#internal_alert').val();
    	templateData['scenario'] = $('#scenario').val();
    	templateData['response'] = $('#response').val();
    	templateData['last_modified'] = moment().format("YYYY-MM-DD H:mm A")+"/"+first_name+"/"+tagger_user_id;

    	if ($('#submit_template').text() == "CREATE") {
			$.post("../communications/addtemplate", {template : JSON.stringify(templateData)})
			.done(function(data) {
				var response = JSON.parse(data);
				if (response == 1 || response == true) {
					$.notify("Successfully added a new template.","success");
					reloadTable();
					$('#template_modal').modal('toggle');
				} else {
					$.notify("Failed to add a new template, Duplicate entry.","error");
				}
			});	
    	} else {
    		templateData['id'] = tableId;
			$.post("../communications/updatetemplate", {template : JSON.stringify(templateData)})
			.done(function(data) {
				var response = JSON.parse(data);
				if (response == 1 || response == true) {
					$.notify("Successfully updated a template.","success");
					reloadTable();
					$('#template_modal').modal('toggle');
				} else {
					$.notify("Failed to update a template, Please recheck input fields.","error");
				}
			});	
    	}
    	templateData = {};
    });

    $('#delete_template').on('click',function(){
    	templateData['id'] = tableId;
		$.post("../communications/deletetemplate", {template : JSON.stringify(templateData)})
		.done(function(data) {
			var response = JSON.parse(data);
			if (response == 1 || response == true) {
				$.notify("Successfully deleted  template.","success");
				reloadTable();
				$('#delete_template_modal').modal('toggle');
			} else {
				$.notify("Failed to delete template. Please contact one of the SWAT member.","error");
			}
		});	
    })

    $('#template_table tbody').on('click','.update',function(){
		var closestRow = $(this).closest('tr');
		var data = templateTable.row(closestRow).data();
		console.log(data);
		tableId = data.id;
		$('#modal-title').text('Update Template');
		$('#alert_lvl').val(data.alert_lvl);
		$('#internal_alert').val(data.internal_alert);
		$('#scenario').val(data.possible_scenario);
		$('#response').val(data.recommended_response);
		$('#submit_template').text("UPDATE");
		$('#template_modal').modal('toggle');
    });

 //    	var table = $('#response-contact-container').DataTable();
	// var data = table.row(this).data();

    $('#template_table tbody').on('click','.delete',function(){
		var data = $(this).closest('tr');
		// var data = templateTable.row(closestRow).data();
		console.log(data);
		tableId = data.id;
		var to_be_deleted = "Alert Level: "+data.alert_lvl+"\n"+
							"Internal Alert: "+data.internal_alert+"\n"+
							"Scenario: "+data.possible_scenario+"\n"+
							"Response: "+data.recommended_response;
		$('#delete-template').val(to_be_deleted);
		$('#submit_template').text("UPDATE");
		$('#delete_template_modal').modal('toggle');
    });
});

function reloadTable() {
	$('#template_table').DataTable().clear();
	$('#template_table').DataTable().destroy();
    template_table = $('#template_table').DataTable( {
        "processing": true,
        "serverSide": false,
        "scrollX": true,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_lvl", title:"ALERT LEVEL"},
            { "data" : "internal_alert", title:"INTERNAL ALERT"},
            { "data" : "possible_scenario", title:"POSSIBLE SCENARIO"},
            { "data" : "recommended_response", title:"RECOMMENDED RESPONSE"},
            { "data" : "last_update_by", title:"LATEST MODIFICATION"},
            { "data" : "functions", title: "*"}
        ]
    });
}