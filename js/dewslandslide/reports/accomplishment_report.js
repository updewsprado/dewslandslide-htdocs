
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Accomplishment Report Filing Form - 
 *  End-of-Shift Report Tab [reports/accomplishment_report.php]
 *  [host]/reports/accomplishment/form
 *  
****/

$(document).ready(function() 
{

    let current_user_id = $("#current_user_id").attr("value");

    /*** Initialize Date/Time Input Fields ***/
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

    /***==============================================================***/

    function groupBy(collection, property, type) 
    {
        var i = 0, val, index,
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

    /**
     * MAIN FUNCTION FOR REPORT CREATION
     * Get the releases for the shift period
     */

    $("#shift_start").focusout(function (x) {
        if(this.value == "") $("#generate").prop('disabled', true).removeClass('btn-info').addClass('btn-danger');
        else $("#generate").prop('disabled', false).removeClass('btn-danger').addClass('btn-info');
    });

    var result, flag = 0, duties = [];
    $("#generate").on("click", function (e) {

        $("#loading .progress-bar").text("Generating end-of-shift report...");
        $('#loading').modal("show");

        if( checkTimestamp($("#shift_end").val(), $("#shift_end")[0] ) )
        {
            let formData = 
            {
                start: $("#shift_start").val(),
                end: $("#shift_end").val()
            };
            
            getShiftReleases(formData, function (res) 
            {
                console.log(res);
                let event_groups = groupBy(res, "event_id", 'releases');
                let ids = {};
                ids.release_ids = res.map( x => x.release_id );
                ids.event_ids = res.map( x => x.event_id );

                console.log("EWI released on the shift", event_groups);
                getShiftTriggers(ids, function (triggers) 
                {
                    // Shift triggers and All triggers contain
                    // all of the triggers REGARDLESS of event
                    let shift_triggers = JSON.parse(triggers.shiftTriggers);
                    let all_triggers = JSON.parse(triggers.allTriggers);
                    console.log("Shift Triggers", shift_triggers);
                    console.log("All Triggers", all_triggers);
                    
                    // Grouped_triggers(_x) contains all triggers
                    // grouped by event per array
                    let grouped_triggers = groupBy(shift_triggers, 'event_id', 'triggers');
                    let grouped_triggers_x = groupBy(all_triggers, 'event_id', 'triggers');
                    console.log("GROUPED TRIGGS", grouped_triggers);

                    let latest_releases = [];
                    event_groups.forEach( function (event) 
                    {
                        //console.log(event[0]);
                        let x = {};
                        x.site = event[0].name;
                        x.event_start = event[0].event_start;
                        x.internal_alert_level = event[0].internal_alert_level;
                        x.validity = event[0].validity;
                        x.mt = event[0].mt_first + " " + event[0].mt_last;
                        x.ct = event[0].ct_first + " " + event[0].ct_last;

                        // Get array group on grouped_triggers corresponding the event
                        // and put it in trigger_group
                        // Trigger_group contains all triggers for an event REGARDLESS of type
                        // arranged in DESCENDING TIMESTAMP
                        let index_group_trigger = grouped_triggers.map( y=>y[0].event_id ).indexOf(event[0].event_id);
                        let trigger_group = index_group_trigger > -1 ? grouped_triggers[index_group_trigger] : null;

                        let alert_triggers = null;
                        let public_alert_level = null;
                        if( x.internal_alert_level !== 'A0') 
                        {
                            public_alert_level = x.internal_alert_level.slice(0,2);
                            alert_triggers = x.internal_alert_level.slice(3);
                            alert_triggers.replace(/0/g, '');
                        }

                        console.log("TRIG GROUP" , trigger_group);
                        
                        // Get inshift triggers = contains most recent triggers alerted on
                        // the shift (one entry per trigger type only)
                        if (trigger_group != null)
                        {
                            let temp = [];
                            if( alert_triggers != null )
                            {
                                let z = alert_triggers.length;
                                while(z--)
                                {
                                    let y = trigger_group.map( x=>x.trigger_type ).indexOf(alert_triggers[z]);
                                    if(y!=-1) { 
                                        temp.push(trigger_group[y]);
                                    }
                                    if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S' || alert_triggers[z] == 'M')
                                    {
                                        y = trigger_group.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase());
                                        if(y!=-1) { 
                                            temp.push(trigger_group[y]);
                                        }
                                    }
                                }
                                x.inshift_trigger = temp;
                            }
                        }

                        // Get first trigger
                        let first_trigger = all_triggers.map( x => x.event_id ).lastIndexOf(event[0].event_id);
                        x.first_trigger = all_triggers[first_trigger];

                        // Get most recent triggers W/O Inshift triggers
                        let most_recent_before = [];
                        index_group_trigger = grouped_triggers_x.map( y=>y[0].event_id ).indexOf(event[0].event_id);
                        let trigger_group_x = grouped_triggers_x[index_group_trigger];
                        if( alert_triggers != null)
                        {
                            let z = alert_triggers.length;
                            while(z--)
                            {
                                let m = null;
                                if(trigger_group != null)
                                {
                                    m = trigger_group.map( x=>x.trigger_type ).lastIndexOf(alert_triggers[z]);
                                }
                                
                                let y = null;
                                // If there's a recent trigger on shift, get the second most recent
                                if(m > -1 && m != null)
                                {
                                    let o = trigger_group[m].trigger_id;
                                    let a = trigger_group_x.map( x=>x.trigger_id ).indexOf(o);
                                    y = trigger_group_x.map( x=>x.trigger_type ).indexOf(alert_triggers[z], a + 1);
                                }
                                // Just get the most recent
                                else
                                {
                                    y = trigger_group_x.map( x=>x.trigger_type ).indexOf(alert_triggers[z]);
                                }

                                if( y != -1) most_recent_before.push(trigger_group_x[y]);

                                if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S' || alert_triggers[z] == 'M')
                                {
                                    let m = null;
                                    if(trigger_group != null)
                                    {
                                        m = trigger_group.map( x=>x.trigger_type ).lastIndexOf(alert_triggers[z].toLowerCase());
                                    }

                                    let y = null;
                                    // If there's a recent trigger on shift, get the second most recent
                                    if(m > -1 && m!=null)
                                    {
                                        let o = trigger_group[m].trigger_id;
                                        let a = trigger_group_x.map( x=>x.trigger_id ).indexOf(o);
                                        y = trigger_group_x.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase(), a + 1);
                                    }
                                    // Just get the most recent
                                    else
                                    {
                                        y = trigger_group_x.map( x=>x.trigger_type ).indexOf(alert_triggers[z].toLowerCase());
                                    }

                                    if( y != -1) most_recent_before.push(trigger_group_x[y]);
                                }
                            }
                        }

                        x.most_recent = most_recent_before;

                        latest_releases.push(x);

                    });
                    //console.log(latest_releases);

                    let report = "";
                    let end = formData.end;
                    let start = moment(formData.start).add(1, 'hour').format("YYYY-MM-DD HH:mm:ss");
                    let form = { start: start, end: end };
                    let promises = [];

                    latest_releases.forEach(function (release, index) {

                        form.event_id = release.first_trigger.event_id;
                        if( release.internal_alert_level == "A0" ) form.end = null; else form.end = formData.end;

                        $("#reports_nav_sample").clone().attr("id", "report_nav_" + release.site).attr("style", "").appendTo("#reports_nav");
                        $("#reports_nav_sample").attr("style", "display:none;").removeClass("active");
                        $("#report_nav_" + release.site + " a").attr("href", "#report_field_" + release.site).html("<strong>" + release.site.toUpperCase() + "</strong>").removeClass("active");

                        $("#reports_field_sample").clone().attr("id", "report_field_" + release.site).removeClass("in active").attr("hidden", false).appendTo("#reports_field");
                        $("#reports_field_sample").attr("hidden", true).removeClass("in active");
                        $("#report_field_" + release.site + " .submit_buttons").attr({id: "submit_" + release.site, disabled: false, "data-value": release.site});

                        $("#graph_checkbox_sample").clone().attr("id", "graph_checkbox_" + release.site).attr("hidden", false).appendTo("#report_field_" + release.site + " .graphs-div");

                        $("#graph_checkbox_" + release.site + " .rainfall_checkbox").attr("value", "rain_" + release.site);
                        $("#graph_checkbox_" + release.site + " .surficial_checkbox").attr("value", "surficial_" + release.site);

                        $("#report_field_" + release.site + " textarea").attr("id", "report_" + release.site);

                        // Get sensor columns for graph options
                        $.get( "/../../accomplishment/getSensorColumns/" + release.site, function (data) {
                            data.forEach(function (column) {
                                $("#subsurface_option_sample").clone().attr({id: "subsurface_option_" + column.name, style:""})
                                    .appendTo("#graph_checkbox_" + release.site + " .subsurface_options");
                                $("#subsurface_option_" + column.name + " a")
                                    .html("<input type='checkbox' class='subsurface_checkbox' value='subsurface_" + column.name + "'>&emsp;" + column.name.toUpperCase());
                            });
                        }, "json");

                        if( index == 0 ) { 
                            $("#report_nav_" + release.site).addClass("active"); 
                            $("#report_field_" + release.site).addClass("in active");  
                        }

                        $.getJSON( "/../../accomplishment/getNarrativesForShift", form)
                        .then(function (nar) {
                            report = makeReport(formData, release, nar);
                            
                            $("#report_" + release.site).val(report);
                                let name = "report_" + release.site;
                                let editor = CKEDITOR.instances[name];
                                if (editor) { editor.destroy(true); }
                                    CKEDITOR.replace( name, {height: 300} );

                            if( index == latest_releases.length - 1 ) {
                                $('.dropdown-toggle').dropdown();
                                $('.js-loading-bar').modal('hide'); 
                            }
                        });
                    });

                    if( latest_releases.length == 0 ) {  $('.js-loading-bar').modal('hide'); }

                    // $.when.apply($, promises).then(function () {
                    //     let report = "";
                    //     let reports = [].slice.call(arguments);
                    //     reports.forEach(function (x) {
                    //         report = report + x;
                    //     })

                    //     CKEDITOR.instances.report.setData('', function () {
                    //         CKEDITOR.instances['report'].insertHtml(report);
                    //         CKEDITOR.instances['report'].focus();
                    //     });

                    //     $('.js-loading-bar').modal('hide');

                    // });
                    
                   // $('.js-loading-bar').modal('hide');

                });
            });
        }
        
    });

    function makeReport(shift, x, nar) 
    {
        let report = null;

        let start_report = "====== REPORT FOR " + x.site.toUpperCase() + " ======<br/><b>END-OF-SHIFT REPORT (" + x.mt.replace(/[^A-Z]/g, '') + ", " + x.ct.replace(/[^A-Z]/g, '') + ")</b><br/>";

        // console.log(x);

        let shift_start = "<b>SHIFT START:<br/>" + moment(shift.start).format("MMMM DD, YYYY, hh:mm A") + "</b>";
        let shift_end = "<b>SHIFT END:<br/>" + moment(shift.end).format("MMMM DD, YYYY, hh:mm A")  + "</b>";
        let end_report = "====== END OF REPORT FOR " + x.site.toUpperCase() + " ======";

        // ORGANIZE SHIFT START INFO
        let start_info = null;
        if( moment(x.event_start).isAfter( moment(shift.start).add(30, 'minutes') ) && moment(x.event_start).isSameOrBefore( moment(shift.end).subtract(30, 'minutes') ) )
        {
            start_info = "Monitoring initiated on " + moment(x.event_start).format("MMMM DD, YYYY, hh:mm A") + " due to " + basisToRaise(x.first_trigger.trigger_type, 0) + " (" + x.first_trigger.info + ").";  
        }
        else 
        { 
            let a =  "Event monitoring started on " + moment(x.event_start).format("MMMM DD, YYYY, hh:mm A") + " due to " + basisToRaise(x.first_trigger.trigger_type, 0) + " (" + x.first_trigger.info + ").";
            let b = null;
            if(x.most_recent.length > 0)
            {
                b = "the following recent trigger/s: ";
                b = b + "<ul>";
                x.most_recent.forEach(function (z) {
                    b = b + "<li> " + basisToRaise(z.trigger_type, 1) + " - alerted on " + moment(z.timestamp).format("MMMM DD, YYYY, hh:mm A") + " due to " + basisToRaise(z.trigger_type, 0) + " (" + z.info + ")</li>";
                });
                b = b + "</ul>";
                //console.log(b);
            }
            else { b = "no new alert triggers from previous shift.<br/>"}
            start_info = "Monitoring continued with " + b + "- " + a;
        }

        // ORGANIZE SHIFT END INFO
        let end_info = null;
        if (x.internal_alert_level === 'A0')
        {
            end_info = "Alert <b>lowered to A0</b>; monitoring ended at <b>" + moment(x.validity).format("MMMM DD, YYYY, hh:mm A") + "</b>.";
        } else {
            let a = "The current internal alert level is <b>" + x.internal_alert_level + "</b>.<br/>- ";
            if(typeof x.inshift_trigger !== 'undefined' && x.inshift_trigger.length !== 0)
            {
                a = a + "The following alert trigger/s was/were encountered: "
                a = a + "<ul>";
                x.inshift_trigger.forEach(function (z) {
                    a = a + "<li> <b>" + basisToRaise(z.trigger_type, 1) + "</b> - alerted on <b>" + moment(z.timestamp).format("MMMM DD, YYYY, hh:mm A") + "</b> due to " + basisToRaise(z.trigger_type, 0) + " (" + z.info + ")</li>";
                });
                a = a + "</ul>";
            } else { a = a + "No new alert triggers encountered.<br/>"; }
            let con = "Monitoring will continue until <b>" + moment(x.validity).format("MMMM DD, YYYY, hh:mm A") + "</b>.<br/>";

            end_info = a + "- " + con;
        }

        let expert_info = "<b>OTHER INFO:</b><br/>- <i>Subsurface data: </i><br/>- <i>Surficial data: </i><br/>- <i>Rainfall data: </i>"
        end_info += "<br/>" + expert_info;

        let narratives = null;
        narratives = "<b>NARRATIVE:</b><br/>";
        nar.forEach(function (x) {
            narratives = narratives + moment(x.timestamp).format("hh:mm:ss A") + " - " + x.narrative + "<br/>";
        })

        report = start_report + "<br/>" + shift_start + "<br/>- " + start_info + "<br/><br/>" +shift_end + "<br/>- " + end_info + "<br/><br/>" + narratives + "<br/>" + end_report + "<br/><br/>";

        return report;
    }

    function basisToRaise(trigger, x) {
        let raise = {
            "D": ["a monitoring request of the LGU/LEWC", "On-Demand"],
            "R": ["accumulated rainfall value exceeding threshold level", "Rainfall"],
            "E": ["a detection of landslide-triggering earthquake", "Earthquake"],
            "g": ["significant surficial movement", "LEWC Ground Measurement"],
            "s": ["significant underground movement", "Subsurface Data"],
            "G": ["critical surficial movement","LEWC Ground Measurement"],
            "S": ["critical underground movement","Subsurface Data"],
            "m": ["significant movement observed as manifestation", "Manifestation"],
            "M": ["critical movement observed as manifestation", "Manifestation"]
        }

        return raise[trigger][x];
    }

    function getShiftReleases(formData, callback) 
    {
        $.ajax({
            url: "/../../accomplishment/getShiftReleases",
            type: "GET",
            data : formData,
            success: function(response, textStatus, jqXHR)
            {
                result = JSON.parse(response);
                
                $(".reports_nav_list, .reports_field_list").each(function (index, obj) {
                    if( obj.id !== "reports_nav_sample" && obj.id !== "reports_field_sample" ) $(obj).remove();
                });
                
                if(result.length != 0) callback(result);
                else {
                    $("#loading").modal("hide");
                    /*CKEDITOR.instances.report.setData('', function () {
                        CKEDITOR.instances['report'].insertText("No early warning information released for this shift.");
                        CKEDITOR.instances['report'].focus();
                    });*/

                    $("#reports_nav_sample").attr("style", "").addClass("active");
                    $("#reports_field_sample").attr("hidden", false).addClass("in active");
                }
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }     
        });
    }

    function getShiftTriggers(ids, callback) 
    {
        $.get( "/../../accomplishment/getShiftTriggers",
            {"releases": ids.release_ids, "events": ids.event_ids}, function (data) {
                callback(data);
        }, "json")
        .fail(function(x) {
            console.log(x.responseText);
        });
    }

    /******************************************
     *
     *   VALIDATION AREA
     * 
     *****************************************/

    function checkTimestamp(value, element) 
    {
        var hour = moment(value).hour();
        var minute = moment(value).minute();
            
        if(element.id == 'shift_start')
        {
            message = "Acceptable times of shift start are 07:30 and 19:30 only.";
            var temp = moment(value).add(13, 'hours')
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

    var message;
    jQuery.validator.addMethod("TimestampTest", function(value, element) 
    {   
        return checkTimestamp(value, element);
    }, function () {return message});

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
            var placement = $(element).closest('.form-group');
            //console.log(placement);
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

        }
    });


    /******************************************
     *
     *   GRAPH INCLUSION ON END-OF-SHIFT
     * 
     *****************************************/

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

    // File uploading 
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

    $(document).on("click", ".submit_buttons", function (btn) {
        let site = $(this).attr("data-value");
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
    });

    /******************************************
     *
     *   OTHERS TAB (ACCOMPLISHMENT GENERAL)
     * 
     *****************************************/

    $("#othersForm").validate(
    {
        debug: true,
        rules: {
            shift_start_others: {
                required: true
            },
            shift_end_others: {
                required: true
            },
            summary: {
                required: true,
                minlength: 20,
                maxlength: 360
            },
        },
        errorPlacement: function ( error, element ) {
            var placement = $(element).closest('.form-group');
            //console.log(placement);
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

            let formData = 
            {
                staff_id: parseInt($("#current_user_id").attr("value")),
                shift_start: $("#shift_start_others").val(),
                shift_end: $("#shift_end_others").val(),
                summary: $("#summary").val()
            };

            console.log(formData);

            $.ajax({
                url: "../../accomplishment/insertData",
                type: "POST",
                data : formData,
                success: function(id, textStatus, jqXHR)
                {
                    console.log(id);
                    $('#othersModal').on('show.bs.modal', reposition);
                    $(window).on('resize', function() {
                        $('#othersModal:visible').each(reposition);
                    });

                    $("#othersModal").modal({backdrop: 'static', show: true});
                },
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }     
            });

        }
    });
    
});
