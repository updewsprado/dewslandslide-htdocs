
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Ratchet websocket implementation on
 *  several site pages:
 *  - Monitoring Dashboard
 *  - Alert Release Form
 *  - Issues And Reminders Page
 *  
****/

var wsUri = "ws://" + window.location.hostname + ":5070/";
var attributes_log;
var websocket;

let json_cache = null;
let reconnect = 10000, isConnected = false;

$(document).ready(function () {
    $("#loading").modal("show");
    init();

    // AUTOMATION SCRIPTS
    /*$("#automation-row #alert_release, #automation-row #bulletin_sending").click(function () {
        let data = {
            "staff_name" : $("#user_name").text(),
            "staff_id" : $("#current_user_id").val()
        }

        if(this.checked) { data.switch = true; }
        else { data.switch = false; }

        if( this.id == "alert_release") doSend("toggleAutomatedAlertRelease", data);
        else doSend("toggleAutomatedBulletinSending", data);
    });*/
});


function init() {
    if (browserSupportsWebSockets() === false) {
        console.log("Sorry! your web browser does not support WebSockets. Try using Google Chrome or Firefox Latest Versions");
        return; 
    }

    websocket = new WebSocket(wsUri);

    websocket.onopen = function() {
        console.log("DASHBOARD SERVER: CONNECTION TO " + wsUri + " has been successfully established");

        isConnected = true;
        /*doSend("sendIdentification", {"name" : $("#user_name").text(), "staff_id": $("#current_user_id").val()});*/
        $("#loading").modal("hide");

        // if (window.timerID) {
        //     window.clearInterval(window.timerID);
        //     window.timerID = 0;
        // }
    };

    websocket.onmessage = function(evt) {
        onMessage(evt);
    };

    websocket.onerror = function(evt) {
        onError(evt);
    };

    websocket.onclose = function(evt) {
        isConnected = false;
        onClose(evt);
    };
}

function onClose(evt) {
    websocket.close();
    console.log("DASHBOARD SERVER: DISCONNECTED");
    //waitForConnection();
}

function onMessage(evt) {
    let data = JSON.parse(evt.data);
    let code = data.code;
    let pathname = window.location.pathname;

    console.log('DASHBOARD SERVER: onMessage Event Fired');
    console.log('RESPONSE:', data);

    if( pathname.includes("release_form") ) {
        return;
    };

    if( pathname.includes("dashboard") || pathname.includes("home") ) {
        
        if( code == "candidateAlerts" ) {
            buildDashboardTables(data);
        }
        else if( code == "existingAlerts" ) {
            buildDashboardTables(data);
        } else if( code == "showAutomationMenu" ) {
            $("#automation-row").show();
            if(data.alert_release.switch) 
            {
                $("#alert_release").prop("checked", true);
                $("#alert_release_staff").text("(Activated by " + data.alert_release.staff_name + ")" );
            }
            else { $("#alert_release").prop("checked", false); $("#alert_release_staff").text(""); }
            if(data.bulletin_sending.switch) 
            {
                $("#bulletin_sending").prop("checked", true);
                $("#bulletin_sending_staff").text("(Activated by " + data.bulletin_sending.staff_name + ")" );
            }
            else { $("#bulletin_sending").prop("checked", false); $("#bulletin_sending_staff").text(""); }
        }
    }

    if(code == "getNormalAndLockedIssues") {
        getNormalAndLockedIssues(data);
    }

}

function onError(evt) {
    console.log('DASHBOARD SERVER: ERROR:', evt.data);
}

function getCurrentDate() {
    var now = new Date();
    var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

    return datetime;
}

function browserSupportsWebSockets() {
    if ("WebSocket" in window)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function doSend(code, data) {
    let x = typeof data == "undefined" ? null : data;
    let message = {
        code: code,
        data: x
    }
    websocket.send( JSON.stringify(message) );
    console.log('DASHBOARD SERVER: onSend Event Fired');
    console.log("SENT: " + code);
}

function waitForConnection() {
    $("#loading").modal("hide");
    if (!isConnected) {
        setInterval(function () {
            // if (websocket == null) {
            //     console.log("Cannot establish connection to DASHBOARD SERVER... Reconnecting...");
            // }
            if (websocket.readyState === 1) {
                console.log("CONNECTION TO " + wsUri + " has been successfully established");
                isConnected = true;
                return;
            } else {
                console.log("Connection to DASHBOARD SERVER lost... Reconnecting...");
                init();
                waitForConnection();
                if (reconnect < 20000) {
                    reconnect += 1000;
                }
            }
        }, reconnect);
    }
}

//***** AUTOMATION FUNCTIONS ******//
