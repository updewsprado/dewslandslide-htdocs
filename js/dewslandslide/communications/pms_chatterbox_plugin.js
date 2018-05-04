$(document).ready(() => {

	$("#quick_search_report").click(function() {
		pms_module_indicator = "quick_search";
		cbx_report_submit(pms_module_indicator);
	});

	$("#routine_report").click(function() {
		pms_module_indicator = "routine_section";
		cbx_report_submit(pms_module_indicator);
	});

	$("#sms_report").click(function() {
		pms_module_indicator = "sms_section";
		cbx_report_submit(pms_module_indicator);
	});

	$("#contact_settings_report").click(function() {
		pms_module_indicator = "contact_settings";
		cbx_report_submit(pms_module_indicator);
	});

	$("#quick_group_selection_report").click(function() {
		pms_module_indicator = "quick_group_selection";
		cbx_report_submit(pms_module_indicator);
	});


    $("#registered_inbox").click(function() {
        pms_module_indicator = "registered_inbox";
    });

    $("#unregistered_inbox").click(function() {
        pms_module_indicator = "unregistered_inbox";
    });

    $("#event_inbox").click(function() {
        pms_module_indicator = "event_inbox";
    });

	$("#qa_site_with_event_report").click(function() {
		pms_module_indicator = "qa_site_with_event";
	});

	$("#qa_group_message_report").click(function() {
		pms_module_indicator = "qa_group_message";
	});

	$(".report-tabs").click(function() {
		cbx_report_submit(pms_module_indicator);
	});

});

function cbx_report_submit(module_indicator) {
    console.log(module_indicator);
    const instance = PMS_MODAL.create({
        modal_id: `chatterbox-accuracy-1`,
        metric_name: module_indicator,
        module_name: "chatterbox"
    });

    setTimeout(() => {
        if (instance.is_attached) {
            pms_instances[`s${release_id}`] = instance;
        }
    }, 300);


    console.log(pms_instances);
    instance.set({
        reference_id: pms_reference_id,
        reference_table: "chatterbox"
    });
    instance.show();
    instance.print();
}

function attachMetricChecklist() {
	 $(".metric-checklist").empty();
	switch(pms_module_indicator) {
	    case "quick_search":
	        $(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	        break;
	    case "routine_section":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "sms_section":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "contact_settings":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "quick_group_selection":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "registered_inbox":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "unregistered_inbox":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "event_inbox":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "qa_site_with_event":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    case "qa_group_message":
	    	$(".metric-checklist").append("<div class='col-sm-12' style='margin-left:15px;'><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='greeting'>Employee Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='data_ts'>Community Contact Settings</label></div><div class='col-sm-4'><label class='checkbox-inline'><input type='checkbox' name='ewi-sms-checkbox' value='alert_desc'>Contact Suggestion</label></div></div>");
	    	break
	    default:
	       console.log("def");
	}
}