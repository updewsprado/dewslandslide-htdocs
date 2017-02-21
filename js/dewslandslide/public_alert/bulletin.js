
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Bulletin Functions
 *  used by [public_alert/monitoring_events_individual.php] and [public_alert/monitoring_dashboard.php]
 *  
****/

let onEdit = null;
let release_id = null, event_id = null;

function loadBulletin(id1, id2) {
    release_id = id1;
    event_id = id2;

    $.ajax({
        url: '../../bulletin/main/' + id1 + '/0', 
        type: 'POST',
        success: function(data) {
            onEdit = false;
            $("#bulletin_modal").html(data);
            let loc = $("#location").text();
            let alert = $("#alert_level_released").text().replace(/\s+/g,' ').trim().slice(0,2);
            let datetime = $("#datetime").text();
            let text = "<b>DEWS-L Bulletin for " + datetime + "<br/>" + alert + " - " + loc + "</b>";
            $("#info").html(text);
            $('#bulletinModal').modal({ backdrop: 'static', keyboard: false, show: true});
        }
    }); 
}

function renderPDF(id) 
{
    console.log("ID", id, "OnEdit", onEdit);
    let isEdited = onEdit === true ? 1 : 0;

    let edits = [];
    if(isEdited)
    {
        $(".editable").each(function (i) {
            let temp = encodeURIComponent($(this).val());
            edits.push(temp);
        })
        console.log(edits.join("/"));
    }

    $('#bulletinModal').modal('hide');
    $('#bulletinLoadingModal .progress-bar').text('Rendering Bulletin PDF...');
    reposition('#bulletinLoadingModal');
    $('#bulletinLoadingModal').modal({ backdrop: 'static', show: 'true'});
    let address = '../../bulletin/run_script/' + id + '/' + isEdited + "/" + edits.join("|");

    edit(false);

    return $.ajax ({
        url: address,
        type: "GET",
        cache: false
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

function sendMail(text, subject, filename) {

    $('#bulletinLoadingModal .progress-bar').text('Sending EWI and Bulletin...');

    let form = {
        text: text,
        subject: subject,
        filename: filename
    };

    console.log("Sent", text, subject, filename);

    $.ajax({
        url: '../../bulletin/mail/', 
        type: 'POST',
        data: form,
        success: function(data)
        {
            $('#bulletinLoadingModal').modal('hide');
            $('#resultModal > .modal-header').html("<h4>Early Warning Information for " + subject.slice(0,3) + "</h4>");

            setTimeout(function () {
                if(data == "Sent.")
                {
                    console.log('Email sent');
                    $("#resultModal .modal-body").html('<p><strong>SUCCESS:</strong>&ensp;Early warning information and bulletin successfully sent through mail!</p>');
                    $("#resultModal").modal('show');
                }
                else
                {
                    console.log('EMAIL SENDING FAILED', data);
                    $("#resultModal .modal-body").html('<p><strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!</p>');
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
        $("#send").text("Send Edit to Mail");
        $("#download").text("Download Edit");
        $("#edit-reminder").show();
        $("#cancel, #bulletinModal .close").hide();

        $(".editable").each(function () {
            $(this).replaceWith("<input class='editable' id='" + $(this).prop('id') + "' value='" + $(this).text() + "'>");
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
        $("#send").text("Send to Mail");
        $("#download").text("Download");
        $("#edit-reminder").hide();
        $("#cancel, #bulletinModal .close").show();
        $(".edit-event-page").popover('destroy');
        $(".editable").each(function () {
            $(this).replaceWith("<span class='editable' id='" + $(this).prop('id') + "'>" + $(this).val() + "</span>"  );
        });
    }
}

$(document).ready(function() {
    $("#edit-bulletin").click(function () {
        onEdit = onEdit === true ? false : true;
        edit(onEdit);
    });
});