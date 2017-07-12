var data_timestamp;
var latest_release_id;
function sendViaAlertMonitor(dashboard_data){
	if (($("#ewi-asap-modal").data('bs.modal') || {}).isShown == true) {
		var internal_alert = "";
		var backbone_message = "";
		var recommended_response = "";
		var alertLevel = dashboard_data.alert_level;
		if (alertLevel.length == 2 && alertLevel.indexOf("A") != -1) {
			alertLevel = alertLevel.replace("A","Alert ");
		}

		if (dashboard_data.internal_alert != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getkeyinputviatriggertype",
				async: false,
				data: {trigger_type : dashboard_data.internal_alert},
				success: function(response){
					internal_alert = JSON.parse(response);
				}
			});
		}

		if (dashboard_data.alert_status != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getbackboneviastatus",
				async: false,
				data: {alert_status : dashboard_data.alert_status},
				success: function(response){
					backbone_message = JSON.parse(response);
				}
			});
		}

		if (alertLevel != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getrecommendedresponse",
				async: false,
				data: {recommended_response : alertLevel},
				success: function(response){
					recommended_response = JSON.parse(response);
					for (var counter = 0; counter < recommended_response.length; counter++) {
						if (recommended_response[counter].alert_status == dashboard_data.alert_status) {
							recommended_response = recommended_response[counter];
						}
					}
				}
			});
		}

		var final_template = backbone_message[0].template;

		var d = new Date();
		var current_meridiem = d.getHours();

		if (current_meridiem >= 13 && current_meridiem <= 18) {
			final_template = final_template.replace("(greetings)","hapon");
		} else if (current_meridiem >= 18 && current_meridiem <=23) {
			final_template = final_template.replace("(greetings)","gabi");
		} else if (current_meridiem >= 0 && current_meridiem <= 3) {
			final_template = final_template.replace("(greetings)","gabi");
		} else if (current_meridiem >= 4 && current_meridiem <= 11) {
			final_template = final_template.replace("(greetings)","umaga");
		} else {
			final_template = final_template.replace("(greetings)","tanghali");
		}

		final_template = final_template.replace("(alert_level)",dashboard_data.alert_level);
		var ewiLocation = dashboard_data["sitio"]+", "+dashboard_data["barangay"]+", "+dashboard_data["municipality"]+", "+dashboard_data["province"];
		var formatSbmp = ewiLocation.replace("null","");
		if (formatSbmp.charAt(0) == ",") {
			formatSbmp = formatSbmp.substr(1);
		}

		final_template = final_template.replace("(site_location)",formatSbmp);
		final_template = final_template.replace("(recommended_response)",recommended_response.key_input);
		final_template = final_template.replace("(technical_info)",internal_alert.key_input);

		var currentTime = moment().format("YYYY-MM-DD HH:mm");
		if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 00:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag 07:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","04:00 AM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag 07:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","08:00 AM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag 11:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","12:00 NN");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag 3:30 PM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","04:00 PM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","bukas");

			final_template = final_template.replace("(next_ewi_time)","08:00 PM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').add(24, "hours").format("YYYY-MM-DD")+" 00:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
			final_template = templfinal_templateate.replace("(gndmeas_date_submission)","bukas");

			final_template = final_template.replace("(next_ewi_time)","12:00 MN");
			final_template = final_template.replace("(next_ewi_date)","bukas ng");
		} else {
			alert("Error Occured: Please contact Administrator");
		}
		final_template = final_template.replace("(current_date_time)",moment(dashboard_data.data_timestamp).format('LL')+" "+moment(dashboard_data.data_timestamp).format('HH:mm A'));
		$('#msg').val(final_template);
		$('#site-abbr').val(dashboard_data["name"]);
	} else {
		var alert_site_name = "";
		var alert_level = "";
		if (dashboard_data.name == "msu" || dashboard_data.name == "msl") {
			alert_site_name = "mes";
		} else {
			alert_site_name = dashboard_data.name;
		}
		alert_level = dashboard_data.internal_alert_level.split('-')[0];
		if (alert_level.length == 2) {
			alert_level = "Alert "+alert_level[1];
		}

		$.ajax({
			type: "POST",
			url: "../chatterbox/getCommunityContactViaDashboard/",
			async: true,
			data: {site: alert_site_name},
			success: function(response){

				var contacts = JSON.parse(response);
				var default_recipients = [];
				var additional_recipients = [];

				$('#ewi-recipients-dashboard').tagsinput('removeAll');
				$('#ewi-recipients-dashboard').val('');

				for (var counter = 0; counter < contacts.length; counter++) {
					var numbers = contacts[counter].number.split(',');
					var number = "";
					var temp = "";

					if (contacts[counter].ewirecipient != 0) {
						numbers.forEach(function(x) {
							temp = temp+"|"+x;
							number = temp;
						});
						if (dashboard_data.status == "extended") {
							if (contacts[counter].office != "PLGU" && contacts[counter].office != "GDAPD-PHIV") {
								var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
								default_recipients.push(detailed);
								$('#ewi-recipients-dashboard').tagsinput('add',detailed);
							}
						} else {
							if (contacts[counter].office != "GDAPD-PHIV") {
								var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
								default_recipients.push(detailed);
								$('#ewi-recipients-dashboard').tagsinput('add',detailed);
							}
						}
					} else {
						numbers.forEach(function(x) {
							temp = temp+"|"+x;
							number = temp;
						});
						var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
						additional_recipients.push(detailed);
					}
				}
				$('#default-recipients').val(default_recipients);
				$('#additional-recipients').val(additional_recipients);
			}
		});

		$('#constructed-ewi-amd').prop("disabled", true );
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-warning');
		$('#edit-btn-ewi-amd').text("Edit");
		$('#edit-btn-ewi-amd').val("edit");
		$('#event_details').val(JSON.stringify(dashboard_data));
		var alertLevel = dashboard_data.internal_alert_level.split('-')[0];
		var alertTrigger = dashboard_data.internal_alert_level.split('-')[1];
		$.ajax({
			type: "POST",
			url: "../communications/getkeyinputviatriggertype",
			async: true,
			data: {trigger_type:alertTrigger},
			success: function(data) {
				console.log(data);
				if (data != null) {
					var techInfo = JSON.parse(data);
				}
				$.ajax({
					type: "POST",
					url: "../communications/getbackboneviastatus",
					async: true,
					data: {alert_status: techInfo.alert_status},
					success: function(data) {
						var backboneMessage = JSON.parse(data);

						if (alertLevel.length == 2 && alertLevel.indexOf("A") != -1) {
							alertLevel = alertLevel.replace("A","Alert ");
						}

						$.ajax({
							type: "POST",
							url: "../communications/getrecommendedresponse",
							async: true,
							data: {recommended_response: alertLevel},
							success: function(data) {
								var recommendedResponse = JSON.parse(data);
								var template = "";
								var level;

								if (recommendedResponse[0].alert_symbol_level.match(/\d+/g)) {
									level = recommendedResponse[0].alert_symbol_level[recommendedResponse[0].alert_symbol_level.length-1];
								}
								for (var counter = 0;counter < backboneMessage.length; counter++) {
									if (backboneMessage[counter].alert_status.indexOf(level) == -1 && level == 3) {
										template = backboneMessage[counter].template;
									} else {
										template = backboneMessage[counter].template;
										break;
									}
								}
								for (var counter = 0;counter < backboneMessage.length;counter++) {
									if (backboneMessage[counter].alert_status.toLowerCase() == dashboard_data.status) {
										template = backboneMessage[counter].template;
										switch(dashboard_data.day) {
											case 0:
											template = template.replace('(nth-day-extended)','3');
											break;
											case 1:
											template = template.replace('(nth-day-extended)','1st');
											break;
											case 2:
											template = template.replace('(nth-day-extended)','2nd');
											break;
											case 3:
											template = template.replace('(nth-day-extended)','3rd');
											break;
										}
									}
								}

								var d = new Date();
								var current_meridiem = d.getHours();

								if (current_meridiem >= 13 && current_meridiem <= 18) {
									template = template.replace("(greetings)","hapon");
								} else if (current_meridiem >= 18 && current_meridiem <=23) {
									template = template.replace("(greetings)","gabi");
								} else if (current_meridiem >= 0 && current_meridiem <= 3) {
									template = template.replace("(greetings)","gabi");
								} else if (current_meridiem >= 4 && current_meridiem <= 11) {
									template = template.replace("(greetings)","umaga");
								} else {
									template = template.replace("(greetings)","tanghali");
								}

								template = template.replace("(alert_level)",alert_level);
								var ewiLocation = dashboard_data["sitio"]+", "+dashboard_data["barangay"]+", "+dashboard_data["municipality"]+", "+dashboard_data["province"];
								var formatSbmp = ewiLocation.replace("null","");
								if (formatSbmp.charAt(0) == ",") {
									formatSbmp = formatSbmp.substr(1);
								}

								template = template.replace("(site_location)",formatSbmp);
								if (techInfo.key_input.substring(0,4) == " at ") {
									techInfo.key_input = techInfo.key_input.substring(4);
								}

								template = template.replace("(technical_info)",techInfo.key_input);
								template = template.replace("(recommended_response)",recommendedResponse[0].key_input);

								var currentTime = moment().format("YYYY-MM-DD HH:mm");

								var release_time = moment(dashboard_data.data_timestamp).format("YYYY-MM-DD hh:mm A");
								var onset_time = moment(dashboard_data.event_start).format("YYYY-MM-DD hh:mm A");

								data_timestamp = dashboard_data.data_timestamp;
								latest_release_id = dashboard_data.latest_release_id;

								if (onset_time != release_time) {
									var meridiem = moment(dashboard_data.data_timestamp).add(30,'m').format("hh:mm A");
									if (meridiem == "12:00 AM") {
										meridiem = meridiem.replace("AM","MN");
									} else if (meridiem == "12:00 PM") {
										meridiem = meridiem.replace("PM","NN");
									}

									var current_time = moment().format('LL');
									template = template.replace("(current_date_time)",current_time+" "+meridiem);
								} else {
									var meridiem = moment(dashboard_data.event_start).format("hh:mm A");
									if (meridiem.slice(-8) == "12:00 AM") {
										meridiem = meridiem.replace("AM","MN");
									}
									else if (meridiem.slice(-8) == "12:00 PM") {
										meridiem = meridiem.replace("PM","NN");
									}

									var current_time = moment().format('LL');
									template = template.replace("(current_date_time)",current_time+" "+meridiem);
								}

								if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 00:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag 07:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","04:00 AM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag 07:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","08:00 AM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag 11:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","12:00 NN");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag 3:30 PM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","04:00 PM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
									template = template.replace("(gndmeas_date_submission)","bukas");

									template = template.replace("(next_ewi_time)","08:00 PM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').add(24, "hours").format("YYYY-MM-DD")+" 00:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
									template = template.replace("(gndmeas_date_submission)","bukas");

									template = template.replace("(next_ewi_time)","12:00 MN");
									template = template.replace("(next_ewi_date)","bukas ng");
								} else {
									alert("Error Occured: Please contact Administrator");
								}
								$('#msg').val(template);
								$('#site-abbr').val(dashboard_data["name"]);
								$('#constructed-ewi-amd').val(template);
								$('#ewi-asap-modal').modal('toggle');
							}
						});
					}
				});
			}
		});
	}
}

$(document).ready(function() {

	var user, contactnum;
	var contactnumTrimmed = [];
	var contactInfo;
	var contactname;
	var contactSuggestions;
	var contactsList = [];
	var messages = [];
	var searchResults = [];
	var quick_inbox_registered = [];
	var quick_inbox_unknown = [];
	var quick_release = [];
	var temp, tempMsg, tempUser, tempRequest;
	var msgType;
	var WSS_CONNECTION_STATUS = -1;
	var isFirstSuccessfulConnect = true;
	var officesAndSites;
	var employeeTags = [];
	var groupTags = [];
	var testName;
	var testNumbers;
	var multiContactsList = [];
	var timerID = 0;
	var ewirecipients;
	var lastMessageTimeStamp="";
	var lastMessageTimeStampYou="";
	var ewiFlagger = false; 
	var convoFlagger = false;
	var connection_status = true;
	var conn = connectWS();
	var quickGroupSelectionFlag = false;
	var delayReconn = 10000;
	var gsmTimestampIndicator = "";
	var gintags_msg_details;
	var tagger_id = "";
	var temp_ewi_template_holder = "";
	var temp_msg_holder = "";
	var socket = "";
	var narrative_recipients = [];
	var tag_indicator = "";

	if (window.location.host != "www.dewslandslide.com") {
		$.notify('This is a test site: https://'+window.location.host,{autoHideDelay: 100000000});
	}

	$.get( "../generalinformation/initialize", function( data ) {
	});

	$('#ewi-recipients-dashboard').on('beforeItemRemove', function(event) {
		var def_val = $('#default-recipients').val().split(',');
		if ($.inArray(event.item, def_val) != -1) {
			$.notify("You cannot remove default recipients.","info");
			event.cancel = true;
		}
	});

	try {
		var footer = "\n\n-" + first_name + " from PHIVOLCS-DYNASLOPE";
		var remChars = 800 - $("#msg").val().length - footer.length;

		$("#remaining_chars").text(remChars);
		$("#msg").attr("maxlength", remChars);

		var messages_template_both = Handlebars.compile($('#messages-template-both').html());
		var selected_contact_template = Handlebars.compile($('#selected-contact-template').html());
		var quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());
		var quick_release_template = Handlebars.compile($('#quick-release-template').html());
		var ewi_template = Handlebars.compile($('#ewi_template').html());

	} catch (err) {
		console.log(err);
		console.log("Chatterbox : monitoring dashboard mode");
	}

	function setTargetTime(hour, minute) {
		var t = new Date();
		t.setHours(hour);
		t.setMinutes(minute);
		t.setSeconds(0);
		t.setMilliseconds(0);

		return t;
	}

	function updateRemainingCharacters() {
		remChars = 800 - $("#msg").val().length - footer.length;
		$("#remaining_chars").text(remChars);
	}

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	function updateMessages(msg) {
		$('#search-key').hide();

		if (msg.user == "You") {

			msg.isyou = 1;

			if (contactInfo == "groups") {
				if (msg.type == "loadEmployeeTag") {
					messages.push(msg);
				} else {
					if (msgType == "smsloadrequestgroup") {
						messages.push(msg);
					} else {
						searchResults.push(msg);
					}
					if(arraysEqual(msg.offices, groupTags.offices)) {
						if (msgType == "searchMessageGroup") {
							searchResults.push(msg);
						} else {
							if (msg.sitenames != undefined|| groupTags.sitenames != undefined){
								if (arraysEqual(msg.sitenames.sort(), groupTags.sitenames)) {
									messages.push(msg);
								}
							}
							else {
								messages.push(msg);
							}
						}
					}
				}
			} 
			else {
				if (msgType == "smsloadrequestgroup") {
					return;
				}
				if (msgType == "searchMessage" || msgType == "smsLoadSearched") {
					searchResults.push(msg);
				} else if (msgType == "searchMessageGlobal"){
					searchResults.push(msg);
				} else {
					messages.push(msg);
				}
			}
		} else {
			if (contactInfo == "groups") {

				if (msg.type == "loadEmployeeTag") {
					msg.isyou = 0;
					messages.push(msg);	
				} else {

					if (msg.name == "unknown") {
						return;
					}

					var isTargetSite = false;
					for (i in groupTags.sitenames) {
						if (msg.name == null || msg.msg != null) {
							msg.isyou = 0;
							msg.user = "PASALOAD REQUEST";
							isTargetSite = true;
							continue;
						} else {
							if ((msg.name.toUpperCase()).indexOf(groupTags.sitenames[i].toUpperCase()) >= 0) {
								isTargetSite = true;
								continue;
							}	
						}
					}

					if (isTargetSite == false) {
						return;
					}

					var isOffices = false;
					for (i in groupTags.offices) {
						if (msg.name == null){
							msg.name = "PASALOAD REQUEST";
							isOffices = true;
							continue;
						} else {
							if ((msg.name.toUpperCase()).indexOf(groupTags.offices[i].toUpperCase()) >= 0) {
								isOffices = true;
								continue;
							}	
						}	
					}

					if (isOffices == false) {
						return;
					}

					if (msg.type == "searchMessageGroup" || msg.type == "smsLoadGroupSearched") {
						msg.isyou = 0;
						msg.user = msg.name;
						searchResults.push(msg);
					} else {
						msg.isyou = 0;
						msg.user = msg.name;
						messages.push(msg);	
					}
				}

			} else {
				for (i in contactInfo) {
					if (msg.type == "searchMessage" || msg.type == "searchMessageGroup" ||
						msg.type == "smsLoadGroupSearched" || msg.type == "smsLoadSearched" || msg.type == "smsloadGlobalSearched"){

						if (contactInfo[i].numbers.search(trimmedContactNum(msg.user)) >= 0) {
							msg.isyou = 0;
							msg.user = contactInfo[i].fullname;
							searchResults.push(msg);
							break;
						}
					} else {
						if (contactInfo[i].numbers.search(trimmedContactNum(msg.user)) >= 0) {
							msg.isyou = 0;
							msg.user = contactInfo[i].fullname;
							messages.push(msg);
							break;
						}
					}
				}
			}
		}

		if (ewiFlagger == false && !(msg.type == "oldMessages" || msg.type == "oldMessagesGroup") &&
			!(msg.type == "searchMessage" || msg.type == "searchMessageGroup" || msg.type == "searchMessageGlobal")){

			try {
				if (messages[counters]['user'] == 'You') {
					if (lastMessageTimeStampYou == "") {
						lastMessageTimeStampYou = messages[counters]['timestamp'];
					}
				} else {
					if (lastMessageTimeStamp == "") {
						lastMessageTimeStamp = messages[counters]['timestamp'];
					}
				}
				if (msg.type == "smssend" || msg.type == "smssendgroup" || msg.type == "smssendgroupemployee") {
					var messages_html = messages_template_both({'messages': messages});
					var htmlString = $('#messages').html();
					$('#messages').html(htmlString+messages_html);
					$('.chat-message').scrollTop($('#messages').height());
					messages = [];

				} else {
					var messages_html = messages_template_both({'messages': messages});
					$('#messages').html(messages_html);
					$('.chat-message').scrollTop($('#messages').height());
				}
			} catch(err){
				console.log(err);
				console.log("Not a Scroll/Search related feature");
			}
		}
	}

	function updateQuickInbox(msg) {
		if (msg.user == "You") {
		}
		else {
			var targetInbox;
			var quick_inbox_html;
			if (msg.name == "unknown") {
				try {
					msg.isunknown = 1;
					targetInbox = "#quick-inbox-unknown-display";
					quick_inbox_unknown.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_unknown});
				} catch(err) {
				}
			}
			else {
				try {
					msg.isunknown = 0;
					targetInbox = "#quick-inbox-display";
					quick_inbox_registered.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_registered});
				} catch(err) {
				}
			}
			$(targetInbox).html(quick_inbox_html);
			$(targetInbox).scrollTop(0);
		}
	}

	function updateLatestPublicRelease(msg) {
		try {
			quick_release.unshift(msg);
			var quick_release_html = quick_release_template({'quick_release': quick_release});
			$('#quick-release-display').html(quick_release_html);
			$('#quick-release-display').scrollTop(0);
		} catch(err) {
		}
	}

	function loadMessageHistory(msg) {
		alert("loadMessageHistory!");
	}

	var counters = 0;

	function initLoadMessageHistory(msgHistory) {
		if (msgHistory['hasNull'] == true) {
			for (var i = 0; i < msgHistory['data'].length; i++){
				$('.list-ewi-recipient').append("<li class='list-group-item'><div class='checkbox'><label><input type='checkbox' name='ewi_recipients' value='"+JSON.stringify(msgHistory['data'][i])+"'>"+
					msgHistory['data'][i].office+" "+msgHistory['data'][i].sitename+" "+msgHistory['data'][i].lastname+", "+msgHistory['data'][i].firstname+
					" - "+msgHistory['data'][i].number+"</label></div></li>");
			}
			$('#ewi-recipient-update-modal').modal('toggle');
		} else {

			if (msgHistory.data == null) {
				return;
			}

			console.log("initLoadMessageHistory");
			var history = msgHistory.data;
			ewirecipients = msgHistory;
			temp = msgHistory.data;
			var msg;
			for (var i = history.length - 1; i >= 0; i--) {
				msg = history[i];
				updateMessages(msg);
				counters++;
			}
			counters = 0;
		}
	}

	$('#confirm-ewi-recipients').click(function(){
		var recipientsUpdate = [];
		$('input[name="ewi_recipients"]:checked').each(function() {
			recipientsUpdate.push(JSON.parse(this.value));
		});

		request = {'type': "updateEwiRecipients",
		'data': recipientsUpdate
	}

	console.log(recipientsUpdate);
	conn.send(JSON.stringify(request));
});

	function updateOldMessages(oldMessages){

		if (contactInfo == "groups") {
			if (oldMessages.user == "You"){
				oldMessages.isyou = 1;
				messages.push(oldMessages);
			} else {
				oldMessages.isyou = 0;
				var isTargetSite = false;
				for (i in groupTags.sitenames) {
					if ((oldMessages.name.toUpperCase()).indexOf(groupTags.sitenames[i].toUpperCase()) >= 0) {
						isTargetSite = true;
						continue;
					}
				}
				if (isTargetSite == false) {
					return;
				}
				var isOffices = false;
				for (i in groupTags.offices) {
					if ((oldMessages.name.toUpperCase()).indexOf(groupTags.offices[i].toUpperCase()) >= 0) {
						isOffices = true;
						continue;
					}
				}

				if (isOffices == false) {
					return;
				}
				oldMessages.user = oldMessages.name;
				messages.push(oldMessages);
			}
		} else {
			for (i in contactInfo) {	
				if (oldMessages.user == 'You') {
					oldMessages.isyou = 1;
					messages.push(oldMessages);
				} else {
					if (contactInfo[i].numbers.search(oldMessages.user) >= 0) {
						oldMessages.isyou = 0;
						oldMessages.user = contactInfo[i].numbers;
						messages.push(oldMessages);
					} else {
						oldMessages.isyou = 0;
						oldMessages.user = contactInfo[i].fullname;
						messages.push(oldMessages);
					}
				}
			}
		}
	}

	var tempTimestampYou;
	var tempTimestamp;

	function loadOldMessages(msg){
		counters = 0;
		lastMessageTimeStampYou = "";
		lastMessageTimeStamp = "";

		var oldMessagesIndi = msg.data;
		var oldMsg;
		messages = [];

		if (msg.data != null){
			for (var i = oldMessagesIndi.length - 1; i >= 0; i--) {
				oldMsg = oldMessagesIndi[i];
				oldMsg["type"] = msg.type;
				updateOldMessages(oldMsg);
				if (messages[counters].user == 'You'){
					if (lastMessageTimeStampYou == "") {
						lastMessageTimeStampYou = messages[counters]['timestamp'];
						tempTimestampYou = lastMessageTimeStampYou;
					}
				} else {
					if (lastMessageTimeStamp == "") {
						lastMessageTimeStamp = messages[counters]['timestamp'];
						tempTimestamp = lastMessageTimeStamp;
					}
				}
				counters++;
			}

			var htmlStringMessage = $('#messages').html();
			var messages_html = messages_template_both({'messages': messages});
			$('#messages').html(messages_html+htmlStringMessage);
			$('html, body').scrollTop(200);
		} else {
			convoFlagger = true;
			alert("End of the Conversation");
			console.log("Invalid Request/End of the Conversation");
		}
		console.log("Loading Old Messages");
	}

	function getOldMessage(){
		if (lastMessageTimeStampYou == "") {
			lastMessageTimeStampYou = tempTimestampYou;
		}

		if (lastMessageTimeStamp == "") {
			lastMessageTimeStamp = tempTimestamp;
		}

		var request = {
			'type': 'oldMessage',
			'number': contactnumTrimmed,
			'timestampYou': lastMessageTimeStampYou,
			'timestampIndi': lastMessageTimeStamp
		};

		tempTimestampYou  = lastMessageTimeStampYou;
		tempTimestamp = lastMessageTimeStamp;

		$('#user').val('You');
		messages = [];

		conn.send(JSON.stringify(request));
	}

	function getOldMessageGroup(){
		groupTags = [];
		user = "You";
		var tagOffices = [];
		$('input[name="offices"]:checked').each(function() {
			tagOffices.push(this.value);
		});

		var tagSitenames = [];
		$('input[name="sitenames"]:checked').each(function() {
			tagSitenames.push(this.value);
		});

		tagSitenames.sort();
		if (lastMessageTimeStampYou == "") {
			lastMessageTimeStampYou = tempTimestampYou;
		}

		if (lastMessageTimeStamp == "") {
			lastMessageTimeStamp = tempTimestamp;
		}

		request = {
			'type': 'oldMessageGroup',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'lastMessageTimeStampYou': lastMessageTimeStampYou,
			'lastMessageTimeStampGroup':lastMessageTimeStamp
		};

		groupTags = {
			'type': 'oldMessageGroup',
			'offices': tagOffices,
			'sitenames': tagSitenames
		};

		tempTimestampYou  = lastMessageTimeStampYou;
		tempTimestamp = lastMessageTimeStamp;

		$('#user').val('You');

		messages = [];
		contactInfo = "groups";
		conn.send(JSON.stringify(request));
	}

	function initLoadQuickInbox(quickInboxMsg) {

		if (quickInboxMsg.data == null) {
			return;
		}

		console.log("initLoadQuickInbox");
		var qiMessages = quickInboxMsg.data;
		temp = quickInboxMsg.data;
		var msg;
		for (var i = qiMessages.length - 1; i >= 0; i--) {
			msg = qiMessages[i];
			updateQuickInbox(msg);
		}
	}

	function initLoadLatestAlerts(latestAlerts){
		if (latestAlerts.data == null) {
			return;
		}

		console.log("Loading Latest Public Releases.");
		var alerts = latestAlerts.data;
		temp = latestAlerts.data;
		var msg;
		for (var i = alerts.length - 1; i >= 0; i--) {
			msg = alerts[i];
			updateLatestPublicRelease(msg);
		}
	}

	function loadOfficesAndSites(msg) {
		var offices = msg.offices;
		var sitenames = msg.sitenames;
		var office, sitename;
		for (var i = 0; i < offices.length; i++) {
			var modIndex = i % 5;

			office = offices[i];
			$("#offices-"+modIndex).append('<div class="checkbox"><label><input name="offices" type="checkbox" value="'+office+'">'+office+'</label></div>');
		}
		for (var i = 0; i < sitenames.length; i++) {
			var modIndex = i % 6;

			sitename = sitenames[i];
			$("#sitenames-"+modIndex).append('<div class="checkbox"><label><input name="sitenames" type="checkbox" value="'+sitename+'">'+sitename+'</label></div>');
		}
	}

	function connectWS() {
		console.log("trying to connect to web socket server");
		var tempConn = new WebSocket("ws://"+window.location.host+":5050");

		tempConn.onopen = function(e) {
			console.log("Connection established!");
			enableCommands();

			connection_status = true;
			WSS_CONNECTION_STATUS = 0;
			delayReconn = 10000;

			// if (isFirstSuccessfulConnect) {
			// 	getOfficesAndSitenames();
			// 	setTimeout(
			// 		function() {
			// 			getInitialQuickInboxMessages();
			// 			getLatestAlert();
			// 		}, 
			// 		500);
			// 	isFirstSuccessfulConnect = false;
			// }
			// if (window.timerID) {
			// 	window.clearInterval(window.timerID);
			// 	window.timerID = 0;
			// }
			$("#send-msg").removeClass("disabled");
		};

		tempConn.onmessage = function(e) {
			var msg = JSON.parse(e.data);
			tempMsg = msg;
			msgType = msg.type;
			if ((msg.type == "smsload") || (msg.type == "smsloadrequestgroup") || (msg.type == "loadEmployeeTag")){
				$('#loading').modal('hide');
				initLoadMessageHistory(msg);
			}  else if (msg.type == "hasNullEWIRecipient"){
				initLoadMessageHistory(msg);
			} else if (msg.type == "resumeLoading") {
				$('#ewi-recipient-update-modal').modal('toggle');
				loadGroups();
			} else if (msg.type == "oldMessage"){
				loadOldMessages(msg);
				msgType = "smsload"
			} else if (msg.type == "oldMessageGroup"){
				loadOldMessages(msg);
				msgType = "smsloadrequestgroup";
			} else if (msg.type == "searchMessage"){
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
				msgType = "searchMessage";
			} else if (msg.type == "searchMessageGlobal") {
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "searchMessageGroup") {
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
				msgType = "searchMessageGroup";
			} else if (msg.type == "searchGintags") {
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsLoadSearched" || msg.type == "smsLoadGroupSearched"){
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsloadGlobalSearched"){
				$('#loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsloadquickinbox") {
				initLoadQuickInbox(msg)
			} else if (msg.type == "latestAlerts"){
				initLoadLatestAlerts(msg);
			} else if (msg.type == "loadofficeandsites") {
				officesAndSites = msg;
				loadOfficesAndSites(officesAndSites);
			} else if (msg.type == "loadnamesuggestions") {
				contactSuggestions = msg.data;

				if (msg.data == null) {
					return;
				}

				var suggestionsArray = [];
				for (var i in msg.data) {
					var suggestion = msg.data[i].fullname.replace(/\?/g,function(){return "\u00f1"}) + 
					" - " + msg.data[i].numbers;
					suggestionsArray.push(suggestion);
				}

				comboplete.list = suggestionsArray;
			} else if (msg.type == "ewi_tagging") {
				gintags_collection = [];
				var tag = "";
				if ($('#edit-btn-ewi-amd').val() === "edit") {
					tag = "#EwiMessage";
					$("#messages li").last().addClass("tagged");
				} else if ($('#edit-btn-ewi-amd').val() === "undo"){
					tag = "#AlteredEWI";
					$("#messages li").last().addClass("tagged");
				}

				temp_msg_holder.sms_id = msg["data"][parseInt(msg["data"].length - 1)];
				updateMessages(temp_msg_holder);
				var current_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
				if (tag != "") {
					for (var i = 0; i < msg["data"].length; i++) {
						gintags = {
							'tag_name': tag,
							'tag_description': "communications",
							'timestamp': current_timestamp,
							'tagger': tagger_user_id,
							'table_element_id': msg["data"][i][0],
							'table_used': "smsoutbox",
							'remarks': ""
						}
						gintags_collection.push(gintags)
					}
					$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
					.done(function(response) {
						var event_details = JSON.parse($('#event_details').val());
						var current_recipients = $('#ewi-recipients-dashboard').tagsinput('items');
						var tagOffices = [];

						$('input[name="offices"]:checked').each(function() {
							tagOffices.push(this.value);
						});

						var raw_recipient = $('#ewi-recipients-dashboard').val().split(',');
						for (var recipient_counter = 0; recipient_counter < raw_recipient.length; recipient_counter++) {
							if ($.inArray(raw_recipient[recipient_counter].slice(0, raw_recipient[recipient_counter].indexOf(':')), narrative_recipients) == -1) {
								narrative_recipients.push(raw_recipient[recipient_counter].slice(0, raw_recipient[recipient_counter].indexOf(':')));
							}
						}

						if (narrative_recipients.length > 0 || tagOffices.length > 0) {
							if (tag == "#EwiMessage" || tag == "#AlteredEWI") {
								var narrative_template = "";

								if (narrative_recipients.length > 0) {
									narrative_recipients.forEach(function(x) {
										narrative_template = narrative_template+","+x;
									});
								} else {
									tagOffices.forEach(function(x) {
										narrative_template = narrative_template+","+x;
									});
								}

								var x = moment(data_timestamp).hour() % 1 == 0  && moment(data_timestamp).minute() == 30 ?  moment(data_timestamp).add(30,'m').format("hh:mm A") : moment(data_timestamp).format("hh:mm A");
								if(/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
								narrative_template = "Sent "+x+" EWI SMS to "+narrative_template.substring(1);
								narrative_recipients = [];
							} 
						}

						if (tag == "#EwiMessage" || tag == "#AlteredEWI") {
							var narrative_details = {
								'event_id': event_details.event_id,
								'site_id': event_details.site_id,
								'municipality': event_details.municipality,
								'province': event_details.province,
								'barangay': event_details.barangay,
								'sition': event_details.sition,
								'ewi_sms_timestamp': current_timestamp,
								'narrative_template': narrative_template
							}

							$.post( "../narrativeAutomation/insert/", {narratives: narrative_details})
							.done(function(response) {
								var start = moment().format('YYYY-MM-DD HH:mm:ss');
								var rounded_release;
								var last_rounded_release;

								if (moment(start).minute() < 30) {
									var rounded_release = moment(start).startOf('hour').format('YYYY-MM-DD HH:mm:ss');
								} else {
									var rounded_release = moment(start).add(1,'h').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
								}

								var current_release_day = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');

								if (moment(rounded_release).hour() % 4 == 0) {
									last_rounded_release = moment(rounded_release).subtract(4,'h').format('YYYY-MM-DD HH:mm:ss');
								} else {
									last_rounded_release = moment(current_release_day).add(moment(rounded_release).hour()- moment(rounded_release).hour() % 4,'h').format('YYYY-MM-DD HH:mm:ss');
								}

								var lastReleaseData = {
									'event_id': event_details.event_id,
									'current_release_time': rounded_release,
									'last_release_time': last_rounded_release
								}

								$.post("../narrativeautomation/checkack/",{last_release : lastReleaseData}).done(function(data){
									var response = JSON.parse(data);
									if (response.ack == "no_ack") {
										var narrative_details = {
											'event_id': event_details.event_id,
											'site_id': event_details.site_id,
											'municipality': event_details.municipality,
											'province': event_details.province,
											'barangay': event_details.barangay,
											'sition': event_details.sition,
											'ewi_sms_timestamp': rounded_release,
											'narrative_template': "No ACK for "+moment(last_rounded_release).format('HH:mm A')+" EWI Release"
										}
										$.post("../narrativeAutomation/insert/", {narratives: narrative_details}).done(function(data){
											console.log(data);
										});
									}
								});
							});
						} 
					});
				}
			} else if (msg.type == "fetchedCmmtyContacts") {
				displayDataTableCommunityContacts(msg.data);
			} else if (msg.type == "fetchedDwslContacts") {
				displayDataTableEmployeeContacts(msg.data);
			} else if (msg.type == "fetchedSelectedDwslContact") {
				updateDwslContact(msg.data);
			} else if (msg.type == "fetchedSelectedCmmtyContact") {
				updateCmmtyContact(msg.data);
				siteSelection(msg.data.list_of_sites,msg.data.org_data);
				orgSelection(msg.data.list_of_orgs,msg.data.org_data);
			} else if (msg.type == "updatedDwslContact") {
				if (msg.status == true) {
					$.notify(msg.return_msg,'success');
				} else {
					$.notify(msg.return_msg,'failed');
				}
			} else if (msg.type == "newAddedDwslContact") {
				if (msg.status == true) {
					$.notify(msg.return_msg,'success');
				} else {
					$.notify(msg.return_msg,'failed');
				}
			} else if (msg.type == "updatedCmmtyContact") {
				if (msg.status == true) {
					$.notify(msg.return_msg,'success');
				} else {
					$.notify(msg.return_msg,'failed');
				}
			} else if (msg.type == "newAddedCommContact") {
				if (msg.status == true) {
					$.notify(msg.return_msg,'success');
				} else {
					$.notify(msg.return_msg,'failed');
				}
			} else if (msg.type == "conSetAllSites") {
				siteSelection(msg.data);
			} else if (msg.type == "conSetAllOrgs") {
				orgSelection(msg.data);
			} else if (msg.type == "newAddedCommContact") {
				if (msg.status == true) {
					$.notify(msg.return_msg,'success');
				} else {
					$.notify(msg.return_msg,'failed');
				}
			} else {
				var numbers = /^[0-9]+$/; 
				if (msg.type == "ackgsm") {
					if ($("#chat-user").text() == "You" && $("#messages li:last #timestamp-written").text() == gsmTimestampIndicator) {
						$("#messages li:last #timestamp-sent").html(msg.timestamp_sent);
					}
				} else if (msg.type == "ackrpi"){
					console.log("Status: "+msg.type);
				} else if (contactInfo == "groups") {

					if (msg.type == "smsrcv") {
						$.notify("New Message Received!","info");
						updateQuickInbox(msg);
					} 

					var select_raw_site = $("#current-contacts h4").text().substring(11);
					var selected_site = select_raw_site.substring(0,select_raw_site.indexOf(']')).replace(/\s/g,'').split(",");

					var select_raw_office = select_raw_site.substring(select_raw_site.indexOf(']'));
					var selected_office = select_raw_office.substring(13,select_raw_office.length-1).replace(/\s/g,'').split(",");

					var sender = msg.name.split(" ");

					for (var i = 0; i < selected_site.length; i++) {
						console.log(selected_site[i]);
						console.log(sender[0]);
						if (selected_site[i] == sender[0]) {
							for (var x = 0; x < selected_office.length; x++) {
								console.log(selected_office[x]);
								console.log(sender[1]);
								if (selected_office[x] == sender[1]) {
									updateMessages(msg);
								}
							}
						}
					}
				} else {

					if (msg.type == "smsrcv") {
						$.notify("New Message Received!","info");
						updateQuickInbox(msg);
					} 

					if(msg.user.match(numbers)) {
						console.log("all numbers");
						for (i in contactnumTrimmed) {
							if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.user)) {
								updateMessages(msg);
								return;
							}
						}
					} else {
						console.log("alphanumeric keywords for msg.user");
						for (i in contactnumTrimmed) {
							for (j in msg.numbers) {
								if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.numbers[j])) {
									updateMessages(msg);
									return;
								}
							}
						}
					}
				}
			}
		}

	tempConn.onclose = function(e) {
		WSS_CONNECTION_STATUS = -1;

		var reason;
		if (event.code == 1000)
			reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
		else if(event.code == 1001)
			reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
		else if(event.code == 1002)
			reason = "An endpoint is terminating the connection due to a protocol error";
		else if(event.code == 1003)
			reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
		else if(event.code == 1004)
			reason = "Reserved. The specific meaning might be defined in the future.";
		else if(event.code == 1005)
			reason = "No status code was actually present.";
		else if(event.code == 1006) {
			reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
			disableCommands();

			connection_status = false;
			$("#send-msg").addClass("disabled");
			waitForSocketConnection();
		}
		else if(event.code == 1007)
			reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
		else if(event.code == 1008)
			reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
		else if(event.code == 1009)
			reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
		else if(event.code == 1010)
			reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
		else if(event.code == 1011)
			reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
		else if(event.code == 1015)
			reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
		else
			reason = "Unknown reason";

		console.log(reason);
	}

	return tempConn;
}

function getOngoingEvents(sites){
	$.get( "../chatterbox/getOnGoingEventsForGintags", function( data ) {
		var events = JSON.parse(data);
		console.log(events);
		$.post( "../chatterbox/getSiteForNarrative/", {site_details: JSON.stringify(sites)})
		.done(function(response) {
			siteids = JSON.parse(response);
			for (var counter = 0; counter < events.length; counter++) {
				for (var siteid_counter = 0; siteid_counter < siteids.length; siteid_counter++) {
					if (events[counter].site_id == siteids[siteid_counter].id) {
						var narrative_template = "";
						console.log(gintags_msg_details);
						if (gintags_msg_details.tags === "#EwiResponse" || gintags_msg_details.tags === "#GroundMeas") {
							if (gintags_msg_details.tags === "#EwiResponse") {
								narrative_template = "Early warning information acknowledged by "+gintags_msg_details[1]+" ("+gintags_msg_details[4]+")";
							} else {
								narrative_template = gintags_msg_details[1]+"sent surficial measurement <insert trend here>";
							}
						} else if (gintags_msg_details.tags === "#EwiMessage" || gintags_msg_details.tags === "#GroundMeasReminder"){

							var tagOffices = [];
							$('input[name="offices"]:checked').each(function() {
								tagOffices.push(this.value);
							});

							if (narrative_recipients.length > 0 || tagOffices.length > 0) {
								if (narrative_recipients.length > 0) {
									narrative_recipients.forEach(function(x) {
										narrative_template = narrative_template+","+x;
									});
								} else {
									tagOffices.forEach(function(x) {
										narrative_template = narrative_template+","+x;
									});
								}
								if (gintags_msg_details.tags === "#EwiMessage") {
									var x = moment(data_timestamp).hour() % 1 == 0  && moment(data_timestamp).minute() == 30 ?  moment(data_timestamp).format("hh:mm A").add(30,'m') : moment(data_timestamp).format("hh:mm A");
									if(/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
									narrative_template = "Sent "+x+" EWI SMS to "+narrative_template.substring(1);
								} else {
									narrative_template = "Sent Ground measurement reminder";
								}
							}
						} else {
							$.notify("Invalid request, please try again.","warning");
						}
						var narrative_details = {
							'event_id': events[counter].event_id,
							'site_id': siteids[siteid_counter].id,
							'ewi_sms_timestamp': gintags_msg_details[2],
							'narrative_template': narrative_template
						}

						$.post( "../narrativeAutomation/insert/", {narratives: narrative_details})
						.done(function(response) {
							var start = moment().format('YYYY-MM-DD HH:mm:ss');
							var rounded_release;
							var last_rounded_release;

							if (moment(start).minute() < 30) {
								var rounded_release = moment(start).startOf('hour').format('YYYY-MM-DD HH:mm:ss');
							} else {
								var rounded_release = moment(start).add(1,'h').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
							}

							var current_release_day = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');

							if (moment(rounded_release).hour() % 4 == 0) {
								last_rounded_release = moment(rounded_release).subtract(4,'h').format('YYYY-MM-DD HH:mm:ss');
							} else {
								last_rounded_release = moment(current_release_day).add(moment(rounded_release).hour()- moment(rounded_release).hour() % 4,'h').format('YYYY-MM-DD HH:mm:ss');
							}

							var lastReleaseData = {
								'event_id': events[counter].event_id,
								'current_release_time': rounded_release,
								'last_release_time': last_rounded_release
							}

							$.post("../narrativeautomation/checkack/",{last_release : lastReleaseData}).done(function(data){
								var response = JSON.parse(data);
								if (response.ack == "no_ack") {
									var narrative_details = {
										'event_id': events[counter].event_id,
										'site_id': siteids[siteid_counter].id,
										'ewi_sms_timestamp': rounded_release,
										'narrative_template': "No ACK for "+moment(last_rounded_release).format('HH:mm A')+" EWI Release"
									}
									$.post("../narrativeAutomation/insert/", {narratives: narrative_details}).done(function(data){
										console.log(data);
									});
								}
							});
						});
					}
				}
			}
		});
	});
}

function waitForSocketConnection() {
	if (!window.timerID) {
		window.timerID = setInterval(
			function () {
				if (conn.readyState === 1) {
					console.log("Connection is made");
					return;

				} else {
					console.log("wait for connection... " + delayReconn);
					conn = connectWS();
					waitForSocketConnection();
					if (delayReconn < 20000) {
						delayReconn += 1000;
					}
				}
			}, delayReconn);
	}
}

function trimmedContactNum(inputContactNumber) {
	var numbers = /^[0-9]+$/;  
	var trimmed;
	var targetNumber = inputContactNumber.replace(/[^0-9]/igm,'');
	if(targetNumber.match(numbers)) {  
		var size = targetNumber.length;

		if (size == 12) {
			trimmed = targetNumber.slice(2, size);
		} 
		else if (size == 11) {
			trimmed = targetNumber.slice(1, size);
		}
		else if (size == 10) {
			trimmed = targetNumber;
		}
		else {
			console.log('Error: No such number in the Philippines');  
			return -1;
		}

		inputContactNumber = "63" + trimmed;
		return trimmed;
	}  
	else {  
		console.log('Please input numeric characters only');  
		return -1;
	}  
}

function normalizedContactNum(targetNumber) {
	var trimmed = trimmedContactNum(targetNumber);

	if (trimmed < 0) {
		console.log("Error: Invalid Contact Number");
		return -1;
	} 
	else {
		return "63" + trimmed;
	}
}

function getNameSuggestions (nameQuery) {
	var nameSuggestionRequest = {
		'type': 'requestnamesuggestions',
		'namequery': nameQuery,
	};
	conn.send(JSON.stringify(nameSuggestionRequest));
};

function parseContactInfo (multipleContactInfo) {
	parseSingleContactInfo(multipleContactInfo);
}

function parseSingleContactInfo (singleContactInfo) {
	var n = singleContactInfo.search(' - ');
	var size = singleContactInfo.length;
	testName = singleContactInfo.slice(0,n);
	testNumbers = singleContactInfo.slice(n + 3,singleContactInfo.length);
	var tempNum;
	var searchIndex = 0;

	while (searchIndex >= 0) {
		searchIndex = testNumbers.search(",");
		var parsedInfo = {};
		parsedInfo.fullname = testName;

		if (searchIndex < 0) {
			parsedInfo.numbers = testNumbers;
			contactnumTrimmed.push(trimmedContactNum(parsedInfo.numbers));
		} 
		else {
			parsedInfo.numbers = testNumbers.slice(0,searchIndex);
			contactnumTrimmed.push(trimmedContactNum(parsedInfo.numbers));
			testNumbers = testNumbers.slice(searchIndex + 1);
		}

		multiContactsList.push(parsedInfo);
	}
}

function getFollowingNameQuery (allNameQueries) {
	var before = allNameQueries.match(/^.+;\s*|/)[0];
	var size = before.length;
	var nameQuery = allNameQueries.slice(size);

	return nameQuery;
}

function displayContactNamesForThread (source="normal") {
	if (source == "normal") {
		var flags = [], uniqueName = [], l = contactInfo.length, i;
		for( i=0; i<l; i++) {
			if( flags[contactInfo[i].fullname]) 
				continue;

			flags[contactInfo[i].fullname] = true;
			uniqueName.push(contactInfo[i].fullname);
		}

		var tempText = "", tempCountContacts = uniqueName.length;
		for (i in uniqueName) {
			console.log(uniqueName[i]);

			if (i == tempCountContacts - 1)
				tempText = tempText + uniqueName[i];
			else
				tempText = tempText + uniqueName[i] + ", ";
		}
	}
	else if (source == "quickInbox") {
		if (qiFullContact.search("unknown") >= 0) {
			tempText = qiFullContact;
			document.title = tempText;
		} 
		else {
			var posDash = qiFullContact.search(" - ");
			tempText = qiFullContact.slice(0, posDash);
		}
	}
	$("#convo-header .panel-heading").text(tempText);
	$("#convo-header .panel-body").text(contactInfo[0].numbers);
	document.title = tempText;
}

$('#btn-standard-search').click(function(){
	if ($('#search-key').is(":visible") == true && $('#search-key').val() != "") {
		searchMessage();
	} else if ($('#search-key').is(":visible") == true && $('#search-key').val() == ""){
		$('#search-key').hide();
	} else {
		$('#search-key').show();
		$('#search-key').val("");	
	}
});

$('#btn-search-global').click(function(){
	$('#loading').modal('show');
	switch($('input[name="opt-search"]:checked').val()) {
		case "gintag-search":
		searchGintagMessages($('#search-global-keyword').val());
		break;
		case "global-search":
		searchMessageGlobal($('#search-global-keyword').val());
		break;
	}
});

function searchMessage(){
	messages = [];
	searchResults = [];
	if (msgType == "smsload" || msgType == "searchMessage") {
		searchMessageIndividual();
	} else if (msgType == "smssendgroup" || msgType == "searchMessageGroup" || msgType == "smsloadrequestgroup"){
		searchMessageGroup();
	} else {
		console.log(msgType);
		console.log("Invalid Request");
	}
}

function searchMessageIndividual(){
	for (var numLen = 0; numLen < contactnumTrimmed.length; numLen++){
		if (contactnumTrimmed[numLen].length == 12){
			contactnumTrimmed[numLen] = contactnumTrimmed[numLen].slice(2);
		} else if (contactnumTrimmed[numLen].length == 11){
			contactnumTrimmed[numLen] = contactnumTrimmed[numLen].slice(1);
		} else {
		}
	}
	var request = {
		'type': 'searchMessageIndividual',
		'number': contactnumTrimmed,
		'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
		'searchKey': $('#search-key').val()
	};

	conn.send(JSON.stringify(request));
}

function searchMessageGroup(){
	groupTags = [];

	user = "You";

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});
	tagSitenames.sort();

	request = {
		'type': 'searchMessageGroup',
		'offices': tagOffices,
		'sitenames': tagSitenames,
		'searchKey': $('#search-key').val()
	};

	groupTags = {
		'type': 'searchMessageGroup',
		'offices': tagOffices,
		'sitenames': tagSitenames,
		'searchKey': $('#search-key').val()
	};

	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(request));
}

function searchMessageGlobal(searchKey){
	request = {
		'type': "searchMessageGlobal",
		'searchKey': searchKey
	}
	console.log(request);
	conn.send(JSON.stringify(request));
}

function searchGintagMessages(searchKey){
	console.log(searchKey);
	request = {
		'type': "searchGintagMessages",
		'searchKey': searchKey
	}
	conn.send(JSON.stringify(request));
}

var coloredTimestamp;

$(document).on("click","#search-result li",function(){
	var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	console.log(($(this).closest('li')).find("input[id='msg_details']").val());
	loadSearchKey(data[0],data[1],data[2],data[3],data[4]);
})

$(document).on("click","#search-global-result li",function(){
	var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	loadSearchKey(data[0],data[1],data[2],data[3],data[4]);
})

function loadSearchKey(type,user,timestamp,user_number = null,sms_message = null){
	$('#search-result-modal').modal('hide');
	coloredTimestamp = "id_"+timestamp;
	if (type == "searchMessage") {
		var request = {
			'type': 'smsLoadSearched',
			'number': contactnumTrimmed,
			'timestamp': timestamp
		};

		conn.send(JSON.stringify(request));
	} else if (type == "searchMessageGroup"){
		var timestampYou = "";
		var timestampGroup = "";

		var tagOffices = [];
		$('input[name="offices"]:checked').each(function() {
			tagOffices.push(this.value);
		});

		var tagSitenames = [];
		$('input[name="sitenames"]:checked').each(function() {
			tagSitenames.push(this.value);
		});

		if (user == 'You') {
			timestampYou = timestamp;
		} else {
			timestampGroup = timestamp;
		}

		request = {
			'type': 'smsLoadGroupSearched',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'timestampYou': timestampYou,
			'timestampGroup': timestampGroup
		};

		conn.send(JSON.stringify(request));

	} else if (type == "searchMessageGlobal" || type == "searchGintags"){
		contactInfo = [{'fullname':user,'numbers': '0'+trimmedContactNum(user_number)}];

		$("#current-contacts h4").text(user);
		document.title = user;
		contactnumTrimmed = [];

		request = {
			'type': 'smsloadGlobalSearched',
			'user': user,
			'user_number': user_number,
			'sms_msg': sms_message,
			'timestamp': timestamp
		}
		contactnumTrimmed = [user_number];
		user = "You";

		conn.send(JSON.stringify(request));

	}
}

try {
	Handlebars.registerHelper('ifCond', function(v1, v2, v3, v4, v5,options) {
		if(v1 === v2 || v1 == v3 || v1 == v4 || v1 == v5) {
			return options.fn(this)
		} else {
			return options.inverse(this);	
		}
	});

	Handlebars.registerHelper('breaklines', function(text) {
		text = Handlebars.Utils.escapeExpression(text);
		text = text.replace(/(\r\n|\n|\r)/gm, ' ');
		return new Handlebars.SafeString(text);
	});

	Handlebars.registerHelper('escape', function(variable) {
		return variable.replace(/(['"-])/g, '\\$1');
	});
} catch (err) {
}

function loadSearchedMessage(msg){
	counters = 0;
	if (msg.type == "searchMessage" || msg.type == "searchMessageGroup") {
		messages = [];
		searchResults = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i = searchedResult.length - 1; i >= 0; i--) {
				res = searchedResult[i];
				updateMessages(res);
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}
		var messages_html = messages_template_both({'messages': searchResults});
		$('#search-result').html(messages_html);
		$('#search-result-modal').modal('toggle');

		if (msg.type == "searchMessage") {
			msgType = "smsload";
		} else {
			msgType = "smsloadrequestgroup";
		}
		counters = 0;

	} else if (msg.type == "smsLoadSearched" || msg.type == "smsLoadGroupSearched"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i = 0;i < searchedResult.length; i++) {
				res = searchedResult[i];
				updateMessages(res);
				if (contact_header == ""){
					if (res.user != "You"){
						contact_header = res.user;
					}
				}
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}

		var messages_html = messages_template_both({'messages': searchResults});
		$('#messages').html(messages_html);
		messages = [];

		if (msg.type == "smsLoadSearched" || msg.type == "smsloadGlobalSearched") {
			msgType = "smsload";
		} else if (msg.type == "smsLoadGroupSearched") {
			msgType = "smsloadrequestgroup";
		}
		counters = 0;

		var targetLi = document.getElementById(coloredTimestamp);
		targetLi.style.border = "solid";
		targetLi.style.borderColor = "#dff0d8";
		targetLi.style.borderRadius = "3px";
		targetLi.style.borderWidth = "5px";
		$('html, body').scrollTop(targetLi.offsetTop - 300);

	} else if (msg.type == "smsloadGlobalSearched"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		var contact_header = "";
		try {
			for (var i = searchedResult.length - 1; i >= 0; i--) {
				res = searchedResult[i];
				updateGlobalMessage(res);
				if (contact_header == ""){
					if (res.user != "You"){
						contact_header = res.user;
					}
				}
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}
		msgType = "smsload";
		var messages_html = messages_template_both({'messages': searchResults});
		$('#messages').html(messages_html);
		counters = 0;

		$("#current-contacts h4").text(contact_header);
		document.title = contact_header;

		$('#main-container').removeClass('hidden');
		$('#search-global-message-modal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();

		var targetLi = document.getElementById(coloredTimestamp);
		targetLi.style.borderColor = "#dff0d8";
		targetLi.style.borderRadius = "3px";
		targetLi.style.borderWidth = "5px";
		console.log(targetLi.offsetTop);
		$('html, body').scrollTop(targetLi.offsetTop - 300);

	} else if (msg.type == "searchMessageGlobal"  || msg.type == "searchGintags"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i =  0; i < searchedResult.length; i++) {
				res = searchedResult[i];
				updateGlobalMessage(res);
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}

		var messages_html = messages_template_both({'messages': searchResults});
		$('#search-global-result').html(messages_html);
		var maxScroll = $(document).height() - $(window).height();
		$('#search-global-result').scrollTop(maxScroll);

	} else {
		console.log("No Result/Invalid Request");
	}
	searchResults = [];
	counters = 0;
}

function updateGlobalMessage(msg){
	if (msg.user == "You") {
		msg.isyou = 1;
		searchResults.push(msg);
	} else {
		msg.isyou = 0;
		msg.user = msg.user;
		searchResults.push(msg);
	}
}

function displayGroupTagsForThread () {
	var tempText = "[Sitenames: ";
	var titleSites = "";
	var tempCountSitenames = groupTags.sitenames.length;
	$("#convo-header .panel-body").text("");
	for (i in groupTags.sitenames) {
		displayDetailsForThread(groupTags.sitenames[i]);
		if (i == tempCountSitenames - 1) {
			tempText = tempText + groupTags.sitenames[i];
			titleSites = titleSites + groupTags.sitenames[i];
		} else {
			tempText = tempText + groupTags.sitenames[i] + ", ";
			titleSites = titleSites + groupTags.sitenames[i] + ", ";
		}
	}

	tempText = tempText + "]; [Offices: ";
	var tempCountOffices = groupTags.offices.length;
	for (i in groupTags.offices) {
		if (i == tempCountOffices - 1){
			tempText = tempText + groupTags.offices[i];
		} else {
			tempText = tempText + groupTags.offices[i] + ", ";
		}
	}

	document.title = titleSites;

	tempText = tempText + "]";
	$("#convo-header .panel-heading").text(tempText);
	document.title = tempText;
}

function displayDetailsForThread(siteabr){
	$.post('../chatterbox/getsitbangprovmun', {sites: siteabr}).done(function(response){
		var site_details = JSON.parse(response);
		for (i in site_details) {
			var site = site_details[i].sitio+", "+site_details[i].barangay+", "+site_details[i].municipality+", "+site_details[i].province+" <b>("+siteabr+")</b>";
			if ($("#convo-header .panel-body").html().split("<b>").length <= 3) {
				$("#convo-header .panel-body").append(site.replace("null,",""));
			} else {
				if ($("#convo-header .panel-body").html().split("glyphicon glyphicon-th-list").length != 2) {
					$("#convo-header .panel-body").append("&nbsp;&nbsp;<span class='glyphicon glyphicon glyphicon-th-list' data-toggle='tooltip' data-placement='bottom''></span>");
					$('#convo-header .panel-body span').attr('title',site)
				} else {
					var more_details = $('#convo-header .panel-body span').attr('title');
					$('#convo-header .panel-body span').attr('title',site.replace("null,","").replace("<b>","").replace("</b>","")+more_details);
				}
			}
		}
	});
}

function displayGroupTagsForDynaThread(tags) {
	var tempText = "[Team Tags: ";
	var titleSites = "";
	var tempCountTag = tags.length;
	for (i in tags) {
		if (i == tempCountTag - 1) {
			tempText = tempText + tags[i];
		} else {
			tempText = tempText + tags[i] + ", ";
		}
	}

	tempText = tempText + "]";
	$("#convo-header .panel-heading").text(tempText);
	document.title = tempText;

}

try {
	var comboplete = new Awesomplete('input.dropdown-input[data-multiple]', {
		filter: function(text, input) {
			return Awesomplete.FILTER_CONTAINS(text, input.match(/[^;]*$/)[0]);
		},

		replace: function(text) {
			var before = this.input.value.match(/^.+;\s*|/)[0];
			this.input.value = before + text + "; ";
		},
		minChars: 3
	});
	comboplete.list = [];

	Awesomplete.$('.dropdown-input').addEventListener("click", function() {
		var nameQuery = $('.dropdown-input').val();

		if (nameQuery.length >= 3) {
			if (comboplete.ul.childNodes.length === 0) {
				comboplete.evaluate();
			} 
			else if (comboplete.ul.hasAttribute('hidden')) {
				comboplete.open();
			}
			else {
				comboplete.close();
			}
		}
	});

	Awesomplete.$('.dropdown-input').addEventListener("keyup", function(e){
		var code = (e.keyCode || e.which);
		if(code == 37 || code == 38 || code == 39 || code == 40) {
			return;
		}

		var allNameQueries = $('.dropdown-input').val();
		var nameQuery = getFollowingNameQuery(allNameQueries);

		if (allNameQueries.length < 3) {
			multiContactsList = [];
			contactnumTrimmed = [];
		}

		if (nameQuery.length >= 3) {
			getNameSuggestions(nameQuery);

		}
		else {
			comboplete.close();
		}

	}, false);

	Awesomplete.$('.dropdown-input').addEventListener("awesomplete-selectcomplete", function(e){
		var allText = $('.dropdown-input').val();
		var size = allText.length;
		var allNameQueries = allText.slice(0, size-2);
		var nameQuery = getFollowingNameQuery(allNameQueries);

		parseContactInfo(nameQuery);
	}, false);
} catch(err) {
}

var qiFullContact = null;

$(document).on("click","#quick-inbox-display li",function(){
	quickInboxStartChat($(this).closest('li').find("input[type='text']").val());
});

$(document).on("click","#quick-inbox-unknown-display li",function(){
	quickInboxStartChat($(this).closest('li').find("input[type='text']").val());
});

$(document).on("click","#quick-release-display li",function(){
	$('#loading').modal('show');
	counters = 0;
	convoFlagger = false;
	groupTags = [];

	user = "You";

	var tagOffices = ['LLMC','BLGU','MLGU','PLGU','REG8'];

	var tagSitenames = [];
	tagSitenames.push($(this).closest('li').find("input[type='text']").val().toUpperCase());
	$('input[name="opt-ewi-recipients"]').prop('checked',true);

	groupTags = {
		'type': 'smsloadrequestgroup',
		'offices': tagOffices,
		'sitenames': tagSitenames
	};
	displayGroupTagsForThread();

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(groupTags));
	$('#main-container').removeClass('hidden');
});

function quickInboxStartChat(fullContact=null) {

	if (fullContact == null) {
		console.log("Error: User or Name is null");
		return;
	}
	else {
		console.log("User: " + fullContact);
	}

	qiFullContact = fullContact;
	startChat(source="quickInbox");
}

function startChat(source="normal") {
	convoFlagger = false;
	counters = 0;

	user = "You";

	if (source == "normal") {
		if (contactSuggestions) {
			contactInfo = multiContactsList;
		}
		else {
			contactname = $('.dropdown-input').val();
			contactnum = contactname;
			contactnumTrimmed = [trimmedContactNum(contactnum)];

			contactInfo = [{'fullname':contactname,'numbers':contactnum}];
		}
	}
	else if (source == "quickInbox") {
		contactname = qiFullContact;
		contactnum = contactname;
		contactnumTrimmed = [trimmedContactNum(contactnum)];

		contactInfo = [{'fullname':contactname,'numbers':contactnum}];
	}
	displayContactNamesForThread(source);

	if (contactnumTrimmed <= 0) {
		alert("Error: Invalid Contact Number");
		return;
	}

	$('#user-container').addClass('hidden');
	$('#main-container').removeClass('hidden');

	var msgHistory = {
		'type': 'smsloadrequest',
		'number': contactnumTrimmed,
		'timestamp': moment().format('YYYY-MM-DD HH:mm:ss')
	};

	$('#user').val('You');
	$('#messages').html('');
	messages = [];

	tempRequest = msgHistory;
	conn.send(JSON.stringify(msgHistory));
}

$('#go-chat').click(function() {
	$('#loading').modal('show');
	lastMessageTimeStamp = "";
	lastMessageTimeStampYou = "";
	tempTimestamp = "";
	tempTimestampYou = "";

	$('input[name="offices"]').prop('checked', false);
	$('input[name="sitenames"]').prop('checked', false);

	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		startChat();
	}
});

var testMsg;
$('#send-msg').on('click',function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {

		messages = [];
		counters = 0;
		ewi_filter = "";
		if (contactInfo == "groups") {
			var text = $('#msg').val();
			user = "You";

			if (quickGroupSelectionFlag == true) {
				var emp_tag = [];
				$('input[name="tag"]:checked').each(function() {
					emp_tag.push(this.value);
				});

				gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss');
				var msg = {
					'type': 'smssend',
					'user': user,
					'tag': emp_tag,
					'msg': text + footer,
					'timestamp': gsmTimestampIndicator,
					'ewi_tag': false
				};

				conn.send(JSON.stringify(msg));

				msgType = "smssendgroup";
				testMsg = msg;
				counters = 0;
				messages = [];
				updateMessages(msg);

				$('#msg').val('');
			} else {
				var tagOffices = [];
				$('input[name="offices"]:checked').each(function() {
					tagOffices.push(this.value);
				});

				var tagSitenames = [];
				$('input[name="sitenames"]:checked').each(function() {
					tagSitenames.push(this.value);
				});

				temp_msg_holder = {
					'type': 'smssendgroup',
					'user': user,
					'offices': tagOffices,
					'sitenames': tagSitenames,
					'msg': text + footer,
					'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
					'ewi_filter': $('input[name="opt-ewi-recipients"]:checked').val(),
					'ewi_tag': false
				};

				conn.send(JSON.stringify(temp_msg_holder));

				msgType = "smssendgroup";
				testMsg = msg;
				counters = 0;
				messages = [];
				$('#msg').val('');	
			}
		}
		else {
			var text = $('#msg').val();

			var normalized = [];
			for (i in contactnumTrimmed) {
				normalized[i] = normalizedContactNum(contactnumTrimmed[i]);
			}

			user = "You";
			gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss')
			temp_msg_holder = {
				'type': 'smssend',
				'user': user,
				'numbers': normalized,
				'msg': text + footer,
				'timestamp': gsmTimestampIndicator,
				'ewi_tag':false
			};
			console.log(temp_msg_holder);
			conn.send(JSON.stringify(temp_msg_holder));
			$('#msg').val('');
		}

		updateRemainingCharacters();
	}
});

function loadGroups(){
	if (quickGroupSelectionFlag == true) {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
		loadGroupsEmployee();
	} else  if (quickGroupSelectionFlag == false) {
		$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
		loadGroupsCommunity();
	} else {
		alert('Something went wrong, Please contact the Administrator');
	}
}

function loadGroupsCommunity(){
	counters = 0;
	convoFlagger = false;
	groupTags = [];

	user = "You";

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});
	tagSitenames.sort();

	groupTags = {
		'type': 'smsloadrequestgroup',
		'offices': tagOffices,
		'sitenames': tagSitenames
	};
	displayGroupTagsForThread();

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(groupTags));
	$('#main-container').removeClass('hidden');
}

function loadGroupsEmployee(){
	var requestTag = [];

	var dynaTags = [];
	$('input[name="tag"]:checked').each(function() {
		dynaTags.push(this.value);
	});
	displayGroupTagsForDynaThread(dynaTags);

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";

	requestTag = {
		'type':'smsloadrequesttag',
		'teams': dynaTags
	}
	conn.send(JSON.stringify(requestTag));
	$('#main-container').removeClass('hidden');
}

$('#go-load-groups').click(function() {
	$('#loading').modal('show');
	groupTags = [];
	tempTimestampYou = "";
	tempTimestampGroup = "";
	lastMessageTimeStampYou = "";
	lastMessageTimeStamp = "";
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		loadGroups();
	}
});

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

$('#response-contact-container').on('click', 'tr:has(td)', function(){
	var table = $('#response-contact-container').DataTable();
	var data = table.row(this).data();
	if ($('#contact-category').val() == "ccontacts") {
		var msg = {
			'type': 'loadCommunityContact',
			'data': data.user_id
		};
	} else {
		var msg = {
			'type': 'loadDewslContact',
			'data': data.user_id
		};	
	}
	conn.send(JSON.stringify(msg));
});

$('#btn-contact-settings').click(function() {

	$('#employee-contact-wrapper').prop('hidden', true);
	$('#community-contact-wrapper').prop('hidden', true);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#update-contact-container').prop('hidden',true);

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

	$('#contact-result').remove();
	fetchSiteAndOffice();
});

function fetchSiteAndOffice(){
	$('#sitename_cc').empty();
	$('#office_cc').empty();
}

$('#sitename_cc').on('change',function() {
	if ($("#sitename_cc").val() == "OTHERS") {
		$("#other-sitename").show();
	} else {
		$("#other-sitename").hide();
	}
});

$('#office_cc').on('change',function() {
	if ($("#office_cc").val() == "OTHERS") {
		$("#other-officename").show();
	} else {
		$("#other-officename").hide();
	}
});

$('#btn-clear-ec').on('click',function(){
	if ($('#settings-cmd').val() == "updatecontact"){
		$('#employee-contact-wrapper').attr('hidden',true);
		getEmpContact();
	} else {
		reset_ec();
	}
});

function reset_ec() {
	$('#firstname_ec').val('');
	$('#lastname_ec').val('');
	$('#grouptags_ec').val('');
	$('#nickname_ec').val('');
	$('#email_ec').val('');
	$('#numbers_ec').val('');
	$('#grouptags_ec').val('');
	$('#numbers_ec').tagsinput("removeAll");
	$('#team_ec').tagsinput("removeAll");
	$('#email_ec').tagsinput("removeAll");
	$('#active_status_ec').val('');
	$('#salutation_ec').val('');
	$('#gender_ec').val('');
	$('#middlename_ec').val('');
	$('#birthdate_ec').val('');
	$('#mobile_ec_0').val('');
	$('#mobile_ec_id_0').val('');
	$('#mobile_ec_status_0').val('');
	$('#mobile_ec_priority_0').val('');
	$('#landline_ec_0').val('');
	$('#landline_ec_id_0').val('');
	$('#landline_ec_remarks_0').val('');

	$('#mobile-div').empty();
	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_number_ec" onclick="addAdditionalNumberEc()">Add another mobile number..</a></div></div>').appendTo("#mobile-div");
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="mobile_ec_0">Mobile #:</label>'+
		'<input type="text" class="form-control" id="mobile_ec_0" name="mobile_ec_0" value="" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Mobile ID #:</label>'+
		'<input type="text" id="mobile_ec_id_0" class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Status:</label>'+
		'<input type="text" id="mobile_ec_status_0" class="form-control" value="">'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Priority:</label>'+
		'<input type="text" id="mobile_ec_priority_0" class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo("#mobile-div");

	$('#landline-div').empty();
	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_landline_ec" onclick="addAdditionalLandlineEc()">Add another landline number..</a></div></div>').appendTo("#landline-div");
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="landline_ec_0">Landline #:</label>'+
		'<input type="text" class="form-control" id="landline_ec_0" name="landline_ec" value="" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline ID #:</label>'+
		'<input type="text" id="landline_ec_id_0" class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline # Remarks:</label>'+
		'<input type="text" id="landline_ec_remarks_0" class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo('#landline-div');

}

$('#btn-clear-cc').on('click',function(){
	if ($('#settings-cmd').val() == "updatecontact"){
		$('#community-contact-wrapper').attr('hidden',true);
		getComContact();
	} else {
		reset_cc();
	}
});

function reset_cc() {
	$('#firstname_cc').val('');
	$('#lastname_cc').val('');
	$('#middlename_cc').val('');
	$('#nickname_cc').val('');
	$('#birthdate_cc').val('');
	$('#salutation_cc').val('');
	$('#active_status_cc').val('');
	$('#gender_cc').val('');
	$('#ewirecipient_cc').val('');

	$('#mobile-div-cc').empty();
	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_number_cc" onclick="addAdditionalNumberCc()">Add another mobile number..</a></div></div>').appendTo("#mobile-div-cc");
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
	'<label for="mobile_cc_0">Mobile #:</label>'+
	'<input type="text" class="form-control" id="mobile_cc_0" name="mobile_cc_0" value="" required>'+
	'</div>'+
	'<div class="col-md-4">'+
	'<label>Mobile ID #:</label>'+
	'<input type="text" id="mobile_cc_id_0" class="form-control" value="" disabled>'+
	'</div>'+
	'<div class="col-md-2">'+
	'<label>Mobile # Status:</label>'+
	'<input type="text" id="mobile_cc_status_0" class="form-control" value="">'+
	'</div>'+
	'<div class="col-md-2">'+
	'<label>Mobile # Priority:</label>'+
	'<input type="text" id="mobile_cc_priority_0" class="form-control" value="">'+
	'</div>'+
	'</div>').appendTo("#mobile-div-cc");

	$('#landline-div-cc').empty();
	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_landline_ec" onclick="addAdditionalLandlineEc()">Add another landline number..</a></div></div>').appendTo("#landline-div-cc");
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
	'<label for="landline_cc_0">Landline #:</label>'+
	'<input type="text" class="form-control" id="landline_cc_0" name="landline_cc_0" value="" required>'+
	'</div>'+
	'<div class="col-md-4">'+
	'<label>Landline ID #:</label>'+
	'<input type="text" id="landline_cc_id_0" class="form-control" value="" disabled>'+
	'</div>'+
	'<div class="col-md-4">'+
	'<label>Landline # Remarks:</label>'+
	'<input type="text" id="landline_cc_remarks_0" class="form-control" value="">'+
	'</div>'+
	'</div>').appendTo("#landline-div-cc");

	$('#site-selection-div').find(".checkbox").find("input").prop('checked', false);
	$('#organization-selection-div').find(".checkbox").find("input").prop('checked', false);

	$('#accordion .panel-collapse').collapse('toggle');

	var msg = {
		'type': 'getAllSitesConSet'
	};
	conn.send(JSON.stringify(msg));

	var msg = {
		'type': 'getAllOrgsConSet'
	};
	conn.send(JSON.stringify(msg));
}

$('#alert_status').on('change',function(){
	$.post( "../chatterbox_beta/getAlertLevel", {alert_status: $(this).val()})
	.done(function(data) {
		var response = JSON.parse(data);
		$('#alert-lvl').empty();
		$('#internal-alert').empty();

	    $('#alert-lvl').append($('<option>', { 
	        value: "------------",
	        text : "------------" 
	    }));

	    $('#internal-alert').append($('<option>', { 
	        value: "------------",
	        text : "------------" 
	    }));

		for (var counter = 0; counter < response.length; counter++) {
			if (response[counter].alert_symbol_level.toLowerCase().indexOf('alert') > -1) {
				 $('#alert-lvl').append($('<option>', { 
			        value: response[counter].alert_symbol_level,
			        text : response[counter].alert_symbol_level 
			    }));
			} else {
				 $('#internal-alert').append($('<option>', { 
			        value: response[counter].alert_symbol_level,
			        text : response[counter].alert_symbol_level 
			    }));
			}
		}
	});
});

$('#btn-ewi').on('click',function(){
	$('#alert-lvl').empty();
	$('#sites').empty();
	$('#alert_status').empty();
	$('#alert_lvl').empty();
	$('#internal_alert').empty();

    $('#alert_status').append($('<option>', { 
        value: "------------",
        text : "------------" 
    }));

	$.ajax({
		type: "GET",
		url: "../chatterbox_beta/getAlertStatus",             	
		dataType: "json",
		success: function(response){
			$.each(response, function (i, response) {
			    $('#alert_status').append($('<option>', { 
			        value: response.alert_status,
			        text : response.alert_status 
			    }));
			});
		}
	});

	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctsitename",             
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('sites');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].sitename;
				opt.innerHTML = response[counter].sitename;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			opt.value = "NSS";
			opt.innerHTML = "NO SITE SELECTED";
			select.className = "form-control";
			select.setAttribute("required","true");
			select.appendChild(opt);

			var counter = 0;
			$('input[name="sitenames"]:checked').each(function() {
				counter++;
			});

			if (counter == 1){
				$('select option[value="'+$('input[name="sitenames"]:checked').val()+'"]').attr("selected",true);
			} else {
				$('select option[value="NSS"]').attr("selected",true);
			}
		}
	});
});

$('#confirm-ewi').click(function(){
	if ($('#ewi-date-picker input').val() == "" || $('#sites').val() == "") {
		alert('Invalid input, All fields must be filled');
	} else {
		$.post( "../chatterbox/getsitbangprovmun", {sites: $('#sites').val()})
		.done(function(response) {
			var location = JSON.parse(response);
			var toTemplate = {
				'name': $('#sites').val(),
				'internal_alert' : $('#internal-alert').val() == "------------" ? "N/A" : $('#internal-alert').val(),
				'alert_level' : $('#alert-lvl').val() == "------------" ? "N/A" : $('#alert-lvl').val(),
				'alert_status' : $('#alert_status').val() == "------------" ? "N/A" : $('#alert_status').val(),
				'sitio':location[0].sitio == null ? "" : location[0].sitio,
				'barangay':location[0].barangay == null ? "" :location[0].barangay,
				'municipality':location[0].municipality == null ? "" : location[0].municipality,
				'province':location[0].province == null ? "" :location[0].province,
				'data_timestamp': $('#ewi-date-picker input').val()
			}
			sendViaAlertMonitor(toTemplate)
		});
	}
});

function getEWI(handledTemplate){
	var constructedEWI = "";
	var dateReplaced = "";
	$.ajax({
		type: "GET",
		url: "../chatterbox/getewi",             	
		dataType: "json",	
		success: function(response){
			var d = new Date();
			var currentPanahon = d.getHours();
			if (currentPanahon >= 12 && currentPanahon <= 18) {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","hapon");
			} else if (currentPanahon > 18 && currentPanahon <=23) {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","gabi");
			} else {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","umaga");
			}
			var year = $('#ewi-date-picker').val().substring(0, 4);
			var month = $('#ewi-date-picker').val().substring(5, 7);
			var day = $('#ewi-date-picker').val().substring(8, 10);

			var months = {1: "January",2: "February",3: "March",
			4: "April",5: "May",6: "June",
			7: "July",8: "August", 9: "September",
			10: "October", 11: "November", 12: "December"};

			var reconstructedDate = day+" "+months[parseInt(month)]+" "+year;
			dateReplaced = constructedEWI.replace("%%DATE%%",reconstructedDate);
			handledTemplate(dateReplaced);
		}
	});
}

function setEWILocation(consEWI){
	var finalEWI = "";
	if (consEWI != "") {
		$.post( "../chatterbox/getsitbangprovmun", {sites: $('#sites').val()})
		.done(function(response) {
			var location = JSON.parse(response);
			var sbmp = location[0].sitio + ", " +  location[0].barangay + ", " + location[0].municipality + ", " + location[0].province;
			var formatSbmp = sbmp.replace("null","");
			if (formatSbmp.charAt(0) == ",") {
				formatSbmp = formatSbmp.substr(1);
			}
			finalEWI = consEWI.replace("%%SBMP%%",formatSbmp);
			$('#msg').val(finalEWI);
		});
	} else {
		$('#msg').val("Site is not available");
	}
}

$('#ewi-date-picker').datetimepicker({
	locale: 'en',
	format: 'YYYY-MM-DD HH:mm:ss'
});

$('#edit-btn-ewi-amd').click(function(){
	if ($('#edit-btn-ewi-amd').val() === "edit"){
		$('#constructed-ewi-amd').prop("disabled", false );
		$('#edit-btn-ewi-amd').val("undo");
		$('#edit-btn-ewi-amd').text("Undo");
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-danger');
	} else {
		$('#constructed-ewi-amd').prop("disabled", true );
		$('#constructed-ewi-amd').val(temp_ewi_template_holder);
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-warning');
		$('#edit-btn-ewi-amd').text("Edit");
		$('#edit-btn-ewi-amd').val("edit");
	}
});

$("#ewi-asap-modal").on('shown.bs.modal', function(){
	temp_ewi_template_holder = $("#constructed-ewi-amd").val();
});

$('#btn-ewi').on('click',function(){
	$('#early-warning-modal').modal('toggle');
});

$('#send-btn-ewi-amd').click(function(){
	var current_recipients = $('#ewi-recipients-dashboard').tagsinput('items');
	var default_recipients = $('#default-recipients').val().split(',');
	var difference = [];

	$.grep(current_recipients, function(el) {
		if ($.inArray(el, default_recipients) == -1) difference.push(el);
	});

	ewiFlagger = true;
	var footer = " -"+$('#footer-ewi').val()+" from PHIVOLCS-DYNASLOPE";
	var text = $('#constructed-ewi-amd').val();
	if (temp_ewi_template_holder == $('#constructed-ewi-amd').val()) {
		$('#edit-btn-ewi-amd').val('edit');
	}

	try {
		var tagOffices = ['LLMC','BLGU','MLGU','PLGU','REG8'];

		$('input[name="offices"]').prop('checked', false);
		$('input[name="sitenames"]').prop('checked', false);

		var tagSitenames = [];
		tagSitenames.push($('#site-abbr').val().toUpperCase());

		switch(tagSitenames[0]) {
			case "MSL":
			tagSitenames[0] = "MES";
			break;
			case "MSU":
			tagSitenames[0] = "MES";
			break;
		}

		var msg = {
			'type': 'smssendgroup',
			'user': 'You',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'msg': text+footer,
			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
			'ewi_filter': true,
			'ewi_tag': true
		};

		conn.send(JSON.stringify(msg));
		msgType = "smssendgroup";
		messages = [];
		updateMessages(msg);

		if (difference != null || difference.length != 0) {
			var added_contacts = [];
			difference.forEach(function(x){
				if (x.indexOf("|") == -1) {
					added_contacts.push([x]);
				} else {
					var temp = x.split('|');
					added_contacts.push(temp.splice(1,1));
				}
			});

			for (var counter = 0; counter < added_contacts.length;counter++) {
				user = "You";
				gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss')
				temp_msg_holder = {
					'type': 'smssend',
					'user': user,
					'numbers': added_contacts[counter],
					'msg': text + footer,
					'timestamp': gsmTimestampIndicator,
					'ewi_tag':true
				};
				conn.send(JSON.stringify(temp_msg_holder));
			}
		}

		$('#constructed-ewi-amd').val('');
		$('#result-ewi-message').text('Early Warning Information sent successfully!');
		$('#success-ewi-modal').modal('toggle');
		$('#ewi-asap-modal').modal('toggle');
		$("#" + latest_release_id + "_sms").css("color", "red").attr("data-sent", 1);
	} catch(err) {
		$('#result-ewi-message').text('Failed!, Please check the template.');
		alert(err.stack);
		$('#success-ewi-modal').modal('toggle');
		$('#ewi-asap-modal').modal('toggle');
	}
});

$('#sbt-update-contact-info').click(function(){
	$('#edit-contact').modal('toggle');
});
$('#checkAllOffices').click(function() {
	$("#modal-select-offices").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllOffices').click(function() {
	$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
});
$('#checkAllTags').click(function() {
	$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllTags').click(function() {
	$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
});
$('#checkAllSitenames').click(function() {
	$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllSitenames').click(function() {
	$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
});

$('#btn-gbl-search').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#search-global-message-modal').modal("toggle");
		searchResults = [];
		counter = 0;
		$('#search-global-keyword').val('');
	}
});
$('#msg').bind('input propertychange', function() {
	updateRemainingCharacters();
});

$('#btn-contact-settings').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#contact-settings').modal("toggle");
	}
});

$('#btn-advanced-search').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#advanced-search').modal("toggle");
	}
});

var isFirstAdvancedSearchActivation = false;

function disableCommands(){
}

function enableCommands(){
}

function getOfficesAndSitenames () {
	try {
		var msg = {
			'type': 'loadofficeandsitesrequest'
		};
		conn.send(JSON.stringify(msg));
	} catch(err) {
	}
}

function getInitialQuickInboxMessages () {
	var msg = {
		'type': 'smsloadquickinboxrequest'
	};
	conn.send(JSON.stringify(msg));
}

function getLatestAlert() {
	var msg = {
		'type' : 'latestAlerts'
	};
	conn.send(JSON.stringify(msg));
}

$('a[href="#emp-group"]').on('click',function(){
	employeeTags = [];
	$.get( "../chatterbox/getEmployeeTags", function( data ) {
		var dataFetched = JSON.parse(data);
		for (var x = 0;x< dataFetched.length;x++){
			var parts = dataFetched[x].grouptags.split(/[ ,.]+/); 
			if (employeeTags.length <= 0) {
				for (var y = 0; y < parts.length; y++){
					employeeTags.push(parts[y]);
				}
			} else {
				for (var y = 0;y < parts.length;y++){
					if (!(employeeTags.indexOf(parts[y]) > -1)) {
						employeeTags.push(parts[y]);
					}
				}
			}
		}
		loadEmployeeTags(employeeTags);
	});
});

$('#emp-grp-flag').on('click',function(){
	quickGroupSelectionFlag = true;
});

$('#comm-grp-flag').on('click',function(){
	quickGroupSelectionFlag = false;
});


function loadEmployeeTags(tags) {
	for (var x = 0;x < 6;x++) {
		var myNode = document.getElementById("tag-"+x);
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
	}

	for (var i = 0; i < tags.length; i++) {
		var modIndex = i % 4;
		var tag = tags[i];
		if (tag != "" || tag != null) {
			$("#tag-"+modIndex).append('<div class="checkbox"><label><input name="tag" type="checkbox" value="'+tag+'">'+tag.toUpperCase()+'</label></div>');
		}	
	}
}

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

	reset_cc();
	reset_ec();

	$('#update-contact-container').prop('hidden',true);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#employee-contact-wrapper').prop('hidden', true);
	$('#community-contact-wrapper').prop('hidden', true);
});

$('#settings-cmd').on('change',function(){

	reset_cc();
	reset_ec();


	if ($('#settings-cmd').val() != 'default') {
		$('#settings-cmd').css("border-color", "#3c763d");
		$('#settings-cmd').css("background-color", "#dff0d8");
	}

	if ($('#contact-category').val() == "econtacts") 
{		if ($('#settings-cmd').val() == "addcontact") {
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', true);
			$('#employee-contact-wrapper').prop('hidden', false);
		} else if ($('#settings-cmd').val() == "updatecontact") {
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			reset_cc();
			reset_ec();
			getEmpContact();
		} else {
			console.log('Invalid Request');
		}
	} else if ($('#contact-category').val() == "ccontacts") {
		if ($('#settings-cmd').val() == "addcontact") {
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', false);
		} else if ($('#settings-cmd').val() == "updatecontact") {	
			reset_cc();
			reset_ec();
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			getComContact();
		} else {
			console.log('Invalid Request');
		}
	} else {
		console.log('Invalid Request');
	}
});

function getComContact(){
	try {
		var msg = {
			'type': 'loadAllCommunityContacts'
		};
		conn.send(JSON.stringify(msg));
	} catch(err) {
}}

function displayDataTableCommunityContacts(cmmty_contact_data){
	$('#response-contact-container').DataTable({
		destroy: true,
		"scrollY": 300,
		"scrollX": true,
		data: cmmty_contact_data,
		columns: [
		{ 'data': 'user_id', title: "ID #" },
		{ 'data': 'salutation', title: "Salutation" },
		{ 'data': 'firstname', title: "Firstname" },
		{ 'data': 'lastname', title: "Lastname" },
		{ 'data': 'middlename', title: "Middlename" },
		{ 'data': 'nickname', title: "Nickname" },
		{ 'data': 'active_status', title: "Active Status" }
		]
	});
	$('#response-contact-container').show();
}

function getEmpContact(){
	try {
		var msg = {
			'type': 'loadAllDewslContacts'
		};
		conn.send(JSON.stringify(msg));
	} catch(err) {
	}
}

function addNewEmpContact() {

}

function displayDataTableEmployeeContacts(dwsl_contact_data) {
	$('#response-contact-container').DataTable({
		destroy: true,
		"scrollY": 300,
		"scrollX": true,
		data: dwsl_contact_data,
		columns: [
		{ 'data': 'user_id', title: "ID #" },
		{ 'data': 'salutation', title: "Salutation" },
		{ 'data': 'firstname', title: "Firstname" },
		{ 'data': 'lastname', title: "Lastname" },
		{ 'data': 'middlename', title: "Middlename" },
		{ 'data': 'nickname', title: "Nickname" },
		{ 'data': 'team', title: "Team" },
		{ 'data': 'active_status', title: "Active Status" }
		]
	});
	$('#response-contact-container').show();
}

function updateDwslContact(dwsl_contact) {
	$('#go_back').prop('hidden',false);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#ec_id').val(dwsl_contact.contact_info.id);
	$('#firstname_ec').val(dwsl_contact.contact_info.firstname);
	$('#lastname_ec').val(dwsl_contact.contact_info.lastname);
	$('#middlename_ec').val(dwsl_contact.contact_info.middlename);
	$('#nickname_ec').val(dwsl_contact.contact_info.nickname);
	$('#gender_ec').val(dwsl_contact.contact_info.gender);
	$('#salutation_ec').val(dwsl_contact.contact_info.salutation);
	$('#birthdate_ec').val(dwsl_contact.contact_info.birthday);
	$('#active_status_ec').val(dwsl_contact.contact_info.contact_active_status);
	$('#mobile-div').empty();
	$('#landline-div').empty();
	$('#email_ec').tagsinput('removeAll');

	for (var counter = 0; counter < dwsl_contact.email_data.length; counter++) {
		$('#email_ec').tagsinput('add',dwsl_contact.email_data[counter].email);
	}

	for (var counter = 0; counter < dwsl_contact.team_data.length; counter++) {
		$('#team_ec').tagsinput('add',dwsl_contact.team_data[counter].team_name);
	}

	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_landline_ec" onclick="addAdditionalLandlineEc()">Add another landline number..</a></div></div>').appendTo("#landline-div");
	for (var counter = 0; counter < dwsl_contact.landline_data.length; counter++) {
		$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
			'<label for="landline_ec_'+(counter)+'">Landline #:</label>'+
			'<input type="text" class="form-control" id="landline_ec_'+(counter)+'" name="landline_ec_'+(counter)+'" value="'+dwsl_contact.landline_data[counter].landline_number+'" required>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Landline ID #:</label>'+
			'<input type="text" id="landline_ec_id_'+(counter)+'" class="form-control" value="'+dwsl_contact.landline_data[counter].landline_id+'" disabled>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Landline # Remarks:</label>'+
			'<input type="text" id="landline_ec_remarks_'+(counter)+'" class="form-control" value="'+dwsl_contact.landline_data[counter].landline_remarks+'">'+
			'</div>'+
			'</div>').appendTo("#landline-div");

		if (dwsl_contact.landline_data[counter].landline_id == null) {
			$('#landline_ec_'+(counter)).val('');
			$('#landline_ec_id_'+(counter)).val('');
			$('#landline_ec_remarks_'+(counter)).val('');
		}
	}


	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_number_ec" onclick="addAdditionalNumberEc()">Add another mobile number..</a></div></div>').appendTo("#mobile-div");
	for (var counter = 0; counter < dwsl_contact.mobile_data.length; counter++) {
		$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
			'<label for="mobile_ec_'+(counter)+'">Mobile #:</label>'+
			'<input type="text" class="form-control" id="mobile_ec_'+(counter)+'" name="mobile_ec_'+(counter)+'" value="'+dwsl_contact.mobile_data[counter].number+'" required>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Mobile ID #:</label>'+
			'<input type="text" id="mobile_ec_id_'+(counter)+'" class="form-control" value="'+dwsl_contact.mobile_data[counter].number_id+'" disabled>'+
			'</div>'+
			'<div class="col-md-2">'+
			'<label>Mobile # Status:</label>'+
			'<input type="text" id="mobile_ec_status_'+(counter)+'" class="form-control" value="'+dwsl_contact.mobile_data[counter].number_status+'">'+
			'</div>'+
			'<div class="col-md-2">'+
			'<label>Mobile # Priority:</label>'+
			'<input type="text" id="mobile_ec_priority_'+(counter)+'" class="form-control" value="'+dwsl_contact.mobile_data[counter].priority+'">'+
			'</div>'+
			'</div>').appendTo("#mobile-div");

		if (dwsl_contact.mobile_data[counter].number_id == null) {
			$('#mobile_ec_'+(counter)).val('');
			$('#mobile_ec_id_'+(counter)).val('');
			$('#mobile_ec_status_'+(counter)).val('');
			$('#mobile_ec_priority_'+(counter)).val('');
		}
	}

	$('#employee-contact-wrapper').prop('hidden',false);
}

function updateCmmtyContact(cmmty_contact) {
	console.log(cmmty_contact.ewi_data.ewi_status);
	$('#go_back').prop('hidden',false);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#cc_id').val(cmmty_contact.contact_info.id);
	$('#firstname_cc').val(cmmty_contact.contact_info.firstname);
	$('#lastname_cc').val(cmmty_contact.contact_info.lastname);
	$('#middlename_cc').val(cmmty_contact.contact_info.middlename);
	$('#nickname_cc').val(cmmty_contact.contact_info.nickname);
	$('#gender_cc').val(cmmty_contact.contact_info.gender);
	$('#salutation_cc').val(cmmty_contact.contact_info.salutation);
	$('#birthdate_cc').val(cmmty_contact.contact_info.birthday);
	$('#active_status_cc').val(cmmty_contact.contact_info.contact_active_status);
	$('#ewirecipient_cc').val(cmmty_contact.ewi_data[0].ewi_status);
	$('#mobile-div-cc').empty();
	$('#landline-div-cc').empty();

	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_landline_cc" onclick="addAdditionalLandlineCc()">Add another landline number..</a></div></div>').appendTo("#landline-div-cc");
	for (var counter = 0; counter < cmmty_contact.landline_data.length; counter++) {
		console.log(cmmty_contact.landline_data[counter].landline_number);
		$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
			'<label for="landline_cc_'+(counter)+'">Landline #:</label>'+
			'<input type="text" class="form-control" id="landline_cc_'+(counter)+'" name="landline_cc_'+(counter)+'" value="'+cmmty_contact.landline_data[counter].landline_number+'" required>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Landline ID #:</label>'+
			'<input type="text" id="landline_cc_id_'+(counter)+'" class="form-control" value="'+cmmty_contact.landline_data[counter].landline_id+'" disabled>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Landline # Remarks:</label>'+
			'<input type="text" id="landline_cc_remarks_'+(counter)+'" class="form-control" value="'+cmmty_contact.landline_data[counter].landline_remarks+'">'+
			'</div>'+
			'</div>').appendTo("#landline-div-cc");

		if (cmmty_contact.landline_data[counter].landline_id == null) {
			$('#landline_cc_'+(counter)).val('');
			$('#landline_cc_id_'+(counter)).val('');
			$('#landline_cc_remarks_'+(counter)).val('');
		}
	}


	$('<div class="row"><div class="col-md-6"><a href="#" id="add_additional_number_cc" onclick="addAdditionalNumberCc()">Add another mobile number..</a></div></div>').appendTo("#mobile-div-cc");
	for (var counter = 0; counter < cmmty_contact.mobile_data.length; counter++) {
		$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
			'<label for="mobile_ec_'+(counter)+'">Mobile #:</label>'+
			'<input type="text" class="form-control" id="mobile_cc_'+(counter)+'" name="mobile_cc_'+(counter)+'" value="'+cmmty_contact.mobile_data[counter].number+'" required>'+
			'</div>'+
			'<div class="col-md-4">'+
			'<label>Mobile ID #:</label>'+
			'<input type="text" id="mobile_cc_id_'+(counter)+'" class="form-control" value="'+cmmty_contact.mobile_data[counter].number_id+'" disabled>'+
			'</div>'+
			'<div class="col-md-2">'+
			'<label>Mobile # Status:</label>'+
			'<input type="text" id="mobile_cc_status_'+(counter)+'" class="form-control" value="'+cmmty_contact.mobile_data[counter].number_status+'">'+
			'</div>'+
			'<div class="col-md-2">'+
			'<label>Mobile # Priority:</label>'+
			'<input type="text" id="mobile_cc_priority_'+(counter)+'" class="form-control" value="'+cmmty_contact.mobile_data[counter].priority+'">'+
			'</div>'+
			'</div>').appendTo("#mobile-div-cc");

		if (cmmty_contact.mobile_data[counter].number_id == null) {
			$('#mobile_cc_'+(counter)).val('');
			$('#mobile_cc_id_'+(counter)).val('');
			$('#mobile_cc_status_'+(counter)).val('');
			$('#mobile_cc_priority_'+(counter)).val('');
		}
	}
	$('#community-contact-wrapper').prop('hidden',false);
}

function siteSelection(sites,user_sites = []) {
	var column_count = 12; // 12 rows 
	$('#new-site').remove();
	for (var counter = 0; counter < column_count; counter++) {
		$('#sitenames-cc-'+counter).empty();
	}
	
	for (var i = 0; i < sites.length; i++) {
		var modIndex = i % 12;
		var site = sites[i];
		console.log(sites[i]);
		$("#sitenames-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+site.psgc+'" name="sites" class="form-group" value="'+site.site_code+'">'+site.site_code.toUpperCase()+'</label></div>');
		for (var counter = 0; counter < user_sites.length; counter++) {
			if (user_sites[counter].org_psgc == site.psgc) {
				$("#sitenames-cc-"+modIndex).find(".checkbox").find("#id_"+site.psgc).prop('checked',true);
			}
		}
	}
	$('<div id="new-site" class="col-md-12"><a href="#" id="add-site"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Site not on the list?</a></div>').appendTo('#site-accord .panel-body');
}

function orgSelection(orgs,user_orgs = []) {
	var column_count = 7;
	$('#new-org').remove();
	for (var counter = 0; counter < column_count; counter++) {
		$('#orgs-cc-'+counter).empty();
	}

	for (var i = 0; i < orgs.length; i++) {
		var modIndex = i % 7;
		var org = orgs[i];
		console.log(orgs[i]);
		$("#orgs-cc-"+modIndex).append('<div class="checkbox"><label><input type="checkbox" id="id_'+org.org_name+'" name="orgs" class="form-group" value="'+org.org_name+'">'+org.org_name.toUpperCase()+'</label></div>');
		for (var counter = 0; counter < user_orgs.length; counter++) {
			if (user_orgs[counter].org_name == org.org_name) {
				$("#orgs-cc-"+modIndex).find(".checkbox").find("#id_"+org.org_name).prop('checked',true);
			}
		}
	}
	$('<div id="new-org" class="col-md-12"><a href="#" id="add-org"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Organization not on the list?</a></div>').appendTo('#organization-selection-div');
}

$('#comm-settings-cmd button[type="submit"]').on('click',function(){
	var mobile_count = $('#mobile-div-cc .row').length-1;
	var landline_count = $('#landline-div-cc .row').length-1;
	var contact_data = {};
	var mobile_raw = {};
	var mobile_data = [];
	var landline_raw = {};
	var landline_data = [];
	var sites_data = [];
	var organization_data = [];
	for (var counter = 0; counter < mobile_count; counter++) {
		if ($('#mobile_cc_'+counter).val() != "" || $('#mobile_cc_id_'+counter).val() != "") {
			mobile_raw = {
				'mobile_id': $('#mobile_cc_id_'+counter).val(),
				'mobile_number': $('#mobile_cc_'+counter).val(),
				'mobile_status': $('#mobile_cc_status_'+counter).val(),
				'mobile_priority': $('#mobile_cc_priority_'+counter).val()
			}
			mobile_data.push(mobile_raw);
		}
	}

	for (var counter = 0; counter < landline_count; counter++) {
		if ($('#landline_cc_'+counter).val() != "" || $('#landline_cc_id_'+counter).val() != "") {
			landline_raw = {
				'landline_id': $('#landline_cc_id_'+counter).val(),
				'landline_number': $('#landline_cc_'+counter).val(),
				'landline_remarks': $('#landline_cc_remarks_'+counter).val()
			}
			landline_data.push(landline_raw);
		}
	}

	$('input[name="sites"]:checked').each(function() {
		sites_data.push(this.value);
	});

	$('input[name="orgs"]:checked').each(function() {
		organization_data.push(this.value);
	});

	if ($('#settings-cmd').val() == "updatecontact") {
		contact_data = {
			'id': $('#cc_id').val(),
			'firstname': $('#firstname_cc').val(),
			'lastname': $('#lastname_cc').val(),
			'middlename': $('#middlename_cc').val(),
			'nickname': $('#nickname_cc').val(),
			'salutation': $('#salutation_cc').val(),
			'gender': $('#gender_cc').val(),
			'birthdate': $('#birthdate_cc').val(),
			'contact_active_status': $('#active_status_cc').val(),
			'ewi_recipient': $('#ewirecipient_cc').val(),
			'numbers': mobile_data,
			'landline': landline_data,
			'sites': sites_data,
			'organizations': organization_data
		}

		console.log(contact_data);
		msg = {
			'type': "updateCommunityContact",
			'data': contact_data
		}
		conn.send(JSON.stringify(msg));
	} else {
		contact_data = {
			'id': $('#cc_id').val(),
			'firstname': $('#firstname_cc').val(),
			'lastname': $('#lastname_cc').val(),
			'middlename': $('#middlename_cc').val(),
			'nickname': $('#nickname_cc').val(),
			'salutation': $('#salutation_cc').val(),
			'gender': $('#gender_cc').val(),
			'birthdate': $('#birthdate_cc').val(),
			'contact_active_status': $('#active_status_cc').val(),
			'ewi_recipient': $('#ewirecipient_cc').val(),
			'numbers': mobile_data,
			'landline': landline_data,
			'sites': sites_data,
			'organizations': organization_data
		}

		console.log(contact_data);
		msg = {
			'type': "newCommunityContact",
			'data': contact_data
		}
		conn.send(JSON.stringify(msg));
	}
});

$('#go_back').click(function(){
	if ($('#settings-cmd').val() == "updatecontact") {
		if ($('#contact-category').val() == "ccontacts") {
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			$('#go_back').prop('hidden',true);
			reset_cc();
			reset_ec();
			getComContact();
		} else {
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			$('#go_back').prop('hidden',true);
			reset_cc();
			reset_ec();
			getEmpContact();
		}
	} else {

	}
})

$('#emp-settings-cmd button[type="submit"]').on('click',function(){
	var mobile_count = $('#mobile-div .row').length-1;
	var landline_count = $('#landline-div .row').length-1;
	var contact_data = {};
	var mobile_raw = {};
	var mobile_data = [];
	var landline_raw = {};
	var landline_data = [];

	for (var counter = 0; counter < mobile_count; counter++) {
		if ($('#mobile_ec_'+counter).val() != "" || $('#mobile_ec_id_'+counter).val() != "") {
			mobile_raw = {
				'mobile_id': $('#mobile_ec_id_'+counter).val(),
				'mobile_number': $('#mobile_ec_'+counter).val(),
				'mobile_status': $('#mobile_ec_status_'+counter).val(),
				'mobile_priority': $('#mobile_ec_priority_'+counter).val()
			}
			mobile_data.push(mobile_raw);
		}
	}

	for (var counter =0; counter < landline_count; counter++) {
		if ($('#landline_ec_'+counter).val() != "" || $('#landline_ec_id_'+counter).val() != "") {
			landline_raw = {
				'landline_id': $('#landline_ec_id_'+counter).val(),
				'landline_number': $('#landline_ec_'+counter).val(),
				'landline_remarks': $('#landline_ec_remarks_'+counter).val()
			}
			landline_data.push(landline_raw);
		}
	}
		
	if ($('#settings-cmd').val() == "updatecontact") {
		contact_data = {
			'id': $('#ec_id').val(),
			'firstname': $('#firstname_ec').val(),
			'lastname': $('#lastname_ec').val(),
			'middlename': $('#middlename_ec').val(),
			'nickname': $('#nickname_ec').val(),
			'salutation': $('#salutation_ec').val(),
			'gender': $('#gender_ec').val(),
			'birthdate': $('#birthdate_ec').val(),
			'email_address': $('#email_ec').val(),
			'teams': $('#team_ec').val(),
			'contact_active_status': $('#active_status_ec').val(),
			'numbers': mobile_data,
			'landline': landline_data
		}

		msg = {
			'type': "updateDewslContact",
			'data': contact_data
		}
		conn.send(JSON.stringify(msg));
	} else {
		contact_data = {
			'firstname': $('#firstname_ec').val(),
			'lastname': $('#lastname_ec').val(),
			'middlename': $('#middlename_ec').val(),
			'nickname': $('#nickname_ec').val(),
			'salutation': $('#salutation_ec').val(),
			'gender': $('#gender_ec').val(),
			'birthdate': $('#birthdate_ec').val(),
			'email_address': $('#email_ec').val(),
			'teams': $('#team_ec').val(),
			'contact_active_status': $('#active_status_ec').val(),
			'numbers': mobile_data,
			'landline': landline_data
		}

		msg = {
			'type': "newDewslContact",
			'data': contact_data
		}
		conn.send(JSON.stringify(msg));
	}
});

var message_li_index;
$(document).on("click","#messages li",function(){
	message_li_index = $(this).index();
	gintags_msg_details = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	current_gintags = getGintagService(gintags_msg_details[5]);
	$('#gintag-modal').modal('toggle');
	$('.bootstrap-tagsinput').prop("disabled", true );
});

$('#gintags').on('beforeItemAdd', function(event) {
	if (gintags_msg_details[1] === "You") {
		if (event.item === "#EwiResponse" || event.item === "#GroundMeas") {
			console.log("Cannot add EwiResponse Tag for this message");
			event.cancel = true;
			$.notify("You cannot tag "+event.item+" if you are the sender","error");
		}
	} else {
		if (event.item === "#EwiMessage" || event.item === "#GroundMeasReminder") {
			console.log("Cannot add EwiMessage Tag for this message");
			event.cancel = true;
			$.notify("You cannot tag "+event.item+" if you are the recipient","error");
		}
	}
});

$('#confirm-gintags').click(function(){
	var tags = holdTags.split(',');
	var current_tags = $('#gintags').val().split(','); if(current_tags.length == 1 && current_tags[0] == 0) {current_tags = []};
	var diff = "";
	$('#gintag-modal').modal('toggle');
	if (tags.length > current_tags.length) {
		diff = $(tags).not(current_tags).get();
		removeGintagService(gintags_msg_details,diff);
	} else if (tags.length < current_tags.length){
		diff = $(tags).not(current_tags).get();
		insertGintagService(gintags_msg_details);
	} else {
		insertGintagService(gintags_msg_details);
	}
});

$('#gintags').tagsinput({
	typeahead: {
		displayKey: 'text',
		source: function (query) {
			var tagname_collection = [];
			$.ajax({
				url : "../../../gintagshelper/getAllGinTags",
				type : "GET",
				async: false,
				success : function(data) {
					var data = JSON.parse(data);
					for (var counter = 0; counter < data.length; counter ++) {
						tagname_collection.push(data[counter].tag_name);
					}
				}
			});
			return tagname_collection;
		}
	} 
});

$('#grouptags_ec').tagsinput({
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

function removeGintagService(data,tags){
	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});

	if (tagOffices.length != 0 && tagSitenames.length != 0) {
		if (data[1] == "You") {
			var gintag_details = {
				"office" : tagOffices,
				"site": tagSitenames,
				"data": data,
				"cmd": "delete",
				"tags": tags
			};
			getGintagGroupContacts(gintag_details);
		} else {
			var gintag_details = {
				"data": data,
				"cmd": "delete",
				"tags": tags
			};
			getGintagGroupContacts(gintag_details);
		}
	} else {
		var db_used = "";
		if (data[1] == "You") {
			db_used = "smsoutbox";
		} else {
			db_used = "smsinbox";
		}
		var gintag_details = {
			"data": data,
			"tags": tags,
			"db_used": db_used
		};
		removeIndividualGintag(gintag_details);
	}
}


$("#confirm-narrative").on('click',function(){
	var data = JSON.parse($('#gintag_details_container').val());
	$('#gintags').val(data.tags);
	var tagSitenames = [];
	var tags = $('#gintags').val();
	tags = tags.split(',');

	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});
	gintags_msg_details.tags = data.tags;
	console.log(data.tags);
	if (data.tags == "#EwiMessage" || data.tags == "#GroundMeasReminder") {
		getGintagGroupContacts(data);
		console.log(tags);
		for (var counter = 0; counter < tags.length; counter++) {
			if (tags[counter] == "#EwiMessage" || tags[counter] == "#GroundMeasReminder") {
				for (var tag_counter = 0; tag_counter < tagSitenames.length;tag_counter++) {
					getOngoingEvents(tagSitenames[tag_counter]);
				}
				break;
			}
		}
	} else if (data.tags == "#EwiResponse" || data.tags == "#GroundMeas") {
		if (tags[1] != "") {
			for (var i = 0; i < tags.length;i++) {
				gintags_collection = [];
				gintags = {
					'tag_name': tags[i],
					'tag_description': "communications",
					'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
					'tagger': tagger_user_id,
					'table_element_id': data.data[5],
					'table_used': data.data[6],
					'remarks': ""
				}
				gintags_collection.push(gintags);
				$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
				.done(function(response) {
					$( "#messages li" ).eq(message_li_index).addClass("tagged");
				});
			}
			$.notify("GINTAG successfully tagged!","success");
		}
		for (var counter = 0; counter < tags.length;counter++) {
			if (tags[counter] == "#EwiResponse" || tags[counter] == "#GroundMeas") {
				for (var tag_counter = 0; tag_counter < tagSitenames.length;tag_counter++) {
					getOngoingEvents(tagSitenames[tag_counter]);
				}
				break;
			}
		}
	} else {
		$.notify('Invalid Request, please try again.',"warning");
	}
});

function displayNarrativeConfirmation(gintag_details){
	if (gintag_details.data[1] == "You") {
		var summary = "";
		var office = "Office(s): ";
		var site = "Site(s): ";
		for (var counter = 0; counter < gintag_details.office.length; counter++) {
			office = office+gintag_details.office[counter]+" ";
		}

		for (var counter = 0; counter < gintag_details.site.length; counter++) {
			site = site+gintag_details.site[counter]+" ";
		}

		summary = office+"\n"+site+"\n\n"+gintag_details.data[4];
		console.log(gintag_details.data);
		$('#save-narrative-content p').text("Saving an "+tag_indicator+" tagged message will be saved to narratives.");
		$('#ewi-tagged-msg').val(summary);
	} else {
		var summary = "";
		var sender = "Sender(s): "+gintag_details.data[1];
		summary = sender+"\n\n"+gintag_details.data[4];
		console.log(gintag_details.data);
		$('#save-narrative-content p').text("Saving an "+tag_indicator+" tagged message will be saved to narratives.");
		$('#ewi-tagged-msg').val(summary);
	}
	$('#save-narrative-modal').modal('toggle');
}

function insertGintagService(data){
	var tags = $('#gintags').val();
	var gintags;
	var gintags_collection = [];
	tags = tags.split(',');

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});

	if (tagOffices.length != 0 && tagSitenames.length != 0) {
		if (data[1] == "You") {
			var gintag_details = {
				"office" : tagOffices,
				"site": tagSitenames,
				"data": data,
				"cmd": "insert"
			};
			if ($.inArray("#EwiMessage",tags) != -1) {
				tag_indicator = "#EwiMessage";
			} else if ($.inArray('#GroundMeasReminder',tags) != -1) {
				tag_indicator = "#GroundMeasReminder";
			}

			if ($.inArray("#EwiMessage", tags) != -1 || $.inArray('#GroundMeasReminder',tags) != -1) {
				var tags = $('#gintags').val();
				tags = tags.split(',');
				tags.splice($.inArray(tag_indicator, tags),1);
				$('#gintags').val(tags);
				getGintagGroupContacts(gintag_details);
				gintag_details.tags = tag_indicator;
				$("#gintag_details_container").val(JSON.stringify(gintag_details));
				displayNarrativeConfirmation(gintag_details);
			} else {
				getGintagGroupContacts(gintag_details);
			}

		} else {
			if ($.inArray("#EwiResponse",tags) != -1 || $.inArray('#GroundMeas',tags) != -1) {
				var gintag_details = {
					"data": data,
					"cmd": "insert"
				};
			
				if ($.inArray("#EwiResponse",tags) != -1) {
					tag_indicator = "#EwiResponse"
				} else if ($.inArray('#GroundMeas',tags) != -1) {
					tag_indicator = "#GroundMeas";
				}
				var tags = $('#gintags').val();
				tags = tags.split(',');
				tags.splice($.inArray(tag_indicator, tags),1);
				$('#gintags').val(tags);
				gintag_details.tags = tag_indicator;
				if (tags[1] != "") {
					for (var i = 0; i < tags.length;i++) {
						gintags_collection = [];
						gintags = {
							'tag_name': tags[i],
							'tag_description': "communications",
							'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
							'tagger': tagger_user_id,
							'table_element_id': data[5],
							'table_used': data[6],
							'remarks': ""
						}
						gintags_collection.push(gintags);
						$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
						.done(function(response) {
							$( "#messages li" ).eq(message_li_index).addClass("tagged");
						});
					}
					$.notify("GINTAG successfully tagged!","success");
				}
				$("#gintag_details_container").val(JSON.stringify(gintag_details));
				displayNarrativeConfirmation(gintag_details);
			} else {
				for (var i = 0; i < tags.length;i++) {
					gintags_collection = [];
					gintags = {
						'tag_name': tags[i],
						'tag_description': "communications",
						'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
						'tagger': tagger_user_id,
						'table_element_id': data[5],
						'table_used': data[6],
						'remarks': ""
					}
					gintags_collection.push(gintags);
					$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
					.done(function(response) {
						$( "#messages li" ).eq(message_li_index).addClass("tagged");
					});
				}
				$.notify("GINTAG successfully tagged!","success");
			}
		}

	} else {
		for (var i = 0; i < tags.length;i++) {
			gintags_collection = [];
			gintags = {
				'tag_name': tags[i],
				'tag_description': "communications",
				'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
				'tagger': tagger_user_id,	
				'table_element_id': data[5],
				'table_used': data[6],
				'remarks': ""
			}
			gintags_collection.push(gintags);
			$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
			.done(function(response) {
				$( "#messages li" ).eq(message_li_index).addClass("tagged");
			});
		}
		$.notify("GINTAG successfully tagged!","success");
	}
}

function removeIndividualGintag(gintag_details){
	$.post("../generalinformation/removeIndividualGintagEntryViaChatterbox", {gintags: gintag_details})
	.done(function(response) {
		$.notify("GINTAG successfully removed!","success");
		$( "#messages li" ).eq(message_li_index).removeClass("tagged");
	});
}

function getGintagGroupContacts(gintag_details){
	if (gintag_details.cmd == "insert" ) {
		var tags = $('#gintags').val();
		tags = tags.split(',');
		if (tags[0] != "") {
			$.post( "../communications/chatterbox/gintagcontacts/", {gintags: JSON.stringify(gintag_details)})
			.done(function(response) {
				var data = JSON.parse(response);
				for (var i = 0; i < tags.length; i++) {
					gintags_collection = [];
					for (var x = 0 ; x < data.length; x++) {
						for (var y = 0; y < data[x].length; y++) {
							gintags = {
								'tag_name': tags[i],
								'tag_description': "communications",
								'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
								'tagger': tagger_user_id,
								'table_element_id': data[x][y].sms_id,					
								'table_used': "smsoutbox",
								'remarks': ""
							}
							gintags_collection.push(gintags);
						}
					}
					if (gintags_collection != null || gintags_collection.length > 0) {
						$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
						.done(function(response) {
							$( "#messages li" ).eq(message_li_index).addClass("tagged");
						});
					}
				}
				$.notify("GINTAG successfully tagged ","success");
			});
		}
	} else if (gintag_details.cmd == "delete") {
		if (gintag_details.data[1] == "You") {
			$.post( "../communications/chatterbox/gintagcontacts/", {gintags: JSON.stringify(gintag_details)})
			.done(function(response) {
				var data = JSON.parse(response);
				var number_collection = [];
				for (var counter = 0; counter < data.length;counter++){
					var numbers = data[counter].number.split(',');
					for (var num_count = 0; num_count < numbers.length;num_count++){
						number_collection.push(numbers[num_count]);
					}
				}
				var toBeRemoved = {	
					'contact': number_collection,
					'details': gintag_details
				}
				console.log(toBeRemoved);
				$.post( "../generalinformation/removeGintagsEntryViaChatterbox/", {gintags: toBeRemoved})
				.done(function(response) {
					$.notify("GINTAG successfully removed!","success");
					$( "#messages li" ).eq(message_li_index).removeClass("tagged");
				});
			});
		} else {
			var toBeRemoved = {
				'details':gintag_details
			}
			$.post( "../generalinformation/removeGintagsEntryViaChatterbox/", {gintags: toBeRemoved})
			.done(function(response) {
				$.notify("GINTAG successfully removed!","success");
				$( "#messages li" ).eq(message_li_index).removeClass("tagged");
			});

		}
	}
}

$('#reset-gintags').on('click',function(){
	$('#gintags').val('');
	$('#gintags').tagsinput("removeAll");
	getGintagService(gintags_msg_details[5]);
});

var holdTags;
function getGintagService(data){
	$('#gintags').val('');
	$('#gintags').tagsinput("removeAll");
	$.get("/../../gintagshelper/getGinTagsViaTableElement/" + data, function(response) {
		for (var i = 0; i < response.length; i++) {
			$('#gintags').tagsinput('add',response[i].tag_name);
		}
		holdTags = $('#gintags').val();
	}, "json")
}

function updateContactService(data,wrapper){
	$.post( "../communications/chatterbox/updatecontacts", {contact: JSON.stringify(data)})
	.done(function(response) {
		console.log(response);
		if (wrapper == "employee-contact-wrapper") {
			getEmpContact();
		} else {
			getComContact();
		}
		if (response == "true") {
			$('#contact-result').remove();
			$.notify('Success! Existing contact updated.','success');
			$('#employee-contact-wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', true);
		} else {
			$('#contact-result').remove();
			var container = document.getElementById(wrapper);
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> Invalid input data";
			container.insertBefore(resContainer,container.childNodes[0]);
		}
	});
}
});

function addAdditionalLandlineEc(){
	var landline_count = $('#landline-div .row').length-1;
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="landline_ec_'+landline_count+'">Landline #:</label>'+
		'<input type="text" class="form-control" id="landline_ec_'+landline_count+'" name="landline_ec" value="" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline ID #:</label>'+
		'<input type="text" id="landline_ec_id_'+landline_count+'" class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline # Remarks:</label>'+
		'<input type="text" id="landline_ec_remarks_'+landline_count+'" class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo('#landline-div');
}

function addAdditionalNumberEc(){
	var mobile_count = $('#mobile-div .row').length-1;
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="mobile_ec">Mobile #:</label>'+
		'<input type="text" class="form-control" id="mobile_ec_'+mobile_count+'" name="mobile_ec" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Mobile ID #:</label>'+
		'<input type="text" id="mobile_ec_id_'+mobile_count+'"class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Status:</label>'+
		'<input type="text" id="mobile_ec_status_'+mobile_count+'"class="form-control" value="">'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Priority:</label>'+
		'<input type="text" id="mobile_ec_priority_'+mobile_count+'"class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo('#mobile-div');
}

function addAdditionalLandlineCc(){
	var landline_count = $('#landline-div-cc .row').length-1;
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="landline_cc_'+landline_count+'">Landline #:</label>'+
		'<input type="text" class="form-control" id="landline_cc_'+landline_count+'" name="landline_cc" value="" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline ID #:</label>'+
		'<input type="text" id="landline_cc_id_'+landline_count+'" class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Landline # Remarks:</label>'+
		'<input type="text" id="landline_cc_remarks_'+landline_count+'" class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo('#landline-div-cc');
}

function addAdditionalNumberCc(){
	var mobile_count = $('#mobile-div-cc .row').length-1;
	$('<div class="row"><div class="col-md-4" title="Notes: If contact number is more than one seprate it by a comma.">'+
		'<label for="mobile_cc">Mobile #:</label>'+
		'<input type="text" class="form-control" id="mobile_cc_'+mobile_count+'" name="mobile_cc" required>'+
		'</div>'+
		'<div class="col-md-4">'+
		'<label>Mobile ID #:</label>'+
		'<input type="text" id="mobile_cc_id_'+mobile_count+'"class="form-control" value="" disabled>'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Status:</label>'+
		'<input type="text" id="mobile_cc_status_'+mobile_count+'"class="form-control" value="">'+
		'</div>'+
		'<div class="col-md-2">'+
		'<label>Mobile # Priority:</label>'+
		'<input type="text" id="mobile_cc_priority_'+mobile_count+'"class="form-control" value="">'+
		'</div>'+
		'</div>').appendTo('#mobile-div-cc');
}