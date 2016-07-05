// (function() {
	var user, contactnum;
	var contactnumTrimmed = [];
	var contactInfo;
	var contactname;
	var contactSuggestions;
	var contactsList = [];
	var messages = [];
	var temp, tempMsg, tempUser, tempRequest;
	var WSS_CONNECTION_STATUS = -1;
	var isFirstSuccessfulConnect = true;

	var messages_template_both = Handlebars.compile($('#messages-template-both').html());

	function updateMessages(msg) {
		// console.log("User is: " + msg.user);
		// console.log("Message: " + msg.msg);

		if (msg.user == "You") {
			msg.isyou = 1;
			messages.push(msg);
		}
		else {
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

		var messages_html = messages_template_both({'messages': messages});
		$('#messages').html(messages_html);
		$('#messages').animate({ scrollTop: $('#messages')[0].scrollHeight}, 300 );
	}

	function loadMessageHistory(msg) {
		//TODO: load the historical message here
		alert("loadMessageHistory!");
	}

	function initLoadMessageHistory(msgHistory) {
		console.log(msgHistory);

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

	function loadCommunityContactRequest(msg) {
		//TODO: load the historical message here
		contactInfo = msg.data;
		var totalContacts = msg.total;
		var contact = msg.data[0];
		var fullname = contact.fullname.replace(/\?/g,function(){return "\u00f1"});
		var tempnum = contact.numbers;

		console.log("fullname: " + fullname + ", number: " + tempnum);
	}

	var timerID = 0;
	var conn = null;
	conn = connectWS();

	function connectWS() {
		console.log("trying to connect to web socket server");
		var tempConn = new WebSocket('ws://www.codesword.com:5050');

		tempConn.onopen = function(e) {
			console.log("Connection established!");
			WSS_CONNECTION_STATUS = 0;

			if (isFirstSuccessfulConnect) {
				//TODO: load contacts information for first successful connect
				//contacts currently 9KB in size. too big for the WSS setup

				//set flag to false after successful loading
				isFirstSuccessfulConnect = false;
			}

			// a setInterval has been fired
			if (window.timerID) {
				window.clearInterval(window.timerID);
				window.timerID = 0;
			}
		};

		tempConn.onmessage = function(e) {
			var msg = JSON.parse(e.data);
			tempMsg = msg;

			if (msg.type == "smsload") {
				initLoadMessageHistory(msg);
			} 
			// else if (msg.type == "loadcommunitycontact") {
			// 	loadCommunityContactRequest(msg);
			// }
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
				if(msg.user.match(numbers)) {
					for (i in contactnumTrimmed) {
						// console.log(contactnumTrimmed[i]);
						if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.user)) {
							updateMessages(msg);
						}
					}
				}
				else {
					//Assumption: Alpha numeric users only come from the browser client
					var tempNum;
					for (tempNum in msg.numbers) {
						if (tempNum.search(contactnumTrimmed) >= 0) {
							updateMessages(msg);
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

	       		//TODO: reconnect to the WSS
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
		                console.log("wait for connection...");
		                conn = connectWS();
		                waitForSocketConnection();
		            }

		        }, 5000); // wait 5 seconds for the connection...
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

	$('#go-chat').click(function() {
		user = "You";

		if (contactSuggestions) {
			contactInfo = testMultiContacts;
		}
		else {
			//If we are contacting an unregistered number
			contactname = $('.dropdown-input').val();
			contactnum = contactname;
			contactnumTrimmed = [trimmedContactNum(contactnum)];

			contactInfo = [{'fullname':contactname,'numbers':contactnum}];
		}

		if (contactnumTrimmed <= 0) {
			alert("Error: Invalid Contact Number");
			return;
		}

		$('#user-container').addClass('hidden');
		$('#main-container').removeClass('hidden');

		var msgHistory = {
			'type': 'smsloadrequest',
			'number': contactnumTrimmed,
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
		};

		$('#user').val('You');
		$('#messages').html('');
		messages = [];

		tempRequest = msgHistory;
		//request for message history of selected number
		conn.send(JSON.stringify(msgHistory));
	});

	function getNameSuggestions (nameQuery) {
		var nameSuggestionRequest = {
			'type': 'requestnamesuggestions',
			'namequery': nameQuery,
		};

		//request for message history of selected number
		conn.send(JSON.stringify(nameSuggestionRequest));
	};

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
			testMultiContacts = [];
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

	var testName;
	var testNumbers;
	var testMultiContacts = [];

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
		//testMultiContacts = [];
		
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

			testMultiContacts.push(parsedInfo);
		}
	}

	function getFollowingNameQuery (allNameQueries) {
		var before = allNameQueries.match(/^.+;\s*|/)[0];
		var size = before.length;
		var nameQuery = allNameQueries.slice(size);

		return nameQuery;
	}

	Awesomplete.$('.dropdown-input').addEventListener("awesomplete-selectcomplete", function(e){
		// User made a selection from dropdown. 
		// This is fired after the selection is applied
		var allText = $('.dropdown-input').val();
		var size = allText.length;
		var allNameQueries = allText.slice(0, size-2);
		var nameQuery = getFollowingNameQuery(allNameQueries);

		parseContactInfo(nameQuery);
	}, false);

	$('#send-msg').click(function() {
		var text = $('#msg').val();
		var footer = "\n\nThis message was sent by Chatterbox App."

		var normalized = [];
		for (i in contactnumTrimmed) {
		   normalized[i] = normalizedContactNum(contactnumTrimmed[i]);
		}

		var msg = {
			'type': 'smssend',
			'user': user,
			'numbers': normalized,
			'msg': text + footer,
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
		};
		updateMessages(msg);
		conn.send(JSON.stringify(msg));

		$('#msg').val('');
	});

// })();