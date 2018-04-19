
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Bulletin Functions
 *  used by [public_alert/monitoring_events_individual.php]
 *  and [public_alert/monitoring_dashboard.php]
 *
****/

let on_edit = null;
let release_id = null;
let event_id = null;
let editableOrigValue = [];
let bulletin_timestamp = null;

const pms_instances = [];

$(document).ready(() => {
    $("#edit-bulletin").click(() => {
        on_edit = on_edit !== true;
        edit(on_edit);
    });

    $("body").on("click", ".report", () => {
        const instance = pms_instances[`s${release_id}`];
        instance.set({
            reference_id: release_id,
            reference_table: "public_alert_release"
        });
        instance.show();
        instance.print();
    });
});

function loadBulletin (id1, id2) {
    release_id = id1;
    event_id = id2;

    const bulletin_div = "#bulletin_div";

    $.when(postBulletinModal(release_id), getFirstEventRelease(event_id))
    .done(([modal_html], [release]) => {
        const obj = processBulletinModal(modal_html, bulletin_div);
        const is_onset = addOnsetMessageIfApplicable(release, release_id, obj);

        addMailRecipients(is_onset);

        setPerformanceMonitoringModal(bulletin_div);

        $("#bulletinModal").modal({ backdrop: "static", keyboard: false, show: true });
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function postBulletinModal (release_id) {
    return $.post(`/../../bulletin/main/${release_id}/0`)
    .catch(err => err);
}

function processBulletinModal (modal_html, bulletin_div) {
    $(bulletin_div).html(modal_html);

    const loc = $("#location").text().replace(/\s+/g, " ").trim();
    const alert = $("#alert_level_released").text().replace(/\s+/g, " ").trim().slice(0, 7);
    const datetime = $("#datetime").text();
    const text = `DEWS-L Bulletin for ${datetime}\n${alert} - ${loc}`;

    $("#info").val(text);

    const temp_ts = datetime.replace("MN", "AM").replace("NN", "PM");
    bulletin_timestamp = moment(temp_ts, "MMMM DD, YYYY, h:mm A");

    const is_bulletin_sent = parseInt($(`#${release_id}`).attr("data-sent"), 10);

    if (is_bulletin_sent === 1) $("#send").removeClass("btn-danger").addClass("btn-primary").text("Sent Already (Send Again)");
    else $("#send").removeClass("btn-primary").addClass("btn-danger").text("Send");

    return { loc, alert, text };
}

function getFirstEventRelease (event_id) {
    return $.getJSON(`/../../monitoring/getFirstEventRelease/${event_id}`)
    .catch(err => err);
}

function addOnsetMessageIfApplicable (release, release_id, obj) {
    const [{ release_id: id, release_time: time, data_timestamp: data_ts }] = release;
    const { loc, alert, text } = obj;
    const onset = id === release_id;

    if (onset) {
        console.log("Onset Bulletin Release");

        const basis = [];
        release.forEach(({ timestamp: trigger_ts, cause }) => {
            const x = `${cause} at ${moment(trigger_ts).format("DD MMMM YYYY, h:mm A")}`;
            basis.push(x);
        });

        let temp_release = moment(data_ts).format("YYYY-MM-DD ") + time;
        temp_release = moment(temp_release);

        let release_time = moment(data_ts).hour() > moment(time, ["HH:mm:ss, HH:mm:ss"]).hour() ? temp_release.add(1, "day") : temp_release;
        release_time = release_time.format("DD MMMM YYYY, hh:mm A");

        const str = `As of ${release_time}, ${loc} is under ${alert} based on ${basis.join(", ")}.`;
        $("#info").val(`${str}\n\n${text}`);
    }

    return onset;
}

function addMailRecipients (is_onset) {
    if (location.hostname === "www.dewslandslide.com") {
        const recipients = ["rusolidum@phivolcs.dost.gov.ph", "asdaag48@gmail.com"];

        if (is_onset) {
            recipients.push("phivolcs-dynaslope@googlegroups.com", "phivolcs-senslope@googlegroups.com");
        }

        recipients.forEach((x) => { $("#recipients").tagsinput("add", x); });
    } else if ($("#recipients_span").html().length === 0) {
        $("#recipients_span").append("<b style='background-color:yellow;'>TEST SERVER ONLY -- RUS & AGD NOT AUTOMATICALLY TAGGED AS RECIPIENTS FOR SAFEGUARD</b><br/>");
    }
}

function setPerformanceMonitoringModal (bulletin_div) {
    $(bulletin_div)
    .prepend($("<div class='row'>" +
        "<div class='col-sm-12 text-right'>" +
        "<span class='report'><span class='fa fa-exclamation-circle'></span> <strong>Report</strong>&emsp;</span>" +
        "</div></div><hr/>"));

    const instance = PMS_MODAL.create({
        modal_id: `bulletin-accuracy-${release_id}`,
        metric_name: "bulletin_accuracy",
        module_name: "Bulletin",
        type: "accuracy"
    });

    if (!instance.is_attached) { setTimeout(null, 300); }
    pms_instances[`s${release_id}`] = instance;
}

function renderPDF (id) {
    console.log("ID", id, "on_edit", on_edit);
    const isEdited = on_edit === true ? 1 : 0;
    let edits = [];
    let editableEditedValue = [];

    if (isEdited) {
        $(".editable").each(function (i) {
            editableEditedValue.push([$(this).prop("id"), $(this).val()]);
            const temp = encodeURIComponent($(this).val());
            edits.push(temp);
        });

        console.log(editableOrigValue, editableEditedValue);

        tagBulletin(release_id, editableEditedValue, editableOrigValue);
    }

    $("#bulletinModal").modal("hide");

    $("#bulletinLoadingModal .progress-bar").text("Rendering Bulletin PDF...");
    reposition("#bulletinLoadingModal");
    $("#bulletinLoadingModal").modal({ backdrop: "static", show: "true" });
    const address = `/../../bulletin/run_script/${id}/${isEdited}`; // + "/" + edits.join("|");

    edit(false);

    return $.ajax({
        url: address,
        type: "GET",
        cache: false,
        data: { edits: edits.join("**") }
    })
    .done((response) => {
        if (response == "Success.") { console.log("PDF RENDERED"); } else console.log(response);
    })
    .fail((a) => {
        console.log("Error rendering:", a);
    });
}

function tagBulletin (release_id, editableEditedValue, editableOrigValue) {
    $.get(
        `/../../gintagshelper/getGinTagsViaTableElement/${release_id}`,
        (x) => {
            if (x.length == 0) {
                const remarks_str = [];
                for (let i = 0; i < editableEditedValue.length; i++) {
                    if (editableEditedValue[i][1] !== editableOrigValue[i][1]) {
                        let str = `Edited "${editableOrigValue[i][0]}"`;
                        str += `(from "${editableOrigValue[i][1]}" to "${editableEditedValue[i][1]}")`;
                        remarks_str.push(str);
                    }
                }

                if (remarks_str.length != 0) {
                    console.log("TAGGING");
                    const gintags_collection = [{
                        tag_name: "#AlteredBulletin",
                        tag_description: "monitoring",
                        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                        tagger: $("#current_user_id").val(),
                        table_element_id: release_id,
                        remarks: remarks_str.join("; "),
                        table_used: "public_alert_event/release"
                    }];

                    $.post("/../../generalinformation/insertGinTags/", { gintags: JSON.stringify(gintags_collection) });
                }
            }
        }, "json"
    );
}

function sendMail (text, subject, filename, recipients) {
    $("#bulletinLoadingModal .progress-bar").text("Sending EWI and Bulletin...");

    const form = {
        text,
        subject,
        filename,
        recipients
    };

    console.log("Sent", text, subject, filename);

    $.ajax({
        url: "/../../bulletin/mail/",
        type: "POST",
        data: form,
        success (data) {
            $("#bulletinLoadingModal").modal("hide");
            $("#resultModal .modal-header").html(`<h4>Early Warning Information for ${subject.slice(0, 3)}</h4>`);
            reposition("#resultModal");

            setTimeout(() => {
                if (data == "Sent.") {
                    console.log("Email sent");

                    const people = recipients.map((x) => {
                        if (x == "rusolidum@phivolcs.dost.gov.ph") return x = "RUS";
                        else if (x == "asdaag48@gmail.com") return x = "ASD";
                        else if (x == "hyunbin_vince@yahoo.com") return x = "KDDC";
                        return x;
                    });

                    let x = moment(bulletin_timestamp).hour() % 4 == 0 && moment(bulletin_timestamp).minute() == 0 ? moment(bulletin_timestamp).format("hh:mm A") : `${moment(bulletin_timestamp).format("hh:mm A")} onset`;
                    if (/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
                    const message = `Sent ${x} EWI Bulletin to ${people.join(", ")}`;

                    const narratives = [{
                        event_id,
                        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                        narrative: message
                    }];

                    $(`#${release_id}`).css("color", "red").attr("data-sent", 1);

                    $.post("/../../accomplishment/insertNarratives", { narratives: JSON.stringify(narratives) })
                    .fail((x, y) => {
                        console.log(y);
                    });

                    $("#resultModal .modal-body").html("<strong>SUCCESS:</strong>&ensp;Early warning information and bulletin successfully sent through mail!");
                    $("#resultModal").modal("show");
                } else {
                    console.log("EMAIL SENDING FAILED", data);
                    $("#resultModal .modal-body").html(`<strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!<br/><br/><i>${data}</i>`);
                    $("#resultModal").modal("show");
                }
            }, 500);
        },
        error (xhr, status, error) {
            const err = eval(`(${xhr.responseText})`);
            alert(err.Message);
        }
    });
}

function edit (on_edit) {
    console.log(on_edit);
    if (on_edit) {
        $(".edit-event-page").css({ "background-color": "#FFFF00" });
        $("#edit-bulletin").text("Exit Edit");
        $("#send").text("Send Edited");
        $("#download").text("Download Edit");
        $("#edit-reminder").show();
        $("#cancel, #bulletinModal .close").hide();

        $(".editable").each(function () {
            editableOrigValue.push([$(this).prop("id"), $(this).text()]);
            const isLonger = $(this).hasClass("longer_input") ? "col-sm-12" : "";
            $(this).replaceWith(`<input class='editable ${isLonger}' id='${$(this).prop("id")}' value='${$(this).text()}'>`);
        });

        const url = $(location).attr("href");
        let content = "Edit this part by changing the <strong>[content]</strong> of the release";
        if (url.includes("home") || url.includes("dashboard")) { content += ` on the <strong><a href='../../monitoring/events/${event_id}/${release_id}'>event page</a></strong>`; }
        $("#datetime.edit-event-page").popover({
            html: true, title: "BULLETIN EDIT", content: content.replace("[content]", "Data Timestamp"), trigger: "hover", placement: "bottom", delay: { hide: 1000 }
        });
        $(".descriptions.edit-event-page").popover({
            html: true, title: "BULLETIN EDIT", content: content.replace("[content]", "Trigger Timestamp, Technical Info, and other needed information (if any)"), trigger: "hover", placement: "bottom", delay: { hide: 1000 }
        });
        $(".editable").popover({
            html: true, title: "BULLETIN EDIT", content: "After editing, report the incident for a hotfix.", trigger: "focus", placement: "bottom"
        });
    } else {
        $(".edit-event-page").css({ "background-color": "#fffff" });
        $("#edit-bulletin").text("Edit");
        $("#send").text("Send");
        $("#download").text("Download");
        $("#edit-reminder").hide();
        $("#cancel, #bulletinModal .close").show();
        $(".edit-event-page").popover("destroy");
        editableOrigValue = [];
        $(".editable").each(function () {
            const isLonger = $(this).hasClass("col-sm-12") ? "longer_input" : "";
            $(this).replaceWith(`<span class='editable ${isLonger}' id='${$(this).prop("id")}'>${$(this).val()}</span>`);
        });
    }
}