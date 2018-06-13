let quick_group_selection_flag = false;
$(document).ready(function() {

	initializeGetQuickGroupSelection();
	initializeContactSettingsButton();
	initializeOnClickQuickInbox();
	initializeContactCategoryOnSelectDesign();
	initializeSettingsOnSelectDesign();
	initializeContactCategoryOnChange();
	initializeContactSettingsOnChange();
	initializeQuickSelectionGroupFlagOnClick();
	initializeGoChatOnClick();
	initializeGoLoadOnClick();
	initializeSendMessageOnClick();

});

function initializeGetQuickGroupSelection () {
	$('#btn-advanced-search').click(function(){
		getQuickGroupSelection();
	});
}

function initializeContactSettingsButton () {
	$('#btn-contact-settings').click(function(){
		if (connection_status === false){
			console.log("NO CONNECTION");
		} else {
			$('#contact-settings').modal("toggle");
			displayContactSettingsMenu();
			addNewMobileForEmployee();
			addNewMobileForCommunity();
			$("#contact-category").val("default").change();
			$("#settings-cmd").prop('disabled', true);
		}
	});
}

function initializeOnClickQuickInbox () {
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
}
function initializeContactCategoryOnSelectDesign () {
	$('#contact-category option').prop('selected', function() {
		$('#contact-category').css("border-color", "#d6d6d6");
		$('#contact-category').css("background-color", "inherit");
		return this.defaultSelected;
	});
}

function initializeSettingsOnSelectDesign () {
	$('#settings-cmd option').prop('selected', function() {
		$('#settings-cmd').prop('disabled',true);
		$('#settings-cmd').css("border-color", "#d6d6d6");
		$('#settings-cmd').css("background-color", "inherit");
		return this.defaultSelected;
	});
}

function initializeContactCategoryOnChange () {
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
}

function initializeContactSettingsOnChange () {
	$('#settings-cmd').on('change',function(){
		$("#mobile-div").empty();
		$("#landline-div").empty();
		$("#mobile-div-cc").empty();
		$("#landline-div").empty();
		if ($('#settings-cmd').val() != 'default') {
			$('#settings-cmd').css("border-color", "#3c763d");
			$('#settings-cmd').css("background-color", "#dff0d8");
		}else {
			$("#employee-add-number").empty();
			$("#community-add-number").empty();
		}

		if ($('#contact-category').val() == "econtacts") {
			employee_input_count = 1;
			employee_input_count_landline = 1;
			$("#settings-cmd").prop('disabled', false);
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#community-contact-wrapper').hide();
				$('#employee-contact-wrapper').show();
				emptyEmployeeContactForm();
				$("#emp-settings-cmd").show();
				$('#employee-contact-wrapper').show();
				$("#update-contact-container").hide();
			} else if ($('#settings-cmd').val() == "updatecontact") {
				$('#community-contact-wrapper').hide();
				$('#employee-contact-wrapper').hide();
				$('#email_ec').tagsinput('removeAll');
				$('#team_ec').tagsinput('removeAll');
				getEmployeeContact();
			} else {
				console.log('Invalid Request');
			}
		} else if ($('#contact-category').val() == "ccontacts") {
			community_input_count = 1;
			community_input_count_landline = 1;
			console.log(community_input_count);
			console.log(community_input_count_landline);
			$("#settings-cmd").prop('disabled', false);
			if ($('#settings-cmd').val() == "addcontact") {
				$('#emp-response-contact-container_wrapper').prop('hidden',true);
				$('#comm-response-contact-container_wrapper').prop('hidden',true);
				$('#employee-contact-wrapper').hide();
				$('#community-contact-wrapper').show();
				$('#comm-settings-cmd').show();
				$('#update-comm-contact-container').hide();
				emptyCommunityContactForm();
				$('#employee-contact-wrapper').hide();
			} else if ($('#settings-cmd').val() == "updatecontact") {
				$('#comm-response-contact-container_wrapper').hide();
				$('#employee-contact-wrapper').hide();
				$('#community-contact-wrapper').hide();
				$('#comm-settings-cmd').hide();
				$('#update-comm-contact-container').show();
				getCommunityContact();
			} else {
				console.log('Invalid Request');
			}
		} else {
			console.log('Invalid Request');
		}
	});

	$('#contact-category').on('change',function(){
		$('#community-contact-wrapper').hide();
		$('#employee-contact-wrapper').hide();
	});
}

function initializeQuickSelectionGroupFlagOnClick () {
	$('#emp-grp-flag').on('click',function(){
		quick_group_selection_flag = true;
	});

	$('#comm-grp-flag').on('click',function(){
		quick_group_selection_flag = false;
	});
}

function initializeGoChatOnClick () {
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
}

function initializeGoLoadOnClick () {
	$("#go-load-groups").click(function() {
		loadSiteConversation();
	});
}

function initializeSendMessageOnClick () {
	$("#send-msg").click(function() {
		sendSms(recipient_container,$("#msg").val());
	});
}