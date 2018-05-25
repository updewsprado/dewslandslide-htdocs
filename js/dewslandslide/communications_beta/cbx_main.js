let quick_inbox_registered = [];
let quick_inbox_unregistered = [];
let quick_inbox_event = [];
let quick_inbox_data_logger = [];
let chatterbox_user = "You";
let message_container = [];

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

let employee_input_count = 0;
let community_input_count = 0;
function addNewMobileForEmployee () {
	$("#employee-add-number").click(function(){
		if (employee_input_count <= 3) {
			$("#mobile-div").append(
			"<div class='row'>"+
		    "<div class='col-md-4' title='Notes: If contact number is more than one seprate it by a comma.'>"+
			"<label for='mobile_ec_'>Mobile #:</label>"+
			"<input type='text' class='form-control' id='mobile_cc_' name='mobile_cc_' value='' required>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='mobile_cc_id_' class='form-control' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Status:</label>"+
			"<select class='form-control' id='mobile_cc_status_' class='form-control' value=''>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Priority:</label>"+
			"<input type='text' id='mobile_cc_priority_' class='form-control' value=''>"+
			"</div>"+
			"</div>");
			employee_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "err");
		}
		
	});
} 

function addNewMobileForCommunity () {
	$("#community-add-number").click(function(){
		if (community_input_count <= 3) {
			$("#mobile-div-cc").append(
			"<div class='row'>"+
		    "<div class='col-md-4' title='Notes: If contact number is more than one seprate it by a comma.'>"+
			"<label for='mobile_ec_'>Mobile #:</label>"+
			"<input type='text' class='form-control' id='mobile_cc_' name='mobile_cc_' value='' required>"+
			"</div>"+
			"<div class='col-md-4' hidden>"+
			"<label>Mobile ID #:</label>"+
			"<input type='text' id='mobile_cc_id_' class='form-control' value='' disabled>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Status:</label>"+
			"<select class='form-control' id='mobile_cc_status_' class='form-control' value=''>"+
			"<option value='1'>Active</option>"+
			"<option value='0'>Inactive</option>"+
			"</select>"+
			"</div>"+
			"<div class='col-md-4'>"+
			"<label>Mobile # Priority:</label>"+
			"<input type='text' id='mobile_cc_priority_' class='form-control' value=''>"+
			"</div>"+
			"</div>");
			community_input_count +=1;
		} else {
			$.notify("Reach the maximum entry for mobile number", "err");
		}
		
	});
} 

function displayConversationPanel(msg_data, full_data) {
	$('#messages').empty();
	$(".recent_activities").addClass("hidden");
	$("#main-container").removeClass("hidden");
	message_container = [];
	msg_data.forEach(function(data) {
		displayUpdatedMessages(data);
	});
}

function displayUpdatedMessages(data) {
	data.ts_received == null ? data.isYou = 1 : data.isYou = 0;
	message_container.push(data);
	messages_html = messages_template_both({'messages': message_container});
	console.log(message_container);
	let html_string = $('#messages').html();
	$('#messages').html(html_string+messages_html);
	$('.chat-message').scrollTop($('#messages').height());
	message_container = [];
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


	// displayGroupTagsForThread(tagOrgs,tagSitenames);

	// $('#user').val('You');
	// $('#messages').html('');
	// messages = [];
	// contactInfo = "groups";
	// $('#main-container').removeClass('hidden');
}