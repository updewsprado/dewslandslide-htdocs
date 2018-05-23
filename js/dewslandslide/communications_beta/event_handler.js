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
		}
	});

	$("body").on("click","#quick-inbox-display li",function(){
		let conversation_details = {
			full_name: $(this).closest('li').find("input[type='text']").val(),
			number: $(this).closest('li').find("input[type='text']").attr("id").replace(/'/g, "")
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
			} else if ($('#settings-cmd').val() == "updatecontact") {	
				$('#employee-contact-wrapper').prop('hidden', true);
				$('#community-contact-wrapper').prop('hidden', true);
				getCommunityContact();
			} else {
				console.log('Invalid Request');
			}
		} else {
			console.log('Invalid Request');
		}
	});

});