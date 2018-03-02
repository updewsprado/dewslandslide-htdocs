$(document).ready(function() {
    try {
        let remChars = 800 - $("#msg").val().length - footer.length;
        $("#remaining_chars").text(remChars);
        $("#msg").attr("maxlength", remChars);

    } catch (err) {
        console.log(err);
        console.log("Chatterbox : monitoring dashboard mode");
    }
});

try {
    Handlebars.registerHelper("ifCond", function (v1, v2, v3, v4, v5, v6, options) {
        if (v1 === v2 || v1 == v3 || v1 == v4 || v1 == v5 || v1 == v6) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper("breaklines", (text) => {
        text = Handlebars.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, " ");
        return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper("escape", variable => variable.replace(/(['"-])/g, "\\$1"));
} catch (err) {
    console.log(err.message);
}

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

function updateMessages (msg) {
    if (msg.status === "SUCCESS" || msg.status === "SENT") {
        msg.status = 1;
    } else {
        msg.status = 0;
    }
    $("#search-key").hide();

    if (msg.user === "You") {
        msg.isyou = 1;

        if (contact_info === "groups") {
            if (msg.type === "loadEmployeeTag") {
                messages.push(msg);
            } else {
                if (message_type === "smsloadrequestgroup") {
                    messages.push(msg);
                } else {
                    search_results.push(msg);
                }
                if (arraysEqual(msg.offices, group_tags.offices)) {
                    if (message_type === "searchMessageGroup") {
                        search_results.push(msg);
                    } else if (msg.sitenames !== undefined || group_tags.sitenames !== undefined) {
                        if (arraysEqual(msg.sitenames.sort(), group_tags.sitenames)) {
                            messages.push(msg);
                        }
                    } else {
                        messages.push(msg);
                    }
                }
            }
        } else {
            if (message_type === "smsloadrequestgroup") {
                return;
            }
            if (message_type === "searchMessage" || message_type === "smsLoadSearched") {
                search_results.push(msg);
            } else if (message_type === "searchMessageGlobal") {
                search_results.push(msg);
            } else {
                messages.push(msg);
            }
        }
    } else if (contact_info === "groups") {
        if (msg.type === "loadEmployeeTag") {
            msg.isyou = 0;
            messages.push(msg);
        } else {
            if (msg.name === "unknown") {
                return;
            }

            var isTargetSite = false;
            for (i in group_tags.sitenames) {
                if (msg.name == null || msg.msg != null) {
                    msg.isyou = 0;
                    msg.user = "PASALOAD REQUEST";
                    isTargetSite = true;
                    continue;
                } else if ((msg.name.toUpperCase()).indexOf(group_tags.sitenames[i].toUpperCase()) >= 0) {
                    isTargetSite = true;
                    continue;
                }
            }

            if (isTargetSite == false) {
                return;
            }

            var isOffices = false;
            for (i in group_tags.offices) {
                if (msg.name == null) {
                    msg.name = "PASALOAD REQUEST";
                    isOffices = true;
                    continue;
                } else if ((msg.name.toUpperCase()).indexOf(group_tags.offices[i].toUpperCase()) >= 0) {
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
                search_results.push(msg);
            } else {
                msg.isyou = 0;
                msg.user = msg.name;
                messages.push(msg);
            }
        }
    } else {
        for (const counter in contact_info) {
            if (msg.type === "searchMessage" || msg.type === "searchMessageGroup" ||
                    msg.type === "smsLoadGroupSearched" || msg.type === "smsLoadSearched" || msg.type === "smsloadGlobalSearched") {
                if (contact_info[counter].numbers.search(trimmedContactNum(msg.user)) >= 0) {
                    msg.isyou = 0;
                    msg.user = contact_info[counter].fullname;
                    search_results.push(msg);
                    break;
                }
            } else if (contact_info[counter].numbers.search(trimmedContactNum(msg.user)) >= 0) {
                msg.isyou = 0;
                msg.user = contact_info[counter].fullname;
                messages.push(msg);
                break;
            }
        }
    }

    if (ewi_recipient_flag === false && !(msg.type === "oldMessages" || msg.type === "oldMessagesGroup") &&
        !(msg.type === "searchMessage" || msg.type === "searchMessageGroup" || msg.type === "searchMessageGlobal")) {
        try {
            if (messages[message_counter].user === "You") {
                if (last_message_time_stamp_sender === "") {
                    last_message_time_stamp_sender = messages[message_counter].timestamp;
                }
            } else if (last_message_time_stamp_recipient === "") {
                last_message_time_stamp_recipient = messages[message_counter].timestamp;
            }
            if (msg.type === "smssend" || msg.type === "smssendgroup" || msg.type === "smssendgroupemployee") {
                var messages_html = messages_template_both({ messages });
                var htmlString = $("#messages").html();
                $("#messages").html(htmlString + messages_html);
                $(".chat-message").scrollTop($("#messages").height());
                messages = [];
            } else {
                var messages_html = messages_template_both({ messages });
                $("#messages").html(messages_html);
                $(".chat-message").scrollTop($("#messages").height());
            }
        } catch (err) {
            console.log("Not a Scroll/Search related feature");
        }
    }
}

function updateRemainingCharacters () {
    remChars = 800 - $("#msg").val().length - footer.length;
    $("#remaining_chars").text(remChars);
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

function getLatestAlert () {
    var msg = {
        type: "latestAlerts"
    };
    wss_connect.send(JSON.stringify(msg));
}

function updateLatestPublicRelease (msg) {
    try {
        quick_release.unshift(msg);
        var quick_release_html = quick_release_template({ quick_release });
        $("#quick-release-display").html(quick_release_html);
        $("#quick-release-display").scrollTop(0);
    } catch (err) {
        console.log(err.message)
    }
}

function updateQuickInbox (msg) {
    if (window.location.href == `${window.location.origin}/communications/chatterbox_beta` || window.location.href == `${window.location.origin}/communications/chatterbox_beta#`) {
        if (msg.user == "You") {
        } else {
            var targetInbox;
            var quick_inbox_html;
            if (msg.name == "unknown") {
                try {
                    msg.isunknown = 1;
                    targetInbox = "#quick-inbox-unknown-display";
                    quick_inbox_unknown.unshift(msg);
                    quick_inbox_html = quick_inbox_template({ quick_inbox_messages: quick_inbox_unknown });
                } catch (err) {
                }
            } else {
                try {
                    msg.isunknown = 0;
                    targetInbox = "#quick-inbox-display";
                    quick_inbox_registered.unshift(msg);
                    quick_inbox_html = quick_inbox_template({ quick_inbox_messages: quick_inbox_registered });
                } catch (err) {
                }
            }
            $(targetInbox).html(quick_inbox_html);
            $(targetInbox).scrollTop(0);
        }

        if (msg.onevent == 1) {
            if (msg.user != "You") {
                var targetInbox;
                var quick_inbox_html;
                msg.isunknown = 0;
                targetInbox = "#quick-event-inbox-display";
                quick_event_inbox.unshift(msg);
                quick_inbox_html = quick_inbox_template({ quick_inbox_messages: quick_event_inbox });
            }

            $(targetInbox).html(quick_inbox_html);
            $(targetInbox).scrollTop(0);
        }
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