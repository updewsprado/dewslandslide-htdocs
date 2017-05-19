var templateData = {};
var templateTable;
var backboneTable;
var tableId;
var template="";
var alertLevelSymbol;
var defaultTemplateInputs = {
    'ALERT_LVL' : 'Alert 1',
    'GREETINGS': 'Hapon',
    'SBMP': 'Boloc, Tubungan, Iloilo',
    'CURRENT_DATE': '17 May 2017',
    'CURRENT_TIME': '04:00 PM',
    'EXPECTED_DATE_GDATA': 'bukas bago ',
    'EXPECTED_TIME_GDATA': 'mag-7:30 AM',
    'NEXT_EWI_DATE': 'mamayang',
    'NEXT_EWI_TIME': '08:00 PM',
    'LOWERING_EXTENDED_TIME': '08:00 PM',
    'EXT_DAY': 'ikatlo',
    'KEY_INPUT': 'Ang recommended response ay PREPARE TO EVACUATE THE HOUSEHOLDS AT RISK.'
}

$(document).ready(function(e){

    templateTable = $('#template_table').DataTable( {
        "processing": true,
        "bSort" : false,
        "scrollCollapse": true,
        "serverSide": false,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_status", title:"ALERT STATUS"},
            { "data" : "alert_symbol_level", title:"ALERT SYMBOL / ALERT LEVEL"},
            { "data" : "key_input", title:"KEY INPUT"},
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
    		{ "data" : "alert_status", title: "ALERT STATUS"},
    		{ "data" : "template", title: "BACKBONE MESSAGE"},
    		{ "data" : "last_modified_by", title: "LAST UPDATE"},
    		{ "data" : "functions", title : "*"}
    	]
    });

    $('#template_table tbody').on('mouseover', 'tr', function () {
       var ttip = $('#template_table').DataTable().row(this).data();
       tooltipKeyinput(ttip);
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
        keyInputAutocomplete();
    });

    $('#add_backbone').on('click',function(){
        // loadKeyInputs();
    	$('form').trigger('reset');
    	$('#modal-title-backbone').text('Create Message Backbone');
    	$('#submit_backbone').text("CREATE");
    	$('#backbone_modal').modal('toggle');
        backboneAutocomplete();
    });

    $('#show_key_inputs').on('click',function(){
    	$('#key_input_display').modal('toggle');
    });

    $('#show_key_input_display').on('click',function(){
        $('#key_input_display').modal('toggle');
    });

    $('#submit_template').on('click',function(){
    	templateData['last_modified'] = moment().format("YYYY-MM-DD H:mm A")+"/"+first_name+"/"+tagger_user_id;

        if (!$('#response_template').prop('disabled')) {
            templateData['alert_level'] = $('#alert_level').val();
            templateData['response_template'] = $('#response_template').val();
        } else {
            templateData['alert_level'] = "";
            templateData['response_template'] = ""; 
        }

        if (!$('#alert_symbols').prop('disabled')) {
            templateData['alert_symbols'] = $('#alert_symbols').val();
            templateData['techinfo_template'] =$('#techinfo_template').val();
        } else {
            templateData['alert_symbols'] = "";
            templateData['techinfo_template'] = "";
        }

        templateData['alert_status'] = $('#alert_status').val();
        templateData['backbone_template'] = $('#backbone_template').val();

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
					$.notify("Failed to update a template, template already exist.","error");
				}
			});	
    	}
    	templateData = {};
    });

    $('#submit_backbone').on('click',function(){
    	templateData['alert_status'] = $('#alert_status').val();
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
                    $.notify("Failed to update a backbone message, backbone category already exist.","error");
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
        keyInputAutocomplete();
    	var table = $('#template_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		$('#modal-title').text('Update Template');
		$('#alert_symbol').val(data.alert_symbol);
		$('#key_input').val(data.key_input);
		$('#alert_status').val(data.alert_status);
		$('#submit_template').text("UPDATE");
		$('#template_modal').modal('toggle');
    });

    $('#template_table tbody').on('click','tr:has(td) .delete',function(){
    	var table = $('#template_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		var to_be_deleted = "Alert Level / Alert Symbol: "+data.alert_symbol_level+"\n"+
							"Key input: "+data.key_input;
		$('#delete-template').val(to_be_deleted);
		$('#submit_template').text("UPDATE");
		$('#delete_template_modal').modal('toggle');
    });

    $('#msg_backbone').on('input',function(){
    	loadBackboneView($('#msg_backbone').val());
    });

    $('#backbone_table tbody').on('click','.update',function(){
        backboneAutocomplete();
        // loadKeyInputs();
    	var table = $('#backbone_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		$('#modal-title-backbone').text('Update Message Backbone');
		$('#alert_status').val(data.alert_status);
		$('#msg_backbone').val(data.template);
		$('#submit_backbone').text("UPDATE");
		$('#backbone_modal').modal('toggle');
		loadBackboneView(data.template);
    });

    $('#backbone_table tbody').on('click','.view',function(){
        $('#template_simulation').modal('toggle');
    });

    $('#backbone_table tbody').on('click','tr:has(td) .delete',function(){
    	var table = $('#backbone_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		console.log(data);
        var to_be_deleted = "Alert Status: "+data.alert_status+"\n"+
                            "Template: "+data.template+"\n";
        $('#delete-backbone').val(to_be_deleted);
		$('#submit_backbone').text("UPDATE");
        $('#delete_backbone_modal').modal('toggle');
    });

    $('#alert_lvl').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#greetings').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#sbmp').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#current_date').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#current_time').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#expected_date_gdata').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#expected_time_gdata').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#next_ewi_date').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#next_ewi_time').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#lowering_extended_time').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#ext_day').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $('#recom_response').on('click',function(){
        template = $('#msg_backbone').val()+$(this).val();
        $('#msg_backbone').val(template);
        loadBackboneView(template);
    });

    $.get('../chatterbox/getdistinctsitename',function(data){
        var response = JSON.parse(data);
        for (var counter = 0; counter < response.length;counter++) {
                 $('#site_code').append($("<option></option>")
                            .attr("value",response[counter].sitename)
                            .text(response[counter].sitename)); 
        }
    });

    $('#time_of_release').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });

});

function tooltipKeyinput(toToolTip) {
    $.get('../communications/fetchallbackbonetemplate',function(data){
        var response = JSON.parse(data);
        var tooltip = "";
        for (var counter =0; counter < response.data.length;counter++) {
            if (response.data[counter].alert_status == toToolTip.alert_status) {
                tooltip = response.data[counter].template.replace('{KEY_INPUT}',toToolTip.recommended_response);
                tooltip = tooltip.replace('{GREETINGS}',defaultTemplateInputs.GREETINGS);
                tooltip = tooltip.replace('{SBMP}',defaultTemplateInputs.SBMP);
                tooltip = tooltip.replace('{CURRENT_DATE}',defaultTemplateInputs.CURRENT_DATE);
                tooltip = tooltip.replace('{CURRENT_TIME}',defaultTemplateInputs.CURRENT_TIME);
                tooltip = tooltip.replace('{EXPECTED_DATE_GDATA}',defaultTemplateInputs.EXPECTED_DATE_GDATA);
                tooltip = tooltip.replace('{EXPECTED_TIME_GDATA}',defaultTemplateInputs.EXPECTED_TIME_GDATA);
                tooltip = tooltip.replace('{NEXT_EWI_DATE}',defaultTemplateInputs.NEXT_EWI_DATE);
                tooltip = tooltip.replace('{NEXT_EWI_TIME}',defaultTemplateInputs.NEXT_EWI_TIME);
                tooltip = tooltip.replace('{LOWERING_EXTENDED_TIME}',defaultTemplateInputs.LOWERING_EXTENDED_TIME);
                tooltip = tooltip.replace('{EXT_DAY}',defaultTemplateInputs.EXT_DAY);   
                $('#template_table').attr('title',tooltip);
            }
        }
    });
}

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
            { "data" : "alert_status", title:"ALERT STATUS"},
            { "data" : "alert_symbol_level", title:"ALERT SYMBOL / ALERT LEVEL"},
            { "data" : "key_input", title:"KEY INPUT"},
            { "data" : "last_update_by", title:"LATEST MODIFICATION"},
            { "data" : "functions", title: "*"}
        ]
    });
}

function keyInputAutocomplete() {
    $.get('../communications/fetchalltemplate',function(data){
        var response = JSON.parse(data);
        alertLevelSymbol = response;
        console.log(alertLevelSymbol);
        alertSymbolAutocomplete(response);
        alertLevelAutocomplete(response);
        $('#alert_symbols').on('change',function(){
            for(var counter = 0; counter < response.data.length; counter++){
                if ($(this).val() == response.data[counter].alert_symbol_level) {
                    $('#techinfo_template').prop('disabled', true);
                    $('#techinfo_template').val(response.data[counter].key_input);
                    break;
                } else {
                    $('#techinfo_template').prop('disabled', false);
                    $('#techinfo_template').val("");
                }
            }
        });

        $('#alert_level').on('change',function(){
            for(var counter = 0; counter < response.data.length; counter++){
                if ($(this).val() == response.data[counter].alert_symbol_level) {
                    $('#response_template').prop('disabled', true);
                    $('#response_template').val(response.data[counter].key_input);
                    break;
                } else {
                    $('#response_template').prop('disabled', false);
                    $('#response_template').val("");
                }
            }
        });

    });
}

function alertSymbolAutocomplete(response) {
    var alert_symbols = [];
    for (var counter=0;counter < response.data.length;counter++){
        if ($.inArray(response.data[counter].alert_symbol_level,alert_symbols) == -1) {
           if (response.data[counter].alert_symbol_level.toLowerCase().indexOf("alert") == -1) {
            alert_symbols.push(response.data[counter].alert_symbol_level);
           }
        }
    }
    var alert = document.getElementById("alert_symbols");
    var awesomplete = new Awesomplete(alert, {
        minChars: 1,
    });
    awesomplete.list = alert_symbols;
}

function alertLevelAutocomplete(response) {
    var alert_levels = [];
    for (var counter=0;counter < response.data.length;counter++){
        if ($.inArray(response.data[counter].alert_symbol_level,alert_levels) == -1) {
           if (response.data[counter].alert_symbol_level.toLowerCase().indexOf("alert") != -1) {
            alert_levels.push(response.data[counter].alert_symbol_level);
           }
        }
    }
    var alert = document.getElementById("alert_level");
    var awesomplete = new Awesomplete(alert, {
        minChars: 1,
    });
    awesomplete.list = alert_levels;
}

function backboneCategoryAutocomplete(response) {
    var backbone_category = [];
    for (var counter=0;counter < response.data.length;counter++){
        if ($.inArray(response.data[counter].alert_status,backbone_category) == -1) {
           backbone_category.push(response.data[counter].alert_status); 
        }
    }
    var input = document.getElementById("alert_status");
    var awesomplete = new Awesomplete(input, {
        minChars: 1,
    });
    awesomplete.list = backbone_category;
}

function backboneAutocomplete() {
    $.get('../communications/fetchallbackbonetemplate').done(function(data){
        var response = JSON.parse(data);
        var category = [];
        for (var counter =0; counter < response.data.length;counter++) {
            if ($.inArray(response.data[counter].category,category) == -1){
                category.push(response.data[counter].category);
            }
        }
        var input = document.getElementById("category");
        var awesomplete = new Awesomplete(input, {
            minChars: 1,
        });
        awesomplete.list = category;
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
    		{ "data" : "alert_status", title: "ALERT STATUS"},
    		{ "data" : "template", title: "BACKBONE MESSAGE"},
    		{ "data" : "last_modified_by", title: "LASTEST MODIFICATION"},
    		{ "data" : "functions", title : "*"}
        ]
    });
}

function loadKeyInputs(){
    var objKeys = Object.keys(defaultTemplateInputs);
    for (var counter =0; counter < objKeys.length; counter++) {
        var r= $('<button type="button" id="'+objKeys[counter].toLowerCase()+'" class="btn btn-info" style="margin: 2px;"" value="{'+objKeys[counter]+'}">+ '+objKeys[counter]+'</button>');
        $("#key-input-container").append(r);
    }
}

function loadBackboneView(real_time_value) {
	template = real_time_value;
	var key = {
		'keypoint' : $('#alert_status').val()
	};

	$.post('../communications/getkeypointsviacategory',{template_key : JSON.stringify(key)})
	.done(function(data){
		var response = JSON.parse(data);
		if (response.length == 0) {
			$('#no-key-input').show();
		} else {
			$('#no-key-input').hide();
			template = template.replace('{KEY_INPUT}',defaultTemplateInputs.KEY_INPUT);
            template = template.replace('{ALERT_LVL}',defaultTemplateInputs.ALERT_LVL);
            template = template.replace('{GREETINGS}',defaultTemplateInputs.GREETINGS);
            template = template.replace('{SBMP}',defaultTemplateInputs.SBMP);
            template = template.replace('{CURRENT_DATE}',defaultTemplateInputs.CURRENT_DATE);
            template = template.replace('{CURRENT_TIME}',defaultTemplateInputs.CURRENT_TIME);
            template = template.replace('{EXPECTED_DATE_GDATA}',defaultTemplateInputs.EXPECTED_DATE_GDATA);
            template = template.replace('{EXPECTED_TIME_GDATA}',defaultTemplateInputs.EXPECTED_TIME_GDATA);
            template = template.replace('{NEXT_EWI_DATE}',defaultTemplateInputs.NEXT_EWI_DATE);
            template = template.replace('{NEXT_EWI_TIME}',defaultTemplateInputs.NEXT_EWI_TIME);
            template = template.replace('{LOWERING_EXTENDED_TIME}',defaultTemplateInputs.LOWERING_EXTENDED_TIME);
            template = template.replace('{EXT_DAY}',defaultTemplateInputs.EXT_DAY);	
			$('#backbone_preview').val(template);
		}		
	});
}