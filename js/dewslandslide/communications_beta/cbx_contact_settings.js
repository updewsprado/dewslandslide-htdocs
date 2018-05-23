function onSubmitEmployeeContactForm () {
	$('#emp-settings-cmd button[type="submit"]').on('click',function(){
		const save_type = $("#settings-cmd").val();
		let message_type = null;
		contact_data = {
			"id": $("#ec_id").val(),
			"firstname": $("#firstname_ec").val(),
			"lastname": $("#lastname_ec").val(),
			"middlename": $("#middlename_ec").val(),
			"nickname": $("#nickname_ec").val(),
			"salutation": $("#salutation_ec").val(),
			"gender": $("#gender_ec").val(),
			"birthdate": $("#birthdate_ec").val(),
			"email_address": $("#email_ec").val(),
			"teams": $("#team_ec").val(),
			"contact_active_status": $("#active_status_ec").val(),
			"numbers": 8888,
			"landline": 9999
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

function onResetEmployeeContactForm () {

}

function getGroupTags () {

}