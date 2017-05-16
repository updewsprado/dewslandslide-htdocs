var templateData = {};
var templateTable;
var backboneTable;
var tableId;
var template;
$(document).ready(function(e){

    templateTable = $('#template_table').DataTable( {
        "processing": true,
        "bSort" : false,
        "scrollCollapse": true,
        "serverSide": false,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_lvl", title:"ALERT LEVEL"},
            { "data" : "internal_alert", title:"INTERNAL ALERT"},
            { "data" : "possible_scenario", title:"POSSIBLE SCENARIO"},
            { "data" : "recommended_response", title:"RECOMMENDED RESPONSE"},
            { "data" : "bb_scenario", title:"Backbone Message Category"},
            { "data" : "last_update_by", title:"LATEST MODIFICATION"},
            { "data" : "functions", title: "*"}
        ]
    });

    backboneTable = $('#backbone_table').DataTable({
    	"processing": true,
    	"bSort" : false,
    	"scrollCollapse": true,
    	"serverSide": false,
    	"ajax": '../communications/fetchallbackbonetemplate',
    	columns: [
    		{ "data" : "id", title: "ID"},
    		{ "data" : "category", title: "CATEGORY"},
    		{ "data" : "template", title: "BACKBONE MESSAGE"},
    		{ "data" : "last_modified_by", title: "LAST UPDATE"},
    		{ "data" : "functions", title : "*"}
    	]
    });

    $('#key_input_tab').on('click',function(){
    	reloadTable();
    });

    $('#message_backbone_tab').on('click',function(){
    	reloadBackboneTable();
    });

    $('#add_template').on('click',function(){
    	$('form').trigger('reset');
    	$('#modal-title').text('Create Template');
    	$('#submit_template').text("CREATE");
    	$('#template_modal').modal('toggle');
    });

    $('#add_backbone').on('click',function(){
    	$('form').trigger('reset');
    	$('#modal-title-backbone').text('Create Message Backbone');
    	$('#submit_backbone').text("CREATE");
    	$('#backbone_modal').modal('toggle');
    });

    $('#show_key_inputs').on('click',function(){
    	$('#key_input_display').modal('toggle');
    });

    $('#submit_template').on('click',function(){
    	templateData['alert_lvl'] = $('#alert_lvl').val();
    	templateData['internal_alert'] = $('#internal_alert').val();
    	templateData['scenario'] = $('#scenario').val();
    	templateData['response'] = $('#response').val();
    	templateData['bb_scenario'] = $('#bb_scenario').val();
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

    $('#submit_backbone').on('click',function(){
    	templateData['category'] = $('#category').val();
    	templateData['backbone_message'] = $('#msg_backbone').val();
    	templateData['last_modified'] = moment().format("YYYY-MM-DD H:mm A")+"/"+first_name+"/"+tagger_user_id;

    	if ($('#submit_backbone').text() == "CREATE") {
    		$.post('../communications/addbackbonemessage',{backbone_message: JSON.stringify(templateData)})
    		.done(function(data){
    			console.log(data);
    			var response = JSON.parse(data);
				if (response == 1 || response == true) {
					$.notify("Successfully added a new backbone message.","success");
					reloadBackboneTable();
					$('#backbone_modal').modal('toggle');
				} else {
					$.notify("Failed to add a new backbone message, Duplicate entry.","error");
				}

    		});
    	} else {
    		templateData['id'] = tableId;
    		$.post('../communications/updatebackbonemessage',{backbone_message: JSON.stringify(templateData)})
    		.done(function(data){
    			var response = JSON.parse(data);
                if (response == 1 || response == true) {
                    $.notify("Successfully updated a backbone message.","success");
                    reloadBackboneTable();
                    $('#backbone_modal').modal('toggle');
                } else {
                    $.notify("Failed to update a backbone message, Please recheck input fields.","error");
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

    $('#delete_backbone').on('click',function(){
        templateData['id'] = tableId;
        $.post("../communications/deletebackbone", {backbone_message : JSON.stringify(templateData)})
        .done(function(data) {
            var response = JSON.parse(data);
            if (response == 1 || response == true) {
                $.notify("Successfully deleted the backbone message.","success");
                reloadBackboneTable();
                $('#delete_backbone_modal').modal('toggle');
            } else {
                $.notify("Failed to delete backbone message. Please contact one of the SWAT member.","error");
            }
        }); 
    });

    $('#template_table tbody').on('click','.update',function(){
    	var table = $('#template_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		$('form').trigger('reset');
		$('#modal-title').text('Update Template');
		$('#alert_lvl').val(data.alert_lvl);
		$('#internal_alert').val(data.internal_alert);
		$('#scenario').val(data.possible_scenario);
		$('#response').val(data.recommended_response);
		$('#bb_scenario').val(data.bb_scenario);
		$('#submit_template').text("UPDATE");
		$('form').trigger('reset');
		$('#template_modal').modal('toggle');
    });

    $('#template_table tbody').on('click','tr:has(td) .delete',function(){
    	var table = $('#template_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		var to_be_deleted = "Alert Level: "+data.alert_lvl+"\n"+
							"Internal Alert: "+data.internal_alert+"\n"+
							"Scenario: "+data.possible_scenario+"\n"+
							"Response: "+data.recommended_response;
		$('#delete-template').val(to_be_deleted);
		$('#submit_template').text("UPDATE");
		$('#delete_template_modal').modal('toggle');
    });

    $('#msg_backbone').on('input',function(){
    	loadBackboneView($('#msg_backbone').val());
    });

    $('#backbone_table tbody').on('click','.update',function(){
    	var table = $('#backbone_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		$('form').trigger('reset');
		$('#modal-title-backbone').text('Update Message Backbone');
		$('#category').val(data.category);
		$('#msg_backbone').val(data.template);
		$('#submit_backbone').text("UPDATE");
		$('#backbone_modal').modal('toggle');
		loadBackboneView(data.template);
    });

    $('#backbone_table tbody').on('click','tr:has(td) .delete',function(){
    	var table = $('#backbone_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		console.log(data);
        var to_be_deleted = "Category: "+data.category+"\n"+
                            "Template: "+data.template+"\n";
        $('#delete-backbone').val(to_be_deleted);
		$('#submit_backbone').text("UPDATE");
        $('#delete_backbone_modal').modal('toggle');
    });	

});

function reloadTable() {
	var templateTable = $('#template_table').DataTable();
	$('#template_table').DataTable().clear();
	$('#template_table').DataTable().destroy();
    template_table = $('#template_table').DataTable( {
    	"processing": true,
    	"serverSide": false,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_lvl", title:"ALERT LEVEL"},
            { "data" : "internal_alert", title:"INTERNAL ALERT"},
            { "data" : "possible_scenario", title:"POSSIBLE SCENARIO"},
            { "data" : "recommended_response", title:"RECOMMENDED RESPONSE"},
            { "data" : "bb_scenario", title:"Backbone Message Category"},
            { "data" : "last_update_by", title:"LATEST MODIFICATION"},
            { "data" : "functions", title: "*"}
        ]
    });
}

function reloadBackboneTable() {
	var backboneTable = $('#backbone_table').DataTable();
	$('#backbone_table').DataTable().clear();
	$('#backbone_table').DataTable().destroy();
    backbone_table = $('#backbone_table').DataTable( {
    	"processing": true,
    	"serverSide": false,
        "ajax": '../communications/fetchallbackbonetemplate',
        columns: [
    		{ "data" : "id", title: "ID"},
    		{ "data" : "category", title: "CATEGORY"},
    		{ "data" : "template", title: "BACKBONE MESSAGE"},
    		{ "data" : "last_modified_by", title: "LASTEST MODIFICATION"},
    		{ "data" : "functions", title : "*"}
        ]
    });
}

function loadBackboneView(real_time_value) {
	template = real_time_value;
	var key = {
		'keypoint' : $('#category').val()
	};

	$.post('../communications/getkeypointsviacategory',{template_key : JSON.stringify(key)})
	.done(function(data){
		var response = JSON.parse(data);
		if (response.length == 0) {
			$('#no-key-input').show();
		} else {
			$('#no-key-input').hide();
			template = template.replace("%%ALERT_LVL%%",response[0].alert_lvl);
			template = template.replace("%%POSSIBLE_SCENARIO%%", response[0].possible_scenario);
			template = template.replace("%%RECOMMENDED_RESPONSE%%",response[0].recommended_response);	
			$('#backbone_preview').val(template);
		}		
	});
}