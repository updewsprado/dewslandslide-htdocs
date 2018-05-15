let WSS_CONNECTION_STATUS = -1;
let connection_status = false;
let reconnection_delay = 10000;
let wss_connect= connectWS();

// const wss_types = ["smsload","smsloadrequestgroup","loadEmployeeTag","hasNullEWIRecipient","resumeLoading",
// 					"oldMessage","oldMessageGroup","searchMessage","searchMessageGlobal","searchMessageGroup",
// 					"searchGintags","smsLoadSearched","smsLoadGroupSearched","smsloadGlobalSearched",
// 					"smsloadquickinbox","latestAlerts","loadofficeandsites","loadnamesuggestions","ewi_tagging",
// 					"fetchedCmmtyContacts","fetchedDwslContacts","fetchedSelectedDwslContact","fetchedSelectedCmmtyContact",
// 					"updatedDwslContact","newAddedDwslContact","updatedCmmtyContact","newAddedCommContact","conSetAllSites",
// 					"conSetAllOrgs","qgrAllSites","qgrAllOrgs","newAddedCommContact","fetchGroupSms","fetchSms","ackgsm",
// 					"ackrpi","smsrcv"];

$(document).ready(function() {
	
});

function connectWS() {
		console.log("trying to connect to web socket server");
		var wssConnection = new WebSocket("ws://"+window.location.host+":5050");

		wssConnection.onopen = function(e) {
			console.log("Connection established!");
			connection_status = true;
			delayReconn = 10000;
			WSS_CONNECTION_STATUS = 0;
			$("#send-msg").removeClass("disabled");
		};

		wssConnection.onmessage = function(e) {
			let msg_data = JSON.parse(e.data);
			switch (msg_data.type) {
				case "loadnamesuggestions":
					getContactSuggestion(msg_data);
					break;
				case "qgrAllSites":
					displaySitesSelection(msg_data.data);
					break;
				case "qgrAllOrgs":
					displayOrgSelection(msg_data.data);
					break;
				default:
					console.log("none");
					break;
			}
		}

	wssConnection.onclose = function(e) {
		let reason;
		WSS_CONNECTION_STATUS = -1;
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
			// disableCommands();

			// connection_status = false;
			// $("#send-msg").addClass("disabled");
			// waitForSocketConnection();
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

	return wssConnection;
	}