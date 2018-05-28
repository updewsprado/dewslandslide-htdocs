$(document).ready(function() {
	initializeContactSuggestion($("#contact-suggestion").val());
	initializeQuickInboxMessages();
	onSubmitEmployeeContactForm();
	onSubmitCommunityContactForm();
	initializeOnClickUpdateEmployeeContact();
	$(".birthdate").datetimepicker({
		locale: "en",
		format: "YYYY-MM-DD"
	});

	getEmployeeContactGroups();

});

function initializeContactSuggestion(name_query) {
	let name_suggestion_request = {
		'type': 'requestnamesuggestions',
		'namequery': name_query,
	};
	wss_connect.send(JSON.stringify(name_suggestion_request));
}

function getContactSuggestion (name_suggestion) {
	let contact_suggestion_input = document.getElementById("contact-suggestion");
	let awesomplete = new Awesomplete(contact_suggestion_input);
	let contact_suggestion_container = [];

	name_suggestion.data.forEach(function(raw_names) {
		contact_suggestion_container.push(raw_names.fullname);
	});

	awesomplete.list = contact_suggestion_container;
}

function initializeQuickInboxMessages () {
	getQuickInboxMain();
	getQuickInboxEvent();
	getQuickInboxUnregistered();
	getQuickInboxDataLogger();
}

function getQuickInboxMain() {
	let load_quick_inbox_main = {
		'type': 'smsloadquickinboxrequest'
	};
	wss_connect.send(JSON.stringify(load_quick_inbox_main));
}

function getQuickInboxEvent() {

}

function getQuickInboxUnregistered() {

}

function getQuickInboxDataLogger() {

}

function getRecentActivity () {
	getRecentlyViewedContacts();
	getRecentlyViewedSites();
	getOnRoutineSites();
}

function getRecentlyViewedContacts () {

}

function getRecentlyViewedSites () {

}

function getOnRoutineSites () {

}

function getQuickAcces () {
	getQASitesWithEvent();
	getQAGroupMessages();
}

function getQASitesWithEvent () {

}

function getQAGroupMessages () {

}

function initializeOnClickUpdateEmployeeContact () {
	$('#emp-response-contact-container').on('click', 'tr:has(td)', function(){
		$("#emp-response-contact-container_wrapper").hide();
		$("#update-contact-container").show(300);
		$("#employee-contact-wrapper").show(300);
		$("#emp-settings-cmd").hide();
		var table = $('#emp-response-contact-container').DataTable();
		var data = table.row(this).data();
		var msg = {
			'type': 'loadDewslContact',
			'data': data.user_id
		};	
		wss_connect.send(JSON.stringify(msg));
	});
}

function initializeOnClickUpdateCommunityContact () {
	
}

function getEmployeeContactGroups () {
	$('#team_ec').tagsinput({
		typeahead: {
			displayKey: 'text',
			source: function (query) {
				var group_tag = [];
				$.ajax({
					url : "../chatterbox/get_employee_contacts",
					type : "GET",
					async: false,
					success : function(data) {
						var data = JSON.parse(data);
						for (var counter = 0; counter < data.length; counter ++) {
							var raw_grouptags = data[counter].grouptags.split(",");
							for (var raw_counter = 0; raw_counter < raw_grouptags.length; raw_counter++) {
								if ($.inArray(raw_grouptags[raw_counter],group_tag) == -1) {
									group_tag.push(raw_grouptags[raw_counter]);
								}
							}
						}
					}
				});
				return group_tag;
			}
		} 
	});
}