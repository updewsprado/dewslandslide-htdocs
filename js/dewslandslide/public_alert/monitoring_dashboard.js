
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Monitoring Dashboard
 *	[host]/home or [host]/dashboard
 *	
****/

let realtime_cache = [], ongoing = [], candidate_triggers = [];
let isTableInitialized = false;
let latest_table = null, extended_table = null, overdue_table = null, candidate_table =null;
let modalForm = null, entry = {};
let sitesList = [];

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

                text = $("#info").html();
                subject = $("#subject").text();
                filename = $("#filename").text();
                sendMail(text, subject, filename, recipients);
            }
        })
    });
 

	/********** END OF AUTOMATED PDF SENDING **********/ 

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
		let site = row.site;

		$("#timestamp_entry").val(row.timestamp);
		$("#internal_alert_level").val(row.internal_alert);
		$("#site").val(sitesList[row.site]);
		$("#comments").val("");

		let merged_arr = jQuery.merge(jQuery.merge([], ongoing.latest), ongoing.overdue);
		let index = merged_arr.map(x => x.name).indexOf(site);
		let previous = null;

		entry.rain_alert = row.rain_alert;

		if(index > -1)
		{
			previous = merged_arr[index];
			entry.trigger_list = showModalTriggers(row, previous.trigger_timestamp);
			entry.previous_validity = previous.validity;

			// Put internal alert checker here if there's invalid trigger
			if( row.internal_alert == "A0" )
			{
				if( moment(previous.validity).isAfter( moment(row.timestamp).add(30, 'minutes') ) )
					entry.status = "invalid";
				else entry.status = "extended";
			}
			else entry.status = "on-going";
			entry.event_id = previous.event_id;

			let hour = moment(row.timestamp).hour();
			let minute = moment(row.timestamp).minutes();
			if( hour % 4 == 3 && minute == 30 ) $("#release").prop("disabled", false);
			else $("#release").prop("disabled", true);
		}
		else
		{
			//console.log("NEW EVENT");
			let index_ex = ongoing.extended.map(x => x.name).indexOf(site);
			if(index_ex > -1) entry.previous_event_id = ongoing.extended[index_ex].event_id;

			entry.trigger_list = showModalTriggers(row, null);
			entry.status = "new";

			$("#release").prop("disabled", false);
		}

		$("#releaseModal").modal({ backdrop: 'static', keyboard: false, show: true});	
		//console.log(entry);
	});

	$("#candidate tbody").on( "click", 'tr .glyphicon-info-sign', function(x) 
	{
		reposition("#manualInputModal")
		$("#manualInputModal").modal("show");
	});

	function showModalTriggers(row, latest) 
	{
		let list = row.retriggerTS;
		let arr = [];
		list.forEach(function (x) {
			if( moment(x.timestamp).isAfter(latest) || latest == null )
			{
				arr.push(x);
			}
		});

		["r1","e1","l2","l3","L2","L3","d1","e1"].forEach(function (x) {
			let y = lookup[x];
			$("#" + y[0] + "_area").hide();
			$("#trigger_" + y[1]).val("").prop({readonly:false, disabled:true});
			$("#trigger_" + y[1] + "_info").val("").prop("disabled", true);
			if( x == "d1" ) $(".od_group, #reason").prop("disabled", true);
			else if( x == "e1" ) $("#magnitude, #latitude, #longitude").val("").prop("disabled", true);
		});

		let retriggers = [];
		arr.forEach(function (x) {
			let y = lookup[x.retrigger];
			$("#" + y[0] + "_area").show();
			$("#trigger_" + y[1]).val(x.timestamp).prop({readonly:true, disabled:false});
			let info = y[2] == "E" ? row.tech_info[y[0] + "_tech"]["tech_info"] : row.tech_info[y[0] + "_tech"];
			$("#trigger_" + y[1] + "_info").val(info).prop("disabled", false);
			if( y[2] == "D" ) $(".od_group, #reason").prop("disabled", false);
			else if( y[2] == "E" ) {
				let x = row.tech_info[y[1] + "_tech"];
				$("#magnitude").val(x.magnitude).prop("disabled", false);
				$("#longitude").val(x.longitude).prop("disabled", false);
				$("#latitude").val(x.latitude).prop("disabled", false);
			}
			retriggers.push(y[2]);
		});

		return retriggers;
	}

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
	        temp.trigger_list = entry.trigger_list.length == 0 ? null : entry.trigger_list;
	        temp.reporter_1 = $("#reporter_1").attr("value-id");

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
	        		else if ( entry.rain_alert == "rx" ) temp.extend_rain_x = true;
	        	}
	        }

	        console.log(temp);
	     	$.ajax({
	            url: "../pubrelease/insert",
	            type: "POST",
	            data : temp,
	            success: function(result, textStatus, jqXHR)
	            {
	                console.log(result);

	                doSend("getOnGoingAndExtended");

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


/*****************************************
 * 
 * 		BUILD THREE TABLES AVAILABLE
 * 
******************************************/

function buildTable( latest, extended, overdue, candidate ) 
{
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
	            		return full.release_time;
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

	latest_table = buildLatestAndOverdue("latest", latest);
	overdue_table = buildLatestAndOverdue("overdue", overdue);
	overdue_table.column(6).visible(false);

    extended_table = $('#extended').DataTable({
    	"data": extended,
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
            		return "<a onclick='sendViaAlertMonitor("+JSON.stringify(full)+")'><span id='" + full.latest_release_id + "_sms' class='glyphicon glyphicon-phone'></span></a>&ensp;&ensp;<a><span class='glyphicon glyphicon-envelope' id='" + full.latest_release_id + "' data-sent='0'></span></a>";
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

    candidate_table = $('#candidate').DataTable({
    	"data": candidate,
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
 					else if( full.latest_trigger_timestamp == "manual" ) return "---";
            		else return moment(full.latest_trigger_timestamp).format("DD MMMM YYYY HH:mm");
            	},
            	"name": "latest_trigger_timestamp"
        	},
        	{ 
            	"data": "trigger",
            	"render": function (data, type, full) {
            		if( full.trigger == "No new triggers" ) return full.trigger;
            		else if( full.trigger == "manual" ) return "---";
            		return full.trigger.toUpperCase();
            	},
            	"name": "trigger",
	        },
            { 
            	"data": "validity",
            	"render": function (data, type, full) {
            		if ( full.validity == "end" ) return "END OF VALIDITY"
            		else if ( full.validity == "manual" ) return "---";
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
	   //  "rowCallback": function( row, data, index ) 
	   //  {
 //            switch(data.day)
 //            {
 //            	case 1: $(row).addClass("day-one"); break;
 //                case 2: $(row).addClass("day-two"); break;
 //                case 3: $(row).addClass("day-three"); break;
 //            }
	  	// }
    });

    ["latest", "extended", "overdue", "candidate"].forEach(function (data) { tableCSSifEmpty(data); });

    isTableInitialized = true;
    $("#loading").modal("hide");
}

function tableCSSifEmpty( table ) 
{
	if ($("#" + table).dataTable().fnSettings().aoData.length == 0)
    {
    	if( table == "candidate" && candidate == null ) {
    		reposition("#errorModal");
		    $("#errorModal").modal("show");
    	}

        $("#" + table + " .dataTables_empty").css({"font-size": "20px", "padding": "30px 15px 10px 15px", "width": "600px"})
    }
}

/********** END OF TABLE BUILDING **********/


function reloadTable(table, data) {
	table.clear();
    table.rows.add(data).draw();

    ["latest", "extended", "overdue", "candidate"].forEach(function (table) { tableCSSifEmpty(table); });
}

/*****************************************
 * 
 * 		GOOGLE MAP INITIALIZATION
 * 
******************************************/

function initialize_map() 
{
		let latlng = new google.maps.LatLng(12.867031,121.766552);

		let mapOptions = {
		center: latlng,
		zoom: 5
	};

	let map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	let markerList = ongoing.markers;

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

function getRealtimeAlerts(data)
{
	let json = jQuery.extend(true, {}, data);	
	if(typeof json.is_bad != 'undefined')
	{
		console.log(json.is_bad);
	}
	else {
		let cache = json.alert_json.pop();
		ongoing = jQuery.extend(true, {}, json.ongoing);

		if( realtime_cache.length == 0 || ( typeof realtime_cache.alerts !== 'undefined' && realtime_cache.alerts[0].timestamp !== cache.alerts[0].timestamp))
		{	
			realtime_cache.no_alerts = cache.alerts.filter(function (x) {
				return x.alert == "A0";
			});

			// Get only alerts with alerts
			realtime_cache.alerts = cache.alerts.filter(function (x) {
				return x.alert != "A0";
			});


			realtime_cache.invalids = cache.invalids.slice(0);
		}
		else {
			console.log("No new data.");
		}
	}
}

function getOnGoingAndExtended(data) {
	ongoing = jQuery.extend(true, {}, data.ongoing);

	try {
		candidate = checkCandidateTriggers(realtime_cache);
	} catch (err) {
		console.log(err);
		candidate = null;
	}

	if(isTableInitialized) 
	{
		reloadTable(latest_table, ongoing.latest);
		reloadTable(extended_table, ongoing.extended);
		reloadTable(overdue_table, ongoing.overdue);
		reloadTable(candidate_table, candidate);
	}
	else buildTable(ongoing.latest, ongoing.extended, ongoing.overdue, candidate);

	// Update icon on dashboard if EWI and Bulletin already sent
	ongoing.latest.forEach(function (x) {
		checkIfAlreadySent(x.latest_release_id, x.event_id, x.data_timestamp);
	});

	initialize_map();
}

function checkCandidateTriggers(cache) {
	let alerts = cache.alerts,
		invalids = cache.invalids,
		no_alerts = cache.no_alerts,
		final = [];

	// Get all the latest and overdue releases on site
	let merged_arr = jQuery.merge(jQuery.merge([], ongoing.latest), ongoing.overdue);

	alerts.forEach( function (alert) {

		let retriggers = alert.retriggerTS;

		// Check sites if it is in invalid list 
		// yet have legitimate alerts
		function getAllInvalids(arr, val) {
		    var site_invalids = [], i;
		    for(i = 0; i < arr.length; i++)
		        if (arr[i].site === val)
		            site_invalids.push(arr[i]);
		    site_invalids.sort(function(a,b) {return (a.alert > b.alert) ? -1 : ((b.alert > a.alert) ? 1 : 0);} );
		    return site_invalids;
		}

		let site_invalids = getAllInvalids(invalids, alert.site);

		let isInvalid = false;
		let isValidButNeedsManual = false;
		let merged_arr_sites = merged_arr.map(x => x.name);
		site_invalids.forEach(function (invalid)
		{
			//console.log("INVALID", invalid);

			// Get alerts sources from the alerts array and invalids array
			let invalid_source = invalid.source;
			let alerts_source = alert.source.split(",");

			alerts_source.forEach(function (source) {
				if (source == invalid_source)
				{
					function getRetriggerIndex (trigger) {
						let temp = retriggers.map(x => x.retrigger).indexOf(trigger);
						return temp;
					};
					
					// Check if alert exists on database
					// Mark isInvalid TRUE to prevent being pushed to final
					// if alert is really invalid and has no active alert
					if( merged_arr_sites.indexOf(invalid.site) == -1 )
						{ isInvalid = true; }
					else if (source == "sensor") {
						let isL2Available = retriggers.map(x => x.retrigger).indexOf("L2");
						if(isL2Available > -1 && invalid.alert == "A3") {
							alert.alert =  "A2";
							alert.internal_alert = alert.internal_alert.replace(/S0*/g, "s").replace("A3", "A2");
							alert.retriggerTS.splice(getRetriggerIndex("L3"), 1);
						} else {
							alert.alert =  "A1";
							alert.internal_alert = alert.internal_alert.replace(/[sS]0*/g, "");

							let hasSensorData = alert.sensor_alert.filter( x => x.alert != "ND" );
							if ( hasSensorData == 0 && alert.ground_alert == "g0" ) alert.internal_alert = alert.internal_alert.replace(/A[1-3]/g, "ND");
							else alert.internal_alert = alert.internal_alert.replace(/A[1-3]/g, "A1");
							
							alert.retriggerTS.splice(getRetriggerIndex("L2"), 1);
						}
					}
					else if(source == "rain")
					{
						// Check if alert exists on database already
						let index_on_database = merged_arr_sites.indexOf(invalid.site);
						if( index_on_database > -1 
							&& merged_arr[index_on_database].internal_alert_level.includes("R") == true )
						{
							// If already exist and it has rain that became invalid,
							// recommend manual input
							isValidButNeedsManual = true;
						}
						else {
							// Rain trigger is plain invalid
							alert.internal_alert = alert.internal_alert.replace(/R0*/g, "");
							alert.retriggerTS.splice(getRetriggerIndex("r1"), 1);
						}
					}
				}
			});
		});	
		
		let forUpdating = true;
		retriggers = alert.retriggerTS;

		if( !isValidButNeedsManual )
		{
			let maxDate = moment( Math.max.apply(null, retriggers.map(x => new Date(x.timestamp)))).format("YYYY-MM-DD HH:mm:ss");
			let max = null;
			for (let i = 0; i < retriggers.length; i++) {
				if(retriggers[i].timestamp === maxDate) { max = retriggers[i]; break; }
			}
			//console.log(max, retriggers);
			alert.latest_trigger_timestamp = max.timestamp;
			alert.trigger = max.retrigger;
		}

		// Check if alert entry is already updated on latest/overdue table
		for (let i = 0; i < merged_arr.length; i++) 
		{
			//console.log(merged_arr[i]);
			if( merged_arr[i].name == alert.site )
			{
				// Tag the site on merged_arr as cleared
				// else if not, it is candidate for lowering already
				merged_arr[i].checked = true;

				if( moment(merged_arr[i].data_timestamp).isSame(alert.timestamp) )
				{
					forUpdating = false; break;
				}

				if ( moment(merged_arr[i].trigger_timestamp).isSame(alert.latest_trigger_timestamp) )
				{
					alert.latest_trigger_timestamp = "end";
					alert.trigger = "No new triggers";
				}

				if(isValidButNeedsManual) 
				{
					alert.latest_trigger_timestamp = "manual";
					alert.trigger = "manual";
					alert.validity = "manual";
					alert.isManual = true;
				}
			}
		} 

		if(forUpdating && !isInvalid) final.push(alert);

	});

	// Tag a site as candidate for lowering if it has alert
	// on site but already A0 on json
	merged_arr.forEach(function (a) {
		if ( typeof a.checked == "undefined" )
		{
			let index = no_alerts.map( x => x.site ).indexOf(a.name);
			let x = no_alerts[index];
			//console.log(a);

			x.latest_trigger_timestamp = "end";
			x.trigger = "No new triggers";
			x.validity = "end";
			final.push(x);
		}
	});

	return final;
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
	$.get( "/../../accomplishment/getNarrativesForShift", 
    { event_id: event_id, start: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"), end: moment(timestamp).add(4, "hours").format("YYYY-MM-DD HH:mm:ss") } )
    .done(function (data) {
        let temp = JSON.parse(data);
        let isBulletinSent = false;
        let isEWISent = false;
        for( let i = 0; i < temp.length; i++) {
            if(temp[i].narrative.includes("Bulletin") && temp[i].narrative.includes(moment(timestamp).format("hh:mm A")))
            {
            	isBulletinSent = true;
                $("#" + release_id).css("color", "red").attr("data-sent", 1);
            }

            if(temp[i].narrative.includes("SMS") && temp[i].narrative.includes(moment(timestamp).format("hh:mm A")))
            {
            	isEWISent = true;
                $("#" + release_id + "_sms").css("color", "red").attr("data-sent", 1);
            }
        }
    });
}