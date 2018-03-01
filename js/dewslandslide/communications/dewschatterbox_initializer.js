$(document).ready(function() {

});

function initLoadMessageHistory (msgHistory) {
    if (msgHistory.hasNull === true) {
        for (let counter = 0; counter < msgHistory.data.length; counter += 1) {
            $(".list-ewi-recipient").append(`<li class='list-group-item'><div class='checkbox'><label><input type='checkbox' name='ewi_recipients' value='${JSON.stringify(msgHistory.data[i])}'>${
                msgHistory.data[counter].office} ${msgHistory.data[counter].sitename} ${msgHistory.data[counter].lastname}, ${msgHistory.data[counter].firstname
            } - ${msgHistory.data[counter].number}</label></div></li>`);
        }
        $("#ewi-recipient-update-modal").modal("toggle");
    } else {
        if (msgHistory.data == null) {
            return;
        }
        const history = msgHistory.data;
        temp = msgHistory.data;
        let msg;
        for (let counter = history.length - 1; counter >= 0; counter -= 1) {
            msg = history[counter];
            updateMessages(msg);
            message_counter += 1;
        }
        message_counter = 0;
    }
    $(".chat-message").scrollTop($("#messages").height());
}

function initLoadLatestAlerts (latestAlerts) {
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
        $("input[name=\"sitenames\"]:unchecked").each(function () {
            if ($(this).val().toLowerCase() == alerts[i].name.toLowerCase()) {
                if (alerts[i].status == "on-going") {
                    $(this).parent().css("color", "red");
                } else if (alerts[i].status == "extended") {
                    $(this).parent().css("color", "blue");
                } else {
                    $(this).parent().css("color", "green");
                }
            } else if ($(this).val().toLowerCase() == "mes") {
                if (alerts[i].name == "msl" || alerts[i].name == "msu") {
                    if (alerts[i].status == "on-going") {
                        $(this).parent().css("color", "red");
                    } else if (alerts[i].status == "extended") {
                        $(this).parent().css("color", "blue");
                    } else {
                        $(this).parent().css("color", "green");
                    }
                }
            }
        });
    }
}

function initLoadQuickInbox (quickInboxMsg) {
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

function initLoadGroupMessageQA (siteMembers) {
    const group_contacts_quick_access = [];
    group_message_quick_access = [];
    if (siteMembers.data == null) {
        return;
    }

    var members = siteMembers.data;
    temp = siteMembers.data;
    var msg;

    $("#group-message-display").empty();
    var arr_sites = [];
    var arr_contacts = [];

    for (var i = members.length - 1; i >= 0; i--) {
        msg = members[i];
        if ($.inArray(msg.fullname, arr_contacts) == -1) {
            arr_contacts.push(msg.fullname);
        }
    }

    for (var i = members.length - 1; i >= 0; i--) {
        msg = members[i];
        if ($.inArray(msg.site, arr_sites) == -1) {
            arr_sites.push(msg.site);
            var contact_per_site = [];
            for (var counter = 0; counter < arr_contacts.length; counter++) {
                if (arr_contacts[counter].substring(0, 3) == msg.site) {
                    var temp_contacts = {
                        contacts: arr_contacts[counter]
                    };
                    contact_per_site.push(temp_contacts);
                }
            }
            msg.data = contact_per_site;
            updateGroupMessageQuickAccess(msg);
        }
    }
}

function loadOfficesAndSites (msg) {
    var offices = msg.offices;
    var sitenames = msg.sitenames;
    var office,
        sitename;
    for (var i = 0; i < offices.length; i++) {
        var modIndex = i % 5;

        office = offices[i];
        $(`#offices-${modIndex}`).append(`<div class="checkbox"><label><input name="offices" type="checkbox" value="${office}">${office}</label></div>`);
    }
    for (var i = 0; i < sitenames.length; i++) {
        var modIndex = i % 6;

        sitename = sitenames[i];
        $(`#sitenames-${modIndex}`).append(`<div class="checkbox"><label><input name="sitenames" type="checkbox" value="${sitename}">${sitename}</label></div>`);
    }
}

function getInitialQuickInboxMessages () {
    var msg = {
        type: "smsloadquickinboxrequest"
    };
    wss_connect.send(JSON.stringify(msg));
}