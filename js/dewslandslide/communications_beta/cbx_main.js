let quick_inbox_registered = [];
let quick_inbox_unregistered = [];
let quick_inbox_event = [];
let quick_inbox_data_logger = [];
let chatterbox_user = "You";
let message_container = [];
let current_user_id = $("#current_user_id").val();

let quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());
let messages_template_both = Handlebars.compile($('#messages-template-both').html());
let selected_contact_template = Handlebars.compile($('#selected-contact-template').html());
let quick_release_template = Handlebars.compile($('#quick-release-template').html());

function getQuickGroupSelection () {
	getQuickCommunitySelection();
	getQuickEmployeeSelection();
}

function getQuickCommunitySelection () {
	try {
		let list_of_sites = {
			'type': "qgrSites"
		}

		let list_of_orgs = {
			'type': "qgrOrgs"
		}

		wss_connect.send(JSON.stringify(list_of_sites));
		wss_connect.send(JSON.stringify(list_of_orgs));
		$('#advanced-search').modal("toggle");
	} catch(err) {
		console.log(err);
		// Add PMS here
	}

}

function getEmployeeContact(){
	try {
		let employee_details = {
			'type': 'loadAllDewslContacts'
		};
		wss_connect.send(JSON.stringify(employee_details));
	} catch(err) {
		console.log(err);
		// Add PMS here
	}
}

function getCommunityContact(){
	try {
		let community_details = {
			'type': 'loadAllCommunityContacts'
		};
		wss_connect.send(JSON.stringify(community_details));
	} catch(err) {
		console.log(err);
		// Add PMS here
	}
}

function getQuickEmployeeSelection () {
	// requestTag = {
	// 	'type':'smsloadrequesttag',
	// 	'teams': dynaTags
	// }
	// conn.send(JSON.stringify(requestTag));
	// $('#main-container').removeClass('hidden');
}

function displaySitesSelection(data) {
	let sitenames = data;
	let sitename, site_id, psgc;
	
	for (var i = 0; i < sitenames.length; i++) {
		var modIndex = i % 6;
		$("#sitenames-"+i).empty();

		sitename = sitenames[i].site_code;
		site_id = sitenames[i].site_id;
		psgc = sitenames[i].psgc;
		$("#sitenames-"+modIndex).append('<div class="checkbox"><label><input name="sitenames" id="id_'+psgc+'" type="checkbox" value="'+site_id+'">'+sitename.toUpperCase()+'</label></div>');
	}
}

function startConversation(details) {
	try {
		let convo_details = {
			type: 'loadSmsConversation',
			data: details
		};
		wss_connect.send(JSON.stringify(convo_details));
	} catch(err) {
		console.log(err);
		// Add PMS here
	}	
}

function displayQuickInboxMain(msg_data) {
	try {
		try {
			for (let counter = 0; counter < msg_data.length; counter++) {
				msg_data[counter].isunknown = 0;
				quick_inbox_registered.unshift(msg_data[counter]);	
			}
			
		} catch(err) {
			console.log(err);
		}

		quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_registered});
		$("#quick-inbox-display").html(quick_inbox_html);
		$("#quick-inbox-display").scrollTop(0);
	} catch (err) {
		console.log(err);
		//Add PMS here
	}
}

function displayOrgSelection(data){
	let offices = data;
	let office, office_id;

	for (var i = 0; i < offices.length; i++) {
		var modIndex = i % 5;
		$("#offices-"+i).empty();

		office = offices[i].org_name;
		office_id = offices[i].org_id;
		$("#offices-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+office+'" name="orgs" class="form-group" value="'+office+'">'+office.toUpperCase()+'</label></div>');
	}
}

function displayContactSettingsMenu() {
	$('#employee-contact-wrapper').prop('hidden', true);
	$('#community-contact-wrapper').prop('hidden', true);
	$('#comm-response-contact-container_wrapper').prop('hidden',true);
	$('#emp-response-contact-container_wrapper').prop('hidden',true);
	$('#update-contact-container').prop('hidden',true);
	$('#contact-result').remove();
	// fetchSiteAndOffice();
}

function displayDataTableCommunityContacts(cmmty_contact_data){
	$('#comm-response-contact-container').DataTable({
		destroy: true,
		data: cmmty_contact_data,
		columns: [
		{ "data": "user_id", "title": "User ID"},
		{ "data": "salutation", "title": "Salutation" },
		{ "data": "firstname", "title": "Firstname"},
		{ "data": "lastname", "title": "Lastname"},
		{ "data": "middlename", "title": "Middlename"},
		{ "data": "active_status", "title": "Active Status"}
		]
	});
	$('#comm-response-contact-container').prop('hidden',false);
}

function displayDataTableEmployeeContacts(dwsl_contact_data) {
	$('#emp-response-contact-container').DataTable({
		destroy: true,
		data: dwsl_contact_data,
		columns: [
		{ "data": "user_id", "title": "User ID"},
		{ "data": "firstname", "title": "Firstname"},
		{ "data": "lastname", "title": "Lastname"},
		{ "data": "team", "title": "Team"},
		{ "data": "active_status", "title": "Active Status"}
		]
	});
	$('#emp-response-contact-container').prop('hidden',false);
}

function displaySiteSelection (sites) {
	console.log(sites);
	var column_count = 12; // 12 rows 
	$('#new-site').remove();
	for (var counter = 0; counter < column_count; counter++) {
		$('#sitenames-cc-'+counter).empty();
	}
	
	for (var i = 0; i < sites.length; i++) {
		var modIndex = i % 12;
		var site = sites[i];
		$("#sitenames-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+site.psgc_source+'" name="sites" class="form-group" value="'+site.site_code+'">'+site.site_code.toUpperCase()+'</label></div>');
		// for (var counter = 0; counter < user_sites.length; counter++) {
		// 	// TODO : OPTIMIZE BETTER LOGIC FOR THIS.
		// 	if (user_sites[counter].org_psgc_source.length < 9) {
		// 		user_sites[counter].org_psgc_source = "0"+user_sites[counter].org_psgc_source;
		// 		user_sites[counter].org_psgc_source = user_sites[counter].org_psgc_source.substring(0,user_sites[counter].org_psgc_source.length - psgc_scope_filter[parseInt(user_sites[counter].org_scope)]);
		// 		user_sites[counter].org_psgc_source = user_sites[counter].org_psgc_source.substring(1);
		// 		var flagger = parseInt(8 - user_sites[counter].org_psgc_source.length);
		// 		for (var psgc_filter_counter = 0; psgc_filter_counter < flagger;psgc_filter_counter++) {
		// 			user_sites[counter].org_psgc_source = user_sites[counter].org_psgc_source+"0";
		// 		}
		// 	} else {
		// 		var flagger = parseInt(8 - user_sites[counter].org_psgc_source.length);
		// 		user_sites[counter].org_psgc_source = user_sites[counter].org_psgc_source.substring(0,user_sites[counter].org_psgc_source.length - psgc_scope_filter[parseInt(user_sites[counter].org_scope)]);
		// 		for (var psgc_filter_counter = 0; psgc_filter_counter < flagger;psgc_filter_counter++) {
		// 			user_sites[counter].org_psgc_source = user_sites[counter].org_psgc_source+"0";
		// 		}
		// 	}
		// 	if (user_sites[counter].org_psgc_source == site.psgc_source) {
		// 		$("#sitenames-cc-"+modIndex).find(".checkbox").find("#id_"+site.psgc_source).prop('checked',true);
		// 	}
		// }
	}
	$('<div id="new-site" class="col-md-12"><a href="#" id="add-site"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Site not on the list?</a></div>').appendTo('#site-accord .panel-body');
}

function displayOrganizationSelection (orgs,user_orgs = []) {
	var column_count = 7;
	$('#new-org').remove();
	for (var counter = 0; counter < column_count; counter++) {
		$('#orgs-cc-'+counter).empty();
	}

	for (var i = 0; i < orgs.length; i++) {
		var modIndex = i % 7;
		var org = orgs[i];
		$("#orgs-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+org.org_name+'" name="orgs" class="form-group" value="'+org.org_name+'">'+org.org_name.toUpperCase()+'</label></div>');
		for (var counter = 0; counter < user_orgs.length; counter++) {
			if (user_orgs[counter].org_name.toUpperCase() == org.org_name.toUpperCase()) {
				$("#orgs-cc-"+modIndex).find(".checkbox").find("#id_"+org.org_name).prop('checked',true);
			}
		}
	}
	$('<div id="new-org" class="col-md-12"><a href="#" id="add-org"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Organization not on the list?</a></div>').appendTo('#organization-selection-div');
}

let employee_input_count = 1;
let community_input_count = 1;
function addNewMobileForEmployee () {
	$("#employee-add-number").click(function(){
		if (employee_input_count <= 4) {
			$("#mobile-div").append(
			"<div class='row'>"+
		    "<div class='col-md-4'>"+
			"<label>Mobile #:</label>"+
			"<input type='number' class='form-control employee_mobile_number' id='employee_mobile_number_"+employee_input_count+"'' name='employee_mobile_number' value='' required>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='employee_mobile_id_"+employee_input_count+"'' class='form-control employee_mobile_id' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Status:</label>"+
			"<select class='form-control' id='employee_mobile_status_"+employee_input_count+"'' class='form-control employee_mobile_status' value=''>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Priority:</label>"+
			"<select class='form-control' id='employee_mobile_priority_"+employee_input_count+"'' class='form-control employee_mobile_priority' value=''>"+
			"<option value=''>--------</option>"+
			"<option value='1'>1</option>"+
			"<option value='2'>2</option>"+
			"<option value='3'>3</option>"+
			"</select>"+
			"</div>"+
			"</div>");
			employee_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "warn");
		}
		
	});
} 

function addNewMobileForCommunity () {
	$("#community-add-number").click(function(){
		if (community_input_count <= 4) {
			$("#mobile-div-cc").append(
			"<div class='row'>"+
		    "<div class='col-md-4'>"+
			"<label>Mobile #:</label>"+
			"<input type='number' class='form-control community_mobile_number' id='community_mobile_number_"+community_input_count+"' name='community_mobile_number' value='' required>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='community_mobile_id_"+community_input_count+"' class='form-control community_mobile_id' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Status:</label>"+
			"<select class='form-control' id='community_mobile_status_"+community_input_count+"' class='form-control community_mobile_status' value=''>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Priority:</label>"+
			"<select class='form-control' id='community_mobile_priority_"+community_input_count+"' class='form-control community_mobile_priority' value=''>"+
			"<option value=''>--------</option>"+
			"<option value='1'>1</option>"+
			"<option value='2'>2</option>"+
			"<option value='3'>3</option>"+
			"</select>"+
			"</div>"+
			"</div>");
			community_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "warn");
		}
		
	});
} 

function displayConversationPanel(msg_data, full_data) {
	$('#messages').empty();
	$(".recent_activities").addClass("hidden");
	$("#main-container").removeClass("hidden");
	message_container = [];
	recipient_container = [];
	msg_data.forEach(function(data) {
		displayUpdatedMessages(data);
	});
}

function displayUpdatedMessages(data) {
	if (recipient_container.includes(data.mobile_id) != true) {recipient_container.push(data.mobile_id);}
	data.ts_received == null ? data.isYou = 1 : data.isYou = 0;
	message_container.push(data);
	messages_html = messages_template_both({'messages': message_container});
	let html_string = $('#messages').html();
	$('#messages').html(html_string+messages_html);
	$('.chat-message').scrollTop($('#messages').height());
	message_container = [];
}

function displayAddEmployeeContactMessage (msg_data) {
	console.log(msg_data);
	if(msg_data.status === true) {
		$.notify(msg_data.return_msg, "success");
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
		employee_input_count = 1;
	}else {
		$.notify(msg_data, "warn");
	}
	
}

function displayAddCommunityContactMessage (msg_data) {
	
}

function displayUpdateEmployeeDetails (employee_data) {
	console.log(employee_data);
	$("#user_id_ec").val(employee_data.contact_info.id);
	$("#salutation_ec").val(employee_data.contact_info.salutation);
	$("#firstname_ec").val(employee_data.contact_info.firstname);
	$("#middlename_ec").val(employee_data.contact_info.middlename);
	$("#lastname_ec").val(employee_data.contact_info.lastname);
	$("#nickname_ec").val(employee_data.contact_info.nickname);
	$("#birthdate_ec").val(employee_data.contact_info.birthday);
	$("#gender_ec").val(employee_data.contact_info.gender);
	$("#active_status_ec").val(employee_data.contact_info.contact_active_status);

	for (var counter = 0; counter < employee_data.email_data.length; counter++) {
		$('#email_ec').tagsinput('add',employee_data.email_data[counter].email);
	}

	for (var counter = 0; counter < employee_data.team_data.length; counter+=1) {
		$('#team_ec').tagsinput('add',employee_data.team_data[counter].team_name);
	}
}

function displayUpdateCommunityDetails (msg_data) {
	
}

function displayTeamsForEmployee () {

}
function loadSiteConversation(){
	console.log("GO HERE");
	if (quick_group_selection_flag == true) {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
		// loadGroupsEmployee();
	} else  if (quick_group_selection_flag == false) {
		$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
		siteConversation();
	} else {
		alert('Something went wrong, Please contact the Administrator');
	}
}

function siteConversation(){
	try {
		let tag_offices = [];
		$('input[name="orgs"]:checked').each(function() {
			tag_offices.push(this.value);
		});

		let tag_sites = [];
		$('input[name="sitenames"]:checked').each(function() {
			tag_sites.push(this.value);
		});
		tag_sites.sort();

		let convo_request = {
			'type': 'loadSmsForSites',
			'organizations': tag_offices,
			'sitenames': tag_sites
		};

		wss_connect.send(JSON.stringify(convo_request));
	} catch(err) {
		console.log(err);
		// Add PMS here.
	}

}

function sendSms(recipients, message) {
	try {
		let convo_details = {
			type: 'sendSmsToRecipients',
			recipients: recipients,
			message: message
		};
		wss_connect.send(JSON.stringify(convo_details));
	} catch(err) {
		console.log(err);
		// Add PMS here
	}	
}