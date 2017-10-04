
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Monitoring Dashboard
 *	[host]/home or [host]/dashboard
 *	
****/

let realtime_cache = {}, ongoing = [], candidate_triggers = [];
let isTableInitialized = false;
let latest_table = null, extended_table = null, overdue_table = null, candidate_table = null;
let modalForm = null, entry = {}, current_row = {};
let sitesList = [], merged_arr = [];

let lookup = { "r1":["rain","rain","R"], "r2":["rain","rain","R"], "l2":["ground","ground_1","g"], "l3":["ground","ground_2","G"], "L2":["sensor","sensor_1","s"], "L3":["sensor","sensor_2","S"], "d1":["od","od","D"], "e1":["eq","eq","E"] };
let lookup2 = { "rain":["R"], "eq":["E"], "ground":["g","G"], "sensor":["s","S"], "on-demand":["D"]};


let setElementHeight = function () {
    let col_height = $("#column_2").height();
    $('#map-canvas').css('min-height', col_height-20);
};


$(document).ready( function() {

	getSites();

	$(window).on("resize", function () {
	    setElementHeight();
	}).resize();

	$(window).on("resize", function () {
	    $('#page-wrapper').css('min-height', ($(window).height()));
	}).resize();
 

	/*****************************************
	 * 
	 * 		AUTOMATED PDF SENDING
	 * 
	******************************************/

	let id = null, text = null, filename = null, subject = null;

	reposition("#bulletinLoadingModal");
	reposition("#resultModal");

	$("#latest, #extended").on( "click", 'tbody tr .glyphicon-envelope', function(x) {
		id = $(this).prop('id');
		let event_id = $(this).attr('data-event-id')
		console.log("event", event_id)
		loadBulletin(id, event_id);
	});

    $("#send").click(function () {
        $.when(renderPDF(id))
        .then(function (x) {
            if( x == "Success.")
            {
                let recipients = $("#recipients").tagsinput("items");
                console.log(recipients);

                text = $("#info").val().replace(/\n/g, '<br/>');
                let i = text.indexOf("DEWS");
                if( i > 0) 
                	text = text.substr(0, i) + "<b>" + text.substr(i) + "</b>";
                else text = "<b>" + text + "</b>";

                subject = $("#subject").text();
                filename = $("#filename").text() + ".pdf";
                sendMail(text, subject, filename, recipients);
            }
        })
    });
 

	/********** END OF AUTOMATED PDF SENDING **********/ 

	/**************************************************
	 * 
	 * 		DASHBOARD EWI WEB RELEASE MECHANISM
	 * 
	***************************************************/

	reposition("#releaseModal");

	setInterval( function () { $("#release_time").val(moment().format("HH:mm:00")); }, 1000);

	$("#candidate tbody").on( "click", 'tr .glyphicon-ok', function(x) 
	{
		$('#modalForm .form-group').removeClass('has-feedback').removeClass('has-error').removeClass('has-success');
		$('#modalForm .glyphicon.form-control-feedback').remove();
		modalForm.resetForm();

		entry = {};
		let i = $(this).parents("tr");
		let row = candidate_table.row(i).data();
		current_row = row;
		let site = row.site;

		$("#timestamp_entry").val(row.timestamp);
		$("#internal_alert_level").val(row.internal_alert);
		$("#site").val(sitesList[row.site]);
		$("#comments").val("");

		// Search candidate trigger if existing on latest and overdue
		merged_arr = jQuery.merge(jQuery.merge([], ongoing.latest), ongoing.overdue);
		let index = merged_arr.map(x => x.name).indexOf(site);
		let previous = null;

		if(index > -1)
		{
			previous = merged_arr[index];
			entry.trigger_list = showModalTriggers(row, previous.trigger_timestamp);
			entry.previous_validity = previous.validity;

			if( row.internal_alert == "A0" )
			{
				if( moment(previous.validity).isAfter( moment(row.timestamp).add(30, 'minutes') ) )
					entry.status = "invalid";
				else entry.status = "extended";
			}
			else entry.status = "on-going";
			entry.event_id = previous.event_id;
		}
		else
		{	

			let index_ex = ongoing.extended.map(x => x.name).indexOf(site);
			entry.trigger_list = showModalTriggers(row, null);

			if( row.status == "extended" ) 
			{
				entry.status = "extended";
				entry.event_id = ongoing.extended[index_ex].event_id;
			} 
			else {
				// Search if candidate trigger exists on extended
				if(index_ex > -1) entry.previous_event_id = ongoing.extended[index_ex].event_id;
				entry.status = "new";
				$("#release").prop("disabled", false);
			}
		}

		// Insert X on internal alert if Rx is not yet automatic on JSON
		entry.rain_alert = row.rain_alert;
		if( entry.rain_alert == "rx" )
		{
			let internal = row.internal_alert;
			if( internal.indexOf("x") == -1 ) {
				if( internal.indexOf("R") > -1 ) internal = internal.replace(/R/g, "Rx");
				else internal += "rx";
				$("#internal_alert_level").val(internal);
			}
		}

		// Check data timestamp for regular release (x:30)
		// Disable send button if not else enable button
		let hour = moment(row.timestamp).hour();
		let minute = moment(row.timestamp).minutes();
		if( hour % 4 == 3 && minute == 30 ) $("#release").prop("disabled", false);
		else $("#release").prop("disabled", true);

		showInvalidTriggersOnModal( row );

		// Automatically check trigger_switch if invalid area is empty
		$(".trigger_switch").each( function (count, item) {
			if( $("#" + item.value + "_area .invalid_area").html() === "" ) {
				$(item).prop("checked", true);
			}
		});

		//toggleTriggerOnRelease( row, index );
		$("#releaseModal").modal({ backdrop: 'static', keyboard: false, show: true});	
		//console.log(entry);
	});

	$(".trigger_switch").click( function () {
		let index = merged_arr.map(x => current_row.site).indexOf(site);
		toggleTriggerOnRelease(this.value, current_row, index);
	});

	/*$("#candidate tbody").on( "click", 'tr .glyphicon-remove', function(x) 
	{
		reposition("#manualInputModal")
		$("#manualInputModal").modal("show");
	});*/

	$("#candidate tbody").on( "click", 'tr .glyphicon-info-sign', function(x) 
	{
		reposition("#manualInputModal")
		$("#manualInputModal").modal("show");
	});

	jQuery.validator.addMethod("isInvalid", function(value, element, param) {
	        if (entry.status == "invalid") { 
	        	if (value != "") return true;
	        	else return false; }
	        else return true;
	    }, "");

	jQuery.validator.addMethod("at_least_one", function(value, element, options) {
        if( $(".od_group[value=llmc]").is(":checked") || $(".od_group[value=lgu]").is(":checked") )
        	return true;
        else return false;
    }, "Choose at least one of the two groups as requester.");

    jQuery.validator.addClassRules({od_group: {"at_least_one": true}});

    jQuery.validator.addMethod("at_least_one_invalid", function(value, element, param) {
        let alert = $("#internal_alert_level").val();
        let internal_alert = alert.slice(3);

    	if( entry.status == "new" ) {
    		//console.log("NEW", $('.trigger_switch:checked:enabled') );
    		if ( $('.trigger_switch:checked:enabled').length == 0 ) return false;
    		else return true;
        } else if ( internal_alert == "" ) {
        	return false;
        } else {
        	$(".trigger_switch").closest(".form-group").children("label.error").remove();
        	return true;
        }

    }, "Check the box of invalid trigger to be released.");

	$.validator.addClassRules({ "trigger_switch": { "at_least_one_invalid": true } });

	modalForm = $("#modalForm").validate(
	{
	    debug: true,
	    rules: {
	    	site: "required",
	        timestamp_entry: "required",
	        release_time: "required",
	        trigger_rain: "required",
	        trigger_eq: "required",
	        trigger_od: "required",
	        trigger_ground_1: "required",
	        trigger_ground_2: "required",
	        trigger_sensor_1: "required",
	       	trigger_sensor_2: "required",
	        trigger_rain_info: "required",
	        trigger_eq_info: "required",
	        trigger_od_info: "required",
	        trigger_ground_1_info: "required",
	        trigger_ground_2_info: "required",
	        trigger_sensor_1_info: "required",
	        trigger_sensor_2_info: "required",
	        reporter_2: "required",
	        comments: {
	        	"isInvalid": true
	        },
	        magnitude: {
                required: true,
                step: false
            },
            latitude: {
                required: true,
                step: false
            },
            longitude: {
                required: true,
                step: false
            },
            reason: "required"
	    },
	    messages: {
	    	comments: "Provide a reason to invalidate this event. If the event is not invalid and is really an end of event EWI, release it on the indicated end of validity."
	    },
	    errorPlacement: function ( error, element ) {

	    	var placement = $(element).closest('.form-group');
	        //console.log(placement);
	        
	        /*if( $(element).hasClass("trigger_switch") )
	        {
	            $("#errorLabel").append(error).show();
	        }
	        else */if (placement) {
	            $(placement).append(error)
	        } else {
	            error.insertAfter(placement);
	        } //remove on success

	        element.parents( ".form-group" ).addClass( "has-feedback" );

	        // Add the span element, if doesn't exists, and apply the icon classes to it.
	        if ( !element.next( "span" )[ 0 ] ) {
                if( !element.is("[type=checkbox]") )
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback' style='top:18px; right:22px;'></span>" ).insertAfter( element );
                if(element.parent().is(".datetime")) element.next("span").css("right", "15px");
                if(element.is("input[type=number]")) element.next("span").css({"top": "24px", "right": "20px"});
                if(element.is("textarea") || element.is("select")) element.next("span").css({"top": "24px", "right": "22px"});
                if(element.attr("id") == "reason") element.next("span").css({"top": "0", "right": "0"});
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
	    	$("#releaseModal").modal('hide');
	    	let data = $( "#modalForm" ).serializeArray();
	        let temp = {};
	        data.forEach(function (value) { temp[value.name] = value.value == "" ? null : value.value; });
	        let aX = temp.internal_alert_level.slice(0,2);
	        temp.public_alert_level = aX == "ND" ? "A1" : aX;
	        temp.status = entry.status;
	        temp.reporter_1 = $("#reporter_1").attr("value-id");

	        // Don't include un-checked retriggers for rain and sensor
	        $(".trigger_switch").each( function (count, item) {
	        	if ( !$(item).is(":checked") ) {
	        		let x = null;
	        		let haystack = entry.trigger_list.join("").toUpperCase();
	        		x = item.value == "rain" ? "R" : "S";
	        		let index = haystack.indexOf(x);
	        		entry.trigger_list.splice(index, 1);
	        		// console.log(haystack, index, entry.trigger_list);
	        	}
			});

			temp.trigger_list = entry.trigger_list.length == 0 ? null : entry.trigger_list;

	        if( temp.trigger_list != null ) 
	        {
				if( temp.trigger_list.indexOf("D") > -1 )
		        {
		    		if($(".od_group[value=llmc]").is(":checked")) temp.is_llmc = true;
		    		if($(".od_group[value=lgu]").is(":checked")) temp.is_lgu = true;
		    		temp.reason = $("#reason").val();
		        } else if( temp.trigger_list.indexOf("E") > -1 )
		        {
		    		temp.magnitude = $("#magnitude").val();
		    		temp.latitude = $("#latitude").val();
		    		temp.longitude = $("#longitude").val();
		        }
	        }
	        
	        if (entry.status == "new")
	        {
	        	if( typeof entry.previous_event_id != 'undefined' ) temp.previous_event_id = entry.previous_event_id;
	        }
	        else temp.current_event_id = entry.event_id;

	        if (entry.status == "on-going")
	        {
	        	let extend = false;

	        	if( temp.internal_alert_level.indexOf("ND") > -1 || temp.internal_alert_level.indexOf("g0") > -1 || temp.internal_alert_level.indexOf("s0") > -1 )
	        		extend = true;

	        	if( temp.trigger_list == null && moment(entry.previous_validity).isSame( moment(temp.timestamp_entry).add(30, 'minutes') ) )
	        	{
	        		if( extend ) temp.extend_ND = true;
	        		if ( entry.rain_alert == "rx" ) {
	        			temp.extend_rain_x = true;
	        		}
	        	}
	        }

	        if(entry.status == 'extended') {
	        	$.post("../issues_and_reminders/archiveIssuesFromLoweredEvents", {event_id: temp.current_event_id})
	        	.done(function (has_updated) {
                    if(has_updated == 'true') { doSend("getNormalAndLockedIssues"); }
                });
	        }

	        console.log(temp);
	     	$.ajax({
	            url: "../pubrelease/insert",
	            type: "POST",
	            data : temp,
	            success: function(result, textStatus, jqXHR)
	            {
	                console.log(result);
	                doSend("updateDashboardTables");

	                setTimeout(function () 
	                {
	            		$('#resultModal .modal-header').html("<h4>Early Warning Information Release</h4>");
	                	$("#resultModal .modal-body").html('<p><strong>SUCCESS:</strong>&ensp;Early warning information successfully released on site!</p>');
	                	$('#resultModal').modal('show');

	                }, 1000);
	            },
	            error: function(xhr, status, error) {
	              var err = eval("(" + xhr.responseText + ")");
	              alert(err.Message);
	            }
	        });
	    }
	});
});

/********** END OF DASHBOARD EWI WEB RELEASE MECHANISM **********/

/*****************************************
 * 
 * 		BUILD DASHBOARD TABLES AVAILABLE
 * 
******************************************/

function buildDashboardTables( data )
{
	if ( data.code == "existingAlerts" )
	{
		ongoing = jQuery.extend(true, {}, data.alerts);
	}

	let tables = {"latest":latest_table, "extended":extended_table, "overdue":overdue_table, "candidate":candidate_table};
	let alerts = data.alerts;

	if( alerts == null  ) 
	{
        console.log("=== ERROR PROCESSING ALERTS! ===");
        console.log(data.error);
        alerts = {"candidate" : null};
    } 

	for( let key in alerts ) 
	{
		if( tables[key] == null ) 
		{
			switch(key) {
				case "latest": latest_table = buildLatestAndOverdue(key, alerts[key]); 
								alerts[key].forEach(function (x) {
									checkIfAlreadySent(x.latest_release_id, x.event_id, x.data_timestamp);
								});
								break;
				case "extended": extended_table = buildExtendedTable(alerts[key]); break;
				case "overdue": overdue_table = buildLatestAndOverdue(key, alerts[key]);
								overdue_table.column(6).visible(false);
								break;
				case "candidate": candidate_table = buildCandidateTable(alerts[key]); break;
			}
		} else {
			console.log("Entered Here reload", key)
			reloadTable(tables[key], alerts[key], key);
		}

		if( key !== 'markers' ) tableCSSifEmpty(key, alerts[key]);
	}

	initialize_map();

	function buildLatestAndOverdue (table, dataX)
	{
		return $('#' + table).DataTable({
			"data": dataX,
			"columnDefs": [
				{ className: "text-left", "targets": [ 0, 3 ] },
		 		{ className: "text-right", "targets": [ 1, 2, 4, 5 ] },
		 		{ className: "text-center", "targets": [6] }
			],
			"columns": [
	            {
	            	data: "name", 
	            	"render": function (data, type, full) {
	            		return "<b><a href='../monitoring/events/" + full.event_id + "'>" + full.name.toUpperCase() + "</a></b>";
	            	},
	        		"name": 'name',
	            },
	            { 
	            	"data": "event_start",
	            	"render": function (data, type, full) {
	            		return moment(full.event_start).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "event_start"
	        	},
	        	{
	        		"data": "trigger_timestamp",
	            	"render": function (data, type, full) {
	            		return moment(full.trigger_timestamp).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "trigger_timestamp"
	        	},
	            { 
	            	"data": "internal_alert_level",
	            	"render": function (data, type, full) {
	            		return full.internal_alert_level;
	            	},
	            	"name": "internal_alert_level",
	            },
	            { 
	            	"data": "validity",
	            	"render": function (data, type, full) {
	            		return moment(full.validity).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "validity"
	        	},
	        	{ 
	            	"data": "release_time",
	            	"render": function (data, type, full) {
	            		if( full.internal_alert_level == "A0" ) return "FINISHED";
	            		else return full.release_time;
	            	},
	            	"name": "release_time"
	        	},
	        	{
	        		"render": function (data, type, full) {
	            		return "<a onclick='sendViaAlertMonitor("+JSON.stringify(full)+")'><span id='" + full.latest_release_id + "_sms' class='glyphicon glyphicon-phone'></span></a>&ensp;&ensp;<a><span class='glyphicon glyphicon-envelope' id='" + full.latest_release_id + "' data-sent='0' data-event-id='"+ full.event_id +"'></span></a>";
	            	}
	        	}
	    	],
	    	"order" : [[4, "asc"]],
	    	"processing": true,
	    	"filter": false,
	    	"info": false,
	    	"paginate": false,
	    	"autoWidth": false,
	    	"language": 
	    	{
		        "emptyTable": "There are no sites under monitoring at the moment."
		    },
		    "rowCallback": function( row, data, index ) 
		    {
                switch(data.internal_alert_level.slice(0,2))
                {
                	case 'A2': $(row).addClass("alert_2"); break;
                	case 'A1': case 'ND': $(row).addClass("alert_1"); break;
                    case 'A3': $(row).addClass("alert_3"); break;
                }
		  	}
	    });
	};

	function buildExtendedTable (data)
	{
		return $('#extended').DataTable({
	    	"data": data,
			"columnDefs": [
				{ className: "text-left", "targets": [ 0 ] },
		 		{ className: "text-right", "targets": [ 1, 2, 3 ] },
		 		{ className: "text-center", "targets": [4] }
			],
			"columns": [
	            {
	            	data: "name", 
	            	"render": function (data, type, full) {
	            		return "<b><a href='../monitoring/events/" + full.event_id + "'>" + full.name.toUpperCase() + "</a></b>";
	            	},
	        		"name": 'name',
	            },
	            { 
	            	"data": "validity",
	            	"render": function (data, type, full) {
	            		return moment(full.validity).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "validity"
	        	},
	        	{
	            	"data": "start",
	            	"render": function (data, type, full) {
	            		return moment.unix(full.start).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "start"
	        	},
	        	{ 
	            	"data": "end",
	            	"render": function (data, type, full) {
	            		return moment.unix(full.end).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "end"
	        	},
	        	{
	        		"render": function (data, type, full) {
	            		return "<a onclick='sendViaAlertMonitor("+JSON.stringify(full)+")'><span id='" + full.latest_release_id + "_sms' class='glyphicon glyphicon-phone'></span></a>&ensp;&ensp;<a><span class='glyphicon glyphicon-envelope' id='" + full.latest_release_id + "' data-sent='0' data-event-id='"+ full.event_id +"'></span></a>";
	            	}
	        	}
			],
	    	"order" : [[3, "asc"]],
	    	"processing": true,
	    	"filter": false,
	    	"info": false,
	    	"paginate": false,
	    	"autoWidth": false,
	    	"language": 
	    	{
		        "emptyTable": "There are no sites under 3-day extended monitoring."
		    },
		    "rowCallback": function( row, data, index ) 
		    {
	            switch(data.day)
	            {
	            	case 0: break;
	            	case 1: $(row).addClass("day-one"); break;
	                case 2: $(row).addClass("day-two"); break;
	                case 3: $(row).addClass("day-three"); break;
	                default: if(data.day != 0) $(row).addClass("day-overdue"); break;
	            }
		  	}
	    });
	}

	function buildCandidateTable (data)
	{
		return $('#candidate').DataTable({
	    	"data": data,
			"columnDefs": [
				{ className: "text-left", "targets": [ 0, 3 ] },
		 		{ className: "text-right", "targets": [ 1, 2, 4 ] },
		 		{ className: "text-center", "targets": [ 5 ] }
			],
			"columns": [
	            {
	            	data: "site", 
	            	"render": function (data, type, full) {
	            		return "<b>" + full.site.toUpperCase() + "</b>";
	            	},
	        		"name": 'site',
	            },
	            { 
	            	"data": "data_timestamp",
	            	"render": function (data, type, full) {
	 					if( full.timestamp == null )	return "No new triggers";
	            		else return moment(full.timestamp).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "data_timestamp"
	        	},
	            { 
	            	"data": "latest_trigger_timestamp",
	            	"render": function (data, type, full) {
	 					if( full.latest_trigger_timestamp == "end" ) return "No new triggers";
	 					else if( data == "manual" || data == "extended" ) return "---";
	            		else return moment(full.latest_trigger_timestamp).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "latest_trigger_timestamp"
	        	},
	        	{ 
	            	"data": "trigger",
	            	"render": function (data, type, full) {
	            		if( full.trigger == "No new triggers" ) return full.trigger;
	            		else if( full.trigger == "manual" || data == "extended" ) return "---";
	            		return full.trigger.toUpperCase();
	            	},
	            	"name": "trigger",
		        },
	            { 
	            	"data": "validity",
	            	"render": function (data, type, full) {
	            		if ( full.validity == "end" ) return "END OF VALIDITY"
	            		else if ( full.validity == "manual" ) return "---";
	            		else if ( data == "extended" ) return "EXTENDED RELEASE";
	            		else return moment(full.validity).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "validity"
	        	},
	        	{
	        		"render": function (data, type, full) {
	        			if(typeof full.isManual !== "undefined") return "<a><span class='glyphicon glyphicon-info-sign' title='Info'></span></a>";
	            		else return "<a><span class='glyphicon glyphicon-ok' title='Approve'></span></a>&ensp;<a><span class='glyphicon glyphicon-remove' title='Dismiss'></span></a>";
	            	}
	        	}
			],
	    	"order" : [[3, "asc"]],
	    	"processing": true,
	    	"filter": false,
	    	"info": false,
	    	"paginate": false,
	    	"autoWidth": false,
	    	"language": 
	    	{
		        "emptyTable": "There are no current candidate triggers."
		    },
		    "rowCallback": function( row, data, index ) 
		    {
		    	if( data.status == "valid" ) {
		    		$(row).attr("style", "background-color: rgba(0,128,0,0.5)");
		    	} else if ( data.status)

		    	switch ( data.status ) {
		    		case "valid": $(row).attr("style", "background-color: rgba(0,128,0,0.5)");
		    					break;
		    		case "partial": $(row).attr("style", "background-color: rgba(255,165,0,0.5)"); break;
		    		case "invalid": $(row).attr("style", "background-color: rgba(255,0,0,0.5)");
		    					break;
		    	}
	            // console.log(data.status);
		  	}
	    });
	}
	
	$("#loading").modal("hide");
}

function tableCSSifEmpty( table, data ) 
{
	if ($("#" + table).dataTable().fnSettings().aoData.length == 0)
    {
    	if( table == "candidate" && data == null ) {
    		reposition("#errorProcessingModal");
		    $("#errorProcessingModal").modal("show");
    	}

        $("#" + table + " .dataTables_empty").css({"font-size": "20px", "padding": "30px 15px 10px 15px", "width": "600px"})
    }
}

function reloadTable(table, data, tbl_name) {
	table.clear();
    table.rows.add(data).draw();

    ["latest", "extended", "overdue", "candidate"].forEach(function (table) { tableCSSifEmpty(table, data); });
	if( tbl_name == "latest" ) {
    	data.forEach(function (x) {
			checkIfAlreadySent(x.latest_release_id, x.event_id, x.data_timestamp);
		});
    }
}

/********** END OF TABLE BUILDING **********/

/*****************************************
 * 
 * 		GOOGLE MAP INITIALIZATION
 * 
******************************************/

function initialize_map(markers) 
{
	let latlng = new google.maps.LatLng(12.867031,121.766552);

	let mapOptions = {
		center: latlng,
		zoom: 5
	};

	let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	let markerList = markers;

	if ( markerList != null ) 
	{
		for (let i = 0; i < markerList.length; i++) {
			latlng = new google.maps.LatLng(markerList[i]['lat'],markerList[i]['lon']);

			let marker = new google.maps.Marker({
	  			position: latlng,
	  			map: map,
	  			title: markerList[i]['name'].toUpperCase() + '\n'
	      			+ markerList[i]['address']
				});

			let siteName = markerList[i]['name'].toUpperCase();
			let mark = marker;
			google.maps.event.addListener(mark, 'click', (function(name) {
		        return function(){
		            alert(name);
		        };
			})(siteName));
		}
	}

	setElementHeight();
}

/********** END OF MAP INITIALIZATION **********/


/*****************************************
 * 
 * 		AUTOMATED EWI SITE RELEASE
 * 
******************************************/

function showInvalidTriggersOnModal (row) {

	$(".invalid_area").empty();
	let invalid_list = row.invalid_list;

	if( typeof invalid_list != "undefined") {
		let status = row.status;
		// console.log(invalid_list, "AKO INVALID LIST");

		$.each( invalid_list, function (count, trigger) {
			let template = $("#invalid_template").html();
			template = $(template).show();
			let x = "#" + trigger.source + "_area";
			$(x + " .invalid_area").append(template);
			$(x + " .invalid_area" + " #timestamp").text( moment(trigger.timestamp).format("MMM. D, YYYY, H:mm") );
			$(x + " .invalid_area" + " #staff").text( trigger.iomp );
			let remarks = trigger.remarks == "" ? "---" :  trigger.remarks;
			$(x + " .invalid_area" + " #remarks").text( remarks );
		});
	}
}

function showModalTriggers(row, latest) 
{
	let retrigger_list = typeof row.retriggerTS !== "undefined" ? row.retriggerTS : null;
	let qualified_retriggers = [];

	// Get triggers ONLY if they are not yet saved
	// candidate trigger > latest trigger
	if( retrigger_list != null ) {
		retrigger_list.forEach(function (x) {
			if( moment(x.timestamp).isAfter(latest) || latest == null )
			{
				qualified_retriggers.push(x);
			}
		});
	}

	// Disable/Hide all trigger fields on modal form
	["r1","e1","l2","l3","L2","L3","d1","e1"].forEach(function (x) {
		let y = lookup[x];
		$("#" + y[0] + "_area").hide();
		$("#trigger_" + y[1]).val("").prop({readonly:false, disabled:true});
		$("#trigger_" + y[1] + "_info").val("").prop("disabled", true);
		$(".trigger_switch").prop({disabled: true, checked:false});
		if( x == "d1" ) $(".od_group, #reason").prop("disabled", true);
		else if( x == "e1" ) $("#magnitude, #latitude, #longitude").val("").prop("disabled", true);
	});

	let retrigger_letters_arr = [];

	if( retrigger_list != null ) {
		qualified_retriggers.forEach(function (x) {
			let y = lookup[x.retrigger];
			$("#" + y[0] + "_area").show();
			$("#trigger_" + y[1]).val(x.timestamp).prop({readonly:true, disabled:false});
			let info = y[2] == "E" ? row.tech_info[y[0] + "_tech"]["info"] : row.tech_info[y[0] + "_tech"];
			$("#trigger_" + y[1] + "_info").val(info).prop("disabled", false);

			$(".trigger_switch[value=" + y[0] + "]").prop("disabled", false);

			if( y[2] == "D" ) $(".od_group, #reason").prop("disabled", false);
			else if( y[2] == "E" ) {
				let x = row.tech_info[y[1] + "_tech"];
				$("#magnitude").val(x.magnitude).prop("disabled", false);
				$("#longitude").val(x.longitude).prop("disabled", false);
				$("#latitude").val(x.latitude).prop("disabled", false);
			}
			retrigger_letters_arr.push(y[2]);
		});
	}

	return retrigger_letters_arr;
}

function toggleTriggerOnRelease(trigger_type, alert, merged_index) {
	
	let invalid_list = alert.invalid_list;
	let orig_public_alert = alert.internal_alert.slice(0, 2);
	let orig_internal_alert = alert.internal_alert.slice(3);

	if ( alert.status != "valid" ) {
		let alert = $("#internal_alert_level").val();
		let public_alert = alert.slice(0, 2);
		let internal_alert = alert.slice(3);

		if( $(".trigger_switch[value=" + trigger_type + "]").prop("checked") ) {
			invalid_list.forEach( function (trigger) {
				if( trigger.source == trigger_type ) {
					if (trigger_type == "rain") {
						if (orig_internal_alert.indexOf('R') == -1) 
							internal_alert += "R";
					} else {
						public_alert = trigger.alert;
						let x = trigger.alert == 'A3' ? "S" : "s";
						if (orig_internal_alert.indexOf(x) == -1) 
							internal_alert += x;
					}
				}
			});
		} else {
			// Remove trigger letter on internal alert level
			invalid_list.forEach( function (trigger) {
				if( trigger.source == trigger_type ) {
					if (trigger_type == "rain") {
						if (orig_internal_alert.indexOf('R') == -1) 
							internal_alert = internal_alert.replace(/R/g, "");
					} else {
						x = trigger.alert == 'A3' ? "S" : "s";
						if (orig_internal_alert.indexOf(x) == -1) 
							internal_alert = internal_alert.replace(x, "");
						public_alert = orig_public_alert;
					}
				}
			});
		}

		let alert_list = internal_alert.split(/([A-z]0?)/g);
		let ordered_internal = orderInternalAlertTriggers(alert_list);
		$("#internal_alert_level").val(public_alert + "-" + ordered_internal);
	}
}

function orderInternalAlertTriggers( internal ) {
	internal.sort( function( a, b ) 
    {
        let arr = { "S":5, "s":5, "s0":5, "G":4, "g":4, "g0":4, "R":3, "R0":3, "E":2, "D":1 };
        let x = arr[a], y = arr[b];
        if( x>y ) return -1; else return 1;
    });

    return internal.join("");
}

function getSites() {
	$.get("../monitoring/getSites", function(data) {
        data.forEach(function(x) {
        	sitesList[x.name] = x.id;
        });
    }, "json");
}

function checkIfAlreadySent(release_id, event_id, timestamp) 
{
	timestamp = moment(timestamp).add(30, "minutes").format("YYYY-MM-DD HH:mm:ss")
	$.get( "/../../accomplishment/getNarrativesForShift", 
    { event_id: event_id, start: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"), end: moment(timestamp).add(4, "hours").format("YYYY-MM-DD HH:mm:ss") } )
    .done(function (data) {
        let temp = JSON.parse(data);
        let isBulletinSent = false;
        let isEWISent = false;
        
        let hour_min = moment(timestamp).format("hh:mm A");
        if(/12:\d{2} PM/g.test(hour_min)) hour_min = hour_min.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(hour_min)) hour_min = hour_min.replace("AM", "MN");
        
        for( let i = 0; i < temp.length; i++) 
        {
            if(temp[i].narrative.includes("Bulletin") && temp[i].narrative.includes(hour_min) || temp[i].narrative.includes("onset"))
            {
            	isBulletinSent = true;
                $("#" + release_id).css("color", "red").attr("data-sent", 1);
            }

            if(temp[i].narrative.includes("SMS") && temp[i].narrative.includes(hour_min) || temp[i].narrative.includes("onset"))
            {
            	isEWISent = true;
                $("#" + release_id + "_sms").css("color", "red").attr("data-sent", 1);
            }
        }
    });
}
