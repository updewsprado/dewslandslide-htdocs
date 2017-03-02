
var wsUri = "ws://" + window.location.hostname + ":999/";
var output;
var attributes_log;
var websocket;

let json_cache = [];

$(document).ready(function () {

    $("#loading").modal("show");
    init();

    function init() {
        output = document.getElementById("output");
        attributes_log = document.getElementById("attributes_log");
        if (browserSupportsWebSockets() === false) {
            console.log("Sorry! your web browser does not support WebSockets. Try using Google Chrome or Firefox Latest Versions");
            return; //
        }

        websocket = new WebSocket(wsUri);

        websocket.onopen = function() {
            console.log('DASHBOARD SERVER: onOpen Event Fired');
            console.log("CONNECTION TO " + wsUri + " has been successfully established");
        };

        websocket.onmessage = function(evt) {
            onMessage(evt);
        };

        websocket.onerror = function(evt) {
            onError(evt);
        };
    }

    function onClose(evt) {
        websocket.close();
        console.log('DASHBOARD SERVER: onClose Event Fired');
        console.log("DISCONNECTED");
        waitForConnection();
    }

    function onMessage(evt) {
        let data = JSON.parse(evt.data);
        console.log('DASHBOARD SERVER: onMessage Event Fired');
        console.log('RESPONSE:', data);

        if( window.location.pathname.includes("release_form") ) return;

        if(data.code == "getJSONandLastRelease")
        {
            getRealtimeAlerts(data);
            let temp = data.alert_json.slice(0).pop();
            if(json_cache.length == 0 || ( typeof json_cache.alerts !== 'undefined' && json_cache.alerts[0].timestamp !== temp.alerts[0].timestamp))
            {
                json_cache = jQuery.extend(true, {}, temp);
                doSend("getOnGoingAndExtended");
            } else {
                console.log("DASHBOARD SERVER: No new JSON data.");
            }
        }
        else if(data.code == "getOnGoingAndExtended")
            getOnGoingAndExtended(data);
    }

    function onError(evt) {
        console.log('DASHBOARD SERVER: onError Event Fired');
        console.log('ERROR:', evt.data);
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
});

function doSend(message) {
    websocket.send(message);
    console.log('DASHBOARD SERVER: onSend Event Fired');
    console.log("SENT: " + message);
}

function waitForConnection() {
    if (!window.timerID) {
        window.timerID = setInterval(
        function () {
            if (websocket.readyState === 1) {
                return;
            } else {
                console.log("Connection to DASHBOARD SERVER lost... Reconnecting...");
                websocket = init();
                waitForConnection();
                if (delayReconn < 20000) {
                    delayReconn += 1000;
                }
            }
        }, delayReconn);
    }
}