function sendViaAlertMonitor(data){
	console.log(data);
	$.ajax({
		type: "GET",
		url: "../chatterbox/getewi",             	
		dataType: "json",	
		success: function(response){
			var formGroundTime;
			var formCurrentTime;
			var months = {1: "January",2: "February",3: "March",
			4: "April",5: "May",6: "June",
			7: "July",8: "August", 9: "September",
			10: "October", 11: "November", 12: "December"};		
			console.log(data["internal_alert_level"].toUpperCase());
			if (data["internal_alert_level"].toUpperCase().length > 4) {
				if (data["internal_alert_level"].toUpperCase().substring(0, 2) == "A2") {
					var preConstructedEWI = response["A2"];
				} else {
					var preConstructedEWI = response["A3"];
				}
			} else {
				if (data["internal_alert_level"].toUpperCase().substring(0, 2) == "ND" && data['status'] != 'extended') {
					var preConstructedEWI = response["A1-"+data["internal_alert_level"].toUpperCase().substring(3)];
				} else {
					var preConstructedEWI = "";
					if (data['day'] == "3") {
						preConstructedEWI = response["ROUTINE"];	
					} else {
						preConstructedEWI = response["A0"];	
					}
				}
				
			}

			if (data['status'] == 'extended') {
				switch(data['day']) {
					case 0:
					preConstructedEWI = preConstructedEWI.replace("%%EXT_DAY%%","pangalawang araw");
					break;
					case 1:
					preConstructedEWI = preConstructedEWI.replace("%%EXT_DAY%%","pangatlong araw");
					break;
					case 2:
					preConstructedEWI = preConstructedEWI.replace("%%EXT_DAY%%","huling araw");
				}
				var ext_month = moment().add(1, 'days').format("MM");
				var ext_day = moment().add(1, 'days').format("DD");
				var ext_year = moment().add(1, 'days').format("YYYY");

				preConstructedEWI = preConstructedEWI.replace("%%EXT_NEXT_DAY%%",ext_day+" "+months[parseInt(ext_month)]+" "+ext_year);
			}

			var constructedEWIDate = "";
			var finalEWI = ""
			var d = new Date();
			var currentPanahon = d.getHours();
			if (currentPanahon >= 12 && currentPanahon <= 18) {
				constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","hapon");
			} else if (currentPanahon > 18 && currentPanahon <=23) {
				constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","gabi");
			} else {
				constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","umaga");
			}

			//Changes the Date
			var year = moment().locale('en').format("YYYY-MM-DD").substring(0, 4);
			var month = moment().locale('en').format("YYYY-MM-DD").substring(5, 7);
			var day = moment().locale('en').format("YYYY-MM-DD").substring(8, 10);

			var reconstructedDate = day+" "+months[parseInt(month)]+" "+year;

			constructedEWIDate = constructedEWIDate.replace("%%DATE%%",reconstructedDate);
			var ewiLocation = data["sitio"]+","+data["barangay"]+","+data["municipality"]+","+data["province"];

			var formatSbmp = ewiLocation.replace("null","");
			if (formatSbmp.charAt(0) == ",") {
				formatSbmp = formatSbmp.substr(1);
			}

			var formSBMP = constructedEWIDate.replace("%%SBMP%%",formatSbmp);
			var currentTime = moment().locale('en').format("YYYY-MM-DD HH:mm");
			// to be converted to swtich case.
			if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD 00:00")).valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD 07:30")).valueOf()) {
				formGroundTime = formSBMP.replace("%%GROUND_DATA_TIME%%",day+" "+months[parseInt(month)]+" bago mag-7:30AM");
				formGroundTime = formGroundTime.replace("%%NOW_TOM%%","mamayang");
				if (moment(currentTime).valueOf() > moment(moment().locale('en').format("YYYY-MM-DD 07:55")).valueOf()) {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%","8:00 AM");
				} else {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%",moment().locale('en').format("hh:mm A"));
				}
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD 7:30")).valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD 11:30")).valueOf()) {
				formGroundTime = formSBMP.replace("%%GROUND_DATA_TIME%%",day+" "+months[parseInt(month)]+" bago mag-11:30 AM");	
				formGroundTime = formGroundTime.replace("%%NOW_TOM%%","mamayang");
				if (moment(currentTime).valueOf() > moment(moment().locale('en').format("YYYY-MM-DD 11:55")).valueOf()) {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%","12:00 NN");
				} else {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%",moment().locale('en').format("hh:mm A"));
				}
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD 11:30")).valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD 15:30")).valueOf()) {
				formGroundTime = formSBMP.replace("%%GROUND_DATA_TIME%%",day+" "+months[parseInt(month)]+" bago mag-03:30PM");
				formGroundTime = formGroundTime.replace("%%NOW_TOM%%","mamayang");
				if (moment(currentTime).valueOf() > moment(moment().locale('en').format("YYYY-MM-DD 15:55")).valueOf()) {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%","4:00 PM");
				} else {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%",moment().locale('en').format("hh:mm A"));
				}
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD 15:30")).valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD 23:59")).valueOf()){
				formGroundTime = formSBMP.replace("%%GROUND_DATA_TIME%%",(parseInt(day)+1)+" "+months[parseInt(month)]+" bago mag-07:30AM");
				formGroundTime = formGroundTime.replace("%%NOW_TOM%%","bukas ng");
				if (moment(currentTime).valueOf() > moment(moment().locale('en').format("YYYY-MM-DD 19:55")).valueOf()) {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%","8:00 PM");
				} else {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%",moment().locale('en').format("hh:mm A"));
				}
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD 00:00")).add(24,"hours").valueOf()){
				formGroundTime = formSBMP.replace("%%GROUND_DATA_TIME%%",(parseInt(day)+1)+" "+months[parseInt(month)]+" bago mag-7:30AM");
				formGroundTime = formGroundTime.replace("%%NOW_TOM%%","mamayang");
				if (moment(currentTime).valueOf() > moment(moment().locale('en').format("YYYY-MM-DD 23:55")).valueOf()) {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%","12:00 MN");
				} else {
					formCurrentTime = formGroundTime.replace("%%CURRENT_TIME%%",moment().locale('en').format("hh:mm A"));
				}
			} else {
				alert("Error Occured: Please contact Administrator");
			}

			if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 00:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 04:00 AM");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","mamayang");
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 08:00 AM");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","mamayang");
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 12:00 NN");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","mamayang");
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 04:00 PM");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","mamayang");
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 08:00 PM");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","mamayang");
			} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').add(24, "hours").format("YYYY-MM-DD")+" 00:00").valueOf()) {
				finalEWI = formCurrentTime.replace("%%NEXT_EWI%%"," 12:00 MN");
				finalEWI = finalEWI.replace("%%N_NOW_TOM%%","bukas ng");
			} else {
				alert("Error Occured: Please contact Administrator");
			}

			
			$('#site-abbr').val(data["name"]);
			$('#constructed-ewi-amd').val(finalEWI);
		}
	});
$('#ewi-asap-modal').modal('toggle');
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
	var connection_status = true; // True means Connected.
	var conn = connectWS();
	var quickGroupSelectionFlag = false;
	var delayReconn = 10000;	//10 Seconds
	var gsmTimestampIndicator = "";
	var gintags_msg_details;

	// first_name came from PHP Session Variable. Look for chatterbox.php
	//	in case you want to edit it.\

	try {
		var footer = "\n\n-" + first_name + " from PHIVOLCS-DYNASLOPE";
		var remChars = 800 - $("#msg").val().length - footer.length;

		$("#remaining_chars").text(remChars);
		$("#msg").attr("maxlength", remChars);

		var messages_template_both = Handlebars.compile($('#messages-template-both').html());
		var selected_contact_template = Handlebars.compile($('#selected-contact-template').html());
		var quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());

	} catch (err) {
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

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.

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

					// //only push the message if it belongs to the groupTags
					// messages.push(msg);
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
					//only push the message if it belongs to the groupTags
					//Don't include message if "msg.name" is "unknown"
					if (msg.name == "unknown") {
						return;
					}
					//Use "sitenames" as the primary filter
					var isTargetSite = false;
					for (i in groupTags.sitenames) {
						if ((msg.name.toUpperCase()).indexOf(groupTags.sitenames[i].toUpperCase()) >= 0) {
							isTargetSite = true;
							continue;
						}
					}

					if (isTargetSite == false) {
						return;
					}

					//Use "offices" as the secondary filter
					var isOffices = false;
					for (i in groupTags.offices) {
						if ((msg.name.toUpperCase()).indexOf(groupTags.offices[i].toUpperCase()) >= 0) {
							isOffices = true;
							continue;
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
				//substitute number for name of registered user from contactInfo
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
					var maxScroll = $(document).height() - $(window).height();
					$('html, body').scrollTop(maxScroll);
					// Clears the messages container if already displayed.
					messages = [];

				} else {
					var messages_html = messages_template_both({'messages': messages});
					$('#messages').html(messages_html);
					var maxScroll = $(document).height() - $(window).height();
					$('html, body').scrollTop(maxScroll);
				}
			} catch(err){
				console.log(err);
				console.log("Not a Scroll/Search related feature");
			}
		}
	}

	function updateQuickInbox(msg) {
		if (msg.user == "You") {
			//Don't do anything if the message came from Dynaslope
		}
		else {

			var targetInbox;
			var quick_inbox_html;

			if (msg.name == "unknown") {
				try {
					msg.isunknown = 1;
					targetInbox = "#quick-inbox-unknown-display";

					//Message Pushing using unshift (push at the start of the array)
					quick_inbox_unknown.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_unknown});
				} catch(err) {
					// Do nothing. Chatterbox: Monitoring Dashboard mode.
				}
			}
			else {
				try {
					msg.isunknown = 0;
					targetInbox = "#quick-inbox-display";

					//Message Pushing using unshift (push at the start of the array)
					quick_inbox_registered.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_registered});
				} catch(err) {
					// Do nothing. Chatterbox: Monitoring Dashboard mode.
				}
			}

			$(targetInbox).html(quick_inbox_html);

			//Scroll to the top of the quick inbox
			$(targetInbox).scrollTop(0);
		}
	}

	function loadMessageHistory(msg) {
		//TODO: load the historical message here
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
			//Loop through the JSON msg and
			//	use updateMessages multiple times
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
			//substitute number for name of registered user from contactInfo
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

	$(window).scroll(function(){
		var scroll = $(window).scrollTop();
		if ($(document).height() > $(window).height()) {
			if (scroll == 0 && convoFlagger == false){
				console.log(msgType);
				if (msgType == "smsload") {
					getOldMessage();
				} else if (msgType == "smsloadrequestgroup" || msgType == "smssendgroup") {
					getOldMessageGroup();
				} else {
					console.log("Invalid Request/End of the Conversation");
				}
			}
		}
	});

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
		$('#loading').modal('toggle');
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

		//Request for message exchanges from the groups selected
		conn.send(JSON.stringify(request));
		$('#loading').modal('toggle');
	}

	function initLoadQuickInbox(quickInboxMsg) {
		// console.log(quickInboxMsg);

		if (quickInboxMsg.data == null) {
			return;
		}

		console.log("initLoadQuickInbox");
		//Loop through the JSON msg and
		//	use updateMessages multiple times
		var qiMessages = quickInboxMsg.data;
		temp = quickInboxMsg.data;
		var msg;
		for (var i = qiMessages.length - 1; i >= 0; i--) {
			msg = qiMessages[i];
			updateQuickInbox(msg);
		}
	}

	function loadOfficesAndSites(msg) {
		var offices = msg.offices;
		var sitenames = msg.sitenames;
		var office, sitename;

		//Load the offices on the modal
		for (var i = 0; i < offices.length; i++) {
			var modIndex = i % 5;

			office = offices[i];
			$("#offices-"+modIndex).append('<div class="checkbox"><label><input name="offices" type="checkbox" value="'+office+'">'+office+'</label></div>');
		}

		//Load the site names on the modal
		for (var i = 0; i < sitenames.length; i++) {
			var modIndex = i % 6;

			sitename = sitenames[i];
			$("#sitenames-"+modIndex).append('<div class="checkbox"><label><input name="sitenames" type="checkbox" value="'+sitename+'">'+sitename+'</label></div>');
		}
	}

	//Connect the app to the Web Socket Server
	function connectWS() {
		console.log("trying to connect to web socket server");
		// var tempConn = new WebSocket('ws://www.dewslandslide.com:5050');
		var tempConn = new WebSocket('ws://localhost:5050'); // For local server

		tempConn.onopen = function(e) {
			console.log("Connection established!");
			enableCommands(); // Enable commands for chatterbox

			connection_status = true;
			WSS_CONNECTION_STATUS = 0;
			delayReconn = 10000;

			if (isFirstSuccessfulConnect) {
				getOfficesAndSitenames();
				setTimeout(
					function() {
						getInitialQuickInboxMessages();
					}, 
					500);

				//set flag to false after successful loading
				isFirstSuccessfulConnect = false;
			}

			// a setInterval has been fired
			if (window.timerID) {
				window.clearInterval(window.timerID);
				window.timerID = 0;
			}

			//Enable the functionality of "send button"
			$("#send-msg").removeClass("disabled");
		};

		tempConn.onmessage = function(e) {
			$('#loading').modal('hide');
			var msg = JSON.parse(e.data);
			tempMsg = msg;
			msgType = msg.type;
			if ((msg.type == "smsload") || (msg.type == "smsloadrequestgroup") || (msg.type == "loadEmployeeTag")){
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
				loadSearchedMessage(msg);
				msgType = "searchMessage";
			} else if (msg.type == "searchMessageGlobal") {
				loadSearchedMessage(msg);
			} else if (msg.type == "searchMessageGroup") {
				loadSearchedMessage(msg);
				msgType = "searchMessageGroup";
			} else if (msg.type == "smsLoadSearched" || msg.type == "smsLoadGroupSearched"){
				loadSearchedMessage(msg);
			} else if (msg.type == "smsloadGlobalSearched"){
				loadSearchedMessage(msg);
			}
			else if (msg.type == "smsloadquickinbox") {
				initLoadQuickInbox(msg)
			}
			else if (msg.type == "loadofficeandsites") {
				// loadCommunityContactRequest(msg);
				officesAndSites = msg;
				loadOfficesAndSites(officesAndSites);
			}
			else if (msg.type == "loadnamesuggestions") {
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
			}
			else {

				var numbers = /^[0-9]+$/; 
				console.log(msg);
				if (msg.type == "ackgsm") {
					if ($("#chat-user").text() == "You" && $("#messages li:last #timestamp-written").text() == gsmTimestampIndicator) {
						$("#messages li:last #timestamp-sent").html(msg.timestamp_sent);
					}
				}

				if (contactInfo == "groups") {
					updateMessages(msg);
				}
				else {
					if (msg.type == "smsrcv") {
						//Update the Quick Inbox from the incoming real time messages
						updateQuickInbox(msg);
					}

					if(msg.user.match(numbers)) {
						console.log("all numbers");
						for (i in contactnumTrimmed) {
							// console.log(contactnumTrimmed[i]);
							if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.user)) {
								updateMessages(msg);
								return;
							}
						}
					}
					else {
						console.log("alphanumeric keywords for msg.user");
						//Assumption: Alpha numeric users only come from the browser client

						//Update messages on user interface only if recipient is found in 
						//	target contact info
						for (i in contactnumTrimmed) {
							// console.log(contactnumTrimmed[i]);
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
	        //alert(event.code);
	        // See http://tools.ietf.org/html/rfc6455#section-7.4.1
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
	        	// $("#connectionStatusModal").modal("show");

	        	//Disables the commands for chatterbox if the connection lost.
	        	disableCommands();

	        	connection_status = false;
				//Enable the functionality of "send button"
				$("#send-msg").addClass("disabled");

	       		// reconnect to the WSS
	       		waitForSocketConnection();
	       	}
	       	else if(event.code == 1007)
	       		reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
	       	else if(event.code == 1008)
	       		reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
	       	else if(event.code == 1009)
	       		reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
	        else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
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

	// Make the function wait until the connection is made...
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

						// Add 1 second for everytime the reconnection is triggered
						//	will reset once connected
						if (delayReconn < 20000) {
							delayReconn += 1000;
						}
					}

		        }, delayReconn); // wait delayReconn seconds for the connection...
		}
	}

	//9xx-xxxx-xxx format
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

	//639xx-xxxx-xxx format
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

		//request for message history of selected number
		conn.send(JSON.stringify(nameSuggestionRequest));
	};

	function parseContactInfo (multipleContactInfo) {
		// var n = multipleContactInfo.search(' - ');
		// var size = multipleContactInfo.length;
		// contactname = multipleContactInfo.slice(0,n);
		// contactnum = multipleContactInfo.slice(n + 3, multipleContactInfo.length);
		// contactnumTrimmed = [];

		parseSingleContactInfo(multipleContactInfo);
	}

	function parseSingleContactInfo (singleContactInfo) {
		var n = singleContactInfo.search(' - ');
		var size = singleContactInfo.length;
		testName = singleContactInfo.slice(0,n);
		testNumbers = singleContactInfo.slice(n + 3,singleContactInfo.length);
		var tempNum;
		var searchIndex = 0;
		//multiContactsList = [];
		
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
			//Number is Unknown
			tempText = qiFullContact;
			document.title = tempText;
		} 
		else {
			//Number is known
			var posDash = qiFullContact.search(" - ");
			tempText = qiFullContact.slice(0, posDash);
		}
	}
	$("#current-contacts h4").text(tempText);
	document.title = tempText;
	$('#search-lbl').css('display', 'block')
	$('#search-lbl h5').show();
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
	searchMessageGlobal($('#search-global-keyword').val());
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
				// Do nothing
			}
		}
		var request = {
			'type': 'searchMessageIndividual',
			'number': contactnumTrimmed,
			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
			'searchKey': $('#search-key').val()
		};

		conn.send(JSON.stringify(request));
		$('#loading').modal('toggle');
	}

	function searchMessageGroup(){
		//Reset the group tags
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

		//sort the sitename values in the array alphabetically
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

		//Request for message exchanges from the groups selected
		conn.send(JSON.stringify(request));
		$('#loading').modal('toggle');
	}

	function searchMessageGlobal(searchKey){
		request = {
			'type': "searchMessageGlobal",
			'searchKey': searchKey
		}
		conn.send(JSON.stringify(request));
		$('#loading').modal('toggle');
	}

	var coloredTimestamp;

	$(document).on("click","#search-result li",function(){
		var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
		console.log(($(this).closest('li')).find("input[id='msg_details']").val());
		console.log(data);
		loadSearchKey(data[0],data[1],data[2],data[3],data[4]);
	})

	$(document).on("click","#search-global-result li",function(){
		var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
		console.log(data);
		console.log(($(this).closest('li')).find("input[id='msg_details']").val());
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

		} else if (type == "searchMessageGlobal"){

			// console.log(msg);
			contactInfo = [{'fullname':user,'numbers': '0'+trimmedContactNum(user_number)}];

			$("#current-contacts h4").text(user);
			document.title = user;
			$('#search-lbl').css('display', 'block')
			$('#search-lbl h5').show();
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

	//HandleBars Helper
	try {
		Handlebars.registerHelper('ifCond', function(v1, v2, v3, v4,options) {
			if(v1 === v2 || v1 == v3 || v1 == v4) {
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
		// Do nothing. Chatterbox: Monitoring dashboard mode
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
				console.log(err);
				console.log("No Result/Invalid Request");
			}
			var messages_html = messages_template_both({'messages': searchResults});
			console.log(searchResults);
			$('#search-result').html(messages_html);
			$('#search-result-modal').modal('toggle');

		if (msg.type == "searchMessage") { // DISABLED FOR NOW: ISSUE: Does not fetch the old message via scroll feature
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
			console.log(err);
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
		console.log(searchedResult);
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
			console.log(err);
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

			// Colors the div of the searched key message

			var targetLi = document.getElementById(coloredTimestamp);
			targetLi.style.borderColor = "#dff0d8";
			targetLi.style.borderRadius = "3px";
			targetLi.style.borderWidth = "5px";
			$('html, body').scrollTop(targetLi.offsetTop - 300);

		} else if (msg.type == "searchMessageGlobal"){
			messages = [];
			var searchedResult = msg.data;
			var res;
			try {
				for (var i = searchedResult.length - 1; i >= 0; i--) {
					res = searchedResult[i];
					updateGlobalMessage(res);
					counters++;
				}
			} catch(err) {
				console.log(err);
				console.log("No Result/Invalid Request");
			}

			var messages_html = messages_template_both({'messages': searchResults});
			$('#search-global-result').html(messages_html);
			var maxScroll = $(document).height() - $(window).height();
			$('#search-global-result').scrollTop(maxScroll);

		} else {
			console.log("No Result/Invalid Request");
		}

		// Resets the Search Result container
		searchResults = [];
		counters = 0;
	}

	function updateGlobalMessage(msg){
		if (msg.user == "You") {
			msg.isyou = 1;
			searchResults.push(msg);
		} else {
			msg.isyou = 0;
			msg.user = msg.user + " - " + msg.user_number;
			searchResults.push(msg);
		}
	}

	function displayGroupTagsForThread () {
		var tempText = "[Sitenames: ";
		var titleSites = "";
		var tempCountSitenames = groupTags.sitenames.length;
		for (i in groupTags.sitenames) {
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
		$("#current-contacts h4").text(tempText);
		document.title = tempText;
		$('#search-lbl').css('display', 'block')
		$('#search-lbl h5').show();
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
		$("#current-contacts h4").text(tempText);
		document.title = tempText;
		$('#search-lbl').css('display', 'block')
		$('#search-lbl h5').show();

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
					//comboplete.minChars = 3;
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
		    // get keycode of current keypress event
		    var code = (e.keyCode || e.which);

		    // do nothing if it's an arrow key
		    if(code == 37 || code == 38 || code == 39 || code == 40) {
		    	return;
		    }

		    var allNameQueries = $('.dropdown-input').val();
		    var nameQuery = getFollowingNameQuery(allNameQueries);

		    if (allNameQueries.length < 3) {
				//Reset the contacts list
				multiContactsList = [];
				contactnumTrimmed = [];
			}

			if (nameQuery.length >= 3) {
				//Get autocomplete data from the WSS
				getNameSuggestions(nameQuery);

			}
			else {
				comboplete.close();
			}
			
		}, false);

		Awesomplete.$('.dropdown-input').addEventListener("awesomplete-selectcomplete", function(e){
			// User made a selection from dropdown. 
			// This is fired after the selection is applied
			var allText = $('.dropdown-input').val();
			var size = allText.length;
			var allNameQueries = allText.slice(0, size-2);
			var nameQuery = getFollowingNameQuery(allNameQueries);

			parseContactInfo(nameQuery);
		}, false);
	} catch(err) {
		//Do nothing. Chatterbox: Monitoring dashboard mode
	}

	var qiFullContact = null;

	$(document).on("click","#quick-inbox-display li",function(){
		quickInboxStartChat($(this).closest('li').find("input[type='text']").val());
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
				//If we are contacting an unregistered number
				contactname = $('.dropdown-input').val();
				contactnum = contactname;
				contactnumTrimmed = [trimmedContactNum(contactnum)];

				contactInfo = [{'fullname':contactname,'numbers':contactnum}];
			}
		}
		else if (source == "quickInbox") {
			//If we are contacting an unregistered number
			contactname = qiFullContact;
			contactnum = contactname;
			contactnumTrimmed = [trimmedContactNum(contactnum)];

			contactInfo = [{'fullname':contactname,'numbers':contactnum}];
		}
		//Display Names of contacts for the thread being loaded
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
		//request for message history of selected number
		conn.send(JSON.stringify(msgHistory));
		$('#loading').modal('toggle');
	}

	// Chat with selected recipients
	$('#go-chat').click(function() {
		//Reset the timestamp flaggers
		lastMessageTimeStamp = "";
		lastMessageTimeStampYou = "";
		tempTimestamp = "";
		tempTimestampYou = "";

		if (connection_status == false){
			console.log("NO CONNECTION");
		} else {
			startChat();
		}
		
	});

	var testMsg;
	// Send a message to the selected recipients
	$('#send-msg').on('click',function(){
		if (connection_status == false){
			console.log("NO CONNECTION");
		} else {

			messages = [];
			counters = 0;
			ewi_filter = "";
			//For group type communication
			if (contactInfo == "groups") {
				var text = $('#msg').val();
				user = "You";

				if (quickGroupSelectionFlag == true) { // True means the group selection is set to EMPLOYEE
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
						'timestamp': gsmTimestampIndicator
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

					var msg = {
						'type': 'smssendgroup',
						'user': user,
						'offices': tagOffices,
						'sitenames': tagSitenames,
						'msg': text + footer,
						'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
						'ewi_filter': $('input[name="opt-ewi-recipients"]:checked').val()
					};

					console.log(msg);

					conn.send(JSON.stringify(msg));

					msgType = "smssendgroup";
					testMsg = msg;
					counters = 0;
					messages = [];
					updateMessages(msg);

					$('#msg').val('');	
				}
			} 
			//For non group tags communication
			else {
				var text = $('#msg').val();

				var normalized = [];
				for (i in contactnumTrimmed) {
					normalized[i] = normalizedContactNum(contactnumTrimmed[i]);
				}

				user = "You";
				gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss')
				var msg = {
					'type': 'smssend',
					'user': user,
					'numbers': normalized,
					'msg': text + footer,
					'timestamp': gsmTimestampIndicator
				};
				updateMessages(msg);
				conn.send(JSON.stringify(msg));

				$('#msg').val('');
			}

			updateRemainingCharacters();
		}
	});

	// Send a message to the selected recipients
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
		//Reset the group tags
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

		//sort the sitename values in the array alphabetically
		tagSitenames.sort();

		groupTags = {
			'type': 'smsloadrequestgroup',
			'offices': tagOffices,
			'sitenames': tagSitenames
		};

		//Display Group Tags for the thread being loaded
		displayGroupTagsForThread();

		$('#user').val('You');
		$('#messages').html('');
		messages = [];
		contactInfo = "groups";

		//Request for message exchanges from the groups selected
		conn.send(JSON.stringify(groupTags));
		$('#loading').modal('toggle');
		$('#main-container').removeClass('hidden');
	}

	function loadGroupsEmployee(){
		var requestTag = [];

		var dynaTags = [];
		$('input[name="tag"]:checked').each(function() {
			dynaTags.push(this.value);
		});

		//Display Group Tags for the thread being loaded
		displayGroupTagsForDynaThread(dynaTags);

		$('#user').val('You');
		$('#messages').html('');
		messages = [];
		contactInfo = "groups";

		requestTag = {
			'type':'smsloadrequesttag',
			'teams': dynaTags
		}
		//Request for message exchanges from the groups selected
		conn.send(JSON.stringify(requestTag));
		$('#loading').modal('toggle');
		$('#main-container').removeClass('hidden');
	}

	$('#go-load-groups').click(function() {
		groupTags = [];
		// Reset the timeStamp flaggers
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

	$(document).ready(function() {
		var table = $('#response-contact-container').DataTable();
	});

	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}

	$('#response-contact-container').on('click', 'tr:has(td)', function(){
		var table = $('#response-contact-container').DataTable();
		var data = table.row(this).data();
		if (data[0].charAt(0) == "c") {
			reset_cc();
			var container = document.getElementById("community-contact-wrapper");
			var input = document.createElement("input");
			input.id = "c_id";
			input.value = data[0];
			console.log(data[0]);
			input.setAttribute('hidden',true);
			container.appendChild(input);
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', false);
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#firstname_cc').val(data[1]);
			$('#lastname_cc').val(data[2]);
			$('#prefix_cc').val(data[3]);
			$('#office_cc').val(data[4]);
			$('#sitename_cc').val(data[5]);
			$('#numbers_cc').val(data[6]);
			$('#rel_cc').val(data[7]);
			$('#ewirecipient').val(data[8].charAt(0))

			var numbers = data[6].split(',');

			for(x = 0; x < numbers.length; x++) {
				$('#numbers_cc').tagsinput('add',numbers[x]);
			}
		} else {
			reset_ec();
			var container = document.getElementById("employee-contact-wrapper");
			var input = document.createElement("input");
			input.id = "eid";
			input.value = data[0];
			input.setAttribute('hidden',true);
			container.appendChild(input);
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', true);
			$('#employee-contact-wrapper').prop('hidden', false);
			$('#firstname_ec').val(data[1]);
			$('#lastname_ec').val(data[2]);
			$('#nickname_ec').val(data[3]);
			$('#birthdate_ec').val(data[4]);
			$('#email_ec').val(data[5]);
			$('#numbers_ec').val(data[6]);
			$('#grouptags_ec').val(data[7]);

			var numbers = data[6].split(',');
			var grouptags = data[7].split(',');

			for(x = 0; x < numbers.length; x++) {
				$('#numbers_ec').tagsinput('add',numbers[x]);
			}

			for(y = 0;y < grouptags.length; y++) {
				$('#grouptags_ec').tagsinput('add',grouptags[y]);
			}
		}
	});

// GETS the Office and site options
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
	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctsitename",             
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('sitename_cc');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].sitename;
				opt.innerHTML = response[counter].sitename;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			opt.value = "OTHERS";
			opt.innerHTML = "OTHERS";
			select.appendChild(opt);
		}
	});

	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctofficename",             	
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('office_cc');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].office;
				opt.innerHTML = response[counter].office;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			var opt = document.createElement('option');
			opt.value = "OTHERS";
			opt.innerHTML = "OTHERS";
			select.className = "form-control";
			select.setAttribute("required","true");
			select.appendChild(opt);
		}
	});
}

	$('#sitename_cc').on('change',function() {   //Get Disticnt Sitename.
		if ($("#sitename_cc").val() == "OTHERS") {
			$("#other-sitename").show();
		} else {
			$("#other-sitename").hide();
		}
	});

	$('#office_cc').on('change',function() {  //Get Disticnt Offices.
		if ($("#office_cc").val() == "OTHERS") {
			$("#other-officename").show();
		} else {
			$("#other-officename").hide();
		}
	});

	//Clear Field inputs for Employee Contact
	$('#btn-clear-ec').on('click',function(){
		if ($('#settings-cmd').val() == "updatecontact"){
			$('#employee-contact-wrapper').attr('hidden',true);
			getEmpContact();
		} else {
			reset_ec(); // Resets the field for employee contact
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
		$('#grouptags_ec').tagsinput("removeAll");
	}

	// Clear Field inputs for Community Contact
	$('#btn-clear-cc').on('click',function(){
		if ($('#settings-cmd').val() == "updatecontact"){
			$('#community-contact-wrapper').attr('hidden',true);
			getComContact();
		} else {
			reset_cc(); // Resets the field for community contact
		}
	});

	function reset_cc() {
		$('#firstname_cc').val('');
		$('#lastname_cc').val('');
		$('#prefix_cc').val('');
		$('#rel_cc').val('');
		$('#numbers_cc').val('');
		$('#numbers_cc').tagsinput("removeAll");
		$('#other-officename').val('');
		$('#other-sitename').val('');

		$('#other-officename').hide();
		$('#other-sitename').hide();
	}

		// Fetched the Alert and Sites EWI

		$('#btn-ewi').on('click',function(){
			$('#alert-lvl').empty();
			$('#sites').empty();
			$.ajax({
				type: "GET",
				url: "../chatterbox/getewi",             	
				dataType: "json",
				success: function(response){
					var alertList = Object.keys(response).length;
					var counter = 0;
					select = document.getElementById('alert-lvl');
					for (counter=0;counter<alertList;counter++){
						var opt = document.createElement('option');
						opt.value = Object.keys(response)[counter];
						opt.innerHTML = Object.keys(response)[counter];
						select.className = "form-control";
						select.setAttribute("required","true");
						select.appendChild(opt);
					}
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

			if ($('#ewi-date-picker').val() == "" || $('#alert-lvl').val() == "" || $('#sites').val() == "") {
				alert('Invalid input, All fields must be filled');
			} else {
				groupTags = [];
				user = "You";
				var tagOffices = [];
				var tagSitenames = [];

				var tagOffices = [];
				$('input[name="offices"]:checked').each(function() {
					tagOffices.push(this.value);
				});

				var counter = 0;
				$('input[name="sitenames"]:checked').each(function() {
					counter++;
				});

				if (counter == 1){
					tagSitenames.push($('#sites').val());
					$('input[name="sitenames"]').prop('checked', false);

					$('input[name="sitenames"]').each(function() {
						if ($('#sites').val() == this.value) {
							$('input[name="sitenames"][value="'+this.value+'"]').prop('checked', true);
						}
					});
				} else if (counter > 1){
					var tagSitenames = [];
					$('input[name="sitenames"]:checked').each(function() {
						tagSitenames.push(this.value);
					});
				} else {
					tagSitenames.push($('#sites').val());
					$('input[name="sitenames"][value="'+$('#sites').val()+'"]').prop('checked', true);
				}


				tagSitenames.sort();
				groupTags = {
					'type': 'smsloadrequestgroup',
					'offices': tagOffices,
					'sitenames': tagSitenames
				};

				$('#main-container').removeClass('hidden');

				getEWI(function(output){
					if (counter == 1 || counter == 0){
						var template = setEWILocation(output);
					}else {
						var nssEWITemplate = output.replace("%%SBMP%%","<Sition,Barangay,Municpality,Province>");
						$('#msg').val(nssEWITemplate);
					}
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

				//Changes the Date
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
					var sbmp = location[0].sitio + "," +  location[0].barangay + "," + location[0].municipality + "," + location[0].province;
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

		$('#send-btn-ewi-amd').click(function(){
			ewiFlagger = true;
			var footer = " -"+$('#footer-ewi').val()+" from PHIVOLCS-DYNASLOPE";

			var text = $('#constructed-ewi-amd').val();
			try {

		// Assume All 4 offices will be included in the EWI
		var tagOffices = ['LLMC','BLGU','MLGU','PLGU'];

		$('input[name="offices"]').prop('checked', false);
		$('input[name="sitenames"]').prop('checked', false);

		var tagSitenames = [];
		tagSitenames.push($('#site-abbr').val().toUpperCase());

		if (tagSitenames[0] == "MNG" || tagSitenames[0] == "MAN") {
			tagSitenames[0] = "MAN/MNG";
		} else if (tagSitenames[0] == "JOR" || tagSitenames[0] == "POB") {
			tagSitenames[0] = "JOR/POB";
		}

		var msg = {
			'type': 'smssendgroup',
			'user': 'You',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'msg': text+footer,
			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
			'ewi_filter': true
		};

		conn.send(JSON.stringify(msg));
		msgType = "smssendgroup";
		messages = [];
		updateMessages(msg);
		
		$('#constructed-ewi-amd').val('');
		$('#result-ewi-message').text('Early Warning Information sent successfully!');
		$('#success-ewi-modal').modal('toggle');
		$('#ewi-asap-modal').modal('toggle');
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

	//CHECK ALL Offices in the advanced search
	$('#checkAllOffices').click(function() {
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', true);
	});

	//UNcheck ALL Offices in the advanced search
	$('#uncheckAllOffices').click(function() {
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
	});

	//CHECK ALL tags in the advanced search
	$('#checkAllTags').click(function() {
		$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', true);
	});

	//UNcheck ALL tags in the advanced search
	$('#uncheckAllTags').click(function() {
		$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
	});

	//CHECK ALL Site Names in the advanced search
	$('#checkAllSitenames').click(function() {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', true);
	});
	
	//UNcheck ALL Site Names in the advanced search
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
			var myNode = document.getElementById("search-global-result");
			myNode.innerHTML = '';
			$('#search-global-keyword').val('');
		}
	});

	// Update the "remaining characters" information below the text area
	$('#msg').bind('input propertychange', function() {
		updateRemainingCharacters();
	});

	var isFirstAdvancedSearchActivation = false;

	function disableCommands(){
		$('#go-chat').attr("class","btn btn-xs btn-danger disabled");
		$('#go-chat').attr("data-toggle","tooltip");
		$('#go-chat').css("text-decoration","line-through");
		$('#go-chat').attr("data-original-title","Chatterbox disconnected, waiting to reconnect..");

		$('#go-load-groups').attr("class","btn btn-danger disabled");
		$('#go-load-groups').css("text-decoration","line-through");
		$('#load-groups-wrapper').attr("data-toggle","tooltip");
		$('#load-groups-wrapper').attr("data-original-title","Chatterbox disconnected, waiting to reconnect..");
		
		$('#send-msg').attr("class","btn btn-danger no-rounded disabled");
		$('#send-msg').css("text-decoration","line-through");
		$('#sms-msg-wrapper').attr("data-toggle","tooltip");
		$('#sms-msg-wrapper').attr("data-original-title","Chatterbox disconnected, waiting to reconnect..");

		$('#btn-gbl-search').attr("class","btn btn-link btn-sm disabled");
		$('#btn-gbl-search').attr("data-toggle","tooltip");
		$('#btn-gbl-search').attr("data-original-title","Chatterbox disconnected, waiting to reconnect..");
		$('#btn-gbl-search').css("color","coral");
	}

	function enableCommands(){
		$('#go-chat').attr("class","btn btn-xs btn-primary");
		$('#go-chat').css("text-decoration","none");
		$('#go-chat').attr("data-original-title","");

		$('#go-load-groups').attr("class","btn btn-success");
		$('#go-load-groups').css("text-decoration","none");
		$('#load-groups-wrapper').attr("data-original-title","");

		$('#send-msg').attr("class","btn btn-success no-rounded");
		$('#send-msg').css("text-decoration","none");
		$('#sms-msg-wrapper').attr("data-original-title","");

		$('#btn-gbl-search').attr("class","btn btn-link btn-sm");
		$('#btn-gbl-search').attr("data-original-title","Search Message");
		$('#btn-gbl-search').css("color","");
	}

	//Load the office and site names from wSS
	function getOfficesAndSitenames () {
		try {
			var msg = {
				'type': 'loadofficeandsitesrequest'
			};
			conn.send(JSON.stringify(msg));
		} catch(err) {
			// Do nothing. Chatterbox: Monitoring dashboard mode
		}
	}

	//Load the office and site names from wSS
	function getInitialQuickInboxMessages () {
		var msg = {
			'type': 'smsloadquickinboxrequest'
		};
		$('#loading').modal('toggle');
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
			$("#tag-"+modIndex).append('<div class="checkbox"><label><input name="tag" type="checkbox" value="'+tag+'">'+tag.toUpperCase()+'</label></div>');
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

		reset_cc(); // Reset the fields for Employee/Community Contacts
		reset_ec();
		
		$('#update-contact-container').prop('hidden',true);
		$('#response-contact-container_wrapper').prop('hidden',true);
		$('#employee-contact-wrapper').prop('hidden', true);
		$('#community-contact-wrapper').prop('hidden', true);
	});

	$('#settings-cmd').on('change',function(){

		reset_cc(); // Reset the fields for Employee/Community Contacts
		reset_ec();


		if ($('#settings-cmd').val() != 'default') {
			$('#settings-cmd').css("border-color", "#3c763d");
			$('#settings-cmd').css("background-color", "#dff0d8");
		}

		if ($('#contact-category').val() == "econtacts") {
			if ($('#settings-cmd').val() == "addcontact") {
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
		var table = $('#response-contact-container').DataTable();
		$.ajax({
			type: "GET",
			url: "../chatterbox/get_community_contacts",      
			success: function(response){
				var data = JSON.parse(response);
				console.log(data);

				$("#response-contact-container").DataTable().clear();
				$("#response-contact-container").DataTable().destroy();

				$('thead tr th').remove();
				$('thead tr').append( $('<th />', {text : 'c_id'}).css("display", "none"));
				$('thead tr').append( $('<th />', {text : 'First name'}));
				$('thead tr').append( $('<th />', {text : 'Last name'}));
				$('thead tr').append( $('<th />', {text : 'Prefix'}));
				$('thead tr').append( $('<th />', {text : 'Office'}));
				$('thead tr').append( $('<th />', {text : 'Sitename'}));
				$('thead tr').append( $('<th />', {text : 'Contact #'}));
				$('thead tr').append( $('<th />', {text : 'Rel'}));
				$('thead tr').append( $('<th />', {text : 'EWI Recipient'}));

				$('tfoot tr th').remove();
				$('tfoot tr').append( $('<th />', {text : 'c_id'}).css("display", "none"));
				$('tfoot tr').append( $('<th />', {text : 'First name'}));
				$('tfoot tr').append( $('<th />', {text : 'Last name'}));
				$('tfoot tr').append( $('<th />', {text : 'Prefix'}));
				$('tfoot tr').append( $('<th />', {text : 'Office'}));
				$('tfoot tr').append( $('<th />', {text : 'Sitename'}));
				$('tfoot tr').append( $('<th />', {text : 'Contact #'}));
				$('tfoot tr').append( $('<th />', {text : 'Rel'}));
				$('tfoot tr').append( $('<th />', {text : 'EWI Recipient'}));

				for (var i = 0; i < data.length; i++) {
					var ewi_flag = "";
					if (data[i].ewirecipient == true) {
						ewi_flag = "Yes";
					} else {
						ewi_flag = "No";
					}
					var newContent = "<tr><td style='display:none;'>c_"+data[i].c_id+"</td><td>"+data[i].firstname+"</td><td>"+data[i].lastname+"</td><td>"+data[i].prefix+"</td><td>"+data[i].office+"</td><td>"+data[i].sitename+"</td><td>"+data[i].number+"</td><td>"+data[i].rel+"</td><td>"+ewi_flag+"</td></tr>";
					$("#response-contact-container tbody").append(newContent);
				}


				$('#response-contact-container').show();
				$("#response-contact-container").DataTable();
			}
		});
	}

	function getEmpContact(){
		var table = $('#response-contact-container').DataTable();
		$.ajax({
			type: "GET",
			url: "../chatterbox/get_employee_contacts",        
			success: function(response){
				var data = JSON.parse(response);
				console.log(data);
				$("#response-contact-container").DataTable().clear();
				$("#response-contact-container").DataTable().destroy();

				$('thead tr th').remove();
				$('thead tr').append( $('<th />', {text : 'eid'}).css("display", "none"));
				$('thead tr').append( $('<th />', {text : 'First name'}));
				$('thead tr').append( $('<th />', {text : 'Last name'}));
				$('thead tr').append( $('<th />', {text : 'Nickname'}));
				$('thead tr').append( $('<th />', {text : 'Birthdate'}));
				$('thead tr').append( $('<th />', {text : 'Email'}));
				$('thead tr').append( $('<th />', {text : 'Contact #'}));
				$('thead tr').append( $('<th />', {text : 'Group Tags'}));

				$('tfoot tr th').remove();
				$('tfoot tr').append( $('<th />', {text : 'eid'}).css("display", "none"));
				$('tfoot tr').append( $('<th />', {text : 'First name'}));
				$('tfoot tr').append( $('<th />', {text : 'Last name'}));
				$('tfoot tr').append( $('<th />', {text : 'Nickname'}));
				$('tfoot tr').append( $('<th />', {text : 'Birthdate'}));
				$('tfoot tr').append( $('<th />', {text : 'Email'}));
				$('tfoot tr').append( $('<th />', {text : 'Contact #'}));
				$('tfoot tr').append( $('<th />', {text : 'Group Tags'}));

				for (var i = 0; i < data.length; i++) {
					console.log(data[i].numbers);
					var newContent = "<tr><td style='display:none;'>"+data[i].eid+"</td><td>"+data[i].firstname+"</td><td>"+data[i].lastname+"</td><td>"+data[i].nickname+"</td><td>"+data[i].birthday+"</td><td>"+data[i].email+"</td><td>"+data[i].numbers+"</td><td>"+data[i].grouptags+"</td></tr>";
					$("#response-contact-container tbody").append(newContent);
				}

				$('#response-contact-container').show();
				$("#response-contact-container").DataTable();
			}
		});
	}

	$('#comm-settings-cmd button[type="submit"]').on('click',function(){
		if ($('#settings-cmd').val() != "updatecontact") {
			var empty_fields = 0;
			$('#community-contact-wrapper input').each(function(){
				if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
					empty_fields++;
				}
			});

			if (empty_fields > 2) { // Empty field filter 2 is for the hidden text field for OTHER sitename/office
				$('#contact-result').remove();
				var container = document.getElementById('community-contact-wrapper');
				var resContainer = document.createElement('div');
				resContainer.id = "contact-result";
				resContainer.className = "alert alert-danger";
				resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
				container.insertBefore(resContainer,container.childNodes[0]);
			} else {
				if ($('#sitename_cc').val() == "OTHERS") {
					$site = $('#other-sitename').val();
				} else {
					$site = $('#sitename_cc').val();
				}

				if ($('#office_cc').val() == "OTHERS") {
					$office = $('#other-officename').val();
				} else {
					$office = $('#office_cc').val();
				}

				data = {
					'category': 'communitycontacts',
					'c_id': '',
					'lastname': $('#lastname_cc').val(),
					'firstname': $('#firstname_cc').val(),
					'prefix': $('#prefix_cc').val(),
					'office': $office,
					'sitename': $site,
					'number': $('#numbers_cc').val(),
					'rel': $('#rel').val(),
					'ewirecipient': ($('#ewirecipient').val() == "Y" ? true : false)
				};

				$.post( "../chatterbox/addcontacts", {contact: JSON.stringify(data)})
				.done(function(response) {
					if (response == true) {
						$('#contact-result').remove();
						var container = document.getElementById('community-contact-wrapper');
						var resContainer = document.createElement('div');
						resContainer.id = "contact-result";
						resContainer.className = "alert alert-success";
						resContainer.innerHTML = "<strong>Success!</strong> New Community contact added.";
						container.insertBefore(resContainer,container.childNodes[0]);
						$("#employee-contact-wrapper input").val('');
					} else {
						$('#contact-result').remove();
						var container = document.getElementById('community-contact-wrapper');
						var resContainer = document.createElement('div');
						resContainer.id = "contact-result";
						resContainer.className = "alert alert-danger";
						resContainer.innerHTML = "<strong>Failed!</strong> Duplicate Entry / Invalid input data";
						container.insertBefore(resContainer,container.childNodes[0]);
					}
					reset_cc();
					fetchSiteAndOffice();
				});
			}
		} else {
			var empty_fields = 0;
			$('#community-contact-wrapper input').each(function(){
				if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
					
					if (($(this).attr('id') == "other-officename" && $(this).val() == "") || ($(this).attr('id') == "other-sitename" && $(this).val() == "")) {
						console.log($(this).attr('id'));
					} else {
						empty_fields++;
					}
				}
			});

			if (empty_fields > 0) {
				$('#contact-result').remove();
				var container = document.getElementById('community-contact-wrapper');
				var resContainer = document.createElement('div');
				resContainer.id = "contact-result";
				resContainer.className = "alert alert-danger";
				resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
				container.insertBefore(resContainer,container.childNodes[0]);
			} else {
				if (confirm('The Changes you made will be saved. \n Do you want to proceed?')) {
					data = {
						'id': $('#c_id').val(),
						'firstname': $('#firstname_cc').val(),
						'lastname': $('#lastname_cc').val(),
						'prefix': $('#prefix_cc').val(),
						'office': $('#office_cc').val(),
						'sitename': $('#sitename_cc').val(),
						'number': $('#numbers_cc').val(),
						'rel': $('#rel').val(),
						'ewirecipient': $('#ewirecipient').val()
					};
					console.log(data);
					updateContactService(data,"community-contact-wrapper");
				}
			}
		}
	});

$('#emp-settings-cmd button[type="submit"]').on('click',function(){
	if ($('#settings-cmd').val() != "updatecontact") {
		var empty_fields = 0;
		$('#employee-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
				empty_fields++;
			}
		});

		if (empty_fields > 0) {
			$('#contact-result').remove();
			var container = document.getElementById('employee-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			data = {
				'category': 'dewslcontacts',
				'eid': '',
				'lastname': $('#lastname_ec').val(),
				'firstname': $('#firstname_ec').val(),
				'nickname': $('#nickname_ec').val(),
				'birthday': $('#birthdate_ec').val(),
				'email': $('#email_ec').val(),
				'numbers': $('#numbers_ec').val(),
				'grouptags': $('#grouptags_ec').val()
			};
			$.post( "../chatterbox/addcontacts", {contact: JSON.stringify(data)})
			.done(function(response) {
				if (response == true) {
					$('#contact-result').remove();
					var container = document.getElementById('employee-contact-wrapper');
					var resContainer = document.createElement('div');
					resContainer.id = "contact-result";
					resContainer.className = "alert alert-success";
					resContainer.innerHTML = "<strong>Success!</strong> New Employee contact added.";
					container.insertBefore(resContainer,container.childNodes[0]);
					$("#employee-contact-wrapper input").val('');
				} else {
					$('#contact-result').remove();
					var container = document.getElementById('employee-contact-wrapper');
					var resContainer = document.createElement('div');
					resContainer.id = "contact-result";
					resContainer.className = "alert alert-danger";
					resContainer.innerHTML = "<strong>Failed!</strong> Duplicate Entry / Invalid input data";
					container.insertBefore(resContainer,container.childNodes[0]);
				}
				reset_ec();
			});
		}
	} else {
		var empty_fields = 0;
		$('#employee-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
				empty_fields++;
			}
		});

		if (empty_fields > 0) {
			$('#contact-result').remove();
			var container = document.getElementById('employee-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			if (confirm('The Changes you made will be saved. \n Do you want to proceed?')) {
				data = {
					'id': $('#eid').val(), 
					'firstname': $('#firstname_ec').val(),
					'lastname': $('#lastname_ec').val(),
					'nickname': $('#nickname_ec').val(),
					'birthdate': $('#birthdate_ec').val(),
					'email': $('#email_ec').val(),
					'numbers': $('#numbers_ec').val(),
					'grouptags': $('#grouptags_ec').val()
				};
				updateContactService(data,"employee-contact-wrapper");
			}
		}
	}
});

	$(document).on("click","#messages li",function(){
		gintags_msg_details = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
		reposition('#gintag-modal');

		// Fetch Gintags from server
		current_gintags = getGintagService(gintags_msg_details[5]);
		$('#gintag-modal').modal('toggle');
	})

	$('#confirm-gintags').click(function(){
		insertGintagService(gintags_msg_details);
	});


function insertGintagService(data){
	var tags = $('#gintags').val();
	var gintags;
	tags = tags.split(',');

	for (var i = 0; i < tags.length;i++) {
		gintags = {
			'tag_name': tags[i],
			'tag_description': "communications",
			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
			'tagger': tagger_user_id,
			'remarks': data[5],
			'table_used': data[6]
		}
		$.post( "../generalinformation/inserGinTags/", {gintags: JSON.stringify(gintags)})
		.done(function(response) {
			console.log(response);
		});
	}
}

function getGintagService(data){
	$('#gintags').val('');
	$('#gintags').tagsinput("removeAll");
	$.post( "../generalinformation/getGinTags/", {gintags: JSON.stringify(data)})
		.done(function(response) {
			var data = JSON.parse(response);
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				$('#gintags').tagsinput('add',data[i].tag_name);
			}
	});
}

function updateContactService(data,wrapper){
	$.post( "../communications/chatterbox/updatecontacts", {contact: JSON.stringify(data)})
	.done(function(response) {
		console.log(response);
		if (response == "true") {
			$('#contact-result').remove();
			var container = document.getElementById(wrapper);
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-success";
			resContainer.innerHTML = "<strong>Success!</strong> Existing contact updated.";
			container.insertBefore(resContainer,container.childNodes[0]);
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