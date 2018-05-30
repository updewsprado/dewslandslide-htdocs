let quick_group_selection_flag = false;
$(document).ready(function() {
	$('#btn-advanced-search').click(function(){
		getQuickGroupSelection();
	});

	$('#btn-contact-settings').click(function(){
		if (connection_status === false){
			console.log("NO CONNECTION");
		} else {
			$('#contact-settings').modal("toggle");
			displayContactSettingsMenu();
			addNewMobileForEmployee();
			addNewMobileForCommunity();
		}
	});

	$("body").on("click","#quick-inbox-display li",function(){
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

	$('#contact-category option').prop('selected', function() {
		$('#contact-category').css("border-color", "#d6d6d6");
		$('#contact-category').css("background-color", "inherit");
		return this.defaultSelected;
	});

	$('#settings-cmd option').prop('selected', function() {
		$('#settings-cmd').prop('disabled',true);
		$('#settings-cmd').css("border-color", "#d6d6d6");
		$('#settings-cmd').css("background-color", "inherit");
		return this.defaultSelected;
	});

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

	$('#settings-cmd').on('change',function(){
		if ($('#settings-cmd').val() != 'default') {
			$('#settings-cmd').css("border-color", "#3c763d");
			$('#settings-cmd').css("background-color", "#dff0d8");
		}

		if ($('#contact-category').val() == "econtacts") {
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#community-contact-wrapper').prop('hidden', true);
				$('#employee-contact-wrapper').prop('hidden', false);
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
				$("#emp-settings-cmd").show();
				$("#update-contact-container").hide();
			} else if ($('#settings-cmd').val() == "updatecontact") {
				$('#employee-contact-wrapper').prop('hidden', true);
				$('#community-contact-wrapper').prop('hidden', true);
				getEmployeeContact();
			} else {
				console.log('Invalid Request');
			}
		} else if ($('#contact-category').val() == "ccontacts") {
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#employee-contact-wrapper').prop('hidden', true);
				$('#community-contact-wrapper').prop('hidden', false);
				getSiteSelection();
				getOrganizationSelection();
			} else if ($('#settings-cmd').val() == "updatecontact") {	
				$('#employee-contact-wrapper').prop('hidden', true);
				$('#community-contact-wrapper').prop('hidden', true);
				getCommunityContact();
				getSiteSelection();
				getOrganizationSelection();
			} else {
				console.log('Invalid Request');
			}
		} else {
			console.log('Invalid Request');
		}
	});

	$('#emp-grp-flag').on('click',function(){
		quick_group_selection_flag = true;
	});

	$('#comm-grp-flag').on('click',function(){
		quick_group_selection_flag = false;
	});


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

	$("#go-load-groups").click(function() {
		loadSiteConversation();
	});

	$("#send-msg").click(function() {
		sendSms(recipient_container,$("#msg").val());
	});

});