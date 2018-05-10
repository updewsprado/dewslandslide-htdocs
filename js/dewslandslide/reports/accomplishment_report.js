
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Accomplishment Report Filing Form -
 *  End-of-Shift Report Tab [reports/accomplishment_report.php]
 *  [host]/reports/accomplishment/form
 *
****/

let releases_per_event,
    shift_timestamps,
    validation_message;
const upload_files = [];
const basis_to_raise = {
    D: ["a monitoring request of the LGU/LEWC", "On-Demand"],
    R: ["accumulated rainfall value exceeding threshold level", "Rainfall"],
    E: ["a detection of landslide-triggering earthquake", "Earthquake"],
    g: ["significant surficial movement", "LEWC Ground Measurement"],
    s: ["significant underground movement", "Subsurface Data"],
    G: ["critical surficial movement", "LEWC Ground Measurement"],
    S: ["critical underground movement", "Subsurface Data"],
    m: ["significant movement observed as manifestation", "Manifestation"],
    M: ["critical movement observed as manifestation", "Manifestation"]
};
const current_user_id = $("#current_user_id").attr("value");

$(document).ready(() => {
    initializeTimestamps();
    initializeFormValidator();
    initializeGraphRelatedInputs();
    initializeFileUploading();

    $(document).on("click", ".submit_buttons", ({ currentTarget }) => {
        const site_code = $(currentTarget).attr("data-site");
        const event_id = $(currentTarget).attr("data-event");
        const internal_alert = $(currentTarget).attr("data-alert");
        const btn_id = $(currentTarget).attr("id");

        switch (btn_id) {
            case "send": sendReport(site_code, event_id); break;
            case "refresh-narratives": refreshNarrativesTextArea(event_id, internal_alert, site_code); break;
            case "download-charts": downloadCharts(site_code); break;
            default: break;
        }
    });
});

/*************************************************
 *
 *              Initialize Timestamps
 *
*************************************************/
function initializeTimestamps () {
    $(() => {
        $(".timestamp").datetimepicker({
            format: "YYYY-MM-DD HH:mm:00",
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: "right",
                vertical: "bottom"
            }
        });
        $(".shift_start").datetimepicker({
            format: "YYYY-MM-DD HH:30:00",
            enabledHours: [7, 19],
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: "right",
                vertical: "bottom"
            }
        });
        $(".shift_end").datetimepicker({
            format: "YYYY-MM-DD HH:30:00",
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: "right",
                vertical: "bottom"
            },
            useCurrent: false // Important! See issue #1075
        });
        $(".shift_start").on("dp.change", (e) => {
            $(".shift_end").data("DateTimePicker").minDate(e.date);
        });
        $(".shift_end").on("dp.change", (e) => {
            $(".shift_start").data("DateTimePicker").maxDate(e.date);
        });

        $(".shift_start_others").datetimepicker({
            format: "YYYY-MM-DD HH:mm:00",
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: "right",
                vertical: "bottom"
            }
        });
        $(".shift_end_others").datetimepicker({
            format: "YYYY-MM-DD HH:mm:00",
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: "right",
                vertical: "bottom"
            },
            useCurrent: false // Important! See issue #1075
        });
        $(".shift_start_others").on("dp.change", (e) => {
            $(".shift_end_others").data("DateTimePicker").minDate(e.date);
        });
        $(".shift_end+others").on("dp.change", (e) => {
            $(".shift_start_others").data("DateTimePicker").maxDate(e.date);
        });
    });

    $("#shift_start").focusout(({ currentTarget }) => {
        if (currentTarget.value === "") $("#generate").prop("disabled", true).removeClass("btn-info").addClass("btn-danger");
        else $("#generate").prop("disabled", false).removeClass("btn-danger").addClass("btn-info");
    });
}

/*************************************************
 *
 *      Function for timestamp validation
 *
*************************************************/
function checkTimestamp (value, { id }) {
    const hour = moment(value).hour();
    const minute = moment(value).minute();

    if (id === "shift_start") {
        const $shift_end = $("#shift_end");
        message = "Acceptable times of shift start are 07:30 and 19:30 only.";
        const temp = moment(value).add(13, "hours");
        $shift_end.val(moment(temp).format("YYYY-MM-DD HH:mm:ss"));
        $("#shift_end").prop("readonly", true).trigger("focus");
        setTimeout(() => {
            $("#shift_end").trigger("focusout");
        }, 500);
        return (hour === 7 || hour === 19) && minute === 30;
    } else if (id === "shift_end") {
        message = "Acceptable times of shift end are 08:30 and 20:30 only.";
        return ((hour === 8 || hour === 20) && minute === 30);
    }
}

/*************************************************
 *
 *           Initialize form validators
 *   Contains main functions for report creation
 *             located on submit area
 *
*************************************************/
function initializeFormValidator () {
    jQuery.validator.addMethod("TimestampTest", (value, element) => checkTimestamp(value, element), () => validation_message);

    $("#accomplishmentForm").validate({
        debug: true,
        rules: {
            shift_start: {
                required: true,
                TimestampTest: true
            },
            shift_end: {
                required: true,
                TimestampTest: true
            }
        },
        errorPlacement (error, element) {
            const placement = $(element).closest(".form-group");

            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            // Add `has-feedback` class to the parent div.form-group
            // in order to add icons to inputs
            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!element.next("span")[0]) {
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:18px; right:22px;'></span>").insertAfter(element);
                if (element.parent().is(".datetime") || element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if (element.is("select")) element.next("span").css({ top: "18px", right: "30px" });
            }
        },
        success (label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
            shift_timestamps = { start: $("#shift_start").val(), end: $("#shift_end").val() };

            $("#loading .progress-bar").text("Generating end-of-shift report...");
            $("#loading").modal("show");

            getShiftReleases(shift_timestamps).then(getShiftTriggers).then(prepareReportDataAndHTML)
            .then(delegateReportsToTextAreas)
            .then((x) => { $("#loading").modal("hide"); });
        }
    });
}

/*************************************************
 *
 *          Initialize mail recipients
 *
*************************************************/
function initializeMailRecipients () {
    $("#mail_recipients_row .bootstrap-tagsinput").css("width", "100%");
    const $recipients = $("#recipients_span");
    if (window.location.hostname === "www.dewslandslide.com") {
        const emails = ["rusolidum@phivolcs.dost.gov.ph", "asdaag48@gmail.com", "phivolcs-senslope@googlegroups.com", "phivolcs-dynaslope@googlegroups.com"];
        emails.forEach((x) => { $("#recipients").tagsinput("add", x); });
    } else if ($recipients.html().length === 0) {
        $recipients.append("<b style='background-color:yellow;'>TEST SERVER ONLY -- RUS & ASD NOT AUTOMATICALLY TAGGED AS RECIPIENTS FOR SAFEGUARD</b><br/>");
    }
}

/*************************************************
 *
 *                Group by function
 *
*************************************************/
function groupBy (collection, property, type) {
    let i = 0;
    const values = [];
    let result = [];
    let val,
        index;

    for (; i < collection.length; i += 1) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1) { result[index].push(collection[i]); } else {
            values.push(val);
            result.push([collection[i]]);
        }
    }

    // Remove extended monitoring releases
    if (type === "releases") {
        const start = $("#shift_start").val();
        const end = $("#shift_end").val();
        result = result.filter(([x]) => {
            const { status, validity } = x;
            return (status === "extended" && moment(validity).isAfter(moment(start).add(30, "minutes")) &&
            moment(validity).isSameOrBefore(moment(end).subtract(30, "minutes"))) ||
            status === "on-going";
        });
    }

    return result;
}

/*************************************************
 *
 *     Function for getting alert releases
 *
*************************************************/
function getShiftReleases (shift_ts) {
    return $.getJSON("/../../accomplishment/getShiftReleases", shift_ts)
    .fail((xhr, status, error) => {
        alert(`(${xhr.responseText})`);
    })
    .then((releases) => {
        // Clear all generated reports if there's any
        // before loading another set of reports
        $(".reports_nav_list, .reports_field_list").each((index, obj) => {
            if (obj.id !== "reports_nav_sample" && obj.id !== "reports_field_sample") $(obj).remove();
        });

        if (releases.length !== 0) {
            $("#mail_recipients_row").show();
            initializeMailRecipients();
            releases_per_event = groupBy(releases, "event_id", "releases");
            const ids = {};
            ids.release_ids = releases.map(x => x.release_id);
            ids.event_ids = releases.map(x => x.event_id);
            return ids;
        }

        $("#loading").modal("hide");
        $("#reports_nav_sample").attr("style", "").addClass("active");
        $("#reports_field_sample").attr("hidden", false).addClass("in active");
        $("#mail_recipients_row").hide();
        return $.Deferred().reject();
    });
}

/*************************************************
 *
 *        Function for getting alert triggers
 *
*************************************************/
function getShiftTriggers (ids) {
    return $.getJSON("/../../accomplishment/getShiftTriggers", { releases: ids.release_ids, events: ids.event_ids })
    .fail((x) => {
        alert(`(${xhr.responseText})`);
    })
    .then((triggers) => {
        // Shift triggers and All triggers contain
        // all of the triggers REGARDLESS of event
        const shift_triggers = JSON.parse(triggers.shiftTriggers);
        const all_triggers = JSON.parse(triggers.allTriggers);

        // Grouped_triggers(_x) contains all triggers
        // grouped by event id per array
        const grouped_triggers = groupBy(shift_triggers, "event_id", "triggers");
        const grouped_triggers_x = groupBy(all_triggers, "event_id", "triggers");

        return [grouped_triggers, grouped_triggers_x];
    });
}

/*************************************************
 *
 *   Function that iterates array containing
 *   array of releases grouped by event id
 *
*************************************************/
function prepareReportDataAndHTML ([shift_triggers, all_triggers]) {
    const backbone_data_per_report = [];
    releases_per_event.forEach((event_releases, index) => {
        const report_data = getReportBackboneData(event_releases, shift_triggers, all_triggers);
        buildEndOfShiftReportSiteTabs(report_data, index);

        const summary_promises = makeSummary(report_data);
        const narrative_promises = makeNarratives(report_data);

        const report = $.when(summary_promises, narrative_promises)
        .then((summary, narratives) => ({ summary, narratives, data: report_data }));

        backbone_data_per_report.push(report);
    });

    return $.when(...backbone_data_per_report).then((...args) => {
        const reports = [];
        args.forEach((report) => { reports.push(report); });
        return $.Deferred().resolve(reports);
    });
}

/*************************************************
 *
 *         Function for getting the data
 *           needed for report creation
 *
*************************************************/
function getReportBackboneData ([event_release], shift_triggers, all_triggers) {
    const {
        name, event_id,
        mt_first, mt_last, ct_first, ct_last
    } = event_release;

    const data = {
        ...event_release,
        site: name,
        mt: `${mt_first} ${mt_last}`,
        ct: `${ct_first} ${ct_last}`
    };

    // Get an array group on shift triggers corresponding the event
    // and put it in triggers_in_shift
    // triggers_in_shift contains all triggers for an event REGARDLESS of type
    // arranged in DESCENDING TIMESTAMP
    let index = shift_triggers.map(({ event_id: id }) => id).indexOf(event_id);
    const triggers_in_shift = index > -1 ? shift_triggers[index] : null;

    let alert_triggers = null;
    if (data.internal_alert_level !== "A0") {
        alert_triggers = data.internal_alert_level.slice(3);
        alert_triggers.replace(/0/g, "");
    }

    // Get in-shift triggers
    data.inshift_triggers = getInshiftTriggers(triggers_in_shift, alert_triggers);

    // Get first trigger
    const first_trigger = all_triggers.map(([{ event_id: id }]) => id).lastIndexOf(event_id);
    const { length } = all_triggers[first_trigger];
    data.first_trigger = all_triggers[first_trigger][length - 1];

    data.event_id = data.first_trigger.event_id;

    // Get last trigger/s from previous shifts
    index = all_triggers.map(([{ event_id: id }]) => id).indexOf(event_id);
    const all_event_triggers = all_triggers[index];
    data.most_recent = getMostRecentTriggersBeforeShift(all_event_triggers, triggers_in_shift, alert_triggers);

    return data;
}

/*************************************************
 *
 *  Get inshift triggers: contains most recent
 *        triggers alerted on the shift
 *      (one entry per trigger type only)
 *
*************************************************/
function getInshiftTriggers (triggers_in_shift, alert_triggers) {
    if (triggers_in_shift != null) {
        const temp = [];
        if (alert_triggers != null) {
            for (let z = alert_triggers.length; z >= 0; z -= 1) {
                const trigger = alert_triggers[z];
                const triggers_array = triggers_in_shift.map(({ trigger_type }) => trigger_type);

                let y = triggers_array.indexOf(trigger);
                if (y !== -1) {
                    temp.push(triggers_in_shift[y]);
                }

                if (trigger === "G" || trigger === "S" || trigger === "M") {
                    y = triggers_array.indexOf(trigger.toLowerCase());
                    if (y !== -1) {
                        temp.push(triggers_in_shift[y]);
                    }
                }
            }
            return temp;
        } return null;
    } return null;
}

/*************************************************
 *
 *           Get most recent triggers
 *          that occurred before shift
 *
*************************************************/
function getMostRecentTriggersBeforeShift (all_event_triggers, triggers_in_shift, alert_triggers) {
    const most_recent_before = [];
    if (alert_triggers != null) {
        for (let z = alert_triggers.length; z >= 0; z -= 1) {
            let m = null;
            let triggers_array = null;
            if (triggers_in_shift !== null) {
                triggers_array = triggers_in_shift.map(({ trigger_type }) => trigger_type);
                m = triggers_array.lastIndexOf(alert_triggers[z]);
            }

            let y = null;
            const all_type_array = all_event_triggers.map(({ trigger_type }) => trigger_type);
            const all_triggers_id_array = all_event_triggers.map(({ trigger_id }) => trigger_id);
            // If there's a recent trigger on shift, get the second most recent
            if (m > -1 && m != null) {
                const { trigger_id } = triggers_in_shift[m];
                const index = all_triggers_id_array.indexOf(trigger_id);
                y = all_type_array.indexOf(alert_triggers[z], index + 1);
            } else { // else just get the most recent
                y = all_type_array.indexOf(alert_triggers[z]);
            }

            if (y !== -1) most_recent_before.push(all_event_triggers[y]);

            if (alert_triggers[z] === "G" || alert_triggers[z] === "S" || alert_triggers[z] === "M") {
                m = null;
                if (triggers_in_shift != null) {
                    triggers_array = triggers_in_shift.map(({ trigger_type }) => trigger_type);
                    m = triggers_array.lastIndexOf(alert_triggers[z].toLowerCase());
                }

                y = null;
                // If there's a recent trigger on shift, get the second most recent
                if (m > -1 && m != null) {
                    const { trigger_id } = triggers_in_shift[m];
                    const index = all_triggers_id_array.indexOf(trigger_id);
                    y = all_type_array.indexOf(alert_triggers[z].toLowerCase(), index + 1);
                } else { // else just get the most recent
                    y = all_type_array.indexOf(alert_triggers[z].toLowerCase());
                }

                if (y !== -1) most_recent_before.push(all_event_triggers[y]);
            }
        }
    }

    return most_recent_before;
}

/*************************************************
 *
 *  Function that creates site tabs separating
 *             reports from each sites
 *
*************************************************/
function buildEndOfShiftReportSiteTabs (data, index) {
    const site_code = data.site;
    const { event_id, internal_alert_level: alert } = data;
    const nav_id = `report_nav_${site_code}`;
    const field_id = `report_field_${site_code}`;

    const $nav_sample = $("#reports_nav_sample");
    $nav_sample.clone().attr({
        id: `${nav_id}`,
        style: ""
    })
    .appendTo("#reports_nav");
    $nav_sample.attr("style", "display:none;").removeClass("active");

    $(`#${nav_id} a`).attr("href", `#${field_id}`)
    .html(`<strong>${site_code.toUpperCase()}</strong>`).removeClass("active");

    const $field_sample = $("#reports_field_sample");
    $field_sample.clone().attr({
        id: `${field_id}`,
        hidden: false
    })
    .removeClass("in active").appendTo("#reports_field");
    $field_sample.attr("hidden", true).removeClass("in active");

    $(`#${field_id} .submit_area button`)
    .attr({
        disabled: false, "data-site": site_code, "data-event": event_id, "data-alert": alert
    })
    .addClass("submit_buttons");

    $(`#${field_id} textarea`).each((x, y) => {
        const id = $(y).attr("id");
        $(y).attr("id", `${id}_${site_code}`);
    });

    const checkbox_id = `graph_checkbox_${site_code}`;
    $("#graph_checkbox_sample").clone().attr({
        id: `${checkbox_id}`,
        hidden: false
    })
    .appendTo(`#${field_id} .graphs-div`);
    const div = `#${checkbox_id}`;
    $(`${div} .rainfall_checkbox`).attr("value", `rain_${site_code}`);
    $(`${div} .surficial_checkbox`).attr("value", `surficial_${site_code}`);
    $(`${div} .file`).attr("value", site_code);
    $(`${div} .files-selected`).attr({
        id: `files-selected-${site_code}`,
        "data-site": site_code
    });
    $(`${div} .files-selected`).tagsinput();
    $(`${div} .bootstrap-tagsinput`).css({ "min-height": "34px", width: "100%" });
    $(`${div} .bootstrap-tagsinput > input`).prop("readonly", true);

    if (index === 0) {
        $(`#${nav_id}`).addClass("active");
        $(`#${field_id}`).addClass("in active");
    }

    getSensorColumns(site_code);
}

/*************************************************
 *
 *  Get sensor columns for graph checkbox options
 *
*************************************************/
function getSensorColumns (site_code) {
    $.get(`/../../accomplishment/getSensorColumns/${site_code}`, (data) => {
        data.forEach((column) => {
            $("#subsurface_option_sample").clone().attr({ id: `subsurface_option_${column.name}`, style: "" })
            .appendTo(`#graph_checkbox_${site_code} .subsurface_options`);
            $(`#subsurface_option_${column.name} a`)
            .html(`<input type='checkbox' class='subsurface_checkbox' value='subsurface_${column.name}'>&emsp;${column.name.toUpperCase()}`);
            $(".dropdown-toggle").dropdown();
        });
    }, "json");
}

/*************************************************
 *
 *  Get all narratives included within shift
 *  (narrative timestamp must within shift
 *  timestamp); if A0, include narratives beyond
 *  shift
 *
*************************************************/
function getShiftNarratives (data) {
    const timestamps = $.extend(true, {}, shift_timestamps);
    timestamps.event_id = data.event_id;
    timestamps.start = moment(timestamps.start).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
    if (data.internal_alert_level === "A0") timestamps.end = null;

    return $.getJSON("/../../accomplishment/getNarrativesForShift", timestamps)
    .then(x => x);
}

/*************************************************
 *
 *     Creates report narratives that will be
 *           entered on textbox inputs
 *
*************************************************/
function makeNarratives (report_data) {
    const data = { ...report_data };

    return getShiftNarratives(data).then((narratives) => {
        let narrative_compiled = null;
        narrative_compiled = "<b>NARRATIVE:</b><br/>";
        narratives.forEach(({ timestamp, narrative }) => {
            narrative_compiled = `${narrative_compiled + moment(timestamp).format("hh:mm:ss A")} - ${narrative}<br/>`;
        });
        return $.Deferred().resolve(narrative_compiled);
    });
}

/*************************************************
 *
 *  Creates report format that will be entered
 *              on textbox inputs
 *
*************************************************/
function makeSummary (report_data) {
    let report = null;
    const {
        mt, ct, event_start, most_recent,
        first_trigger: { trigger_type: first_trigger_type, info: first_trigger_info },
        internal_alert_level, validity, inshift_triggers
    } = report_data;
    const report_header = `<b>END-OF-SHIFT REPORT (${mt.replace(/[^A-Z]/g, "")}, ${ct.replace(/[^A-Z]/g, "")})</b><br/>`;
    const shift_start = `<b>SHIFT START:<br/>${moment(shift_timestamps.start).format("MMMM DD, YYYY, hh:mm A")}</b>`;
    const shift_end = `<b>SHIFT END:<br/>${moment(shift_timestamps.end).format("MMMM DD, YYYY, hh:mm A")}</b>`;

    // ORGANIZE SHIFT START INFO
    let start_info = null;
    const report_start = moment(event_start).format("MMMM DD, YYYY, hh:mm A");

    if (moment(event_start).isAfter(moment(shift_timestamps.start).add(30, "minutes")) && moment(event_start).isSameOrBefore(moment(shift_timestamps.end).subtract(30, "minutes"))) {
        start_info = `Monitoring initiated on ${report_start} due to ${basis_to_raise[first_trigger_type][0]} (${first_trigger_info}).`;
    } else {
        const a = `Event monitoring started on ${report_start} due to ${basis_to_raise[first_trigger_type][0]} (${first_trigger_info}).`;
        let b = null;
        if (most_recent.length > 0) {
            b = "the following recent trigger/s: ";
            b += "<ul>";
            most_recent.forEach((recent) => {
                const { trigger_type, timestamp, info } = recent;
                b = `${b}<li> ${basis_to_raise[trigger_type][1]} - alerted on ${moment(timestamp).format("MMMM DD, YYYY, hh:mm A")} due to ${basis_to_raise[trigger_type][0]} (${info})</li>`;
            });
            b += "</ul>";
        } else { b = "no new alert triggers from previous shift.<br/>"; }
        start_info = `Monitoring continued with ${b}- ${a}`;
    }

    // ORGANIZE SHIFT END INFO
    let end_info = null;
    if (internal_alert_level === "A0") {
        end_info = `Alert <b>lowered to A0</b>; monitoring ended at <b>${moment(validity).format("MMMM DD, YYYY, hh:mm A")}</b>.<br/>`;
    } else {
        let a = `The current internal alert level is <b>${internal_alert_level}</b>.<br/>- `;
        if (inshift_triggers !== null && inshift_triggers.length !== 0) {
            a += "The following alert trigger/s was/were encountered: ";
            a += "<ul>";
            inshift_triggers.forEach((inshift) => {
                const { trigger_type, timestamp, info } = inshift;
                a = `${a}<li> <b>${basis_to_raise[trigger_type][1]}</b> - alerted on <b>${moment(timestamp).format("MMMM DD, YYYY, hh:mm A")}</b> due to ${basis_to_raise[trigger_type][0]} (${info})</li>`;
            });
            a += "</ul>";
        } else { a += "No new alert triggers encountered.<br/>"; }
        const con = `Monitoring will continue until <b>${moment(validity).format("MMMM DD, YYYY, hh:mm A")}</b>.<br/>`;

        end_info = `${a}- ${con}`;
    }

    report = `${report_header}<br/>${shift_start}<br/>- ${start_info}<br/><br/>${shift_end}<br/>- ${end_info}`;
    return report;
}

/*************************************************
 *
 *  Creates report format that will be entered
 *              on textbox inputs
 *
*************************************************/
function delegateReportsToTextAreas (reports, withDataAnalysis = true) {
    reports.forEach((report) => {
        const { data: { site } } = report;
        if (withDataAnalysis) report.analysis = "<b>DATA ANALYSIS:</b><br/>- <i>Subsurface data: </i><br/>- <i>Surficial data: </i><br/>- <i>Rainfall data: </i>";
        Object.keys(report).forEach((key) => {
            if (key !== "data") {
                const name = `shift_${key}_${site}`;
                $(`#${name}`).val(report[key]);
                const editor = CKEDITOR.instances[name];
                if (editor) { editor.destroy(true); }
                CKEDITOR.replace(name, { height: 250 });
            }
        });
    });
}

/*************************************************
 *
 *        Initialize graph related inputs
 *
*************************************************/
function initializeGraphRelatedInputs () {
    $(document).on("click", ".subsurface_options a", ({ currentTarget }) => {
        $(currentTarget).children("input").trigger("click");
    });

    $(document).on("click", ".rainfall_checkbox, .surficial_checkbox, .subsurface_checkbox", ({ currentTarget }) => {
        if ($(currentTarget).is(":checked")) {
            const [type, site] = $(currentTarget).val().split("_");
            const shift_start = $("#shift_start").val();
            const shift_end = $("#shift_end").val();
            window.open(`${window.location.origin}/data_analysis/eos_charts/${current_user_id}/${type}/${site}/${shift_start}/${shift_end}`, "_blank");
        }
    });
}

/*************************************************
 *
 *        Initialize file uploading
 *
*************************************************/
function initializeFileUploading () {
    reposition("#resultModal");
    reposition("#loading");

    $(document).on("click", ".browse", ({ currentTarget }) => {
        const file = $(currentTarget).parent().parent().parent()
        .find(".file");
        file.trigger("click");
    });

    $(document).on("change", ".file", ({ currentTarget }) => {
        const { files } = currentTarget;
        const site = $(currentTarget).attr("value");
        if (!upload_files.hasOwnProperty(site)) upload_files[site] = [];

        for (let i = 0; i < files.length; i += 1) {
            if (upload_files[site].map(x => x.name).indexOf(files[i].name) === -1) {
                upload_files[site].push(files[i]);
                $(`#files-selected-${site}`).tagsinput("add", files[i].name);
            }
        }
    });

    $(document).on("itemRemoved", ".files-selected", (x) => {
        const { item, target: { dataset: { site } } } = x;
        const index = upload_files[site].map(({ name }) => name).indexOf(item);
        upload_files[site].splice(index, 1);
    });
}

/*************************************************
 *
 *              Send report function
 *
*************************************************/
function sendReport (site, event_id) {
    // Get all three values on textarea reports
    // Get files attached
    // Send
    // Save data analysis/expert opinion part

    $("#loading .progress-bar").text("Sending end-of-shift report...");
    $("#loading").modal("show");

    let final_report = "";
    let analysis_report = "";
    const recipients = $("#recipients").tagsinput("items");
    const form_data = new FormData();
    const file_data = typeof upload_files[site] !== "undefined" ? upload_files[site] : [];
    const form = {
        event_id,
        site,
        recipients: JSON.stringify(recipients)
    };

    $(`#report_field_${site} textarea`).each((index, id) => {
        const textarea_id = $(id).attr("id");
        const report = CKEDITOR.instances[textarea_id].getData();
        if (textarea_id.includes("analysis")) analysis_report = report;

        final_report += final_report !== "" ? "<br/><br/>" : "";
        final_report += report;
    });
    form.body = final_report;

    for (let i = 0; i < file_data.length; i += 1) {
        form_data.append("file[]", file_data[i]);
    }

    for (const key in form) {
        if (form.hasOwnProperty(key)) form_data.append(key, form[key]);
    }

    $.ajax({
        type: "POST",
        url: "/../../accomplishment/mail",
        cache: false,
        data: form_data,
        processData: false,
        contentType: false
    })
    .done((x) => {
        $("#loading").modal("hide");

        if (x == "Sent.") {
            console.log("Email sent.");
            $(`#report_nav_${site} a`).attr("style", "background-color: lightgreen !important");
            saveExpertOpinion(event_id, analysis_report, shift_timestamps.start);
            $("#resultModal .modal-body").html("<strong>SUCCESS:</strong>&ensp;End-of-shift report sent!");
            $("#resultModal").modal("show");
        } else {
            console.log("Email sending failed.");
            $("#resultModal .modal-body").html(`<strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!<br/><br/><i>${x}</i>`);
            $("#resultModal").modal("show");
        }
    })
    .fail((x) => { console.log(x.responseText); });
}

/*************************************************
 *
 *       Refresh narratives and get latest
 *  narratives without refreshing the whole page
 *
*************************************************/
function refreshNarrativesTextArea (event_id, internal_alert, site) {
    makeNarratives({ event_id, internal_alert_level: internal_alert })
    .then(x => $.Deferred().resolve([{ narratives: x, data: { site } }]))
    .then((x) => { delegateReportsToTextAreas(x, false); });
}

/*************************************************
 *
 *       Refresh narratives and get latest
 *  narratives without refreshing the whole page
 *
*************************************************/
function saveExpertOpinion (event_id, analysis, shift_start) {
    const form = { event_id, analysis, shift_start };
    $.post("/../../accomplishment/saveExpertOpinion", form)
    .then((x) => {
        console.log(x);
    });
}

/*************************************************
 *
 *        Function for downloading charts
 *
*************************************************/
function downloadCharts (site) {
    const svg = [];
    $(`#graph_checkbox_${site}`).find("input[type=checkbox]:checked")
    .each(function (index, cbox) {
        let val = $(this).val();
        console.log(val);
        if (val.search("subsurface") == -1) {
            const x = val.search("_");
            val = val.slice(0, x);
            console.log(val);
        }
        svg.push(val);
    });
    console.log(site);
    console.log(svg);
    console.log(current_user_id);
    $("#loading .progress-bar").text("Rendering end-of-shift charts...");
    $("#loading").modal("show");
    $.post("/../../chart_export/renderCharts", { site, svg, connection_id: current_user_id })
    .done((data) => {
        if (data == "Finished") {
            $("#loading").modal("hide");
            window.location.href = `/../../chart_export/viewPDF/Graph Attachment for ${site.toUpperCase()}.pdf`;
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus);
    });
}
