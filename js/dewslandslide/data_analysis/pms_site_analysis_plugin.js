let pms_data = {};
let page = "";

const instance = PMS_MODAL.create({
    modal_id: "site-analysis-accuracy-1"
});

$(document).ready(() => {
	pms_data = {
		"metric_indicator": "registered_inbox",
		"table_source": "smsinbox"
	};
		
    setTimeout(() => {
        if (instance.is_attached) {
            pms_instances['12'] = instance;
        }
    }, 300);

	$("#plot-options-report").click(function() {
		pms_data = {
			"metric_indicator": "quick_search",
			"table_source": "smsinbox,smsoutbox"
		};
		site_analysis_report_submit(pms_data);
	});

	$("#rainfall-plot-report").click(function() {
		pms_data = {
			"metric_indicator": "quick_search",
			"table_source": "smsinbox,smsoutbox"
		};
		site_analysis_report_submit(pms_data);
	});

	$("#surficial-plot-report").click(function() {
		pms_data = {
			"metric_indicator": "routine_section",
			"table_source": "site",
			"modal_id": "chx_pms_modal"
		};
		site_analysis_report_submit(pms_data);
	});

	$("#column-level-report").click(function() {
		pms_data = {
			"metric_indicator": "routine_section",
			"table_source": "site",
			"modal_id": "chx_pms_modal"
		};
		site_analysis_report_submit(pms_data);
	});

	$("#node-level-report").click(function() {
		pms_data = {
			"metric_indicator": "routine_section",
			"table_source": "site",
			"modal_id": "chx_pms_modal"
		};
		site_analysis_report_submit(pms_data);
	});
});

function site_analysis_report_submit(pms_data) {
    console.log(pms_data);
    instance.set({
        reference_id: 0,
        reference_table: "communitycontacts",
        metric_name: pms_data.metric_indicator,
        module_name: "chatterbox"
    });
    
    instance.show();
    instance.print();
    console.log(instance);
}

function timelinessReport() {
	$.post("../narrativeAutomation/insert/", { narratives: narrative_details })
    .done((response) => {

    });
}