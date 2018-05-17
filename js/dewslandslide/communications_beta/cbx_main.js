let quick_inbox_registered = [];
let quick_inbox_unregistered = [];
let quick_inbox_event = [];
let quick_inbox_data_logger = [];

function getQuickGroupSelection () {
	getQuickCommunitySelection();
	getQuickEmployeeSelection();
}

function getQuickCommunitySelection () {
	var listSites = {
		'type': "qgrSites"
	}

	var listSOrgs = {
		'type': "qgrOrgs"
	}

	wss_connect.send(JSON.stringify(listSites));
	wss_connect.send(JSON.stringify(listSOrgs));
	$('#advanced-search').modal("toggle");
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
		$("#sitenames-"+modIndex).append('<div class="checkbox"><label><input name="sitenames" id="id_'+psgc+'" type="checkbox" value="'+sitename+'">'+sitename.toUpperCase()+'</label></div>');
	}
}

function displayQuickInboxMain(msg_data) {
	try {
		var quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());
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