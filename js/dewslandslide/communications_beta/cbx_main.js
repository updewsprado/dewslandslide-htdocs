let quick_inbox_registered = [];
let quick_inbox_unregistered = [];
let quick_inbox_event = [];
let quick_inbox_data_logger = [];
let chatterbox_user = "You";
let message_container = [];
let conversation_recipients = [];
let current_user_id = $("#current_user_id").val();

let employee_input_count = 1;
let employee_input_count_landline = 1;
let community_input_count = 1;
let community_input_count_landline = 1;
<<<<<<< Updated upstream
let latest_conversation_timestamp = "";
=======
let psgc_scope_filter = [0,0,6,4,2];
>>>>>>> Stashed changes

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

function displaySiteSelection (sites,psgc_source = []) {
	console.log(sites);
	var column_count = 12; // 12 rows 
	$('#new-site').remove();
	for (var counter = 0; counter < column_count; counter++) {
		$('#sitenames-cc-'+counter).empty();
	}
	// console.log(psgc_source[1].psgc);
	for (var i = 0; i < sites.length; i++) {
		var modIndex = i % 12;
		var site = sites[i];
		$("#sitenames-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+site.psgc_source+'" name="sites" class="form-group site-checkbox" value="'+site.site_code+'">'+site.site_code.toUpperCase()+'</label></div>');

		for (var counter = 0; counter < psgc_source.length; counter++) {
			// TODO : OPTIMIZE BETTER LOGIC FOR THIS.
			if (psgc_source[counter].org_psgc_source.length < 9) {
				psgc_source[counter].org_psgc_source = "0"+psgc_source[counter].org_psgc_source;
				psgc_source[counter].org_psgc_source = psgc_source[counter].org_psgc_source.substring(0,psgc_source[counter].org_psgc_source.length - psgc_scope_filter[parseInt(psgc_source[counter].org_scope)]);
				psgc_source[counter].org_psgc_source = psgc_source[counter].org_psgc_source.substring(1);
				var flagger = parseInt(8 - psgc_source[counter].org_psgc_source.length);
				for (var psgc_filter_counter = 0; psgc_filter_counter < flagger;psgc_filter_counter++) {
					psgc_source[counter].org_psgc_source = psgc_source[counter].org_psgc_source+"0";
				}
			} else {
				var flagger = parseInt(8 - psgc_source[counter].org_psgc_source.length);
				psgc_source[counter].org_psgc_source = psgc_source[counter].org_psgc_source.substring(0,psgc_source[counter].org_psgc_source.length - psgc_scope_filter[parseInt(psgc_source[counter].org_scope)]);
				for (var psgc_filter_counter = 0; psgc_filter_counter < flagger;psgc_filter_counter++) {
					psgc_source[counter].org_psgc_source = psgc_source[counter].org_psgc_source+"0";
				}
			}
			if (psgc_source[counter].org_psgc_source == site.psgc_source) {
				$("#sitenames-cc-"+modIndex).find(".checkbox").find("#id_"+site.psgc_source).prop('checked',true);
			}
		}
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
		$("#orgs-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+org.org_name+'" name="orgs" class="form-group organization-checkbox" value="'+org.org_name+'">'+org.org_name.toUpperCase()+'</label></div>');
		for (var counter = 0; counter < user_orgs.length; counter++) {
			if (user_orgs[counter].org_name.toUpperCase() == org.org_name.toUpperCase()) {
				$("#orgs-cc-"+modIndex).find(".checkbox").find("#id_"+org.org_name).prop('checked',true);
			}
		}
	}
	$('<div id="new-org" class="col-md-12"><a href="#" id="add-org"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Organization not on the list?</a></div>').appendTo('#organization-selection-div');
}

function displayConversationPanel(msg_data, full_data, recipients) {
	conversation_recipients = [];
	recipients.forEach(function(user){
		conversation_recipients.push(user.user_id);
	});
	$('#messages').empty();
	$(".recent_activities").addClass("hidden");
	$("#main-container").removeClass("hidden");
	message_container = [];
	recipient_container = [];
	recipients.forEach(function(mobile_data){
		if (recipient_container.includes(mobile_data.mobile_id) != true) {recipient_container.push(mobile_data.mobile_id);}
	});
	msg_data.reverse();
	msg_data.forEach(function(data) {
		displayUpdatedMessages(data);
	});
}

function displayUpdatedMessages(data) {
	console.log(data);
	latest_conversation_timestamp = data.ts_written;
	data.ts_received == null ? data.isYou = 1 : data.isYou = 0;
	message_container.unshift(data);
	messages_html = messages_template_both({'messages': message_container});
	let html_string = $('#messages').html();
	$('#messages').html(html_string+messages_html);
	$('.chat-message').scrollTop($('#messages').height());
	message_container = [];
}

function displayAddEmployeeContactMessage (msg_data) {
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
		$("#landline-div").empty();
		employee_input_count = 1;
		employee_input_count_landline = 1;
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

function displayUpdateCommunityDetails (community_data) {
	console.log(community_data);
	let user_orgs = [];
	$("#user_id_cc").val(community_data.contact_info.id);
	$("#salutation_cc").val(community_data.contact_info.salutation);
	$("#firstname_cc").val(community_data.contact_info.firstname);
	$("#middlename_cc").val(community_data.contact_info.middlename);
	$("#lastname_cc").val(community_data.contact_info.lastname);
	$("#nickname_cc").val(community_data.contact_info.nickname);
	$("#birthdate_cc").val(community_data.contact_info.birthday);
	$("#gender_cc").val(community_data.contact_info.gender);
	$("#active_status_cc").val(community_data.contact_info.contact_active_status);
	// if (community_data.ewi_data[0].ewi_status === "Active") {
	// 	$("#ewirecipient_cc").val(1);
	// }else {
	// 	$("#ewirecipient_cc").val(0);
	// }

	displaySiteSelection(community_data.list_of_sites, community_data.org_data);
	displayOrganizationSelection(community_data.list_of_orgs, community_data.org_data);
}

function displayTeamsForEmployee () {

}

function loadSiteConversation(){
	if (quick_group_selection_flag == true) {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
		// loadGroupsEmployee();
	} else  if (quick_group_selection_flag == false) {
		$("#modal-select-grp-tags").find(".checkbox").find("value").prop('checked', false);
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

function updateConversationBubble(msg_response) {
	message_container = [];
	displayUpdatedMessages(msg_response);
	$("#msg").val("");
	$("#msg").text("");
}

function updateSmsInbox(data) {
	data[0].isunknown = 0;
	displayQuickInboxMain(data);
}

function updateSmsConversationBubble(data) {
	if ($.inArray(data[0].user_id,conversation_recipients) != -1 ) {
		let msg_container = {
			user: data[0].full_name,
			convo_id: data[0].sms_id,
			gsm_id: data[0].gsm_id,
			isYou: 0,
			mobile_id: data[0].mobile_id,
			read_status: 0,
			send_status: null,
			sms_msg: data[0].msg,
			timestamp: data[0].ts_received,
			ts_received: data[0].ts_received,
			ts_sent: null,
			web_status: null
		};
		displayUpdatedMessages(msg_container);		
	} 
}

function updateSmsoutboxConversationBubble(data) {
	console.log($("#messages li:last #chat-user").text());
	if ($("#messages li:last #chat-user").text() == "You" && $("#messages li:last #timestamp-written").text() == latest_conversation_timestamp) {
		$("#messages li:last #timestamp-sent").html(data.ts_sent);
	}
}