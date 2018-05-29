function onSubmitEmployeeContactForm () {
	$('#emp-settings-cmd button[type="submit"], #sbt-update-contact-info').on('click',function(){
		const save_type = $("#settings-cmd").val();
		let message_type = null;
		let team_inputted = $("#team_ec").val();
		let email_inputted = $("#email_ec").val();
		let mobile_numbers = [];

		for (let counter = 1; counter < employee_input_count; counter +=1) {
			const mobile_number_raw = {
				"id": current_user_id,
				"mobile_number": $("#employee_mobile_number_"+counter).val(),
				"mobile_status": $("#employee_mobile_status_"+counter).val(),
				"mobile_priority": $("#employee_mobile_priority_"+counter).val()
			};
			mobile_numbers.push(mobile_number_raw);
		}
		console.log($("#salutation_ec").attr("id"));
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
			"numbers": mobile_numbers
		}
		
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
	});
}

function onSubmitCommunityContactForm () {
	$('#comm-settings-cmd button[type="submit"]').on('click',function(){
		const save_type = $("#settings-cmd").val();
		let message_type = null;
		let mobile_numbers = [];

		for (let counter = 1; counter < community_input_count; counter +=1) {
			const mobile_number_raw = {
				"id": current_user_id,
				"mobile_number": $("#community_mobile_number_"+counter).val(),
				"mobile_status": $("#community_mobile_status_"+counter).val(),
				"mobile_priority": $("#community_mobile_priority_"+counter).val()
			};
			mobile_numbers.push(mobile_number_raw);
		}


		contact_data = {
			"user_id": current_user_id,
			"salutation": $("#salutation_cc").val(),
			"firstname": $("#firstname_cc").val(),
			"middlename": $("#middlename_cc").val(),
			"lastname": $("#lastname_cc").val(),
			"nickname": $("#nickname_cc").val(),
			"birthdate": $("#birthdate_cc").val(),
			"gender": $("#gender_cc").val(),
			"contact_active_status": $("#active_status_cc").val(),
			"ewi_recipient": $("#ewirecipient_cc").val(),
			"numbers": mobile_numbers
		}

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
	});
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