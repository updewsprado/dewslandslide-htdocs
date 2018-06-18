
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Ratchet websocket implementation on
 *  several site pages:
 *  - Accomplishment Report
 *  
****/

var wsUri = "ws://" + window.location.hostname + ":5070/accomplishment";
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
        console.log("ACCOMPLISHMENT SERVER: CONNECTION TO " + wsUri + " has been successfully established");

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
    console.log("ACCOMPLISHMENT SERVER: DISCONNECTED");
    //waitForConnection();
}

function onMessage(evt) {
    let data = JSON.parse(evt.data);
    let code = data.code;
    let pathname = window.location.pathname;

    console.log('ACCOMPLISHMENT SERVER: onMessage Event Fired');
    console.log('RESPONSE:', data);

    if( code == "sendConnectionID" )
        setConnectionID(data.connection_id);

}

function onError(evt) {
    console.log('ACCOMPLISHMENT SERVER: ERROR:', evt.data);
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
    console.log('ACCOMPLISHMENT SERVER: onSend Event Fired');
    console.log("SENT: " + code);
}

function waitForConnection() {
    $("#loading").modal("hide");
    if (!isConnected) {
        setInterval(function () {
            // if (websocket == null) {
            //     console.log("Cannot establish connection to ACCOMPLISHMENT SERVER... Reconnecting...");
            // }
            if (websocket.readyState === 1) {
                console.log("CONNECTION TO " + wsUri + " has been successfully established");
                isConnected = true;
                return;
            } else {
                console.log("Connection to ACCOMPLISHMENT SERVER lost... Reconnecting...");
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
