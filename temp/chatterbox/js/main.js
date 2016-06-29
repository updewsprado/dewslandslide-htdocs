// (function() {
	//Provide default user name
	//TODO: replace with session user name
	$('#user').val("Orutra-man");

	var user, contactnum, contactnumTrimmed;
	var multiplenums;
	var messages = [];
	var temp, tempMsg;
	var WSS_CONNECTION_STATUS = -1;
	var isFirstSuccessfulConnect = true;

	var messages_template = Handlebars.compile($('#messages-template').html());

	function updateMessages(msg) {
		messages.push(msg);
		var messages_html = messages_template({'messages': messages});
		$('#messages').html(messages_html);
		$('#messages').animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000 );
	}

	function loadMessageHistory(msg) {
		//TODO: load the historical message here
		alert("loadMessageHistory!");
	}

	function initLoadMessageHistory(msgHistory) {
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
		temp = msg;
		var totalContacts = msg.total;
		var contact = msg.data[0];
		var fullname = contact.fullname;
		var tempnum = contact.numbers;

		console.log("fullname: " + fullname + ", number: " + tempnum);
		$('#contactnum').val(tempnum);
	}

	// var conn = new WebSocket('ws://www.codesword.com:5050');
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

			if (msg.type == "smsload") {
				initLoadMessageHistory(msg);
			} 
			else if (msg.type == "loadcommunitycontact") {
				loadCommunityContactRequest(msg);
			}
			else {
				var numbers = /^[0-9]+$/;  
				if(msg.user.match(numbers)) {
					if (contactnum == normalizedContactNum(msg.user)) {
						updateMessages(msg);
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
	function trimmedContactNum(targetNumber) {
		var numbers = /^[0-9]+$/;  
		var trimmed;
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

			targetNumber = "63" + trimmed;
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

	$('#generate-contact').click(function() {
		// conn = new WebSocket('ws://www.codesword.com:5050');
		sitename = $('#sitename').val();
		office = $('#office').val();

		if (sitename == "") {
			alert("Error: No sitename selected");
			return;
		}

		if (office == "") {
			office = "all";
			$('#office').val("all");
		}

		var contactRequest = {
			'type': 'loadcommunitycontactrequest',
			'sitename': sitename,
			'office': office
		};

		//request for message history of selected number
		conn.send(JSON.stringify(contactRequest));
	});

	$('#join-chat').click(function() {
		// conn = new WebSocket('ws://www.codesword.com:5050');

		user = $('#user').val();
		contactnum = normalizedContactNum($('#contactnum').val());
		contactnumTrimmed = trimmedContactNum(contactnum);

		if (contactnum < 0) {
			alert("Error: Invalid Contact Number");
			return;
		}

		$('#user-container').addClass('hidden');
		$('#main-container').removeClass('hidden');

		var msg = {
			'type': 'joinchat',
			'user': user,
			'numbers': [contactnumTrimmed],
			'msg': user + ' is now online',
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
		};

		var msgHistory = {
			'type': 'smsloadrequest',
			'number': contactnumTrimmed,
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
			//'timestamp': moment().format('hh:mm a')
		};

		//updateMessages(msg);
		conn.send(JSON.stringify(msg));

		$('#user').val('');

		//request for message history of selected number
		tempMsg = msgHistory;
		conn.send(JSON.stringify(msgHistory));
	});

	$('#send-msg').click(function() {
		var text = $('#msg').val();
		var msg = {
			'type': 'smssend',
			'user': user,
			'numbers': [contactnum],
			'msg': text,
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
		};
		updateMessages(msg);
		conn.send(JSON.stringify(msg));

		$('#msg').val('');
	});

	$('#leave-room').click(function() {
		var msg = {
			'type': 'leavechat',
			'user': user,
			'numbers': [contactnum],
			'msg': user + ' is now offline',
			'timestamp': moment().format('YYYY-MM-DD HH:mm')
		};
		updateMessages(msg);
		conn.send(JSON.stringify(msg));

		$('#messages').html('');
		messages = [];

		$('#main-container').addClass('hidden');
		$('#user-container').removeClass('hidden');

		conn.close();
	});

// })();