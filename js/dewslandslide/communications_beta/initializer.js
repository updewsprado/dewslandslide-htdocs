$(document).ready(function() {


initializeContactSuggestion($("#contact-suggestion").val());
	
});

function initializeContactSuggestion(name_query) {
	let nameSuggestionRequest = {
		'type': 'requestnamesuggestions',
		'namequery': name_query,
	};
	wss_connect.send(JSON.stringify(nameSuggestionRequest));
}

function getContactSuggestion (name_suggestion) {
	console.log($("#contact-suggestion + ul").html());
	let contact_suggestion_input = document.getElementById("contact-suggestion");
	let awesomplete = new Awesomplete(contact_suggestion_input);
	let contact_suggestion_container = [];

	name_suggestion.data.forEach(function(raw_names) {
		contact_suggestion_container.push(raw_names.fullname);
	});

	awesomplete.list = contact_suggestion_container;
}

function getQuickInboxMessages () {

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

function getQuickGroupSelection () {
	getQuickCommunitySelection();
	getQuickEmployeeSelection();
}

function getQuickCommunitySelection () {

}

function getQuickEmployeeSelection () {

}

function getQuickAcces () {
	getQASitesWithEvent();
	getQAGroupMessages();
}

function getQASitesWithEvent () {

}

function getQAGroupMessages () {

}