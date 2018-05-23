$(document).ready(function() {
	initializeContactSuggestion($("#contact-suggestion").val());
	initializeQuickInboxMessages();
	onSubmitEmployeeContactForm();
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