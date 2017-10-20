
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Early Warning Information Release Form [public_alert/alert_release_form.php]
 *	[host]/public_alert/release_form
 *	
****/

let status = 'new', active = [], routine_finish = [], validity_global = null;
let publicReleaseForm = null, isEndOfValidity = false;

let m_features_num = 1;

let toExtendND = false;
let trigger_list = [], current_event = [], saved_triggers = [];
let lookup = [  { x:"rs", y:"rain_area", z:false }, 
                { x:"es", y:"eq_area", z:false },
                { x:"ds", y:"od_area", z:false },
                { x:"gs", y:"ground_area", z:false },
                { x:"ss", y:"sensor_area", z:false },
                { x:"ms", y:"manifestation_area", z:false } ];


$(document).ready(function() 
{
	setPageWrapperHeight();
    initializeTooltips();
    initializeTimestamps();
    initializeFormValidator();

    ondataTimestampChange();
    mainTabGeneralxRoutine();
    onPublicAlertLevelChange();
    onTriggerSwitchClick();
    onOperationalTriggersAndNoDataClick();
    onRxButtonClick();
    onSiteChange();

    routineAreaFunctions();

    $("#add_feature, #add_nt_feature").click(function () {
        let base_id = null, field, group_id, rule;
        console.log(this.id);
        if( this.id == "add_feature") { 
            base_id = "#base"; field = "#features_field";
            group_id = "#feature_";
            rule = {depends: function () {
                 return $(".cbox_trigger[value='m']").is(":checked") || $(".cbox_trigger[value='M']").is(":checked");
            }};
        }
        else {
            base_id = "#nt_base"; field = "#nt_features_field";
            group_id = "#nt_feature_"; rule = true;
        }

        let base = $(base_id).clone()
            .data("value", m_features_num)
            .prop("id", group_id.slice(1) + m_features_num)
            .prepend('<hr/><button type="button" class="close"><span class="glyphicon glyphicon-trash"></span></button>');

        $(field).append(base);
        initializeTimestamps();
        $(".dropdown-toggle").dropdown();

        let id = group_id + m_features_num;
        console.log(id);
        let name;
        $(id + " input, " + id + " select, " + id + " textarea").each(function () {
            name = $(this).prop("name");
            $(this).addClass(id.slice(1))
            .prop("name", name + "_" + m_features_num).val("");

            $(this).rules('add', {
                required: rule
            });
        });

        $(id).find(".has-success, .has-error").removeClass("has-success has-error")
        .find("span.glyphicon-ok, span.glyphicon-remove, label.error").remove();
        $(id).find(".feature_name").attr("readonly", true);
        $(id).find(".dropdown-toggle").prop("disabled", true);

        m_features_num++;
    });

    $(document).on("click", "#features_field .close", function () {
        $(this).parent().remove();
    });

    $(document).on("change", ".feature_type", function () {
        let feature_type = this.value;
        let field_id = "#" + $(this).parents(".feature_group").prop("id");
        let name_list = field_id + " .feature_name_list";
        $(field_id + " .feature_name").val("");

        $(name_list + " li:not([data-value='new'])").remove();
        if( feature_type != "" ) {
            let site_id = $("#site").val();
            $.get("/../../pubrelease/getFeatureNames/" + site_id + "/" + feature_type, function (data) {
                $(name_list).siblings("button").prop("disabled", false);
                data.forEach(function (data) {
                    let option = $(name_list + " li[data-value='new']").clone()
                        .attr("data-value", data.feature_name)
                        .data("feature-id", data.feature_id);
                    let link = $(option).html();
                    let new_link = $(link).text(data.feature_name);
                    let a = $(option).html(new_link);
                    $(name_list).prepend(a);
                });
            }, "json");
        } else $(name_list).siblings("button").prop("disabled", true);
    });

    $(document).on("click", ".feature_name_list li", function () {
        let value = $(this).data("value"), id = $(this).data("feature-id");
        let feature_name = $(this).parents(".input-group-btn").siblings(".feature_name");
        if( value == "new" ) feature_name.prop("readonly", false).val("").data("feature-id", 0);
        else feature_name.val(value).data("feature-id", id);
    });

    $("#nt_feature_cbox").change(function () {
        if( this.checked ) {
            $("#nt_features_div").slideDown();
            if( $("#manifestation_validator").prop("disabled") == true ) $("#manifestation_validator").prop({disabled: false}).val("");
            $("#nt_features_field input:not([type='checkbox']), #nt_features_field select, #nt_features_field textarea").prop("disabled", false);
        }
        else { 
            $("#nt_features_div").slideUp();
            if( $(".cbox_trigger[value=m]:checked, .cbox_trigger[value=M]:checked").length == 0 ) $("#manifestation_validator").prop({disabled: true}).val(""); 
        }
    });
});

/*******************************************
 * 
 *   Adjust page wrapper height on resize
 *  
*******************************************/
function setPageWrapperHeight() 
{
    $(window).on("resize", function () {
        let window_h = $(window).height();
        $('#page-wrapper').css('min-height', window_h);
    }).resize();
}

/*******************************************
 * 
 *           Initialize tooltips
 *  
*******************************************/
function initializeTooltips()
{
    $('#nd label').tooltip();
    $('.cbox_trigger_nd[value=R0]').parent("label").tooltip();
    $('.cbox_trigger_rx').parent("label").tooltip();
    $('.trigger_info[name=trigger_manifestation_info]').siblings("label").tooltip();
}

/*******************************************
 * 
 *           Initialize Timestamps
 *  
*******************************************/
function initializeTimestamps()
{
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
    });
    
    $('.time').datetimepicker({
        format: 'HH:mm:00',
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    });
}

/*******************************************
 * 
 *   Control changes in General vs Routine
 *  
*******************************************/
function mainTabGeneralxRoutine()
{
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
            getFinishedReleasedRoutineSites();
        }
     });
}

/*******************************************
 * 
 *   Activities when Data Timestamp Changes
 *  
*******************************************/
function ondataTimestampChange()
{
    $('.datetime').on('dp.change', function(e){ if( status == "routine" ) getFinishedReleasedRoutineSites(); });

    // Ensure that Data Timestamp is filled 
    // first before Public Alert Level
    $(".datetime").on('change dp.change', function(e) {
        if( e.currentTarget.id == "entry" && $("#timestamp_entry") != "" ) $("#public_alert_level").prop("disabled", false).val("");
    });
}

/*******************************************
 * 
 *   Disable Sites on Routine Selection
 *   When routine release already made
 *  
*******************************************/
function getFinishedReleasedRoutineSites()
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
 *  Procedures on Public Alert Level change
 *  
*******************************************/
function onPublicAlertLevelChange()
{
    $("#public_alert_level").change(function () 
    {
        let alert_level = $(this).val(),
            trigger_switch = $(".cbox_trigger_switch");
        $(trigger_switch).prop("disabled", false);
        $(".cbox_trigger").prop("checked", false);
        $("#alert_invalid").slideUp();

        switch( alert_level )
        {
            case "": $(trigger_switch).prop("checked", false).prop("disabled", true);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                    break;
            case "A0": $(trigger_switch).not("[value=ms]").prop("checked", false).prop("disabled", true);
                    $(".cbox_trigger_switch[value='ms']").prop({disabled: false});
                    $(".cbox_trigger[value=M], .cbox_trigger[value=m]").prop("disabled", true);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", false);
                    $(".cbox_trigger_nd").prop("checked", false).prop("disabled", true);
                    $(".cbox_trigger_rx").prop("checked", false).prop("disabled", true);
                    toExtendND = false;
                    break;
            case "A1": $(".cbox_trigger_switch[value='gs'], .cbox_trigger_switch[value='ss']").prop("checked", false).prop("disabled", true);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", false);
                    $(".cbox_trigger[value=M], .cbox_trigger[value=m]").prop("disabled", true);
                    break;
            case "A2": $(".cbox_trigger[value=G], .cbox_trigger[value=S], .cbox_trigger[value=M]").prop("checked", false).prop("disabled", true);
                    $(".cbox_trigger[value=m]").prop("disabled", false);
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                    break;
            case "A3": $(trigger_switch).prop("disabled", false); 
                    $(".cbox_trigger[value='G'], .cbox_trigger[value='S'], .cbox_trigger[value=M]").prop("disabled", false);
                    $(".cbox_trigger[value='m']").prop("disabled", true); // Special for manifestation only
                    $(".cbox_nd[value=ND]").prop("checked", false).prop("disabled", true);
                    break;
        }

        // Show invalid alert notification if Alert is lowered prematurely
        if( !$.isEmptyObject(current_event) )
        {
            if( alert_level == "A0" && moment($("#timestamp_entry").val()).add(30, 'minutes').isBefore(current_event.validity) ) 
            {
                status = "invalid";
                $("#alert_invalid").slideDown();
            }
            else $("#alert_invalid").slideUp();
        }

        $(trigger_switch).trigger("change");
        $(".cbox_trigger").trigger("change");
    });
}

/*******************************************
 * 
 *  Procedures on Trigger Switch Click
 *  
*******************************************/
function onTriggerSwitchClick() 
{
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
}

/*******************************************
 * 
 *    Procedures on Operationa Triggers
 *      and No Data Checkboxes Click
 *  
*******************************************/
function onOperationalTriggersAndNoDataClick()
{
    $(".cbox_nd").click(function () 
    {
        let internal_alert_div = $("#internal_alert_level");
        let internal_alert = internal_alert_div.val();
        let temp;
        if( $(".cbox_nd").is(":checked") ) 
        {
            temp = internal_alert.replace(internal_alert.substr(0, 2), "ND");
            toExtendND = true;
        }
        else
        { 
            temp = internal_alert.replace("ND", $("#public_alert_level").val() );
            toExtendND = false;
        }

        internal_alert_div.val(temp);
    });

    $(".cbox_trigger, .cbox_trigger_nd").change(function () 
    {   
        let arr = $(".cbox_trigger:checked, .cbox_trigger_nd:checked");
        trigger_list = [];
        trigger_list = trigger_list.concat(saved_triggers);

        for (let i = 0; i < arr.length; i++) 
        {
            let trigger = arr[i].value;
            trigger_list.push(trigger);

            // Remove duplicates on trigger_list
            trigger_list = trigger_list.filter( function(elem, index, self) {
                return index == self.indexOf(elem);
            });

            prioritizeSameLetteredTriggers(trigger, trigger_list, "S", "s", i, "s0");
            prioritizeSameLetteredTriggers(trigger, trigger_list, "G", "g", i, "g0");
            prioritizeSameLetteredTriggers(trigger, trigger_list, "M", "m", i, "m0");
            prioritizeSameLetteredTriggers(trigger, trigger_list, "R0", "R", i);
        };

        if( this.value.indexOf("0") >= 0 ) disableDivsOnNoDataClick(this);
        
        // Disable Timestamp Input Validation Checkbox Fields
        let a = $(this).closest("span").next("div").children("input");
        if( $(".cbox_trigger[value=" + this.value + "]").is(":checked") ) {
            $(a).prop("disabled", false);
            $( "#" + $(a).attr('id') + "_info" ).prop("disabled", false);
        }
        else {
            $(a).prop("disabled", true);
            $( "#" + $(a).attr('id') + "_info" ).prop("disabled", true);
        }

        // If Checkbox is E, enable magnitude, latitude and longitude
        if( $(".cbox_trigger[value=E]").is(":checked") ) $("#magnitude, #latitude, #longitude").prop("disabled", false);
        else $("#magnitude, #latitude, #longitude").prop("disabled", true);

        // If Checkbox is D, enable magnitude, latitude and longitude
        if( $(".cbox_trigger[value=D]").is(":checked") ) $(".od_group, #reason").prop("disabled", false);
        else $(".od_group, #reason").prop("disabled", true);

        // If Checkbox is m or M, enable corresponding group and validator
        if( $(".cbox_trigger[value=m]").is(":checked") || $(".cbox_trigger[value=M]").is(":checked") )
        {
            $("#features_div").slideDown();
            $("#manifestation_validator, #manifestation_area .trigger_info").prop({disabled: false});
            $("#features_field input:not([type='checkbox']), #features_field select, #features_field textarea").prop("disabled", false);
            $("#features_field input[type='checkbox']").prop("disabled", false);
        }
        else {
            $("#features_div").slideUp();
            if( !$("#nt_feature_cbox").is(":checked") ) $("#manifestation_validator").prop({disabled: true});
            $("#manifestation_area .trigger_info").prop({disabled: true});
            $("#features_field input:not([type='checkbox']), #features_field select, #features_field textarea").prop("disabled", true);
            $("#features_field input[type='checkbox']").prop({disabled: true, checked: false});
        }

        $("#features_field .feature_group").each(function() {
            if( $(this).find(".feature_type").val() == "" ) {
                $(this).find(".dropdown-toggle").prop("disabled", true);
            }
            $(this).find(".feature_name").attr("readonly", true);
        });

        // Mark toExtendND true if X0 (ND-trigger) is checked
        toExtendND = false;
        for (let i = 0; i < trigger_list.length; i++) {
            if( trigger_list[i].includes("0") ) {
                toExtendND = true;
                break;
            }
        };

        trigger_list.sort( function( a, b ) 
        {
            let priority_lookup = { "S":5, "G":4, "M":3, "R":2, "E":1, "D":0, "r":-1};
            let trig_a = a[0] == "r" ? "r" : a[0].toUpperCase();
            let trig_b = b[0] == "r" ? "r" : b[0].toUpperCase();
            let x = priority_lookup[ trig_a ],
                y = priority_lookup[ trig_b ];
            if( x>y ) return -1; else return 1;
        });

        //console.log(trigger_list);

        let alert_level = $(".cbox_nd[value=ND]").is(":checked") ? "ND" : $("#public_alert_level").val();
        let alert = trigger_list.length > 0 ? alert_level + "-" + trigger_list.join("") : alert_level;
        alert = $("#public_alert_level").val() == "A0" ? "A0" : alert;
        $("#internal_alert_level").val(alert);

        // Trigger Rx if it is checked and does not have Rx/rx on internal alert
        if( $(".cbox_trigger_rx").is(":checked") ) {
            $(".cbox_trigger_rx").trigger("change");
        }
    });
}

/*******************************************
 * 
 *     Prioritizes X0/x0 over X over x
 *  
*******************************************/
function prioritizeSameLetteredTriggers(trigger, trigger_list, a, b, i, c = 'q' ) 
{
    if( trigger == a || trigger == b || trigger == c )
    {
        let x = trigger_list.indexOf(a), y = trigger_list.indexOf(b), z = trigger_list.indexOf(c);
        let remove = function (index) { trigger_list.splice( trigger_list.indexOf(index), 1) };

        if( z > -1 ) { 
            /// if uppercase version of trigger is available, make not x0 also uppercase
            if( x > -1 ) { trigger_list[z] = trigger_list[z].toUpperCase(); remove(a); }
            if( y > -1 ) remove(b);
        }
        else if( x > -1 ) { if(y > -1) remove(b); }
    }
}

/*******************************************
 * 
 *    Disable Cbox_Triggers and timestamp 
 *    input if Cbox_Trigger_ND is checked
 *  
*******************************************/
function disableDivsOnNoDataClick(trigger)
{
    let trigger_letter = trigger.value[0],
        tech_info = null; double = false;
    let public_alert = $("#public_alert_level").val();

    switch(trigger_letter) {
        case "R": tech_info = "rain"; break;
        case "g": tech_info = "ground"; double = true; break;
        case "s": tech_info = "sensor"; double = true; break;
        case "m": tech_info = "manifestation"; double = true; break;
    }

    let triggers_div = ".cbox_trigger[value=" + trigger_letter + "]";
    if( public_alert == "A3" ) {
        let copy_letter = trigger_letter == trigger_letter.toUpperCase() ? trigger_letter.toLowerCase() : trigger_letter.toUpperCase();
        triggers_div += ", .cbox_trigger[value=" + copy_letter + "]";
    }

    if(trigger.checked) 
    {
        $(triggers_div).prop("checked", false).prop("disabled", true);
        if( $(trigger).val().toUpperCase() == "M" ) $(triggers_div).parent().next().children("input").prop("disabled", true).val("");

        if (double) tech_info_div = "#trigger_" + tech_info + "_1_info, #trigger_" + tech_info + "_2_info";
        else tech_info_div = "#trigger_" + tech_info + "_info";
        $(tech_info_div).prop("disabled", true).val("");
    }
    else $(triggers_div).prop("disabled", false);

    // Enable/Disable Rainfall Intermediate Threshold option (rx)
    // if R0 is checked
    if(trigger_letter == "R") {
        if(trigger.checked) $(".cbox_trigger_rx").prop("checked", false).prop("disabled", true);
        else $(".cbox_trigger_rx").prop("disabled", false);
    }
}

/*******************************************
 * 
 *  Procedures on Rain Rx checkbox click
 *  
*******************************************/
function onRxButtonClick()
{
    $(".cbox_trigger_rx").change(function () 
    {
        let rx_internal = "";
        let internal = $("#internal_alert_level").val();
        if(this.checked) {
            $(".cbox_trigger_nd[value=R0]").prop("checked", false).prop("disabled", true);
            $(".cbox_trigger[value=R]").prop("checked", false).prop("disabled", true);
            $(".cbox_trigger[value=R]").parent().next().children("input").prop("disabled", true).val("");
            $("#trigger_rain_info").prop("disabled", true).val("");
            rx_internal = internal.indexOf("R") > -1 ? internal.replace(/R/g, "Rx") : internal + "rx";
        }
        else {
            $(".cbox_trigger_nd[value=R0], .cbox_trigger[value=R]").prop("checked", false).prop("disabled", false);
            rx_internal = internal.replace(/Rx/g, "R").replace(/rx/g, "");
        }
        $("#internal_alert_level").val(rx_internal);
    });
}

/*******************************************
 * 
 *     Procedures on Site Option Change
 *  
*******************************************/
function onSiteChange()
{
    $("#site").change(function () 
    {
        let val = $("#site").val() == "" ? 0 : $("#site").val();
        saved_triggers = [];

        // Clear all trigger timestamps area
        $(".trigger_time").val("");

        // Clear all validation on form
        $('#operational_area .form-group').removeClass('has-feedback').removeClass('has-error').removeClass('has-success');
        $('#operational_area .glyphicon.form-control-feedback').remove();

        $.get( "../pubrelease/getLastSiteEvent/" + val, 
        function( event ) 
        {
            // Reset fields on site_info_area
            $("#status").html("Monitoring Status: <br><b>[STATUS]</b>");
            $("#details").html("Event-based monitoring started on <b>[TIMESTAMP]</b>, valid until <b>[VALIDITY]</b>. Recent early warning released last <b>[LAST]</b>.");
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
                    for (let i = 0; i < triggers.length; i++) {
                        if (triggers[i + 1] == "0" || triggers[i + 1] == "x" ) 
                            { saved_triggers.push(triggers[i] + triggers[i + 1]); i++; }
                        else saved_triggers.push(triggers[i]);
                    }

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
                        $(".cbox_trigger_rx").prop('disabled', true).prop('checked', false);
                        $(".cbox_trigger_nd").prop('disabled', true).prop('checked', false);
                        let groupedTriggers = groupTriggersByType(event, triggers);

                        let lookup = { "R":"#rain_desc", "E":"#eq_desc", "G":"#ground_desc", "S":"#sensor_desc", "D":"#od_desc", "D":"#od_desc", "M": "#manifestation_desc" }
                        groupedTriggers.forEach( function (arr) 
                        {
                            let desc = "Latest trigger occurred on " + moment(arr[0].timestamp).format("dddd, MMMM Do YYYY, HH:mm");
                            if( arr[0].trigger_type == 'g' || arr[0].trigger_type == 's' || arr[0].trigger_type == 'm' ) desc = desc + " (L2)";
                            else if( arr[0].trigger_type == 'G' || arr[0].trigger_type == 'S' || arr[0].trigger_type == 'M' ) desc = desc + " (L3)";
                            if( arr[0].trigger_type == "E" )
                            {
                                let a = function (a, b) { $("#" + a).val(b) };
                                a("magnitude", arr[0].eq_info[0].magnitude);
                                a("latitude", arr[0].eq_info[0].latitude);
                                a("longitude", arr[0].eq_info[0].longitude);
                            }

                            $(lookup[arr[0].trigger_type.toUpperCase()] + " span:nth-child(2)").text(desc);
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
                $(".cbox_trigger_rx").prop('disabled', true).prop('checked', false).trigger("change");
                $(".cbox_trigger_nd").prop('disabled', true).prop('checked', false);
                $('#public_alert_level option').prop('disabled', false);
                $("#public_alert_level").val("").trigger("change");
            }
        }, "json")
    })
}


function groupTriggersByType(event, triggers) 
{
    //let trigger_list = event.internal_alert_level.slice(3);
    let trigger_list = saved_triggers.slice(0);
    let public_alert = event.internal_alert_level.substr(0,2);
    
    // Remove 0 from trigger list (if internal alert has no data)
    // and converts g0/s0 to G/S if its A3
    function clearZero(x, public_alert) 
    { 
        x = x.replace('0', '').replace('rx', '').replace("x", '');
        if(x != "") return x;
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
            case "R0": case "Rx": case "rx":
                if(trigger_list[i] == "R0") check(trigger_list[i], "nd");
                else check("rx", "rx");
            case "R": check("rs"); enable("R0"); break;
            case "E": check("es"); enable("E0"); break;
            case "D": check("ds"); enable("D0"); break;
            case "g0": case "G0": check("g0", "nd");
            case "G": case "g": check("gs"); enable("g0"); break;
            case "s0": case "S0": check("s0", "nd");
            case "S": case "s": check("ss"); enable("s0"); break;
            case "m0": case "M0": check("m0", "nd");
            case "M": case "m": check("ms"); enable("m0"); break;
            default: check(trigger_list[i]); break;
        }

        // Re-save the triggers WITHOUT 0 on saved_triggers after using its
        // purpose of checking x0 checkboxes
        saved_triggers = trigger_copy.slice(0);

        $(".cbox_trigger_switch").trigger("change");
        $(".cbox_trigger_nd").trigger("change");
        // END OF CHECKING CHECKBOXES

        // Check for triggers with the corresponding trigger letter
        let x = triggers.filter(function (val) 
        {
            // Check for filtered "rx"
            if( typeof trigger_copy[i] != "undefined" )
                return val.trigger_type == trigger_copy[i] || val.trigger_type == trigger_copy[i].toLowerCase();
        })

        x.sort(function (a, b) 
        {
            if( moment(a.timestamp).isAfter(b.timestamp) ) return -1; else return 1;
        })

        // Check for filtered "rx" and save grouped triggers on array then return
        if( typeof trigger_copy[i] != "undefined" ) arr.push(x);
    }
    
    return arr;
}

/*******************************************
 * 
 *  Control details on Sites Area (Routine)
 * 
********************************************/
function routineAreaFunctions()
{
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
}

/*******************************************
 * 
 *       Initialize Form Validation
 * 
********************************************/
function initializeFormValidator()
{
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
            case "A3": msg = "At least Surficial, Subsurface, and/or Manifestation trigger required."; return ( a("ss") || a("gs") || a("ms") ); break;
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
        if( $("#public_alert_level").val() == "A3" && (val == "G" || val == "g" || val == "S" || val == "s" || val == "M" || val == "m"))
        {
            let a = function (a) { return $(".cbox_trigger[value=" + a + "]" ).is(":checked") };
            msg = "L3 trigger timestamp required.";
            if( triggers.indexOf(val.toUpperCase()) > -1 || triggers.indexOf(val.toLowerCase()) > -1 ) return true;
            else if(val == "G" || val == "S" || val == "M")  return a("G") || a("S") || a("M");
            else if(val == "g" && !a("G") && val == "s" && !a("S") && val == "m" && !a("M")) { msg = "At least L2 or L3 timestamp required."; return a("g") || a("s") || a("m"); }
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
        reposition("#nd_modal");
        let ts_entry = $("#timestamp_entry").val(),
            public_alert = $("#public_alert_level").val();

        if( moment(validity_global).isSame(moment(ts_entry).add(30, 'minutes')) )
        {
            if( public_alert == "A0" ) return true;
            else if( $(".cbox_trigger_rx").is(":checked") ) return true;
            else if( public_alert == "A1")
            {
                if( $(".cbox_trigger_nd").is(":checked") ) return true;
                else if( $(".cbox_nd").is(":checked") || $(element).is(":checked") || $(".cbox_trigger").is(":checked"))
                    return true;
                else { $("#nd_modal").modal('show'); return false; }
            }
            else if( public_alert == "A2" || public_alert == "A3" )
            {
                if ($(".cbox_trigger_nd").is(":checked")) return true;
                else if ($(".cbox_trigger").is(":checked")) return true;
                else { $("#nd_modal").modal('show'); return false; }
            }
            else {
                $("#nd_modal").modal('show');
                return false;
            } 
                
        } else return true;
        
    }, "");

    $.validator.addClassRules({
        cbox_nd: { "isEndOfValidity": true },
        cbox_trigger_nd: { "isEndOfValidity": true },
        cbox_trigger_rx: { "isEndOfValidity": true }
    });

    let manifestation_required = {
        depends: function () {
            return $(".cbox_trigger[value='m']").is(":checked") || $(".cbox_trigger[value='M']").is(":checked");
    }};

    let eq_rules = {
        required: {
            depends: function () {
                return $(".cbox_trigger[value='E']").is(":checked");
            }},
        step: false
    };

    jQuery.validator.addMethod("isNTCboxChecked", function(value, element) {
        if( $(".cbox_trigger[value='m']").is(":checked") || $(".cbox_trigger[value='M']").is(":checked") || $("#nt_feature_cbox").is(":checked") ) return $(element).val() !== "";
        else return true;
    }, "This field is required.");

    publicReleaseForm = $("#publicReleaseForm").validate(
    {
        debug: true,
        rules: {
            public_alert_level: "required",
            timestamp_entry: "required",
            release_time: "required",
            site: "required",
            reporter_2: "required",
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
            magnitude: eq_rules,
            latitude: eq_rules,
            longitude: eq_rules,
            manifestation_validator: { isNTCboxChecked: true },
            feature_type: { required: manifestation_required },
            feature_name: { required: manifestation_required },
            observance_timestamp: { required: manifestation_required },
            feature_reporter: { required: manifestation_required },
            feature_narrative: { required: manifestation_required },
            feature_remarks: { required: manifestation_required },
            nt_feature_type: { required: true },
            nt_feature_name: { required: true },
            nt_observance_timestamp: { required: true },
            nt_feature_reporter: { required: true },
            nt_feature_narrative: { required: true },
            nt_feature_remarks: { required: true }
        },
        messages: {
            comments: "Provide a reason to invalidate this event. If the event is not invalid and is really an end of event EWI, release it on the indicated end of validity."
        },
        errorPlacement: function ( error, element ) {

            let placement = $(element).closest('.form-group');
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
                if(element.hasClass("reporter")) element.next("span").css({"top": "25px", "right": "5px"});
                if(element.hasClass("feature_name")) element.next("span").css({"top": "0", "right": "34px"});
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
            
            let trig_list = temp.trigger_list;
            if( trig_list != null ) {
                if( trig_list.indexOf('m') > -1 || trig_list.indexOf('M') > -1 ) {
                    temp.feature_groups = [];
                    let trig_manifestation = null;
                    $("#features_field .feature_group").each( function() {
                        let ob_ts = $(this).find(".observance_timestamp").val();
                        if(trig_manifestation == null) trig_manifestation = ob_ts;
                        else if( moment(ob_ts).isAfter(trig_manifestation) ) trig_manifestation = ob_ts;
                        temp.feature_groups.push(this.id); 
                    });
                    temp.trigger_manifestation = trig_manifestation;
                }
            }

            if( $("#nt_feature_cbox").is(":checked") ) {
                temp.nt_feature_groups = [];
                $("#nt_features_field .feature_group").each( function() {
                    temp.nt_feature_groups.push(this.id); 
                });
            }

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

                // If A0, check if legit lowered or invalid
                if( temp.public_alert_level == "A0")
                {
                    if( moment(current_event.validity).isSameOrBefore(moment(temp.timestamp_entry).add(30, 'minutes')) )
                    {
                        temp.status = "extended";
                        $.post("../issues_and_reminders/archiveIssuesFromLoweredEvents", {event_id: temp.current_event_id})
                        .done(function (has_updated) {
                            if(has_updated == 'true') { doSend("getNormalAndLockedIssues"); }
                        });
                    }
                    else
                        temp.status = "invalid";
                }
                // Check if needed for 4-hour extension if ND
                else if( temp.trigger_list == null && moment(current_event.validity).isSame(moment(temp.timestamp_entry).add(30, 'minutes')) )
                {
                    if( toExtendND ) temp.extend_ND = true;
                    else if ( typeof temp.cbox_trigger_rx !== "undefined" ) temp.extend_rain_x = true;
                }
            }
            else if (status == "invalid") { temp.current_event_id = current_event.event_id; }
            else if (status == "routine")
            {
                temp.routine_list = [];
                $("input[name='routine_sites[]']:checked").each(function () {
                    if(!this.disabled) 
                        temp.routine_list.push(this.value);
                });
            }
            else if ( status == "extended" )
            {
                // Status is either "extended" or "finished"
                if( temp.public_alert_level == "A0")
                {
                    temp.current_event_id = current_event.event_id;
                    temp.status = "extended";
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
                    doSend("updateDashboardTables");
                },
                error: function(xhr, status, error) {
                  var err = eval("(" + xhr.responseText + ")");
                  alert(err.Message);
                }
            });
        }
    });
}
