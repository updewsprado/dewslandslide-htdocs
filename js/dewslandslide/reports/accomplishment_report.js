
/****
 *
 *  Created by Kevin Dhale dela Cruz
 *  JS file for Accomplishment Report Filing Form [reports/accomplishment_report.php]
 *  [host]/reports/accomplishment/form
 *  
****/

$(document).ready(function() 
{
    CKEDITOR.replace( 'report', {height: 400} );

    let setElementHeight = function () {
        let window_h = $(window).height() - $(".navbar-fixed-top").height();
        $('#page-wrapper').css('min-height', window_h);
    };

    $(window).on("resize", function () {
        setElementHeight();
    }).resize();

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
        $('.timestamp_date').datetimepicker({
            format: 'YYYY-MM-DD',
            allowInputToggle: true,
            widgetPositioning: {
                horizontal: 'right',
                vertical: 'bottom'
            }
        });
        $('.timestamp_time').datetimepicker({
            format: 'HH:mm:00',
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

    let narrativeTable = null, narratives = [], original = [];
    let hasEdit = false;
    narrativeTable = showNarrative(narratives);

    reposition("#saveNarrativeModal");

    $("#event_id").change(function () {
        let event_id = $(this).val();
        if( event_id != "")
        {
            if(hasEdit)
            {
                $("#save_message, #cancel").hide();
                $("#change_message, #discard").show();
                $('#saveNarrativeModal').modal({ backdrop: 'static', keyboard: false });
                $("#saveNarrativeModal").modal("show");
            }
            else getNarratives(event_id);
        }
        else 
        {
            narrativeTable.clear();
            narrativeTable.draw();
            hasEdit = false;
        }
    });

    function getNarratives(event_id) 
    {
        $.get( "../../accomplishment/getNarratives/" + event_id, function (data) {
                //callback(data);
                original = data.slice(0);
                narratives = data.slice(0);
                console.log(narratives);
                narrativeTable.clear();
                narrativeTable.rows.add(narratives).draw();
        }, "json");
    }

    let index_global = null;
    jQuery.validator.addMethod("isUniqueTimestamp", function(value, element, param) {
    	let timestamp = null;
    	if( $(element).prop('id') == "timestamp_time" )
    	{
    		let date = $("#timestamp_date").val();
        	timestamp = date + " " + value;
    	} else timestamp = $("#timestamp_edit").val();

        let i = narratives.map( el => el.timestamp ).indexOf(timestamp);
        if( $(element).prop("id") === 'timestamp_time' ) 
        { 
        	if( i < 0 ) return true; else false; 
        }
        else { if( i < 0 || i == index_global ) return true; else false; }

    }, "Add a new timestamp or edit the entry with the same timestamp to include new narrative development.");

    jQuery.validator.addMethod("noSpace", function(value, element) { 
        console.log(value[0]);
        return value.trim() != ""; 
    }, "Write a narrative before adding.");

    $("#narrativeForm").validate(
    {
        rules: {
            timestamp_date: {
                required: true,
            },
            timestamp_time: {
                required: true,
                isUniqueTimestamp: true
            },
            event_id: {
                required: true
            },
            narrative: {
                required: true,
                noSpace: true
            }
        },
        errorPlacement: function ( error, element ) {

            var placement = $(element).closest('.form-group');
            //console.log(placement);
            
            if( $(element).hasClass("cbox_trigger_switch") )
            {
                $("#errorLabel").append(error).show();
            }
            else if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(placement);
            } //remove on success 

            element.parents( ".form-group" ).addClass( "has-feedback" );

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if ( !element.next( "span" )[ 0 ] ) {
                if(element.parent().is(".datetime") || element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if(element.is("select")) element.next("span").css({"top": "18px", "right": "30px"});
                if(element.is("input[type=number]")) element.next("span").css({"top": "18px", "right": "13px"});
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
        submitHandler: function (form) 
        {
            let data = $( "#narrativeForm" ).serializeArray();
            let temp = {};
            data.forEach(function (value) { 
                if(value.name != "timestamp_time" && value.name != "timestamp_date") temp[value.name] = value.value == "" ? null : value.value; 
            })
           temp.timestamp = $("#timestamp_date").val() + " " + $("#timestamp_time").val();
           temp.narrative = temp.narrative.trim();

            console.log("ADDED", temp);
            narratives.push(temp);
            console.log("NEW", narratives);
            hasEdit = true;
            narrativeTable.clear();
            narrativeTable.rows.add(narratives).draw();
        }
    });

    function showNarrative(result) 
    {
        var table = $('#narrativeTable').DataTable({
            data: result,
            "columns": [
                { 
                    "data": "timestamp",
                    "render": function (data, type, full) {
                        return full.timestamp == null ? "N/A" : moment(full.timestamp).format("MM/DD/YYYY HH:mm:ss");
                    },
                    "name": "timestamp",
                    className: "text-right"
                },
                {
                    data: "narrative"
                },
                {
                    data: "id",
                    "render": function (data, type, full) {
                        if (typeof data == 'undefined')
                            return '<i class="glyphicon glyphicon-edit" aria-hidden="true"></i>&emsp;<i class="glyphicon glyphicon-trash" aria-hidden="true"></i>';
                        else return '<i class="glyphicon glyphicon-edit" aria-hidden="true"></i>';
                    },
                    className: "text-center"
                }
            ],
            "columnDefs": [
                { "orderable": false, "targets": [1, 2] }
            ],
            dom: 'Bfrtip',
            "buttons": [
                {
                    className: 'btn-sm btn-danger save',
                    text: 'Save Narratives',
                    action: function ( e, dt, node, config ) 
                    {
                        $("#save_message, #cancel").show();
                        $("#change_message, #discard").hide();
                        $("#saveNarrativeModal").modal("show");
                    }
                }
            ],
            "processing": true,
            "order" : [[0, "desc"]],
            "filter": true,
            "info": false,
            "paginate": true        
        });

        $("td").css("vertical-align", "middle");

        return table;
    }

    function delegate(self) 
    {
        let index = narrativeTable.row(self.parents("tr")).index();
        let x = narratives.slice(index, index + 1).pop();
        let temp = {};
        for (var key in x) {
            if (x.hasOwnProperty(key)) {
                temp[key] = x[key];
            }
        }
        index_global = temp.id = index;
        console.log(temp);
        console.log(narratives);
        for (var key in temp) {
            if (temp.hasOwnProperty(key)) {
                $("#" + key + "_edit").val(temp[key]);
            }
        }
    }

    reposition("#editModal");

    $("#narrativeTable tbody").on("click", "tr .glyphicon-trash", function (e) {
        let self = $(this);
        delegate(self);
        $(".delete-warning").show();
        $("#editModal input, #editModal textarea").prop("disabled", true);
        $("#update").hide();
        $('#editModal').modal({ backdrop: 'static', keyboard: false, show: true });
    });

    $("#delete").click(function () {
        narratives.splice(index_global, 1);
        narrativeTable.clear();
        narrativeTable.rows.add(narratives).draw();
    });

    $("#narrativeTable tbody").on("click", "tr .glyphicon-edit", function (e) {
        let self = $(this);
        delegate(self);
        $(".delete-warning").hide();
        $("#update").show();
        $("#editModal input, #editModal textarea").prop("disabled", false);
        $('#editModal').modal({ backdrop: 'static', keyboard: false, show: true });
    });

    let edit_validate = $("#editForm").validate(
    {
        rules: {
            timestamp_edit: {
                required: true,
                isUniqueTimestamp: true
            },
            narrative_edit: {
                required: true
            }
        },
        errorPlacement: function ( error, element ) {

            var placement = $(element).closest('.form-group');
            //console.log(placement);
            
            if( $(element).hasClass("cbox_trigger_switch") )
            {
                $("#errorLabel").append(error).show();
            }
            else if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(placement);
            } //remove on success 

            element.parents( ".form-group" ).addClass( "has-feedback" );

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if ( !element.next( "span" )[ 0 ] ) {
                if(element.parent().is(".datetime") || element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if(element.is("select")) element.next("span").css({"top": "18px", "right": "30px"});
                if(element.is("input[type=number]")) element.next("span").css({"top": "18px", "right": "13px"});
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
        submitHandler: function (form) 
        {
            let data = $( "#editForm" ).serializeArray();
            let temp = {};
            data.forEach(function (value) {
                value.name = value.name.replace("_edit", "");
                temp[value.name] = value.value == "" ? null : value.value;
            });

            console.log(temp);
            let index = temp.id;
            narratives[index].timestamp = temp.timestamp;
            narratives[index].narrative = temp.narrative;
            if(typeof narratives[index].id !== 'undefined') narratives[index].isEdited = true;
            console.log("NAR", narratives);
            $("#editModal").modal("hide");
            hasEdit = true;

            narrativeTable.clear();
            narrativeTable.rows.add(narratives).draw();
        }
    });

    $("#cancel").click(function () { edit_validate.resetForm(); })

    $("#save_narrative").click(function () 
    {
        $("#saveNarrativeModal").modal('hide');
        setTimeout(function () 
        {
            $("#loading .progress-bar").text("Saving...");
            $("#loading").modal("show");

            let data = { narratives: narratives };
            $.ajax({
                url: "../../accomplishment/insertNarratives",
                type: "POST",
                data : data,
                success: function(result, textStatus, jqXHR)
                {
                    $('.js-loading-bar').modal('hide');
                    console.log(result);
                    setTimeout(function () 
                    {
                        reposition("#saveNarrativeSuccess");
                        $('#saveNarrativeSuccess').modal({ backdrop: 'static', keyboard: false, show: true });
                    }, 500);
                },
                error: function(xhr, status, error) {
                  var err = eval("(" + xhr.responseText + ")");
                  alert(err.Message);
                }
            });
        }, 500)
        
    });

    $(".okay, #discard").click(function (argument) {
        let event_id = $("#event_id").val();
        getNarratives(event_id);
        hasEdit = false;
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
                            if( public_alert_level == 'A2' ) alert_triggers.replace('g0', 'g').replace('s0', 's');
                            else if ( public_alert_level == 'A3' ) alert_triggers.replace('g0', 'G').replace('s0', 'S');
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
                                    if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S')
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

                                if(alert_triggers[z] == 'G' || alert_triggers[z] == 'S')
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
                    let form = {
                        start: start,
                        end: end,
                    };

                    let promises = [];

                    latest_releases.forEach(function (release) {

                        form.event_id = release.first_trigger.event_id;
                        promises.push( $.getJSON( "../../accomplishment/getNarrativesForShift", form)
                        .then(function (nar) {
                            report = makeReport(formData, release, nar);
                            return report;
                        }) );

                    });

                    $.when.apply($, promises).then(function () {
                        let report = "";
                        let reports = [].slice.call(arguments);
                        reports.forEach(function (x) {
                            report = report + x;
                        })

                        CKEDITOR.instances.report.setData('', function () {
                            CKEDITOR.instances['report'].insertHtml(report);
                            CKEDITOR.instances['report'].focus();
                        });

                        $('.js-loading-bar').modal('hide');

                    });

                });
            });
        }
        
    });

    function makeReport(shift, x, nar) 
    {
        let report = null;

        let start_report = "====== REPORT FOR " + x.site.toUpperCase() + " ======<br/><b>END-OF-SHIFT REPORT (" + x.mt.replace(/[^A-Z]/g, '') + ", " + x.ct.replace(/[^A-Z]/g, '') + ")</b><br/>";

        console.log(x);

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
            "D": ["a monitoring request of the LGU/LLMC", "On-Demand"],
            "R": ["accumulated rainfall value exceeding threshold level", "Rainfall"],
            "E": ["a detection of landslide-triggering earthquake", "Earthquake"],
            "g": ["significant surficial movement", "LLMC Ground Measurement"],
            "s": ["significant underground movement", "Sensor"],
            "G": ["critical surficial movement","LLMC Ground Measurement"],
            "S": ["critical underground movement","Sensor"]
        }

        return raise[trigger][x];
    }


    function getShiftReleases(formData, callback) 
    {
        $.ajax({
            url: "../../accomplishment/getShiftReleases",
            type: "GET",
            data : formData,
            success: function(response, textStatus, jqXHR)
            {
                result = JSON.parse(response);
                if(result.length != 0) callback(result);
                else {
                    $("#loading").modal("hide");
                    CKEDITOR.instances.report.setData('', function () {
                        CKEDITOR.instances['report'].insertText("No early warning information released for this shift.");
                        CKEDITOR.instances['report'].focus();
                    });
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
        $.get( "../../accomplishment/getShiftTriggers",
            {"releases": ids.release_ids, "events": ids.event_ids}, function (data) {
                callback(data);
        }, "json")
        .fail(function(x) {
            console.log(x.responseText);
        });
    }


    /**
     * VALIDATION AREA
    **/

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
                staff_id: parseInt($("#staff_id").attr("value")),
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
