// (function() {
	var user, contactnum;
	var contactnumTrimmed = [];
	var contactInfo;
	var contactname;
	var contactSuggestions;
	var contactsList = [];
	var messages = [];
	var quick_inbox_registered = [];
	var quick_inbox_unknown = [];
	var temp, tempMsg, tempUser, tempRequest;
	var msgType;
	var WSS_CONNECTION_STATUS = -1;
	var isFirstSuccessfulConnect = true;
	var officesAndSites;
	var groupTags = [];
	var testName;
	var testNumbers;
	var multiContactsList = [];
	var timerID = 0;
	var tempMessagePagination = [];
	var ewiFlagger = false;
	var conn = connectWS();
	var delayReconn = 10000;	//10 Seconds

	// first_name came from PHP Session Variable. Look for chatterbox.php
	//	in case you want to edit it.
	var footer = "\n\n-" + first_name + " from PHIVOLCS-DYNASLOPE";

	// Get remaining characters count
	var remChars = 800 - $("#msg").val().length - footer.length;
	$("#remaining_chars").text(remChars);

	// Set the maximum length of text possible for the user
	$("#msg").attr("maxlength", remChars);

	var messages_template_both = Handlebars.compile($('#messages-template-both').html());
	var selected_contact_template = Handlebars.compile($('#selected-contact-template').html());
	var quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());

	function setTargetTime(hour, minute) {
		var t = new Date();
		t.setHours(hour);
		t.setMinutes(minute);
		t.setSeconds(0);
		t.setMilliseconds(0);

		return t;
	}

	function modalDisconnectActivation(modalAction="show", hour, minute) {
		var timeTarget = setTargetTime(hour, minute)
		var timeNow = new Date().getTime();
		var offsetmilliseconds = timeTarget - timeNow;

		//Current time is already greater than the target time
		if (offsetmilliseconds < 0) {
			return;
		}

		if (modalAction == "show") {
			setTimeout(
				function() {
					//Hide the advanced search when disconnected
					$("#advanced-search").modal("hide");
					//Hide the modal backdrop
					$('.modal-backdrop').remove();
					$('#connectionStatusModal').modal();
					conn.close();
				}, 
				offsetmilliseconds);
		} 
		else if (modalAction == "hide") {
			setTimeout(
				function() {
					conn = connectWS();
				}, 
				offsetmilliseconds);
		}
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
		// console.log("User is: " + msg.user);
		// console.log("Message: " + msg.msg);

		if (msg.user == "You") {
			//TODO: must include logic for filtering the messages the current 
			//	user is supposed to receive for either "groups/tags" mode or
			//	normal usage
			msg.isyou = 1;

			//If in "groups/tags" mode, accept message from "You" only if the
			//recipients are exactly the offices and sitenames you've selected
			if (contactInfo == "groups") {
				console.log("type is group/tags")

				if (msgType == "smsloadrequestgroup") {
					console.log("type smsloadrequestgroup")
					messages.push(msg);
				}

				// //only push the message if it belongs to the groupTags
				// messages.push(msg);
				if(arraysEqual(msg.offices, groupTags.offices)) {
					if (arraysEqual(msg.sitenames, groupTags.sitenames)) {
						console.log("type found match for group send receive")
						console.log("the message before it gets pushed:");
						console.log(msg);
						messages.push(msg);
					}
				}
			} 
			else {
				if (msgType == "smsloadrequestgroup") {
					return;
				}

				messages.push(msg);
			}
		}
		else {
			if (contactInfo == "groups") {
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

				msg.isyou = 0;
				msg.user = msg.name;
				messages.push(msg);
			} else {
				//substitute number for name of registered user from contactInfo
				for (i in contactInfo) {
					// console.log(contactInfo[i].fullname + ' ' + contactInfo[i].numbers);

					if (contactInfo[i].numbers.search(trimmedContactNum(msg.user)) >= 0) {
						// console.log(contactInfo[i].fullname + ' ' + contactInfo[i].numbers);

						msg.isyou = 0;
						msg.user = contactInfo[i].fullname;
						messages.push(msg);
						break;
					}
				}
			}
		}
		if (ewiFlagger == false){
			var messages_html = messages_template_both({'messages': messages});
			$('#messages').html(messages_html);
			//$('#messages').animate({ scrollTop: $('#messages')[0].scrollHeight}, 300 );

			//Scroll to the bottom of the page
			var maxScroll = $(document).height() - $(window).height();
			$('html, body').scrollTop(maxScroll);
		}
	}

	function updateQuickInbox(msg) {
		if (msg.user == "You") {
			//Don't do anything if the message came from Dynaslope
		}
		else {
			console.log("Name and User is: " + msg.name + ", " + msg.user);
			console.log("Timestamp and Message: " + msg.timestamp + ", " + msg.msg);

			var targetInbox;
			var quick_inbox_html;

			if (msg.name == "unknown") {
				msg.isunknown = 1;
				targetInbox = "#quick-inbox-unknown-display";

				//Message Pushing using unshift (push at the start of the array)
				quick_inbox_unknown.unshift(msg);
				quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_unknown});
			}
			else {
				msg.isunknown = 0;
				targetInbox = "#quick-inbox-display";

				//Message Pushing using unshift (push at the start of the array)
				quick_inbox_registered.unshift(msg);
				quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_registered});
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

	function initLoadMessageHistory(msgHistory) {

		if (msgHistory.data == null) {
			return;
		}

		console.log("initLoadMessageHistory");
		//Loop through the JSON msg and
		//	use updateMessages multiple times
		var history = msgHistory.data;
		temp = msgHistory.data;
		var msg;
		for (var i = history.length - 1; i >= 0; i--) {
			msg = history[i];
			updateMessages(msg);
		}
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
		var tempConn = new WebSocket('ws://www.dewslandslide.com:5050');

		tempConn.onopen = function(e) {
			console.log("Connection established!");
			$("#connectionStatusModal").modal("hide");
			WSS_CONNECTION_STATUS = 0;
			delayReconn = 10000;

			if (isFirstSuccessfulConnect) {
				//TODO: load contacts information for first successful connect
				//contacts currently 9KB in size. too big for the WSS setup

				getOfficesAndSitenames();

				//getInitialQuickInboxMessages();

				//TODO: Optimize the loading speed
				//Set a 2 sec delay before getting the initial quick inbox messages
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
			var msg = JSON.parse(e.data);
			tempMsg = msg;
			msgType = msg.type;

			if ((msg.type == "smsload") || (msg.type == "smsloadrequestgroup")){
				initLoadMessageHistory(msg);
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
	        	$("#connectionStatusModal").modal("show");
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
}

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

	var qiFullContact = null;
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
	}

	// Chat with selected recipients
	$('#go-chat').click(function() {
		startChat();
	});

	var testMsg;
	// Send a message to the selected recipients
	$('#send-msg').click(function() {
		//For group type communication
		if (contactInfo == "groups") {
			ewiFlagger = false;
			var text = $('#msg').val();

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
				'timestamp': moment().format('YYYY-MM-DD HH:mm:ss')
			};

			console.log(msg);
			conn.send(JSON.stringify(msg));

			// //Create msg.name before updating the message
			// msg.name = "";
			// for (i in tagOffices) {
			// 	msg.name = msg.name + " " + tagOffices[i];
			// }

			// for (i in tagSitenames) {
			// 	msg.name = msg.name + " " + tagSitenames[i];
			// }

			msgType = "smssendgroup";
			testMsg = msg;
			updateMessages(msg);

			$('#msg').val('');
		} 
		//For non group tags communication
		else {
			var text = $('#msg').val();

			var normalized = [];
			for (i in contactnumTrimmed) {
			   normalized[i] = normalizedContactNum(contactnumTrimmed[i]);
			}

			var msg = {
				'type': 'smssend',
				'user': user,
				'numbers': normalized,
				'msg': text + footer,
				'timestamp': moment().format('YYYY-MM-DD HH:mm:ss')
			};
			updateMessages(msg);
			conn.send(JSON.stringify(msg));

			$('#msg').val('');
		}

		updateRemainingCharacters();
	});

	// Send a message to the selected recipients
	$('#go-load-groups').click(function() {
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

		$('#main-container').removeClass('hidden');
	});

	$(document).ready(function() {
	var table = $('#response-contact-container').DataTable();
	});

	$('input[type="radio"]').on('change', function(e) {
		if ($("input[name='category']:checked").val() == "employee_contacts_radio") {
			$.ajax({
				type: "GET",
				url: "../chatterbox/get_employee_contacts",             
				dataType: "html",              
				success: function(response){
					$("#response-contact-container").DataTable().clear();
					$("#response-contact-container").DataTable().destroy();
					$('#response-contact-container').show();
					$("#response-contact-container").html(response);
					$("#response-contact-container").DataTable();
				}
			});
		} else {
			$.ajax({
				type: "GET",
				url: "../chatterbox/get_community_contacts",             
				dataType: "html",              
				success: function(response){
					$("#response-contact-container").DataTable().clear();
					$("#response-contact-container").DataTable().destroy();
					$('#response-contact-container').show();
					$("#response-contact-container").html(response); 
					$("#response-contact-container").DataTable();
				}
			});
		}
	});

	String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
	}

	$('#btn-close-edit-settings,#btn-cancel-update').on('click',function(){
		$('#edit-contact-settings').modal('show');
		$('#edit-contact').modal('hide');
	});

	$('#response-contact-container').on('click', 'tr:has(td)', function(){
		var table = $('#response-contact-container').DataTable();
		var data = table.row(this).data();
		$('#edit-contact-settings').modal('hide');
		$('.modal-backdrop').remove();

		var community_contacts = ['c_id','firstname','lastname','prefix','office','sitename','number','rel'];
		var employee_contacts = ['eid','firstname','lastname','nickname','birthdate','email','numbers','grouptags'];
		var container = document.getElementById("contact-settings-wrapper");

		while (container.hasChildNodes()) {
			container.removeChild(container.lastChild);
		}

		var category = document.createElement("input");

		category.type = "text";
		category.name = "category"
		category.value = data[0];
		category.setAttribute("hidden", true);
		container.appendChild(category);

		for(var i=1; i< data.length; i++) {

			var label = document.createElement("label");
			var input = document.createElement("input");

			if (data[0].charAt(0)=="c") {
				var t = document.createTextNode(community_contacts[i].capitalize());
				label.appendChild(t);
				container.appendChild(label);
				input.id = community_contacts[i];
				input.name = community_contacts[i];
				input.className = "form-control";
				input.value = data[i];
				input.setAttribute("required","true");
				container.appendChild(input);
				container.appendChild(document.createElement("br"));
			} else {
				var t = document.createTextNode(employee_contacts[i].capitalize());
				label.appendChild(t);
				container.appendChild(label);
				input.id = employee_contacts[i];
				if (employee_contacts[i] == "birthdate"){
					input.type = "date";
				} else {
					input.type = "text";
				}
				input.name = employee_contacts[i];
				input.className = "form-control";
				input.value = data[i];
				input.setAttribute("required","true");
				container.appendChild(input);
				container.appendChild(document.createElement("br"));
			}
			console.log(data[i]);
		}
		$('#edit-contact').modal('show');
	});


	// GETS the Office and site options
	$('#btn-contact-settings').click(function() {
		$('#sitename').empty();
		$('#office').empty();
		$.ajax({
			type: "GET",
			url: "../chatterbox/getdistinctsitename",             
			dataType: "json",              
			success: function(response){
				var counter = 0;
				select = document.getElementById('sitename');
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
				select = document.getElementById('office');
				for (counter=0;counter < response.length;counter++){
					var opt = document.createElement('option');
					opt.value = response[counter].office;
					opt.innerHTML = response[counter].office;
					select.className = "form-control";
					select.setAttribute("required","true");
					select.appendChild(opt);
				}
				opt.value = "OTHERS";
				opt.innerHTML = "OTHERS";
				select.appendChild(opt);
			}
		});
	});

	//Get Disticnt Offices.
	$('#office').on('change',function() {
		if ($("#office").val() == "OTHERS") {
			$("#other-officename").show();
			console.log("show");
		} else {
			$("#other-officename").hide();
			console.log("hide");
		}
	});

	//Get Disticnt Offices.
	$('#sitename').on('change',function() {
		if ($("#sitename").val() == "OTHERS") {
			$("#other-sitename").show();
			console.log("show");
		} else {
			$("#other-sitename").hide();
			console.log("hide");
		}
	});

	//Clear Field inputs for Employee Contact
	$('#btn-clear-ec').on('click',function(){
		$('#firstname').val('');
		$('#lastname').val('');
		$('#grouptags').val('');
		$('#nickname').val('');
		$('#email').val('');
		$('#numbers').val('');
		$('#grouptags').val('');
	});

	// Clear Field inputs for Community Contact
	$('#btn-clear-cc').on('click',function(){
		$('#firstname').val('');
		$('#lastname').val('');
		$('#prefix').val('');
		$('#sitename').val('');
		$('#office').val('');
		$('#rel').val('');
	});
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

		displayGroupTagsForThread();
		$('#user').val('You');
		$('#messages').html('');
		messages = [];
		contactInfo = "groups";
		conn.send(JSON.stringify(groupTags));
		$('#main-container').removeClass('hidden');

		getEWI(function(output){
			if (counter == 1 || counter == 0){
				var template = setEWILocation(output);
			}else {
				var nssEWITemplate = output.replace("%%SBMP%%","<Sition,Barangay,Municpality,Province>");
				$('#msg').val(nssEWITemplate);
			}
		});

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
					constructedEWI = response[$('#alert-lvl').val()].replace("%%PANAHON%%","Hapon");
				} else if (currentPanahon > 18 && currentPanahon <=23) {
					constructedEWI = response[$('#alert-lvl').val()].replace("%%PANAHON%%","Gabi");
				} else {
					constructedEWI = response[$('#alert-lvl').val()].replace("%%PANAHON%%","Umaga");
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

	function sendViaAlertMonitor(data){
		$.ajax({
			type: "GET",
			url: "../chatterbox/getewi",             	
			dataType: "json",	
			success: function(response){
				var i = data["comments"].indexOf(';');
				data["comments"] = data["comments"].substr(0,i);
				var counter = 0;
				for (counter = 0;counter < Object.keys(response).length;counter++){
					if (Object.keys(response)[counter] == data["internal_alert"]){
						var preConstructedEWI = response[Object.keys(response)[counter]];
						var constructedEWIDate = "";
						var finalEWI = ""
						var d = new Date();
						var currentPanahon = d.getHours();
						if (currentPanahon >= 12 && currentPanahon <= 18) {
							constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","Hapon");
						} else if (currentPanahon > 18 && currentPanahon <=23) {
							constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","Gabi");
						} else {
							constructedEWIDate = preConstructedEWI.replace("%%PANAHON%%","Umaga");
						}

						constructedEWIDate = constructedEWIDate.replace("%%DATE%%",data["time_released"].slice(0, -9));
						var ewiLocation = data["sitio"]+","+data["barangay"]+","+data["municipality"]+","+data["province"];
						var formatSbmp = ewiLocation.replace("null","");
						if (formatSbmp.charAt(0) == ",") {
							formatSbmp = formatSbmp.substr(1);
						}
						var finalEWI = constructedEWIDate.replace("%%SBMP%%",formatSbmp);
						$('#site-abbr').val(data["name"]);
						$('#constructed-ewi-amd').val(finalEWI);
					}
				}
			}
		});
		$('#ewi-asap-modal').modal('toggle');
	}

	function templateSendViaAMD(){
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

			var msg = {
				'type': 'smssendgroup',
				'user': 'You',
				'offices': tagOffices,
				'sitenames': tagSitenames,
				'msg': text+footer,
				'timestamp': moment().format('YYYY-MM-DD HH:mm:ss')
			};

			console.log('---------___DETECT_---------');
			console.log(msg);
			conn.send(JSON.stringify(msg));
			msgType = "smssendgroup";
			updateMessages(msg);
			
			$('#constructed-ewi-amd').val('');
			$('#result-ewi-message').text('Success!, Message sent.');
			$('#success-ewi-modal').modal('toggle');
			$('#ewi-asap-modal').modal('toggle');
		} catch(err) {
			$('#result-ewi-message').text('Failed!, Please check the template.');
			alert(err.stack);
			$('#success-ewi-modal').modal('toggle');
			$('#ewi-asap-modal').modal('toggle');
		}
	}

	//CHECK ALL Offices in the advanced search
	$('#checkAllOffices').click(function() {
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', true);
	});

	//UNcheck ALL Offices in the advanced search
	$('#uncheckAllOffices').click(function() {
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
	});

	//CHECK ALL Site Names in the advanced search
	$('#checkAllSitenames').click(function() {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', true);
	});
	
	//UNcheck ALL Site Names in the advanced search
	$('#uncheckAllSitenames').click(function() {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
	});



	// Update the "remaining characters" information below the text area
	$('#msg').bind('input propertychange', function() {
		updateRemainingCharacters();
	});

	var isFirstAdvancedSearchActivation = false;

	//Load the office and site names from wSS
	function getOfficesAndSitenames () {
		var msg = {
			'type': 'loadofficeandsitesrequest'
		};
		conn.send(JSON.stringify(msg));
	}

	//Load the office and site names from wSS
	function getInitialQuickInboxMessages () {
		var msg = {
			'type': 'smsloadquickinboxrequest'
		};
		conn.send(JSON.stringify(msg));
	}

	//Activate "Disconnect Notice" at 4:59, 11:59 and 19:00
	modalDisconnectActivation("show", 4, 59);
	modalDisconnectActivation("show", 11, 59);
	modalDisconnectActivation("show", 18, 59);

	//Attempt to reconnect at 5:05, 12:05 and 19:05
	modalDisconnectActivation("hide", 5, 5);
	modalDisconnectActivation("hide", 12, 5);
	modalDisconnectActivation("hide", 19, 5);

// })();