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
        module_name: "Chatterbox"
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