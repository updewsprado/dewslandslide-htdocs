
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Bulletin Functions
 *  used by [public_alert/monitoring_events_individual.php] and [public_alert/monitoring_dashboard.php]
 *  
****/

let onEdit = null;
let release_id = null, event_id = null;
let editableOrigValue = [];
let bulletin_timestamp = null;

function loadBulletin(id1, id2) {
    release_id = id1;
    event_id = id2;

    let loc = null, datetime = null, alert = null, text = null;

    $.post('/../../bulletin/main/' + id1 + '/0', function(data) {
        onEdit = false;
        $("#bulletin_modal").html(data);
        loc = $("#location").text().replace(/\s+/g,' ').trim();
        alert = $("#alert_level_released").text().replace(/\s+/g,' ').trim().slice(0,7);
        datetime = $("#datetime").text();
        // let text = "<b>DEWS-L Bulletin for " + datetime + "<br/>" + alert + " - " + loc + "</b>";
        text = "DEWS-L Bulletin for " + datetime + "\n" + alert + " - " + loc;
        $("#info").val(text);
        if( location.hostname == "www.dewslandslide.com" )
        {
            $('#recipients').tagsinput('add', 'rusolidum@phivolcs.dost.gov.ph');
            $('#recipients').tagsinput('add', 'asdaag48@gmail.com');
        } else {
            if($('#recipients_span').html().length == 0) {
                $("#recipients_span").append("<b style='background-color:yellow;'>TEST SERVER ONLY -- RUS & AGD NOT AUTOMATICALLY TAGGED AS RECIPIENTS FOR SAFEGUARD</b><br/>")
            }   
        }
        bulletin_timestamp = datetime.replace('MN', 'AM').replace('NN', 'PM');
        bulletin_timestamp = moment(bulletin_timestamp, 'MMMM DD, YYYY, h:mm A');

        let isBulletinSent = parseInt($("#" + release_id).attr("data-sent"));

        if(isBulletinSent == 1) $("#send").removeClass("btn-danger").addClass("btn-primary").text("Sent Already (Send Again)");
        else $("#send").removeClass("btn-primary").addClass("btn-danger").text("Send");
        $('#bulletinModal').modal({ backdrop: 'static', keyboard: false, show: true});
    })
    .then(function (data) {
        $.get('/../../monitoring/getFirstEventRelease/' + id2, function(data) {
            console.log(data[0].release_id, release_id);
            if(data[0].release_id == release_id) {
                console.log("ONSET", data);
                let basis = [];
                data.forEach(function (row) {
                    let x = row.cause + " at " + moment(row.timestamp).format("DD MMMM YYYY, h:mm A");
                    basis.push(x);
                });

                let release_time = moment(data[0].data_timestamp).format("YYYY-MM-DD ") + data[0].release_time;
                console.log(moment(data[0].release_time, ["HH:mm:ss, HH:mm:ss"]).hour());
                release_time = moment(data[0].data_timestamp).hour() > moment(data[0].release_time, ["HH:mm:ss, HH:mm:ss"]).hour() ? moment(release_time).add(1, "day").format("DD MMMM YYYY, hh:mm A") : moment(release_time).format("DD MMMM YYYY, hh:mm A");

                let str = "As of " + release_time + ", " + loc + " is under " + alert + " based on " + basis.join(", ") + ".";
                $("#info").val( str + "\n\n" + text );
                
                $('#recipients').tagsinput('add', 'phivolcs-dynaslope@googlegroups.com');
                $('#recipients').tagsinput('add', 'phivolcs-senslope@googlegroups.com');
            }
            bulletin_timestamp = moment(bulletin_timestamp, 'MMMM DD, YYYY, h:mm A');          
        }, "json");
    });

    // $.ajax({
    //     url: '/../../bulletin/main/' + id1 + '/0', 
    //     type: 'POST',
    //     success: function(data) {
    //         onEdit = false;
    //         $("#bulletin_modal").html(data);
    //         let loc = $("#location").text().replace(/\s+/g,' ').trim();
    //         let alert = $("#alert_level_released").text().replace(/\s+/g,' ').trim().slice(0,2);
    //         let datetime = $("#datetime").text();
    //         // let text = "<b>DEWS-L Bulletin for " + datetime + "<br/>" + alert + " - " + loc + "</b>";
    //         let text = "DEWS-L Bulletin for " + datetime + "\n" + alert + " - " + loc;
    //         $("#info").val(text);
    //         if( location.hostname == "www.dewslandslide.com" )
    //         {
    //             $('#recipients').tagsinput('add', 'rusolidum@phivolcs.dost.gov.ph');
    //             $('#recipients').tagsinput('add', 'asdaag@yahoo.com');
    //         } else {
    //             if($('#recipients_span').html().length == 0) {
    //                 $("#recipients_span").append("<b style='background-color:yellow;'>TEST SERVER ONLY -- RUS & AGD NOT AUTOMATICALLY TAGGED AS RECIPIENTS FOR SAFEGUARD</b><br/>")
    //             }   
    //         }
    //         bulletin_timestamp = datetime.replace('MN', 'AM').replace('NN', 'PM');
    //         bulletin_timestamp = moment(bulletin_timestamp, 'DD MMMM YYYY, h:mm A');

    //         let isBulletinSent = parseInt($("#" + release_id).attr("data-sent"));

    //         if(isBulletinSent == 1) $("#send").removeClass("btn-danger").addClass("btn-primary").text("Sent Already (Send Again)");
    //         else $("#send").removeClass("btn-primary").addClass("btn-danger").text("Send");
    //         $('#bulletinModal').modal({ backdrop: 'static', keyboard: false, show: true});
    //     }
    // }); 
}

function renderPDF(id) 
{
    console.log("ID", id, "OnEdit", onEdit);
    let isEdited = onEdit === true ? 1 : 0;
    let edits = [], editableEditedValue = [];

    if(isEdited)
    {
        $(".editable").each(function (i) {
            editableEditedValue.push([$(this).prop('id'), $(this).val()]);
            let temp = encodeURIComponent($(this).val());
            edits.push(temp);
        });

        console.log(editableOrigValue, editableEditedValue);

        tagBulletin(release_id, editableEditedValue, editableOrigValue);
    }

    $('#bulletinModal').modal('hide');

    $('#bulletinLoadingModal .progress-bar').text('Rendering Bulletin PDF...');
    reposition('#bulletinLoadingModal');
    $('#bulletinLoadingModal').modal({ backdrop: 'static', show: 'true'});
    let address = '/../../bulletin/run_script/' + id + '/' + isEdited; // + "/" + edits.join("|");

    edit(false);

    return $.ajax ({
        url: address,
        type: "GET",
        cache: false,
        data: {edits: edits.join("\\")}
    })
    .done( function (response) {
        if(response == "Success.")
            console.log("PDF RENDERED");
        else console.log(response);
    })
    .fail(function (a) {
        console.log("Error rendering:", a);
    });
}

function tagBulletin(release_id, editableEditedValue, editableOrigValue) {
    $.get("/../../gintagshelper/getGinTagsViaTableElement/" + release_id,
    function(x) {
        if(x.length == 0) 
        {
            let remarks_str = [];
            for(let i = 0; i < editableEditedValue.length; i++)
            {
                if( editableEditedValue[i][1] !== editableOrigValue[i][1] )
                {   
                    let str = 'Edited "' + editableOrigValue[i][0] + '"';
                    str += '(from "' + editableOrigValue[i][1] + '" to "' + editableEditedValue[i][1] + '")';
                    remarks_str.push(str);
                }
            }

            if( remarks_str.length != 0 )
            {
                console.log("TAGGING");
                let gintags_collection = [{
                    tag_name: "#AlteredBulletin",
                    tag_description: 'monitoring',
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                    tagger: $('#current_user_id').val(),
                    table_element_id: release_id,
                    remarks: remarks_str.join("; "),
                    table_used: 'public_alert_event/release'
                }];

                $.post( "/../../generalinformation/insertGinTags/", {gintags: JSON.stringify(gintags_collection)} );
            }
        }
    }, "json");
}

function sendMail(text, subject, filename, recipients) {

    $('#bulletinLoadingModal .progress-bar').text('Sending EWI and Bulletin...');

    let form = {
        text: text,
        subject: subject,
        filename: filename,
        recipients: recipients
    };

    console.log("Sent", text, subject, filename);

    $.ajax({
        url: '/../../bulletin/mail/', 
        type: 'POST',
        data: form,
        success: function(data)
        {
            $('#bulletinLoadingModal').modal('hide');
            $('#resultModal .modal-header').html("<h4>Early Warning Information for " + subject.slice(0,3) + "</h4>");
            reposition("#resultModal");

            setTimeout(function () {
                if(data == "Sent.")
                {
                    console.log('Email sent');

                    let people = recipients.map(function (x) {
                        if(x == "rusolidum@phivolcs.dost.gov.ph") return x = "RUS";
                        else if(x == "asdaag48@gmail.com") return x = "ASD";
                        else if(x == "hyunbin_vince@yahoo.com") return x = "KDDC";
                        else return x;
                    });

                    let x = moment(bulletin_timestamp).hour() % 4 == 0  && moment(bulletin_timestamp).minute() == 0 ?  moment(bulletin_timestamp).format("hh:mm A") : moment(bulletin_timestamp).format("hh:mm A") + " onset";
                    if(/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
                    let message = "Sent " + x + " EWI Bulletin to " + people.join(", ");

                    let narratives = [{ 
                        event_id: event_id,
                        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                        narrative: message
                    }];

                    $("#" + release_id).css("color", "red").attr("data-sent", 1);

                    $.post("/../../accomplishment/insertNarratives", { narratives: JSON.stringify(narratives) })
                    .fail(function (x, y) {
                        console.log(y);
                    });

                    $("#resultModal .modal-body").html('<strong>SUCCESS:</strong>&ensp;Early warning information and bulletin successfully sent through mail!');
                    $("#resultModal").modal('show');
                }
                else
                {
                    console.log('EMAIL SENDING FAILED', data);
                    $("#resultModal .modal-body").html('<strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!<br/><br/><i>' + data + "</i>");
                    $("#resultModal").modal('show');
                }   
            }, 500);
            
        },
        error: function(xhr, status, error) 
        {
          let err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    }); 
}

function edit(onEdit) {
    console.log(onEdit)
    if(onEdit) {
        $(".edit-event-page").css({"background-color": "#FFFF00"});    
        $("#edit-bulletin").text("Exit Edit");
        $("#send").text("Send Edited");
        $("#download").text("Download Edit");
        $("#edit-reminder").show();
        $("#cancel, #bulletinModal .close").hide();

        $(".editable").each(function () {
            editableOrigValue.push([$(this).prop('id'), $(this).text()]);
            let isLonger = $(this).hasClass("longer_input") ? "col-sm-12" : "";
            $(this).replaceWith("<input class='editable " + isLonger + "' id='" + $(this).prop('id') + "' value='" + $(this).text() + "'>");
        });

        let url = $(location).attr("href");
        let content = "Edit this part by changing the <strong>[content]</strong> of the release"
        if(url.includes("home") || url.includes("dashboard"))
            content += " on the <strong><a href='../../monitoring/events/" + event_id + "/" + release_id + "'>event page</a></strong>"
        $('#datetime.edit-event-page').popover({html: true, title: "BULLETIN EDIT", content: content.replace('[content]', 'Data Timestamp') , trigger: "hover", placement: "bottom", delay: {hide: 1000}});
        $('.descriptions.edit-event-page').popover({html: true, title: "BULLETIN EDIT", content: content.replace('[content]', 'Trigger Timestamp, Technical Info, and other needed information (if any)') , trigger: "hover", placement: "bottom", delay: {hide: 1000}});
        $('.editable').popover({html: true, title: "BULLETIN EDIT", content: 'After editing, report the incident for a hotfix.' , trigger: "focus", placement: "bottom" });
    }
    else {
        $(".edit-event-page").css({"background-color": "#fffff"});
        $("#edit-bulletin").text("Edit");
        $("#send").text("Send");
        $("#download").text("Download");
        $("#edit-reminder").hide();
        $("#cancel, #bulletinModal .close").show();
        $(".edit-event-page").popover('destroy');
        editableOrigValue = [];
        $(".editable").each(function () {
            let isLonger = $(this).hasClass("col-sm-12") ? "longer_input" : "";
            $(this).replaceWith("<span class='editable " + isLonger + "' id='" + $(this).prop('id') + "'>" + $(this).val() + "</span>"  );
        });
    }
}

$(document).ready(function() {
    $("#edit-bulletin").click(function () {
        onEdit = onEdit === true ? false : true;
        edit(onEdit);
    });
});
