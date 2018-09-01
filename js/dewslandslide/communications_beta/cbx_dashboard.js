$(document).ready(() => {
	let temp_ewi_template_holder = "";
	console.log("Chatterbox: Dashboard mode...");

	initializeEwiPhoneButton();
	initializeEwiPhoneExtendedButton();
	initializeEditUndoButtons();
	initializeSendButton();
});


function initializeEwiPhoneButton() {
    $("#latest").on("click", "tbody tr .send_ewi_sms", ({ currentTarget }) => {
        const i = $(currentTarget).parents("tr");
        current_row = latest_table.row(i).data();
        current_row.formatted_data_timestamp =  moment(current_row.data_timestamp).add(30, "m").format('MMMM D, YYYY h:mm A');
        let request = {
        	"type": "getEwiDetailsViaDashboard",
        	"event_category": 'event',
        	"data": current_row
        };

		wss_connect.send(JSON.stringify(request));
    });
}

function initializeEwiPhoneExtendedButton() {
    $("#extended").on("click", "tbody tr .send_ewi_extended_sms", ({ currentTarget }) => {
        const i = $(currentTarget).parents("tr");
        current_row = latest_table.row(i).data();
        current_row.formatted_data_timestamp =  moment(current_row.data_timestamp).add(30, "m").format('MMMM D, YYYY h:mm A');

        let request = {
        	"type": "getEwiDetailsViaDashboard",
        	"event_category": 'extended',
        	"data": current_row
        };

		wss_connect.send(JSON.stringify(request));
    });
}

function displayTemplatesAndRecipients(recipients,template) {
	temp_ewi_template_holder = template.data;
	$("#ewi-recipients-dashboard").tagsinput('removeAll');
	recipients.forEach(function(row) {
		let construct_name = row.site_code.toUpperCase()+" "+row.org_name.toUpperCase()+" - "+row.firstname.toUpperCase()+". "+row.lastname.toUpperCase();
		$("#ewi-recipients-dashboard").tagsinput('add', construct_name );
	});
	$("#constructed-ewi-amd").text(template.data);
	$("#ewi-asap-modal").modal("show");
}


function initializeEditUndoButtons() {
    $("#edit-btn-ewi-amd").click(() => {
        if ($("#edit-btn-ewi-amd").val() === "edit") {
            $("#constructed-ewi-amd").prop("disabled", false);
            $("#edit-btn-ewi-amd").val("undo");
            $("#edit-btn-ewi-amd").text("Undo");
            $("#edit-btn-ewi-amd").attr("class", "btn btn-danger");
        } else {
            $("#constructed-ewi-amd").prop("disabled", true);
            $("#constructed-ewi-amd").val(temp_ewi_template_holder);
            $("#edit-btn-ewi-amd").attr("class", "btn btn-warning");
            $("#edit-btn-ewi-amd").text("Edit");
            $("#edit-btn-ewi-amd").val("edit");
        }
    });
}

function initializeSendButton() {
	$("#send-btn-ewi-amd").click(function() {
		let request = {
			"type": "sendEwiViaDashboard",
			"recipients": $("#ewi-recipients-dashboard").tagsinput('items'),
			"msg": $("#constructed-ewi-amd").val()
		}
		wss_connect.send(JSON.stringify(request));
	});
}

function displayEwiStatus(ewi_status) {
	let temp = "";
	ewi_status.forEach(function(ewi) {
		console.log();
		if (ewi.status[0].status == false) {
			if (temp == "") {
				temp = "Failed to send EWI to: "+ewi.recipient;
			} else {
				temp = temp+", "+ewi.recipient;
			}
		}
	});
	if (temp == "") {
		$.notify("Successfully Sent Early Warning Information.", "success");
	} else {
		$.notify(temp, "err");
	}
	$("#ewi-asap-modal").modal("hide");
}