
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Accomplishment Report Filing Form - 
 *  End-of-Shift Report Tab [reports/accomplishment_report.php]
 *  [host]/reports/accomplishment/form
 *  
****/

let releases_per_event, shift_timestamps, validation_message;
let basis_to_raise = {
    "D": ["a monitoring request of the LGU/LEWC", "On-Demand"],
    "R": ["accumulated rainfall value exceeding threshold level", "Rainfall"],
    "E": ["a detection of landslide-triggering earthquake", "Earthquake"],
    "g": ["significant surficial movement", "LEWC Ground Measurement"],
    "s": ["significant underground movement", "Subsurface Data"],
    "G": ["critical surficial movement","LEWC Ground Measurement"],
    "S": ["critical underground movement","Subsurface Data"],
    "m": ["significant movement observed as manifestation", "Manifestation"],
    "M": ["critical movement observed as manifestation", "Manifestation"]
};
let current_user_id = $("#current_user_id").attr("value");

$(document).ready(function() 
{
    initializeTimestamps();
    initializeFormValidator();
    initializeGraphRelatedInputs();
    initializeFileUploading();

    $(document).on("click", ".submit_buttons", function (btn) {
        let site = $(this).attr("data-site"),
            event_id = $(this).attr("data-event"),
            internal_alert = $(this).attr("data-alert");
        let btn_id = $(this).attr("id");

        switch( btn_id ) {
            case "send": sendReport(site, event_id); break;
            case "refresh-narratives": refreshNarrativesTextArea(event_id, internal_alert, site); break;
            case "download-charts": downloadCharts(site); break;
        }
    });
});

/*************************************************
 *
 *              Initialize Timestamps
 * 
*************************************************/
function initializeTimestamps() 
{
    $(function () {
        $('.timestamp').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:00',
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            }
        });
        $('.shift_start').datetimepicker({
            format: 'YYYY-MM-DD HH:30:00',
            enabledHours: [7, 19],
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            }
        });
        $('.shift_end').datetimepicker({
            format: 'YYYY-MM-DD HH:30:00',
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            },
            useCurrent: false //Important! See issue #1075
        });
        $(".shift_start").on("dp.change", function (e) {
            $('.shift_end').data("DateTimePicker").minDate(e.date);
        });
        $(".shift_end").on("dp.change", function (e) {
            $('.shift_start').data("DateTimePicker").maxDate(e.date);
        });

        $('.shift_start_others').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:00',
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            }
        });
        $('.shift_end_others').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:00',
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            },
            useCurrent: false //Important! See issue #1075
        });
        $(".shift_start_others").on("dp.change", function (e) {
            $('.shift_end_others').data("DateTimePicker").minDate(e.date);
        });
        $(".shift_end+others").on("dp.change", function (e) {
            $('.shift_start_others').data("DateTimePicker").maxDate(e.date);
        });
    });

    $("#shift_start").focusout(function (x) {
        if(this.value == "") $("#generate").prop('disabled', true).removeClass('btn-info').addClass('btn-danger');
        else $("#generate").prop('disabled', false).removeClass('btn-danger').addClass('btn-info');
    });
}

/*************************************************
 *
 *      Function for timestamp validation
 * 
*************************************************/
function checkTimestamp(value, element) 
{
    let hour = moment(value).hour();
    let minute = moment(value).minute();
        
    if(element.id == 'shift_start')
    {
        message = "Acceptable times of shift start are 07:30 and 19:30 only.";
        let temp = moment(value).add(13, 'hours')
        $("#shift_end").val(moment(temp).format('YYYY-MM-DD HH:mm:ss'))
        $("#shift_end").prop("readonly", true).trigger('focus');
        setTimeout(function() { 
            $("#shift_end").trigger('focusout');
        }, 500);
        return (hour == 7 || hour == 19) && minute == 30;
    } else if(element.id == 'shift_end')
    {   
        message = "Acceptable times of shift end are 08:30 and 20:30 only.";
        return ((hour == 8 || hour == 20) && minute == 30);
    }
}

/*************************************************
 *
 *           Initialize form validators
 *   Contains main functions for report creation
 *             located on submit area
 * 
*************************************************/
function initializeFormValidator() 
{
    jQuery.validator.addMethod("TimestampTest", function(value, element) 
    {   
        return checkTimestamp(value, element);
    }, function () {return validation_message});

    $("#accomplishmentForm").validate(
    {
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
        errorPlacement: function ( error, element ) {
            let placement = $(element).closest('.form-group');

            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(placement);
            } //remove on success 

            // Add `has-feedback` class to the parent div.form-group
            // in order to add icons to inputs
            element.parents( ".form-group" ).addClass( "has-feedback" );

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if ( !element.next( "span" )[ 0 ] ) { 
                $( "<span class='glyphicon glyphicon-remove form-control-feedback' style='top:18px; right:22px;'></span>" ).insertAfter( element );
                if(element.parent().is(".datetime") || element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if(element.is("select")) element.next("span").css({"top": "18px", "right": "30px"});
            }
        },
        success: function ( label, element ) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if ( !$( element ).next( "span" )) {
                $( "<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>" ).insertAfter( $( element ) );
            }

           $(element).closest(".form-group").children("label.error").remove();
        },
        highlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".form-group" ).addClass( "has-error" ).removeClass( "has-success" );
            if($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $( element ).nextAll( "span.glyphicon" ).remove();
                $( "<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>" ).insertAfter( $( element ) );
            }
            else $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
        },
        unhighlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".form-group" ).addClass( "has-success" ).removeClass( "has-error" );
            if($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $( element ).nextAll( "span.glyphicon" ).remove();
                $( "<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>" ).insertAfter( $( element ) );
            }
            else $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
        },
        submitHandler: function (form) {

            shift_timestamps = { start: $("#shift_start").val(), end: $("#shift_end").val() };
            
            $("#loading .progress-bar").text("Generating end-of-shift report...");
            $('#loading').modal("show");

            getShiftReleases(shift_timestamps).then(getShiftTriggers).then(prepareReportDataAndHTML)
            .then(delegateReportsToTextAreas)
            .then(function (x) { $('#loading').modal("hide"); });
        }
    });
}

/*************************************************
 *
 *          Initialize mail recipients
 * 
*************************************************/
function initializeMailRecipients()
{
    if( location.hostname == "www.dewslandslide.com" )
    {
        let emails = ["rusolidum@phivolcs.dost.gov.ph", "asdaag48@gmail.com", "phivolcs-senslope@googlegroups.com", "phivolcs-dynaslope@googlegroups.com"];
        emails.forEach(function(x) { $('#recipients').tagsinput('add', x); });
    } else {
        if($('#recipients_span').html().length == 0) {
            $("#recipients_span").append("<b style='background-color:yellow;'>TEST SERVER ONLY -- RUS & AGD NOT AUTOMATICALLY TAGGED AS RECIPIENTS FOR SAFEGUARD</b><br/>")
        }   
    }
}

/*************************************************
 *
 *                Group by function
 * 
*************************************************/
function groupBy(collection, property, type) 
{
    let i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }

    // Remove extended monitoring releases
    if( type == 'releases')
    {
        let start = $("#shift_start").val();
        let end = $("#shift_end").val();
        result = result.filter( function (x) {
            return ( x[0].status == 'extended' && moment(x[0].validity).isAfter(moment(start).add(30,'minutes')) && moment(x[0].validity).isSameOrBefore(moment(end).subtract(30,'minutes')) ) || x[0].status == 'on-going';
        });
    }
    
    return result;
}

/*************************************************
 * 
 *     Function for getting alert releases
 * 
*************************************************/
function getShiftReleases(shift_timestamps) 
{
    return $.getJSON("/../../accomplishment/getShiftReleases", shift_timestamps)
    .fail(function (xhr, status, error) {
        let err = eval("(" + xhr.responseText + ")");
        alert(err.Message);    
    })
    .then(function (releases) 
    {
        // Clear all generated reports if there's any
        // before loading another set of reports
        $(".reports_nav_list, .reports_field_list").each(function (index, obj) {
            if( obj.id !== "reports_nav_sample" && obj.id !== "reports_field_sample" ) $(obj).remove();
        });
       
        if(releases.length != 0) {
            $("#mail_recipients_row").show();
            initializeMailRecipients();
            releases_per_event = groupBy(releases, "event_id", 'releases');
            let ids = {};
            ids.release_ids = releases.map( x => x.release_id );
            ids.event_ids = releases.map( x => x.event_id );
            return ids;
        }
        else // Set to default empty reports if there's no releases
        { 
            $("#loading").modal("hide");
            $("#reports_nav_sample").attr("style", "").addClass("active");
            $("#reports_field_sample").attr("hidden", false).addClass("in active");
            $("#mail_recipients_row").hide();
            return $.Deferred().reject();
        }
    });
}

/*************************************************
 *
 *        Function for getting alert triggers
 * 
*************************************************/
function getShiftTriggers(ids) 
{
    return $.getJSON( "/../../accomplishment/getShiftTriggers", {"releases": ids.release_ids, "events": ids.event_ids})
    .fail(function(x) {
        let err = eval("(" + x.responseText + ")");
        alert(err.Message);   
    })
    .then(function (triggers) {
        // Shift triggers and All triggers contain
        // all of the triggers REGARDLESS of event
        let shift_triggers = JSON.parse(triggers.shiftTriggers);
        let all_triggers = JSON.parse(triggers.allTriggers);

        // Grouped_triggers(_x) contains all triggers
        // grouped by event id per array
        let grouped_triggers = groupBy(shift_triggers, 'event_id', 'triggers');
        let grouped_triggers_x = groupBy(all_triggers, 'event_id', 'triggers');

        return [grouped_triggers, grouped_triggers_x];
    });
}

/*************************************************
 *
 *   Function that iterates array containing
 *   array of releases grouped by event id
 * 
*************************************************/
function prepareReportDataAndHTML(grouped_triggers) 
{
    let shift_triggers = grouped_triggers[0], 
        all_triggers = grouped_triggers[1];

    let backbone_data_per_report = [];
    releases_per_event.forEach( function (event_releases, index) 
    {
        let report_data = getReportBackboneDataForEvent(event_releases, shift_triggers, all_triggers);
        buildEndOfShiftReportSiteTabs(report_data, index);

        let summary_promises = makeSummary(report_data);
        let narrative_promises = makeNarratives(report_data);

        let x = $.when( summary_promises, narrative_promises )
        .then( function (x, y) {
            let report = { summary: x, narratives: y, data: report_data };
            return report;
        });

        backbone_data_per_report.push( x );
    });

    return $.when.apply($, backbone_data_per_report).then( function () {
        let reports = [];
        for (var i = 0; i < arguments.length; i++) {
            reports.push( arguments[i] );
        }
        return $.Deferred().resolve(reports);
    });
}

/*************************************************
 *
 *         Function for getting the data 
 *           needed for report creation
 * 
*************************************************/
function getReportBackboneDataForEvent(event_releases, shift_triggers, all_triggers) 
{
    let x = {};
    x.site = event_releases[0].name;
    x.event_start = event_releases[0].event_start;
    x.internal_alert_level = event_releases[0].internal_alert_level;
    x.validity = event_releases[0].validity;
    x.mt = event_releases[0].mt_first + " " + event_releases[0].mt_last;
    x.ct = event_releases[0].ct_first + " " + event_releases[0].ct_last;

    // Get an array group on shift triggers corresponding the event
    // and put it in triggers_in_shift
    // triggers_in_shift contains all triggers for an event REGARDLESS of type
    // arranged in DESCENDING TIMESTAMP
    let index = shift_triggers.map( y=>y[0].event_id ).indexOf(event_releases[0].event_id);
    let triggers_in_shift = index > -1 ? shift_triggers[index] : null;

    let alert_triggers = null;
    let public_alert_level = null;
    if( x.internal_alert_level !== 'A0') 
    {
        public_alert_level = x.internal_alert_level.slice(0,2);
        alert_triggers = x.internal_alert_level.slice(3);
        alert_triggers.replace(/0/g, '');
    }
    
    // Get in-shift triggers
    x.inshift_triggers = getInshiftTriggers( triggers_in_shift, alert_triggers );

    // Get first trigger
    let first_trigger = all_triggers.map( x => x[0].event_id ).lastIndexOf(event_releases[0].event_id);
    let length = all_triggers[first_trigger].length;
    x.first_trigger = all_triggers[first_trigger][length - 1];

    x.event_id = x.first_trigger.event_id;

    // Get last trigger/s from previous shifts
    index = all_triggers.map( y=>y[0].event_id ).indexOf(event_releases[0].event_id);
    let all_event_triggers = all_triggers[index];
    x.most_recent = getMostRecentTriggersBeforeShift( all_event_triggers, triggers_in_shift, alert_triggers );

    return x;
}

/*************************************************
 *
 *  Get inshift triggers: contains most recent 
 *        triggers alerted on the shift 
 *      (one entry per trigger type only)
 * 
*************************************************/
function getInshiftTriggers(triggers_in_shift, alert_triggers)
{
    if (triggers_in_shift != null) {
        let temp = [];
        if( alert_triggers != null )
        {
            let z = alert_triggers.length;
            while(z--)
            {
                let y = triggers_in_shift.map( x=>x.trigger_type ).indexOf(alert_triggers[z]);
                if(y!=-1) { 
                    temp.push(triggers_in_shift[y]);
                }

                if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S' || alert_triggers[z] == 'M')
                {
                    y = triggers_in_shift.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase());
                    if(y!=-1) { 
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
function getMostRecentTriggersBeforeShift(all_event_triggers, triggers_in_shift, alert_triggers)
{
    let most_recent_before = [];
    if( alert_triggers != null)
    {
        let z = alert_triggers.length;
        while(z--)
        {
            let m = null;
            if(triggers_in_shift != null)
            {
                m = triggers_in_shift.map( x=>x.trigger_type ).lastIndexOf(alert_triggers[z]);
            }
            
            let y = null;
            // If there's a recent trigger on shift, get the second most recent
            if(m > -1 && m != null)
            {
                let o = triggers_in_shift[m].trigger_id;
                let a = all_event_triggers.map( x=>x.trigger_id ).indexOf(o);
                y = all_event_triggers.map( x=>x.trigger_type ).indexOf(alert_triggers[z], a + 1);
            }
            // Just get the most recent
            else
            {
                y = all_event_triggers.map( x=>x.trigger_type ).indexOf(alert_triggers[z]);
            }

            if( y != -1) most_recent_before.push(all_event_triggers[y]);

            if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S' || alert_triggers[z] == 'M')
            {
                let m = null;
                if(triggers_in_shift != null)
                {
                    m = triggers_in_shift.map( x=>x.trigger_type ).lastIndexOf(alert_triggers[z].toLowerCase());
                }

                let y = null;
                // If there's a recent trigger on shift, get the second most recent
                if(m > -1 && m!=null)
                {
                    let o = triggers_in_shift[m].trigger_id;
                    let a = all_event_triggers.map( x=>x.trigger_id ).indexOf(o);
                    y = all_event_triggers.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase(), a + 1);
                }
                // Just get the most recent
                else
                {
                    y = all_event_triggers.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase());
                }

                if( y != -1) most_recent_before.push(all_event_triggers[y]);
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
function buildEndOfShiftReportSiteTabs(data, index)
{
    let site_code = data.site, event_id = data.event_id, alert = data.internal_alert_level;
    $("#reports_nav_sample").clone().attr("id", "report_nav_" + site_code).attr("style", "").appendTo("#reports_nav");
    $("#reports_nav_sample").attr("style", "display:none;").removeClass("active");
    $("#report_nav_" + site_code + " a").attr("href", "#report_field_" + site_code).html("<strong>" + site_code.toUpperCase() + "</strong>").removeClass("active");

    $("#reports_field_sample").clone().attr("id", "report_field_" + site_code).removeClass("in active").attr("hidden", false).appendTo("#reports_field");
    $("#reports_field_sample").attr("hidden", true).removeClass("in active");
    $("#report_field_" + site_code + " .submit_area button")
    .attr({disabled: false, "data-site": site_code, "data-event": event_id, "data-alert": alert})
    .addClass("submit_buttons");

    $("#report_field_" + site_code + " textarea").each( function(x, y) {
        let id = $(y).attr("id");
        $(y).attr("id", id + "_" + site_code);
    });

    $("#graph_checkbox_sample").clone().attr("id", "graph_checkbox_" + site_code).attr("hidden", false).appendTo("#report_field_" + site_code + " .graphs-div");
    $("#graph_checkbox_" + site_code + " .rainfall_checkbox").attr("value", "rain_" + site_code);
    $("#graph_checkbox_" + site_code + " .surficial_checkbox").attr("value", "surficial_" + site_code);

    if( index == 0 ) { 
        $("#report_nav_" + site_code).addClass("active"); 
        $("#report_field_" + site_code).addClass("in active");  
    }

    getSensorColumns(site_code);
}

/*************************************************
 *
 *  Get sensor columns for graph checkbox options
 * 
*************************************************/
function getSensorColumns(site_code) 
{
    $.get( "/../../accomplishment/getSensorColumns/" + site_code, function (data) {
        data.forEach(function (column) {
            $("#subsurface_option_sample").clone().attr({id: "subsurface_option_" + column.name, style:""})
                .appendTo("#graph_checkbox_" + site_code + " .subsurface_options");
            $("#subsurface_option_" + column.name + " a")
                .html("<input type='checkbox' class='subsurface_checkbox' value='subsurface_" + column.name + "'>&emsp;" + column.name.toUpperCase());
            $('.dropdown-toggle').dropdown();
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
function getShiftNarratives(data) 
{
    let timestamps = $.extend(true, {}, shift_timestamps);
    timestamps.event_id = data.event_id;
    if(data.internal_alert_level == "A0") timestamps.end = null;
    
    return $.getJSON("/../../accomplishment/getNarrativesForShift", timestamps)
    .then(function (x) { return x; });
}

/*************************************************
 *
 *     Creates report narratives that will be 
 *           entered on textbox inputs
 * 
*************************************************/
function makeNarratives(report_data) 
{
    let data = { event_id: report_data.event_id, internal_alert_level: report_data.internal_alert_level };

    return getShiftNarratives(data).then( function (narratives) {
        let narrative_compiled = null;
        narrative_compiled = "<b>NARRATIVE:</b><br/>";
        narratives.forEach(function (x) {
            narrative_compiled = narrative_compiled + moment(x.timestamp).format("hh:mm:ss A") + " - " + x.narrative + "<br/>";
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
function makeSummary(x) 
{
    let report = null;
    let report_header = "<b>END-OF-SHIFT REPORT (" + x.mt.replace(/[^A-Z]/g, '') + ", " + x.ct.replace(/[^A-Z]/g, '') + ")</b><br/>";
    let shift_start = "<b>SHIFT START:<br/>" + moment(shift_timestamps.start).format("MMMM DD, YYYY, hh:mm A") + "</b>";
    let shift_end = "<b>SHIFT END:<br/>" + moment(shift_timestamps.end).format("MMMM DD, YYYY, hh:mm A")  + "</b>";

    // ORGANIZE SHIFT START INFO
    let start_info = null;
    if( moment(x.event_start).isAfter( moment(shift_timestamps.start).add(30, 'minutes') ) && moment(x.event_start).isSameOrBefore( moment(shift_timestamps.end).subtract(30, 'minutes') ) )
    {
        start_info = "Monitoring initiated on " + moment(x.event_start).format("MMMM DD, YYYY, hh:mm A") + " due to " + basis_to_raise[x.first_trigger.trigger_type][0] + " (" + x.first_trigger.info + ").";  
    }
    else 
    { 
        let a =  "Event monitoring started on " + moment(x.event_start).format("MMMM DD, YYYY, hh:mm A") + " due to " + basis_to_raise[x.first_trigger.trigger_type][0] + " (" + x.first_trigger.info + ").";
        let b = null;
        if(x.most_recent.length > 0)
        {
            b = "the following recent trigger/s: ";
            b = b + "<ul>";
            x.most_recent.forEach(function (z) {
                b = b + "<li> " + basis_to_raise[z.trigger_type][1] + " - alerted on " + moment(z.timestamp).format("MMMM DD, YYYY, hh:mm A") + " due to " + basis_to_raise[z.trigger_type][0] + " (" + z.info + ")</li>";
            });
            b = b + "</ul>";
        }
        else { b = "no new alert triggers from previous shift.<br/>"}
        start_info = "Monitoring continued with " + b + "- " + a;
    }

    // ORGANIZE SHIFT END INFO
    let end_info = null;
    if (x.internal_alert_level === 'A0')
    {
        end_info = "Alert <b>lowered to A0</b>; monitoring ended at <b>" + moment(x.validity).format("MMMM DD, YYYY, hh:mm A") + "</b>.<br/>";
    } else {
        let a = "The current internal alert level is <b>" + x.internal_alert_level + "</b>.<br/>- ";
        if(x.inshift_triggers !== null && x.inshift_triggers.length !== 0)
        {
            a = a + "The following alert trigger/s was/were encountered: "
            a = a + "<ul>";
            x.inshift_triggers.forEach(function (z) {
                a = a + "<li> <b>" + basis_to_raise[z.trigger_type][1] + "</b> - alerted on <b>" + moment(z.timestamp).format("MMMM DD, YYYY, hh:mm A") + "</b> due to " + basis_to_raise[z.trigger_type][0] + " (" + z.info + ")</li>";
            });
            a = a + "</ul>";
        } else { a = a + "No new alert triggers encountered.<br/>"; }
        let con = "Monitoring will continue until <b>" + moment(x.validity).format("MMMM DD, YYYY, hh:mm A") + "</b>.<br/>";

        end_info = a + "- " + con;
    }
    
    report = report_header + "<br/>" + shift_start + "<br/>- " + start_info + "<br/><br/>" + shift_end + "<br/>- " + end_info;
    return report;
}

/*************************************************
 *
 *  Creates report format that will be entered
 *              on textbox inputs
 * 
*************************************************/
function delegateReportsToTextAreas(reports, withDataAnalysis = true) 
{
    reports.forEach(function (report) {
        if(withDataAnalysis) report.analysis = "<b>DATA ANALYSIS:</b><br/>- <i>Subsurface data: </i><br/>- <i>Surficial data: </i><br/>- <i>Rainfall data: </i>";
        for ( let key in report ) {
            let site = report.data.site;
            if( key != "data" ) {
                let name = "shift_" + key + "_" + site;
                $("#" + name).val( report[key] );
                let editor = CKEDITOR.instances[name];
                if (editor) { editor.destroy(true); }
                CKEDITOR.replace( name, {height: 250} );
            }
        }
    });
}

/*************************************************
 *
 *        Initialize graph related inputs
 * 
*************************************************/
function initializeGraphRelatedInputs() 
{
    $(document).on("click", ".subsurface_options a", function (link) {
        $(this).children("input").trigger("click");
    });
    
    $(document).on("change", ".rainfall_checkbox, .surficial_checkbox, .subsurface_checkbox", function (cbox) {
        cbox.stopPropagation();
        if( $(this).is(":checked") ) {
            let x = this.value.split("_");
            let type = x[0], site = x[1];
            let shift_start = $("#shift_start").val();
            let shift_end = $("#shift_end").val();
            window.open("/data_analysis/Eos_onModal/" + current_user_id + "/" + type + "/" + site + "/" + shift_start + "/" + shift_end, "_blank", "menubar=0");
        }
    });
}

/*************************************************
 *
 *        Initialize file uploading
 * 
*************************************************/
function initializeFileUploading() 
{
    reposition("#resultModal");
    reposition("#loading");

    $(document).on('click', '.browse', function() {
        let file = $(this).parent().parent().parent().find('.file');
        file.trigger('click');
    });

    $(document).on('change', '.file', function() {
        let files = $(this)[0].files;

        let filenames = "";
        for (let i = 0; i < files.length; i++) {
            if( i == 0 ) filenames = files[i].name;
            else filenames += ", " + files[i].name;
        }

        $(this).parent().find('.form-control').val(filenames);
    });
}

/*************************************************
 *
 *              Send report function
 * 
*************************************************/
function sendReport(site, event_id) 
{
    // Get all three values on textarea reports
    // Get files attached
    // Send
    // Save data analysis/expert opinion part
    
    $("#loading .progress-bar").text("Sending end-of-shift report...");
    $('#loading').modal("show");
    
    let final_report = "", analysis_report = "";
    let recipients = $("#recipients").tagsinput('items');
    let form_data = new FormData();
    let file_data = $(".file"), file;
    let form = { 
        'event_id': event_id, 
        'site': site,
        'recipients': JSON.stringify(recipients)
    };

    $("#report_field_" + site + " textarea").each( function (index, id) {
        let textarea_id = $(id).attr("id");
        let report = CKEDITOR.instances[ textarea_id ].getData();
        if( textarea_id.includes("analysis") ) analysis_report = report;
        
        final_report += final_report != "" ? "<br/><br/>" : "";
        final_report += report;
    });
    form.body = final_report;

    for( let i = 0; i < file_data[0].files.length; i++) {
        file = file_data[0].files[i];
        form_data.append('file[]', file);
    }

    for( let key in form ) {
        if(form.hasOwnProperty(key)) form_data.append(key, form[key]);
    };

    $.ajax({
        type: "POST",
        url: "/../../accomplishment/mail",
        cache: false,
        data: form_data,
        processData: false,
        contentType: false,
    })
    .done( function(x) { 

        $("#loading").modal('hide');

        if( x == "Sent.") {
            console.log("Email sent.");
            $("#report_nav_" + site + " a").attr("style", "background-color: lightgreen !important");
            saveExpertOpinion(event_id, analysis_report, shift_timestamps.start);
            $("#resultModal .modal-body").html('<strong>SUCCESS:</strong>&ensp;End-of-shift report sent!');
            $("#resultModal").modal('show');
        }
        else {
            console.log("Email sending failed.");
            $("#resultModal .modal-body").html('<strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!<br/><br/><i>' + x + "</i>");
            $("#resultModal").modal('show');
        }
    })
    .fail( function(x) { console.log(x.responseText); });
}   

/*************************************************
 *
 *       Refresh narratives and get latest
 *  narratives without refreshing the whole page
 * 
*************************************************/
function refreshNarrativesTextArea( event_id, internal_alert, site ) 
{
    makeNarratives({event_id: event_id, internal_alert_level: internal_alert})
    .then(function(x) { 
        return $.Deferred().resolve( [{ narratives: x, data: { site: site } }] );
    })
    .then(function(x) { delegateReportsToTextAreas(x, false); });
}

/*************************************************
 *
 *       Refresh narratives and get latest
 *  narratives without refreshing the whole page
 * 
*************************************************/
function saveExpertOpinion( event_id, analysis, shift_start ) 
{
    let form = { event_id: event_id, analysis: analysis, shift_start: shift_start };
    $.post("/../../accomplishment/saveExpertOpinion", form)
    .then(function(x) { 
        console.log(x);
    });
}

/*************************************************
 *
 *        Function for downloading charts
 * 
*************************************************/
function downloadCharts(site)
{
    let svg = [];
    $("#graph_checkbox_" + site).find("input[type=checkbox]:checked")
    .each(function (index, cbox) {
        let val = $(this).val();
        if( val.search("subsurface") == -1 ) {
            let x = val.search("_");
            val = val.slice(0, x);
        }
        svg.push(val);
    });

    $("#loading .progress-bar").text("Rendering end-of-shift charts...");
    $('#loading').modal("show");
    $.post("/../../chart_export/renderCharts", {site: site, svg: svg, connection_id: current_user_id})
    .done(function (data) {
        if(data == "Finished") {
            $('#loading').modal("hide");
            window.location.href = "/../../chart_export/viewPDF/Graph Attachment for " + site.toUpperCase() +".pdf";
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    });
}