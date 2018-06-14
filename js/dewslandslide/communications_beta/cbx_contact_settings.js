let site_selected = [];
let organization_selected = [];

function addNewMobileForEmployee () {
	$("#employee-add-number").click(function(){
		if (employee_input_count <= 4) {
			$("#mobile-div").append(
			"<div class='row'>"+
		    "<div class='col-md-4'>"+
		    "<div class='form-group hideable'>"+
			"<label class='control-label' for='employee_mobile_number_"+employee_input_count+"'>Mobile #</label>"+
			"<input type='number' class='form-control employee_mobile_number' id='employee_mobile_number_"+employee_input_count+"' name='employee_mobile_number_"+employee_input_count+"' value='' required/>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='employee_mobile_id_"+employee_input_count+"' class='form-control employee_mobile_id' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<div class='form-group hideable'>"+
			"<label class='control-label' for='employee_mobile_status_"+employee_input_count+"'>Mobile # Status</label>"+
			"<select class='form-control' id='employee_mobile_status_"+employee_input_count+"' name='employee_mobile_status_"+employee_input_count+"' class='form-control employee_mobile_status' value='' required>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4'>"+
		    "<div class='form-group hideable'>"+
			"<label class='control-label' for='employee_mobile_priority_"+employee_input_count+"'>Mobile # Priority</label>"+
			"<select id='employee_mobile_priority_"+employee_input_count+"'' name='employee_mobile_priority_"+employee_input_count+"' class='form-control employee_mobile_priority' value='' required>"+
			"<option value=''>--------</option>"+
			"<option value='1'>1</option>"+
			"<option value='2'>2</option>"+
			"<option value='3'>3</option>"+
			"</select>"+
			"</div>"+
			"</div>"+
			"</div>");
			employee_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "warn");
		}
		
	});

	$("#employee-add-landline").click(function(){
		if (employee_input_count_landline <= 4) {
			$("#landline-div").append(
			"<div class='row'>"+
		    "<div class='col-md-6'>"+
			"<div class='form-group hideable'>"+
	        "<label class='control-label' for='employee_landline_number_"+employee_input_count_landline+"'>Landline #</label>"+
			"<input type='number' class='form-control' id='employee_landline_number_"+employee_input_count_landline+"' name='employee_landline_number_"+employee_input_count+"' required/>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Landline ID #:</label>"+
			"<input type='text' id='employee_landline_id_"+employee_input_count_landline+"' class='form-control' value='' disabled>"+
			"</div>"+
			"<div class='col-md-6'>"+
			"<div class='form-group hideable'>"+
			"<label class='control-label' for='employee_landline_remarks_"+employee_input_count_landline+"'>Remarks</label>"+
			"<input type='text' class='form-control' id='employee_landline_remarks_"+employee_input_count_landline+"' name='employee_landline_remarks_"+employee_input_count_landline+"' required/>"+
			"</div>"+
			"</div>"+
			"</div>");
			employee_input_count_landline +=1;
		} else {
			$.notify("Reach the maximum entry for landile number", "warn");
		}
		
	});

} 

function addNewMobileForCommunity () {
	$("#community-add-number").click(function(){
		if (community_input_count <= 4) {
			$("#mobile-div-cc").append(
			"<div class='row'>"+
		    "<div class='col-md-4'>"+
		    "<div class='form-group hideable'>"+
			"<label class='control-label' for='community_mobile_number_"+community_input_count+"'>Mobile #:</label>"+
			"<input type='number' class='form-control community_mobile_number' id='community_mobile_number_"+community_input_count+"' name='community_mobile_number_"+community_input_count+"' value='' required/>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='community_mobile_id_"+community_input_count+"' class='form-control community_mobile_id' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<div class='form-group hideable'>"+
			"<label class='control-label' for='community_mobile_status_"+community_input_count+"'>Mobile # Status:</label>"+
			"<select id='community_mobile_status_"+community_input_count+"'' name='community_mobile_status_"+community_input_count+"' class='form-control community_mobile_status' value='' required>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<div class='form-group hideable'>"+
			"<label class='control-label' for='community_mobile_priority_"+community_input_count+"'>Mobile # Priority:</label>"+
			"<select id='community_mobile_priority_"+community_input_count+"'' name='community_mobile_priority_"+community_input_count+"' class='form-control community_mobile_priority' value='' required>"+
			"<option value=''>--------</option>"+
			"<option value='1'>1</option>"+
			"<option value='2'>2</option>"+
			"<option value='3'>3</option>"+
			"</select>"+
			"</div>"+
			"</div>"+
			"</div>");
			community_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "warn");
		}
		
	});

	$("#community-add-landline").click(function(){
		if (community_input_count_landline <= 4) {
			$("#landline-div-cc").append(
			"<div class='row'>"+
		    "<div class='col-md-6'>"+
			"<div class='form-group hideable'>"+
	        "<label class='control-label' for='community_landline_number_"+community_input_count_landline+"'>Landline #</label>"+
			"<input type='number' class='form-control' id='community_landline_number_"+community_input_count_landline+"' name='community_landline_number_"+community_input_count+"' required/>"+
			"</div>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Landline ID #:</label>"+
			"<input type='text' id='community_landline_id_"+community_input_count_landline+"' class='form-control' value='' disabled>"+
			"</div>"+
			"<div class='col-md-6'>"+
			"<div class='form-group hideable'>"+
			"<label class='control-label' for='community_landline_remarks_"+community_input_count_landline+"'>Remarks</label>"+
			"<input type='text' class='form-control' id='community_landline_remarks_"+community_input_count_landline+"' name='community_landline_remarks_"+community_input_count_landline+"' required/>"+
			"</div>"+
			"</div>"+
			"</div>");
			community_input_count_landline +=1;
		} else {
			$.notify("Reach the maximum entry for landline number", "warn");
		}
		
	});
} 

function initializeOnSubmitEmployeeContactForm () {
	$('#emp-settings-cmd button[type="submit"], #sbt-update-contact-info').on('click',function(){
		employeeContactFormValidation();
	});
}

function initializeOnSubmitCommunityContactForm () {
	$('#comm-settings-cmd button[type="submit"]').on('click',function(){
		communityContactFormValidation();
	});
}

function submitEmployeeInformation () {
	const save_type = $("#settings-cmd").val();
	let message_type = null;
	let team_inputted = $("#team_ec").val();
	let email_inputted = $("#email_ec").val();
	let mobile_numbers = [];
	let landline_numbers = [];

	//for mobile number
	for (let counter = 1; counter < employee_input_count; counter +=1) {
		const mobile_number_raw = {
			"user_id": $("#user_id_ec").val(),
			"mobile_id": $("#employee_mobile_id_"+counter).val(),
			"mobile_number": $("#employee_mobile_number_"+counter).val(),
			"mobile_status": $("#employee_mobile_status_"+counter).val(),
			"mobile_priority": $("#employee_mobile_priority_"+counter).val()
		};
		mobile_numbers.push(mobile_number_raw);
	}
	
	//for landline number
	for (let counter = 1; counter < employee_input_count_landline; counter +=1) {
		const landline_number_raw = {
			"user_id": $("#user_id_ec").val(),
			"landline": $("#employee_landline_id_"+counter).val(),
			"landline_number": $("#employee_landline_number_"+counter).val(),
			"landline_remarks": $("#employee_landline_remarks_"+counter).val()
		};
		landline_numbers.push(landline_number_raw);
	}

	contact_data = {
		"id": $("#user_id_ec").val(),
		"salutation": $("#salutation_ec").val(),
		"firstname": $("#firstname_ec").val(),
		"middlename": $("#middlename_ec").val(),
		"lastname": $("#lastname_ec").val(),
		"nickname": $("#nickname_ec").val(),
		"birthdate": $("#birthdate_ec").val(),
		"gender": $("#gender_ec").val(),
		"contact_active_status": $("#active_status_ec").val(),
		"teams": team_inputted,
		"email_address": email_inputted,
		"numbers": mobile_numbers,
		"landline": landline_numbers
	}

	console.log(contact_data);
	
	if (save_type === "updatecontact") {
		message_type = "updateDewslContact";
	}else {
		message_type = "newDewslContact";
	}

	message = {
		type: message_type,
		data: contact_data
	}

	wss_connect.send(JSON.stringify(message));
	employee_input_count = 1;
	employee_input_count_landline = 1;
}

function onSubmitCommunityContactForm (sites, organizations) {
	const save_type = $("#settings-cmd").val();
	let message_type = null;
	let mobile_numbers = [];
	let landline_numbers = [];

	//for mobile number
	for (let counter = 1; counter < community_input_count; counter +=1) {
		const mobile_number_raw = {
			"id": current_user_id,
			"mobile_number": $("#community_mobile_number_"+counter).val(),
			"mobile_status": $("#community_mobile_status_"+counter).val(),
			"mobile_priority": $("#community_mobile_priority_"+counter).val()
		};
		mobile_numbers.push(mobile_number_raw);
	}

	//for landline number
	for (let counter = 1; counter < community_input_count_landline; counter +=1) {
		const landline_number_raw = {
			"user_id": current_user_id,
			"landline_num": $("#community_landline_number_"+counter).val(),
			"remarks": $("#community_landline_remarks_"+counter).val()
		};
		landline_numbers.push(landline_number_raw);
	}


	contact_data = {
		"user_id": $("#user_id_cc").val(),
		"salutation": $("#salutation_cc").val(),
		"firstname": $("#firstname_cc").val(),
		"middlename": $("#middlename_cc").val(),
		"lastname": $("#lastname_cc").val(),
		"nickname": $("#nickname_cc").val(),
		"birthdate": $("#birthdate_cc").val(),
		"gender": $("#gender_cc").val(),
		"contact_active_status": $("#active_status_cc").val(),
		"ewi_recipient": $("#ewirecipient_cc").val(),
		"numbers": mobile_numbers,
		"landline": landline_numbers,
		"sites": site_selected,
		"organizations": organization_selected
	}

	console.log(contact_data);

	if (save_type === "updatecontact") {
		message_type = "updateCommunityContact";
	}else {
		message_type = "newCommunityContact";
	}

	message = {
		type: message_type,
		data: contact_data
	}

	wss_connect.send(JSON.stringify(message));
	community_input_count = 1;
	community_input_count_landline = 1;
}

function getSiteSelection () {
	// for site selection
	var msg = {
		'type': 'getAllSitesConSet'
	};
	wss_connect.send(JSON.stringify(msg));
	
}

function getOrganizationSelection () {
	// for org selection
	var msg = {
		'type': 'getAllOrgsConSet'
	};
	wss_connect.send(JSON.stringify(msg));
}

function emptyEmployeeContactForm () {
	$("#user_id_ec").val(0);
	$("#salutation_ec").val("");
	$("#firstname_ec").val("");
	$("#middlename_ec").val("");
	$("#lastname_ec").val("");
	$("#nickname_ec").val("");
	$("#birthdate_ec").val("");
	$("#gender_ec").val("");
	$("#active_status_ec").val(1);
	$("#mobile-div").empty();
	$('#email_ec').tagsinput('removeAll');
	$('#team_ec').tagsinput('removeAll');
	employee_input_count = 1;
}

function emptyCommunityContactForm () {
	$("#user_id_cc").val(0);
	$("#salutation_cc").val("");
	$("#firstname_cc").val("");
	$("#middlename_cc").val("");
	$("#lastname_cc").val("");
	$("#nickname_cc").val("");
	$("#birthdate_cc").val("");
	$("#gender_cc").val("");
	$("#active_status_cc").val("");
	$("#ewirecipient_cc").val("");
	community_input_count = 1;
}

function contactSettingsFeedback (status) {
	if (msg.status == true) {
		$.notify(msg.return_msg,'success');
	} else {
		$.notify(msg.return_msg,'failed');
	}
}

function employeeContactFormValidation() {
	$("#employee-contact-form").validate({
        debug: true,
        rules: {
            firstname_ec: "required",
			lastname_ec: "required",
			middlename_ec: "required",
			nickname_ec: "required",
			salutation_ec: "required",
			gender_ec: "required",
			birthdate_ec: "required",
			email_ec: "required",
			active_status_ec: "required",
			team_ec: "required"
        },
        messages: { comments: "" },
        errorPlacement (error, element) {
            const placement = $(element).closest(".form-group");
            if ($(element).hasClass("cbox_trigger_switch")) {
                $("#errorLabel").append(error).show();
            } else if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            const $next_span = element.next("span");
            if (!$next_span[0]) {
                if (element.is("select") || element.is("textarea")) $next_span.css({ top: "25px", right: "25px" });
            }
        },
        success (label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
            submitEmployeeInformation();
            console.log("success");
        }
    });
}

function communityContactFormValidation () {
	$("#community-contact-form").validate({
        debug: true,
        rules: {
            firstname_cc: "required",
			lastname_cc: "required",
			middlename_cc: "required",
			nickname_cc: "required",
			salutation_cc: "required",
			gender_cc: "required",
			birthdate_cc: "required",
			active_status_cc: "required",
			ewirecipient_cc: "required"
        },
        messages: { comments: "" },
        errorPlacement (error, element) {
            const placement = $(element).closest(".form-group");
            if ($(element).hasClass("cbox_trigger_switch")) {
                $("#errorLabel").append(error).show();
            } else if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            const $next_span = element.next("span");
            if (!$next_span[0]) {
                if (element.is("select") || element.is("textarea")) $next_span.css({ top: "25px", right: "25px" });
            }
        },
        success (label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
        	site_selected = [];
			organization_selected = [];
			$('#site-selection-div input:checked').each(function() {
			    site_selected.push($(this).attr('value'));
			});

			$('#organization-selection-div input:checked').each(function() {
			    organization_selected.push($(this).attr('value'));
			});

			$("#org-and-site-alert").show(300);
			if (site_selected.length === 0 && organization_selected.length === 0) {
				$("#selection-feedback").text("site and organization selection");
			} else if (site_selected.length === 0) {
				$("#selection-feedback").text("site selection");
			} else if (organization_selected.length === 0) {
				$("#selection-feedback").text("organization selection");
			} else {
				$("#org-and-site-alert").hide(300);
				//success function here
				onSubmitCommunityContactForm(site_selected, organization_selected);
			}
            
        }
    });
}