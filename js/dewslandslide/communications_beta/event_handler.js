let quick_group_selection_flag = false;
let site_selected = [];
let organization_selected = [];

$(document).ready(function() {
	initializeGetQuickGroupSelection();
	initializeContactSettingsButton();
	initializeOnClickQuickInbox();
	initializeContactCategoryOnSelectDesign();
	initializeSettingsOnSelectDesign();
	initializeContactCategoryOnChange();
	initializeContactSettingsOnChange();
	initializeQuickSelectionGroupFlagOnClick();
	initializeGoChatOnClick();
	initializeGoLoadOnClick();
	initializeSendMessageOnClick();
	initializeOnAvatarClickForTagging();
	initializeAlertStatusOnChange();
	initializeEWITemplateModal();
	initializeConfirmEWITemplateViaChatterbox();
	initializeQuickSearchModal();
	initializeQuickSearchMessages();
	initializeClearQuickSearchInputs();
	initializeLoadSearchedKeyMessage();
});

function initializeGetQuickGroupSelection () {
	$('#btn-advanced-search').click(function(){
		getQuickGroupSelection();
	});
}

function initializeContactSettingsButton () {
	$('#btn-contact-settings').click(function(){
		if (connection_status === false){
			console.log("NO CONNECTION");
		} else {
			$('#contact-settings').modal("toggle");
			displayContactSettingsMenu();
			addNewMobileForEmployee();
			addNewMobileForCommunity();
			$("#contact-category").val("default").change();
			$("#settings-cmd").prop('disabled', true);
			$(".collapse").collapse("show");
		}
	});
}

function initializeOnClickQuickInbox () {
	$("body").on("click","#quick-inbox-display li",function(){
		$("#msg").val("");
		let raw_name = $(this).closest('li').find("input[type='text']").val().split(",");
		let firstname = raw_name[1].trim();
		let lastname = raw_name[0].split("-")[1].trim();
		let office = raw_name[0].split(" ")[1].trim();
		let site = raw_name[0].split(" ")[0].trim();
		let conversation_details = {
			full_name: $(this).closest('li').find("input[type='text']").val(),
			firstname: firstname,
			lastname: lastname,
			office: office,
			site: site,
			number: "N/A"
		}
		startConversation(conversation_details);
	});
}
function initializeContactCategoryOnSelectDesign () {
	$('#contact-category option').prop('selected', function() {
		$('#contact-category').css("border-color", "#d6d6d6");
		$('#contact-category').css("background-color", "inherit");
		return this.defaultSelected;
	});
}

function initializeSettingsOnSelectDesign () {
	$('#settings-cmd option').prop('selected', function() {
		$('#settings-cmd').prop('disabled',true);
		$('#settings-cmd').css("border-color", "#d6d6d6");
		$('#settings-cmd').css("background-color", "inherit");
		return this.defaultSelected;
	});
}

function initializeContactCategoryOnChange () {
	$('#contact-category').on('change',function(){
		$('#contact-result').remove();
		if ($('#contact-category').val() != 'default') {
			$('#contact-category').css("border-color", "#3c763d");
			$('#contact-category').css("background-color", "#dff0d8");
		}
		$('#settings-cmd').prop('disabled', false);
		$('#settings-cmd option').prop('selected', function() {
			$('#settings-cmd').css("border-color", "#d6d6d6");
			$('#settings-cmd').css("background-color", "inherit");
			return this.defaultSelected;
		});

		$('#update-contact-container').prop('hidden',true);
		$('#comm-response-contact-container_wrapper').prop('hidden',true);
		$('#emp-response-contact-container_wrapper').prop('hidden',true);
		$('#employee-contact-wrapper').prop('hidden', true);
		$('#community-contact-wrapper').prop('hidden', true);
	});
}

function initializeContactSettingsOnChange () {
	$('#settings-cmd').on('change',function(){
		$("#mobile-div").empty();
		$("#landline-div").empty();
		$("#mobile-div-cc").empty();
		$("#landline-div").empty();
		if ($('#settings-cmd').val() != 'default') {
			$('#settings-cmd').css("border-color", "#3c763d");
			$('#settings-cmd').css("background-color", "#dff0d8");
		}else {
			$("#employee-add-number").empty();
			$("#community-add-number").empty();
		}

		if ($('#contact-category').val() == "econtacts") {
			employee_input_count = 1;
			employee_input_count_landline = 1;
			$("#settings-cmd").prop('disabled', false);
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#community-contact-wrapper').hide();
				$('#employee-contact-wrapper').show();
				emptyEmployeeContactForm();
				$("#emp-settings-cmd").show();
				$('#employee-contact-wrapper').show();
				$("#update-contact-container").hide();
			} else if ($('#settings-cmd').val() == "updatecontact") {
				$('#community-contact-wrapper').hide();
				$('#employee-contact-wrapper').hide();
				$('#email_ec').tagsinput('removeAll');
				$('#team_ec').tagsinput('removeAll');
				getEmployeeContact();
			} else {
				console.log('Invalid Request');
			}
		} else if ($('#contact-category').val() == "ccontacts") {
			community_input_count = 1;
			community_input_count_landline = 1;
			console.log(community_input_count);
			console.log(community_input_count_landline);
			$("#settings-cmd").prop('disabled', false);
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#employee-contact-wrapper').hide();
				$('#community-contact-wrapper').show();
				$('#comm-settings-cmd').show();
				$('#update-comm-contact-container').hide();
				emptyCommunityContactForm();
				$('#employee-contact-wrapper').hide();
				$(".organization-checkbox").prop("checked", false);
				$(".site-checkbox").prop("checked", false);
			} else if ($('#settings-cmd').val() == "updatecontact") {
				$('#comm-response-contact-container_wrapper').hide();
				$('#employee-contact-wrapper').hide();
				$('#community-contact-wrapper').hide();
				$('#comm-settings-cmd').hide();
				$('#update-comm-contact-container').show();
				getCommunityContact();
			} else {
				console.log('Invalid Request');
			}
		} else {
			console.log('Invalid Request');
		}
	});

	$('#contact-category').on('change',function(){
		$('#community-contact-wrapper').hide();
		$('#employee-contact-wrapper').hide();
	});
}

function initializeQuickSelectionGroupFlagOnClick () {
	$('#emp-grp-flag').on('click',function(){
		quick_group_selection_flag = true;
	});

	$('#comm-grp-flag').on('click',function(){
		quick_group_selection_flag = false;
	});
}

function initializeGoChatOnClick () {
	$("#go-chat").click(function() {
		let raw_name = $("#contact-suggestion").val().split(",");
		let firstname = raw_name[1].trim();
		let lastname = raw_name[0].split("-")[1].trim();
		let office = raw_name[0].split(" ")[1].trim();
		let site = raw_name[0].split(" ")[0].trim();
		let conversation_details = {
			full_name: $("#contact-suggestion").val(),
			firstname: firstname,
			lastname: lastname,
			office: office,
			site: site,
			number: "N/A"
		}
		startConversation(conversation_details);
	});
}

function initializeGoLoadOnClick () {
	$("#go-load-groups").click(function() {
		loadSiteConversation();
		const offices_selected = [];
		const sites_selected = [];
		$("#conversation-details").empty();
		$("#modal-select-sitenames input:checked").each(function() {
		    sites_selected.push($(this).closest('label').text());
		});
		$("#modal-select-offices input:checked").each(function() {
		    offices_selected.push($(this).attr('value'));
		});

		const sites = sites_selected.join(", ");
		const offices = offices_selected.join(", ");
		console.log("Site(s): "+sites+" | Office(s): "+offices+"");
		$("#conversation-details").append("Site(s): "+sites+" | Office(s): "+offices+"");
	});
}


function initializeSendMessageOnClick () {
	$("#send-msg").click(function() {
		sendSms(recipient_container,$("#msg").val());
	});
}

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
			"<input type='text' id='employee_mobile_id_"+employee_input_count+"' class='form-control employee_mobile_id' disabled>"+
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
			"<input type='number' class='form-control' id='employee_landline_number_"+employee_input_count_landline+"' name='employee_landline_number_"+employee_input_count_landline+"' required/>"+
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
			"id": $("#user_id_cc").val(),
			"mobile_number": $("#community_mobile_number_"+counter).val(),
			"mobile_status": $("#community_mobile_status_"+counter).val(),
			"mobile_priority": $("#community_mobile_priority_"+counter).val()
		};
		mobile_numbers.push(mobile_number_raw);
	}

	//for landline number
	for (let counter = 1; counter < community_input_count_landline; counter +=1) {
		const landline_number_raw = {
			"user_id": $("#user_id_cc").val(),
			"landline_number": $("#community_landline_number_"+counter).val(),
			"landline_remarks": $("#community_landline_remarks_"+counter).val()
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

function initializeOnAvatarClickForTagging() {
	$(document).on("click","#messages .user-avatar",function(){
		$("#gintag_selected").tagsinput('removeAll');
		$("#gintag-modal").modal({backdrop: 'static', keyboard: false});
		message_details = $(this).closest("li.clearfix").find("input[class='msg_details']").val().split('<split>');
		const gintag_selected = $("#gintag_selected").tagsinput("items");

		OnClickConfirmTagging(message_details);
		getSmsTags(message_details[0]);
	});
}

function getSmsTags (sms_id) {
	const message = {
		type: "getSmsTags",
		data: sms_id
	}

	wss_connect.send(JSON.stringify(message));
}

function initializeEWITemplateModal() {
	$("#btn-ewi").click(function() {
		$("#alert-lvl").empty();
        $("#sites").empty();
        $("#alert_status").empty();
        $("#alert_lvl").empty();
        $("#internal_alert").empty();

        $("#alert_status").append($("<option>", {
            value: "------------",
            text: "------------"
        }));

        const alert_status = {
        	type: "getAlertStatus"
        };
        wss_connect.send(JSON.stringify(alert_status));
	});
}

function OnClickConfirmTagging (message_details) {
	$("#confirm-tagging").click(function(){
		// $("#narrative-modal").modal({backdrop: 'static', keyboard: false});
		// $("#gintag-modal").hide();
		const gintag_selected = $("#gintag_selected").tagsinput("items");
		const important = [];
		const new_tag = [];
		console.log(message_details);
		if (gintag_selected.length === 0 ) {
			$("#gintag_warning_message").show(300).effect("shake");
		} else {
			$("#gintag_warning_message").hide(300);
			gintag_selected.forEach(function(selected) {
				const [result] = important_tags.filter(tags => tags === selected);
				if(typeof result === "undefined") {
					new_tag.push(selected);
				}else {
					important.push(result);
				}
			});

			if (new_tag.length > 0){
				addNewTags(message_details, new_tag);
			}

			if(important.length > 0){
				console.log("tag and open narrative modal");
				$("#narrative-modal").modal({backdrop: 'static', keyboard: false});
				$("#gintag-modal").modal("hide");

				onClickConfirmNarrative(message_details);
			}
		}
		
	});
}

function addNewTags (message_details, new_tag) {
	console.log("success tagging new tagg");
	$("#gintag-modal").modal("hide");
	const details_data = {
		"user_id": message_details[1],
		"sms_id": message_details[0],
		"tag": new_tag,
		"full_name": message_details[2],
		"ts": message_details[3],
		"account_id": current_user_id,
		"tag_important": true
	};
	console.log(details_data);
	const message = {
		type: "gintaggedMessage",
		data: details_data
	}

	wss_connect.send(JSON.stringify(message));
}

function onClickConfirmNarrative (message_details) {
	$("#narrative_message").empty();
	$("#narrative_message").append(
		"Contact(s) to be tagged: " + "&#013;&#010;"+ 
		"Timestamp: " + message_details[3] + "&#013;&#010;&#013;&#010;&#013;&#010;" +
		message_details[4] + "&#013;&#010;"
	);

	$("#save-narrative").click(function(){
		const details_data = {
			"user_id": message_details[1],
			"sms_id": message_details[0],
			"tag": important,
			"full_name": message_details[2],
			"ts": message_details[3],
			"account_id": current_user_id,
			"tag_important": false
		};

		console.log(details_data);
		const message = {
			type: "gintaggedMessage",
			data: details_data
		}

		wss_connect.send(JSON.stringify(message));
	});
}

function displayConversationTags (conversation_tags) {
	
	if(conversation_tags.length > 0){
		$("#gintag_selected").tagsinput('removeAll');
		$(".bootstrap-tagsinput").keypress(function(){
			console.log("pressed");
			conversation_tags.forEach(function(tag) {
				$("#gintag_selected").tagsinput("add", tag);
			});
			console.log($("#gintag_selected").val());
		});
	}else {
		$("#gintag_selected").tagsinput('removeAll');
		conversation_tags.forEach(function(tag) {
			$("#gintag_selected").tagsinput("add", tag);
		});
	}
}

function initializeAlertStatusOnChange() {
	$("#alert_status").on("change", function () {
        const alert_request = {
        	type: "getEWITemplateSettings",
        	data: $(this).val()
        }
        wss_connect.send(JSON.stringify(alert_request));
    });
}
function initializeQuickSearchModal () {
	$('#btn-gbl-search').click(function(){
		$("#quick-search-modal").modal({backdrop: 'static', keyboard: false});
	});
}

function initializeQuickSearchMessages () {
	$('#submit-search').click(function(){
		$('#chatterbox-loader-modal').modal({backdrop: 'static', keyboard: false});
		const search_via = $("#search-via").val();
		const search_key = $("#search-keyword").val();
		const search_limit = $("#search-limit").val();
		let request = null;
		switch(search_via) {
			case "messages":
				request = {
					type: "searchMessageGlobal",
					searchKey: search_key,
					searchLimit: search_limit
				}
				break;
			case "gintags":
				request = {
					type: "searchGintagMessages",
					searchKey: search_key,
					searchLimit: search_limit
				}
				break;
			case "ts_sent":
				request = {
					type: "searchGintagMessages",
					searchKey: search_key,
					searchLimit: search_limit
				}
				break;
			case "ts_written":
				request = {
					type: "searchGintagMessages",
					searchKey: search_key,
					searchLimit: search_limit
				}
				break;
			case "unknown":
				request = {
					type: "searchGintagMessages",
					searchKey: search_key,
					searchLimit: search_limit
				}
				break;
		}
		console.log(request);
		wss_connect.send(JSON.stringify(request));
	});
}

function initializeClearQuickSearchInputs () {
	$('#clear-search').click(function(){
		$("#search-limit").val("");
		$("#search-keyword").val("");
	});
}

function initializeConfirmEWITemplateViaChatterbox() {
	$("#confirm-ewi").click(() => {
        var samar_sites = ["jor", "bar", "ime", "lpa", "hin", "lte", "par", "lay"];
        if ($("#rainfall-sites").val() !== "#") {
            var rain_info_template = "";
            if ($("#rainfall-cummulative").val() == "1d") {
                rain_info_template = `1 day cumulative rainfall as of ${$("#rfi-date-picker input").val()}: `;
            } else {
                rain_info_template = `3 day cumulative rainfall as of ${$("#rfi-date-picker input").val()}: `;
            }
      //       $.ajax({
      //           url: "/api/rainfallScanner",
      //           dataType: "json",
      //           success (result) {
	    	// var data = JSON.parse(result);
	    	// for (var counter = 0; counter < samar_sites.length; counter++) {
	    	// 	for (var sub_counter = 0; sub_counter < data.length; sub_counter++) {
	    	// 		if (data[sub_counter].site == samar_sites[counter]) {
	    	// 		if ($("#rainfall-cummulative").val() == "1d") {
    		// 			rainfall_percent = parseInt((data[sub_counter]["1D cml"] / data[sub_counter]["half of 2yr max"]) * 100);
	    	// 			} else {
	    	// 				rainfall_percent = parseInt((data[sub_counter]["3D cml"] / data[sub_counter]["2yr max"]) * 100);
	    	// 			}
	    	// 			rain_info_template = `${rain_info_template} ${data[sub_counter].site} = ${rainfall_percent}%,\n`;
	    	// 		}
	    	// 	}
	    	// }

	  //   	for (var counter = 0; counter < samar_sites.length; counter++) {
   //              $.post("../chatterbox/getsitbangprovmun", { sites: samar_sites[counter] })
   //              .done((response) => {
   //                  var data = JSON.parse(response);
   //                  console.log(data);
   //                  var sbmp = `${data[0].sitio}, ${data[0].barangay}, ${data[0].municipality}`;
   //                  var formatSbmp = sbmp.replace("null", "");
   //                  if (formatSbmp.charAt(0) == ",") {
   //                      formatSbmp = formatSbmp.substr(1);
   //                  }
   //                  rain_info_template = rain_info_template.replace(data[0].name, formatSbmp);
   //                  $("#msg").val(rain_info_template);
   //              });
			// }
	    } else if ($("#ewi-date-picker input").val() == "" || $("#sites").val() == "") {
            alert("Invalid input, All fields must be filled");
        } else {
        	let template_container = {
				site_name: $("#sites").val(),
                internal_alert: $("#internal-alert").val() == "------------" ? "N/A" : $("#internal-alert").val(),
                alert_level: $("#alert-lvl").val() == "------------" ? "N/A" : $("#alert-lvl").val(),
                alert_status: $("#alert_status").val() == "------------" ? "N/A" : $("#alert_status").val(),
                formatted_data_timestamp: moment($("#ewi-date-picker input").val()).format('MMMM D, YYYY h:mm A'),
                data_timestamp: $("#ewi-date-picker input").val()
        	};
            let template_request = {
            	type: "fetchTemplateViaLoadTemplateCbx",
                data: template_container
            };
            console.log(template_request);
            wss_connect.send(JSON.stringify(template_request));
        }
    });
}

function initializeLoadSearchedKeyMessage() {
	$(document).on("click", "#search-global-result li", function () {
        let data = ($(this).closest("li")).find("input[id='msg_details']").val().split("<split>");
        let msg_data = {
        	sms_id: data[0],
        	sms_msg: data[1],
        	ts: data[2],
        	mobile_id: data[4],
        	table_source: data[3]
        };
        const search_request = {
        	type: "loadSearchedMessageKey",
        	data: msg_data
        };
        wss_connect.send(JSON.stringify(search_request));
        $(".recent_activities").hide();
    });
}