
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Early Warning Information Release Form [public_alert/alert_release_form.php]
 *	[host]/public_alert/release_form
 *	
****/

$(document).ready(function() 
{
	let setElementHeight = function () {
        let window_h = $(window).height();
        $('#page-wrapper').css('min-height', window_h);
    };

    $(window).on("resize", function () {
        setElementHeight();
    }).resize();

    $('#nd label').tooltip();
    $('.cbox_trigger_nd[value=R0]').parent("label").tooltip();

    $('.datetime').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:00',
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    })
    .on('dp.show', function (e) {
        $(this).data("DateTimePicker").maxDate(moment().second(0));
    })
    
    $('.time').datetimepicker({
        format: 'HH:mm:00',
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    });

    let status = 'new', active = [], routine_finish = [], validity_global = null;
    let publicReleaseForm = null;

    /*******************************************
     * 
     *  Ensure that Data Timestamp is filled 
     *  first before Public Alert Level
     *  
     *******************************************/
    $(".datetime").on('change dp.change', function(e) {
        if( e.currentTarget.id == "entry" && $("#timestamp_entry") != "" ) $("#public_alert_level").prop("disabled", false);
    });

    /*******************************************
     * 
     *  Control changes in General vs Routine
     *  
     *******************************************/
     $(".btn-group-justified button").click( function () {
        if($(this).attr("id") == "general") 
        {
            $("#sites_area").slideUp();
            $("#operational_area").slideDown();
            $("#site").val("").trigger("change");
            $("#release_info_area .panel-body .form-group").each(function (i) {
                let a = ["5", "3", "4"], b = ["6", "0", "6"];
                $( this ).switchClass( "col-sm-" + b[i], "col-sm-" + a[i], 500, "easeOutQuart", function () {
                    $("#site").parent().prop("hidden", false);
                });
            })
        }
        else 
        {
            $(".extended").parent().css({"color": "rgb(62, 212, 43)"});
            $(".active").parent().css({"color": "red"});

            $("#sites_area").slideDown();
            $("#operational_area").slideUp();
            $("#site_info_area").slideUp();
            $("#public_alert_level").val("").trigger("change");
            $('#public_alert_level option[value=A3], #public_alert_level option[value=A2], #public_alert_level option[value=A1]').prop('disabled', true);
            $("#site").val("").parent().prop("hidden", true);
            $("#release_info_area .panel-body .form-group").each(function (i) {
                let a = ["5", "3", "4"], b = ["6", "0", "6"];
                $( this ).switchClass( "col-sm-" + a[i], "col-sm-" + b[i], 500, "easeInQuart");
            })
            status = "routine";
            getSentRoutine();
        }
     });

    $('.datetime').on('dp.change', function(e){ 
        if( status == "routine" ) getSentRoutine();
    });

    function getSentRoutine ()
    {
        let timestamp = $("#timestamp_entry").val();
        if( $("#timestamp_entry").val() != "" )
        {
            $.get( "../pubrelease/getSentRoutine", {timestamp: timestamp}, 
            function( data ) 
            {
                if( data.length == 0 ) $("input.routine-checkboxes:checked").prop("disabled", false).prop("checked", false);
                else data.forEach(function (a) { $("input.routine-checkboxes[value=" + a.site_id + "]").prop("checked", true).prop("disabled", true); })
            }, "json" )
            .done(function () {
                $("#sites_area .panel-body").slideDown();
            });
        }
        else $("#sites_area .panel-body").slideUp();
    }

    /*******************************************
     * 
     *  Control changes in Public Alert Level 
     *  and Operational Triggers Checkboxes
     * 
     *******************************************/
    let toExtendND = false;
    let trigger_list = [], current_event = [];
    var saved_triggers = [],
        lookup = [  { x:"rs", y:"rain_area", z:false }, 
                    { x:"es", y:"eq_area", z:false },
                    { x:"ds", y:"od_area", z:false },
                    { x:"gs", y:"ground_area", z:false },
                    { x:"ss", y:"sensor_area", z:false } ];

    // For Public Alert Level Changes
    $("#public_alert_level").change(function () 
    {
        let val = $("#public_alert_level").val();
        $(".cbox_trigger_switch").prop("disabled", false);
        $(".cbox_trigger").prop("checked", false);
        $("#alert_invalid").slideUp();

        switch( val )
        {
            case "": $(".cbox_trigger_switch").prop("checked", false).prop("disabled", true);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                    break;
            case "A0": $(".cbox_trigger_switch").prop("checked", false).prop("disabled", true);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", false);
                    $(".cbox_trigger_nd").prop("checked", false).prop("disabled", false);
                    toExtendND = false;
                    break;
            case "A1": $(".cbox_trigger_switch[value='gs'], .cbox_trigger_switch[value='ss']").prop("checked", false).prop("disabled", true);
                $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", false);
                    break;
            case "A2": $(".cbox_trigger[value=G], .cbox_trigger[value=S]").prop("checked", false).prop("disabled", true);
                $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                break;
            case "A3": $(".cbox_trigger_switch").prop("disabled", false); 
                $(".cbox_trigger[value='G'], .cbox_trigger[value='S']").prop("disabled", false);
                $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                break;
        }

        // Show invalid alert notification if Alert is lowered prematurely
        if( !jQuery.isEmptyObject(current_event) )
        {
            if( val == "A0" && moment($("#timestamp_entry").val()).add(30, 'minutes').isBefore(current_event.validity) ) 
            {
                status = "invalid";
                $("#alert_invalid").slideDown();
            }
            else $("#alert_invalid").slideUp();
        }

        // Prevent entering of NO DATA trigger on NEW ON-GOING ENTRIES
        // if( status != "on-going" && val != "A0" ) $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);


        $(".cbox_trigger_switch").trigger("change");
        $(".cbox_trigger").trigger("change");
    });


    $(".cbox_trigger_switch").change(function () 
    {
        let arr = $(".cbox_trigger_switch:checked");
        for (let i = 0; i < lookup.length; i++) lookup[i].z = false;

        for (let i = 0; i < arr.length; i++) 
        {
            let val =  $(arr[i]).val();
            let pos = lookup.map(function(x) {return x.x; }).indexOf(val);
            if( pos >= 0 ) lookup[ pos ].z = true;
        }

        // Hide trigger fields that are not checked
        for (let i = 0; i < lookup.length; i++) 
        {
            if (lookup[i].z == false) $("#" + lookup[i].y).slideUp();
            else $("#" + lookup[i].y).slideDown();
        }
    })

    // For ND (A0-A1) Trigger Change
    $(".cbox_nd").click(function () 
    {
        let val = $("#internal_alert_level").val();
        if( $(".cbox_nd").is(":checked") ) 
        {
            $("#internal_alert_level").val( val.replace(val.substr(0, 2), "ND") );
            toExtendND = true;
        }
        else
        { 
            $("#internal_alert_level").val( val.replace("ND", $("#public_alert_level").val() ) );
            toExtendND = false;
        }
    });

    // For Operational Triggers Changes
    $(".cbox_trigger, .cbox_trigger_nd").change(function () 
    {
        let arr = $(".cbox_trigger:checked, .cbox_trigger_nd:checked");
        trigger_list = [];
        trigger_list = trigger_list.concat(saved_triggers);

        for (let i = 0; i < arr.length; i++) 
        {
            let val =  $(arr[i]).val();
            trigger_list.push( val );

            trigger_list = trigger_list.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });

            function priority( a, b, i, c = 'q' ) 
            {
                if( $(arr[i]).val() == a || $(arr[i]).val() == b || $(arr[i]).val() == c)
                {
                    let x = trigger_list.indexOf(a), y = trigger_list.indexOf(b), z = trigger_list.indexOf(c);
                    let remove = function (index) { trigger_list.splice( trigger_list.indexOf(index), 1) };

                    if( z > -1 ) { if( y > -1 ) remove(b); if( x > -1 ) remove(a);  }
                    else if( x > -1 ) { if(y > -1) remove(b); }
                }
            }

            priority("S", "s", i, "s0");
            priority("G", "g", i, "g0");
            priority("R0", "R", i);
        };

        // Disable Cbox_Triggers and timestamp input if Cbox_Trigger_ND is checked
        if( this.value.indexOf("0") >= 0 )
        {
            if( $(".cbox_trigger_nd[value=" + this.value + "]").is(":checked") ) {
                $(".cbox_trigger[value=" + this.value[0] + "]").prop("checked", false).prop("disabled", true);
                $(".cbox_trigger[value=" + this.value[0] + "]").parent().next().children("input").prop("disabled", true);
            }
            else $(".cbox_trigger[value=" + this.value[0] + "]").prop("disabled", false);
        }
        
        // Disable Timestamp Input Validation Checkbox Fields
        let a = $(this).closest("span").next("div").children("input");
        if( $(".cbox_trigger[value=" + this.value + "]").is(":checked") )
        {
            $(a).prop("disabled", false);
            $( "#" + $(a).attr('id') + "_info" ).prop("disabled", false);
        }
        else
        {
            $(a).prop("disabled", true);
            $( "#" + $(a).attr('id') + "_info" ).prop("disabled", true);
        }

        // If Checkbox is E, enable magnitude, latitude and longitude
        if( $(".cbox_trigger[value=E]").is(":checked") ) $("#magnitude, #latitude, #longitude").prop("disabled", false);
        else $("#magnitude, #latitude, #longitude").prop("disabled", true);

        // If Checkbox is D, enable magnitude, latitude and longitude
        if( $(".cbox_trigger[value=D]").is(":checked") ) $(".od_group, #reason").prop("disabled", false);
        else $(".od_group, #reason").prop("disabled", true);
        
        // Mark toExtendND true if X0 (ND-trigger) is checked
        if( trigger_list.includes("s0") || trigger_list.includes("g0") ) toExtendND = true;
        else toExtendND = false;

        trigger_list.sort( function( a, b ) 
        {
            let arr = { "S":5, "s":5, "s0":5, "G":4, "g":4, "g0":4, "R":3, "R0":3, "E":2, "D":1 };
            let x = arr[a], y = arr[b];
            if( x>y ) return -1; else return 1;
        });

        let alert_level = $(".cbox_nd[value=ND]").is(":checked") ? "ND" : $("#public_alert_level").val();
        let alert = trigger_list.length > 0 ? alert_level + "-" + trigger_list.join("") : alert_level;
        alert = $("#public_alert_level").val() == "A0" ? "A0" : alert;
        $("#internal_alert_level").val(alert);
    });

    /*************** END OF THIS AREA ****************/


    /*******************************************
     * 
     *  Controls changes in Site Input 
     *  and Recommendations Area
     * 
     *******************************************/
    $("#site").change(function () 
    {
        let val = $("#site").val() == "" ? 0 : $("#site").val();
        trigger_list = [], saved_triggers = [];

        // Clear all trigger timestamps area
        $(".trigger_time").val("");

        // Clear all validation on form
        $('#operational_area .form-group').removeClass('has-feedback').removeClass('has-error').removeClass('has-success');
        $('#operational_area .glyphicon.form-control-feedback').remove();
        //publicReleaseForm.resetForm();

        $.get( "../pubrelease/getLastSiteEvent/" + val, 
        function( event ) 
        {
            // Reset fields on site_info_area
            $("#status").html("Monitoring Status: <br><b>[STATUS]</b>");
            $("#details").html("Event-based monitoring started on <b>[TIMESTAMP]</b>, valid until <b>[VALIDITY]</b>. Recent early warning released last <b>[LAST]</b>.");
            //$("#details").html("<u>EVENT MONITORING START</u>: <b>[TIMESTAMP]</b> <br><u>VALIDITY</u>: <b>[VALIDITY]</b> <br><u>LAST EARLY WARNING RELEASE</u>: <b>[LAST]</b>");
            $("#current_alert").html("Current Internal Alert: <br><b>[ALERT]</b>");
            $("#site_info_area").slideUp(10);

            if( event.status == "on-going" || event.status == "extended" ) 
            {
                status = event.status;
                current_event = JSON.parse(JSON.stringify(event));

                $("#status").html($("#status").html().replace("[STATUS]", event.status.toUpperCase()));
                if( event.status == 'on-going' )
                    $("#details").html($("#details").html().replace("[TIMESTAMP]", moment(event.event_start).format("dddd, MMMM Do YYYY, HH:mm") ).replace("[VALIDITY]", moment(event.validity).format("dddd, MMMM Do YYYY, HH:mm") ));
                else 
                {
                    $("#details").html("Event-based monitoring started on <b>" + moment(event.event_start).format("dddd, MMMM Do YYYY, HH:mm") + "</b> and ended on <b>" + moment(event.validity).format("dddd, MMMM Do YYYY, HH:mm") + "</b>. The site is under three-day extended monitoring.");
                }
                $("#site_info_area").slideDown();
                validity_global = event.validity;
                
                $.get( "../pubrelease/getLastRelease/" + event.event_id, 
                function( release ) 
                {
                    // Save internal alert level on CURRENT ALERT LEVEL
                    // and change column size of different columns for aesthetics
                    $("#current_alert").html($("#current_alert").html().replace("[ALERT]", release.internal_alert_level));
                    $("#details").html($("#details").html().replace("[LAST]", moment(release.data_timestamp).add(30, 'minutes').format("dddd, MMMM Do YYYY, HH:mm") ));

                    let triggers = release.internal_alert_level.substr(3).split("");
                    //saved_triggers = triggers.splice(0);
                    for (let i = 0; i < triggers.length; i++) {
                        if (triggers[i + 1] == "0") 
                            { saved_triggers.push(triggers[i] + triggers[i + 1]); i++; }
                        else saved_triggers.push(triggers[i]);
                    }
                    console.log("SAVED TRIGGERS", saved_triggers);

                    // Trigger Public ALert change and restrict unintentional level lowering
                    // except to A0
                    let x = release.internal_alert_level.substr(0, 2);
                    public_alert = x == "ND" ? "A1" : x;
                    switch (public_alert)
                    {
                        case "A3": $('#public_alert_level option[value=A2]').prop('disabled', true);
                        case "A2": $('#public_alert_level option[value=A1]').prop('disabled', true); break;
                        case "A1": $('#public_alert_level option').prop('disabled', false); break;
                    }
                    $("#public_alert_level").val(public_alert).trigger("change");
                    if( x == "ND" ) setTimeout(function(){ $(".cbox_nd").trigger("click"); }, 1000);

                }, "json")
                .done(function (event) 
                {
                    $.get( "../pubrelease/getAllEventTriggers/" + event.event_id, 
                    function( triggers ) 
                    {
                        console.log(event);
                        console.log(triggers);

                        let groupedTriggers = groupTriggersByType(event, triggers);
                        console.log(groupedTriggers);

                        let lookup = { "R":"#rain_desc", "E":"#eq_desc", "g":"#ground_desc", "G":"#ground_desc", "s":"#sensor_desc", "S":"#sensor_desc", "D":"#od_desc" }
                        groupedTriggers.forEach( function (arr) 
                        {
                            let desc = "Latest trigger occurred on " + moment(arr[0].timestamp).format("dddd, MMMM Do YYYY, HH:mm");
                            if( arr[0].trigger_type == 'g' || arr[0].trigger_type == 's' ) desc = desc + " (L2)";
                            else if( arr[0].trigger_type == 'G' || arr[0].trigger_type == 'S' ) desc = desc + " (L3)";
                            if( arr[0].trigger_type == "E" )
                            {
                                let a = function (a, b) { $("#" + a).val(b) };
                                a("magnitude", arr[0].eq_info[0].magnitude);
                                a("latitude", arr[0].eq_info[0].latitude);
                                a("longitude", arr[0].eq_info[0].longitude);
                            }
                            //desc = arr[0].trigger_type == "E" ? desc + ". Magnitude: " + arr[0].eq_info[0].magnitude + ", Latitude: " + arr[0].eq_info[0].latitude + ", Longitude: " + arr[0].eq_info[0].longitude : desc;
                            $(lookup[arr[0].trigger_type] + " span:nth-child(2)").text(desc);
                        });

                    }, "json");
                });
            } 
            else // If no current alert for the site 
            {
                status = "new";
                saved_triggers = [];
                current_event = [];
                validity_global = null;
                $(".previous_info span:nth-child(2)").text("No trigger yet.");
                $("#site_info_area").slideUp();
                $(".cbox_trigger_nd").prop('disabled', true);
                $('#public_alert_level option').prop('disabled', false);
                $("#public_alert_level").val("").trigger("change");
            }

        }, "json")
    })


    function groupTriggersByType(event, triggers) 
    {
        //let trigger_list = event.internal_alert_level.slice(3);
        let trigger_list = saved_triggers.slice(0);
        let public_alert = event.internal_alert_level.substr(0,2);
        
        // Remove 0 from trigger list (if internal alert has no data)
        // and converts g0/s0 to G/S if its A3
        function clearZero(x, public_alert) 
        { 
            console.log(public_alert);
            x = x.replace('0', '');
            if(public_alert == "A3") x = x.toUpperCase();
            return x;
        }
        let trigger_copy = trigger_list.map(function (x) { return clearZero(x, public_alert); });

        $(".cbox_trigger_switch").prop("checked", false);
        let arr = [];
        for (let i = 0; i < trigger_list.length; i++) 
        {
            // Check Operational Triggers and Enable cbox_triggers_nd on Form
            let check = function (x, y = "switch") { $(".cbox_trigger_" + y + "[value=" + x + "]").prop("checked", true); }
            let enable = function (x) { $(".cbox_trigger_nd[value=" + x + "]").prop("disabled", false); }

            switch( trigger_list[i] )
            {
                case "R": check("rs"); enable("R0"); break;
                case "E": check("es"); enable("E0"); break;
                case "D": check("ds"); enable("D0"); break;
                case "g0": check("g0", "nd");
                case "G": case "g": check("gs"); enable("g0"); break;
                case "s0": check("s0", "nd");
                case "S": case "s": check("ss"); enable("s0"); break;
                default: check(trigger_list[i]); break;
            }

            // Re-save the triggers WITHOUT 0 on saved_triggers after using its
            // purpose of checking x0 checkboxes
            saved_triggers = trigger_copy.slice(0);

            $(".cbox_trigger_switch").trigger("change");
            $(".cbox_trigger_nd").trigger("change");
            // END OF CHECKING CHECKBOXES

            let x = triggers.filter(function (val) 
            {
                return val.trigger_type == trigger_copy[i] || val.trigger_type == trigger_copy[i].toLowerCase();
            })

            x.sort(function (a, b) 
            {
                if( moment(a.timestamp).isAfter(b.timestamp) ) return -1; else return 1;
            })

            arr.push(x);
        }
        return arr;
    }


    /*******************************************
     * 
     *  Control details on Sites Area (Routine)
     * 
     *******************************************/
    // Outside array pertains to season group [season 1, season 2]
    // Inside arrays contains months (0 - January, 11 - December)
    let wet = [[0,1,5,6,7,8,9,10,11], [4,5,6,7,8,9]],
        dry = [[2,3,4], [0,1,2,3,10,11]];


     $("#sites_area .panel-heading button#all").click(function () {
        $("#sites_area input[type=checkbox]:enabled").trigger("click");
     });

     $("#sites_area .panel-heading button#wet").click(function () {
        let month = moment($("#timestamp_entry").val()).get('month');
        [1,2].forEach(function (i) {
            if(wet[i-1].indexOf(month) > -1) $("#sites_area input[type=checkbox][season="+ i +"]:enabled").trigger("click");
        });
     });

     $("#sites_area .panel-heading button#dry").click(function () {
        let month = moment($("#timestamp_entry").val()).get('month');
        [1,2].forEach(function (i) {
            if(dry[i-1].indexOf(month) > -1) $("#sites_area input[type=checkbox][season="+ i +"]:enabled").trigger("click");
        });
     });


    jQuery.validator.addMethod("TimestampTest", function(value, element)
    {   
        var message = "";
        var x = $("#timestamp_initial_trigger").val();
        if (value == "") return true;
        else if(validity_global != null) 
        {
            if(moment(value).isAfter(x) && moment(value).isBefore(validity_global)) return true;
            else return false;
        }
        else return (moment(value).isAfter(x)); 
    }, "Timestamp is either before the initial trigger timestamp or after the validity of alert.");

    jQuery.validator.addMethod("TimestampTest2", function(value, element)
    {   
        if(retriggerList == null || value == "") return true;
        else 
        {
            if(moment(retriggerList[retriggerList.length - 1]).isBefore(value, 'hour')) return true;
            else return false;
        }
        
    }, "Timestamp should be more recent than the last re-trigger timestamp.");


    let msg = null;
    let dynamicMsg = function () { return msg; }
    jQuery.validator.addMethod("requiredTrigger", function(value, element, param) {
        let alert = $("#public_alert_level").val();
        let a = function (a) { return $(".cbox_trigger_switch[value=" + a + "]").is(":checked"); }
        switch( alert )
        {
            case "A1": msg = "At least one trigger (Rainfall, Earthquake, or On-Demand) required."; return ( a("rs") || a("es") || a("ds") ); break;
            case "A2": 
            case "A3": msg = "At least Sensor or Ground Data trigger required."; return ( a("ss") || a("gs") ); break;
            default: return true;
        }
    }, dynamicMsg);

   $.validator.addClassRules({
        cbox_trigger_switch: {
            "requiredTrigger": true
        }
    });

    jQuery.validator.addMethod("isNewTrigger", function(value, element, param) {
        let val = $(element).val();
        let triggers = $("#internal_alert_level").val().substr(3);

        msg = "New trigger timestamp required.";
        if( $("#public_alert_level").val() == "A3" && (val == "G" || val == "g" || val == "S" || val == "s"))
        {
            let a = function (a) { return $(".cbox_trigger[value=" + a + "]" ).is(":checked") };
            msg = "L3 trigger timestamp required.";
            if( triggers.indexOf(val.toUpperCase()) > -1 || triggers.indexOf(val.toLowerCase()) > -1 ) return true;
            else if(val == "G" || val == "S")  return a("G") || a("S");
            else if(val == "g" && !a("G") && val == "s" && !a("S")) { msg = "At least L2 or L3 timestamp required."; return a("g") || a("s"); }
            else return true;
        }

        if( triggers.indexOf(val) > -1 ) return true;
        else if( !($(".cbox_trigger[value=" + val + "]" ).is(":checked")) ) return false;
        else return true;

    }, dynamicMsg);

   $.validator.addClassRules({
        cbox_trigger: {
            "isNewTrigger": true
        }
    });

    jQuery.validator.addMethod("hasTriggerTime", function(value, element, param) {
        return $(element).val() !== '';
    }, "New trigger timestamp required.");

   $.validator.addClassRules({
        trigger_time: {
            "hasTriggerTime": true
        }
    });

   jQuery.validator.addMethod("hasTriggerInfo", function(value, element, param) {
        return $(element).val() !== '';
    }, "Basic technical information of the trigger required.");

   $.validator.addClassRules({
        trigger_info: {
            "hasTriggerInfo": true
        }
    });

   jQuery.validator.addMethod("isEndOfValidity", function(value, element, param) {
        let x = validity_global;
        let y = $("#timestamp_entry").val();
        console.log(moment(x).isSame(moment(y).add(30, 'minutes')));
        if( moment(x).isSame(moment(y).add(30, 'minutes')) )
        {
            if( $("#public_alert_level").val() == "A0")
            {   
                return true;
            }
            if( $("#public_alert_level").val() == "A1")
            {
                if($(element).is(":checked") || $(".cbox_trigger").is(":checked"))
                    return true;
                else { $("#nd_modal").modal('show'); return false; }
            }
            else if( $("#public_alert_level").val() == "A2" || $("#public_alert_level").val() == "A3" )
            {
                if ($(".cbox_trigger_nd[value=g0]").is(":checked") || $(".cbox_trigger_nd[value=s0]").is(":checked") || $(".cbox_trigger").is(":checked")) return true;
                else { $("#nd_modal").modal('show'); return false; }
            }
            else {
                $("#nd_modal").modal('show');
                return false;
            } 
                
        } else return true;
        
    }, "");

   $.validator.addClassRules({
        cbox_nd: {
            "isEndOfValidity": true
        },
        cbox_trigger_nd: {
            "isEndOfValidity": true
        }
    });

    publicReleaseForm = $("#publicReleaseForm").validate(
    {
        rules: {
            public_alert_level: {
                required: true,
            },
            timestamp_entry: "required",
            release_time: "required",
            site: {
                required: true
            },
            reporter_2: {
                required: true
            },
            comments: {
                required: {
                    depends: function () {
                       return status == 'invalid';
                }}
            },
            'routine_sites[]': {
                required: {
                    depends: function () {
                        return status == 'routine';
                }}
            },
            magnitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
            latitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
            longitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
        },
        messages: {
            comments: "Provide a reason to invalidate this event. If the event is not invalid and is really an end of event EWI, release it on the indicated end of validity."
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
                if( !$(element).hasClass("cbox_trigger") && !$(element).hasClass("cbox_trigger_switch") && !$(element).hasClass("cbox_nd") 
                	&& !$(element).hasClass("cbox_trigger_nd") && $(element).attr("name") != "routine_sites[]" )
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback' style='top:18px; right:22px;'></span>" ).insertAfter( element );
                if(element.parent().is(".datetime") || element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if(element.is("select") || element.is("textarea")) element.next("span").css({"top": "25px", "right": "25px"});
                if(element.attr("id") == "reason") element.next("span").css({"top": "0", "right": "0"});
                if(element.is("input[type=number]")) element.next("span").css({"top": "24px", "right": "0px"});
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
            let data = $( "#publicReleaseForm" ).serializeArray();
            let temp = {};
            data.forEach(function (value) { temp[value.name] = value.value == "" ? null : value.value; })
            temp.status = status;
            temp.reporter_1 = $("#reporter_1").attr("reporter_id");
            temp.trigger_list = $(".cbox_trigger:checked").map( function () { return this.value }).get();
            temp.trigger_list = temp.trigger_list.length == 0 ? null : temp.trigger_list;

            if( status == 'new' )
            {
                if(temp.public_alert_level == 'A0')
                {
                    temp.routine_list = [temp.site];
                    temp.status = 'routine';
                } 
            }
            else if( status == "on-going" ) 
            {
                temp.current_event_id = current_event.event_id;

                // Check if needed for 4-hour extension if ND
                if( toExtendND && temp.trigger_list == null && moment(current_event.validity).isSame(moment(temp.timestamp_entry).add(30, 'minutes')) )
                {
                    console.log("ND EXTEND");
                    temp.extend_ND = true;
                }
                // If A0, check if legit lowered or invalid
                else if( temp.public_alert_level == "A0")
                {
                    if( moment(current_event.validity).isSameOrAfter(moment(temp.timestamp_entry).add(30, 'minutes')) )
                        temp.status = "extended";
                    else
                        temp.status = "invalid";
                }
            }
            else if (status == "invalid") { temp.current_event_id = current_event.event_id; }
            else if (status == "routine")
            {
                temp.routine_list = [];
                $("input[name='routine_sites[]']:checked").each(function () {
                    if(!this.disabled) 
                        temp.routine_list.push(this.value); 
                    else console.log("DIS");
                });
            }
            else if ( status == "extended" )
            {
                // Status is either "extended" or "finished"
                if( temp.public_alert_level == "A0")
                {
                    temp.current_event_id = current_event.event_id;
                    let base = moment(temp.timestamp_entry).add(30, "minutes");
                    let extended_start = moment(current_event.validity).add(1, "day").hour(12);
                    let extended_end = moment(extended_start).add(2, "day");

                    if( moment(base).isAfter(extended_start) && moment(base).isBefore(extended_end ) ) temp.status = "extended";
                    else if ( moment(base).isAfter(extended_start) && moment(base).isSameOrAfter(extended_end ) ) temp.status = "finished";
                }
                // Alert heightened so status is "new" and change current event to "finished"
                else
                {
                    temp.status = 'new';
                    temp.previous_event_id = current_event.event_id;
                }
            }

            console.log(temp);

            $("#loading .progress-bar").text("Submitting early warning releases... Please wait.");
            reposition("#loading");
            $("#loading").modal("show");

            $.ajax({
                url: "../pubrelease/insert",
                type: "POST",
                data : temp,
                success: function(result, textStatus, jqXHR)
                {
                    $("#loading").modal("hide");
                    $("#loading .progress-bar").text("Loading...");
                    console.log(result);
                    setTimeout(function () 
                    {
                        if( result == "Routine")
                             $("#view").attr("href", "../monitoring/events").text("View All Releases");
                        else $("#view").attr("href", "../monitoring/events/" + result).text("View Recent Release");
                        reposition("#view_modal");
                        $('#view_modal').modal('show');
                    }, 1000);

                    // Send to websocket to refresh all dashboards
                    doSend("getOnGoingAndExtended");
                },
                error: function(xhr, status, error) {
                  var err = eval("(" + xhr.responseText + ")");
                  alert(err.Message);
                }
            });
        }
    });
});