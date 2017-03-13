
var wsUri = "ws://" + window.location.hostname + ":5070/";
var output;
var attributes_log;
var websocket;

let json_cache = null;
let reconnect = 10000, isConnected = false;

$(document).ready(function () {
    $("#loading").modal("show");
    init();
});


function init() {
    output = document.getElementById("output");
    attributes_log = document.getElementById("attributes_log");
    if (browserSupportsWebSockets() === false) {
        console.log("Sorry! your web browser does not support WebSockets. Try using Google Chrome or Firefox Latest Versions");
        return; //
    }

    websocket = new WebSocket(wsUri);

    websocket.onopen = function() {
        console.log("DASHBOARD SERVER: CONNECTION TO " + wsUri + " has been successfully established");

        isConnected = true;
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
    waitForConnection();
}

function onMessage(evt) {
    let data = JSON.parse(evt.data);
    console.log('DASHBOARD SERVER: onMessage Event Fired');
    console.log('RESPONSE:', data);

    if( window.location.pathname.includes("release_form") ) return;

    if(data.code == "getJSONandLastRelease")
    {
        let temp = data.alert_json.slice(0);
        temp = temp.pop();
        if(json_cache == null || json_cache !== JSON.stringify(temp))
        {
            getRealtimeAlerts(data);
            json_cache = JSON.stringify(temp);
            doSend("getOnGoingAndExtended");
        } else {
            console.log("DASHBOARD SERVER: No new JSON data.");
        }
    }
    else if(data.code == "getOnGoingAndExtended")
        getOnGoingAndExtended(data);
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

function doSend(message) {
    websocket.send(message);
    console.log('DASHBOARD SERVER: onSend Event Fired');
    console.log("SENT: " + message);
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