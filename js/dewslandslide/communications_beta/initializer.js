let recipient_container = [];
$(document).ready(function() {

	setTimeout(function(){
		initializeContactSuggestion($("#contact-suggestion").val());
		initializeQuickInboxMessages();
		initializeOnClickUpdateEmployeeContact();
		initializeOnClickUpdateCommunityContact();
		getSiteSelection();
		getOrganizationSelection();
	}, 3000);

	$(".birthdate").datetimepicker({
		locale: "en",
		format: "YYYY-MM-DD"
	});

	getEmployeeContactGroups();
	initializeOnSubmitEmployeeContactForm();
	initializeOnSubmitCommunityContactForm();

});



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

function getQuickInboxMain () {
	let msg = {
		type: 'smsloadquickinboxrequest'
	}
	wss_connect.send(JSON.stringify(msg));
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
	$('#comm-response-contact-container').on('click', 'tr:has(td)', function(){
		$('#comm-response-contact-container_wrapper').hide();
		$("#update-comm-contact-container").show(300);
		$("#community-contact-wrapper").show(300);
		$("#comm-settings-cmd").hide();
		var table = $('#comm-response-contact-container').DataTable();
		var data = table.row(this).data();
		var msg = {
			'type': 'loadCommunityContact',
			'data': data.user_id
		};	
		wss_connect.send(JSON.stringify(msg));
	});
}

function getSiteSelection() {
	let msg = {
		type: 'getAllSitesConSet'
	}
	wss_connect.send(JSON.stringify(msg));
}

function getOrganizationSelection() {
	let msg = {
		type: 'getAllOrgsConSet'
	}
	wss_connect.send(JSON.stringify(msg));
}

function initializeContactSuggestion(name_query) {
	let msg = {
		'type': 'requestnamesuggestions',
		'namequery': name_query
	}
	wss_connect.send(JSON.stringify(msg));
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

function initializeOnSubmitEmployeeContactForm () {
	$('#emp-settings-cmd button[type="submit"], #sbt-update-contact-info').on('click',function(){
		employeeContactFormValidation();
	});
}

function initializeOnSubmitCommunityContactForm () {
	$('#comm-settings-cmd button[type="submit"], #sbt-update-comm-contact-info').on('click',function(){
		try{
			communityContactFormValidation();
			alert();
		} catch (e) {
			console.log(e.message);
		}
	});
}

function employeeContactFormValidation() {
	$("#employee-contact-form").validate({
        debug: true,
        rules: {
            firstname_ec: "required",
			lastname_ec: "required",
			middlename_ec: "required",
			nickname_ec: "required",
			salutation_ec: "required",
			gender_ec: "required",
			birthdate_ec: "required",
			email_ec: "required",
			active_status_ec: "required",
			team_ec: "required"
        },
        messages: { comments: "" },
        errorPlacement (error, element) {
            const placement = $(element).closest(".form-group");
            if ($(element).hasClass("cbox_trigger_switch")) {
                $("#errorLabel").append(error).show();
            } else if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            const $next_span = element.next("span");
            if (!$next_span[0]) {
                if (element.is("select") || element.is("textarea")) $next_span.css({ top: "25px", right: "25px" });
            }
        },
        success (label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
            submitEmployeeInformation();
            console.log("success");
        }
    });
}

function communityContactFormValidation () {

	$("#community-contact-form").validate({
        debug: true,
        rules: {
            firstname_cc: "required",
			lastname_cc: "required",
			middlename_cc: "required",
			nickname_cc: "required",
			salutation_cc: "required",
			gender_cc: "required",
			birthdate_cc: "required",
			active_status_cc: "required",
			ewirecipient_cc: "required"
        },
        messages: { comments: "" },
        errorPlacement (error, element) {
        	console.log("errorPlacement");
            const placement = $(element).closest(".form-group");
            if ($(element).hasClass("cbox_trigger_switch")) {
                $("#errorLabel").append(error).show();
            } else if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            const $next_span = element.next("span");
            if (!$next_span[0]) {
                if (element.is("select") || element.is("textarea")) $next_span.css({ top: "25px", right: "25px" });
            }
        },
        success (label, element) {
        	console.log("success");
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
        	console.log("highlight");
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
        	console.log("unhighlight");
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
        	console.log("submit");
        	site_selected = [];
			organization_selected = [];
			$('#site-selection-div input:checked').each(function() {
			    site_selected.push($(this).attr('value'));
			});

			$('#organization-selection-div input:checked').each(function() {
			    organization_selected.push($(this).attr('value'));
			});

			$("#org-and-site-alert").show(300);
			if (site_selected.length === 0 && organization_selected.length === 0) {
				$("#selection-feedback").text("site and organization selection");
			} else if (site_selected.length === 0) {
				$("#selection-feedback").text("site selection");
			} else if (organization_selected.length === 0) {
				$("#selection-feedback").text("organization selection");
			} else {
				$("#org-and-site-alert").hide(300);
				//success function here
				onSubmitCommunityContactForm(site_selected, organization_selected);
			}
            
        }
    });
}