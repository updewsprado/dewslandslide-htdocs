
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Monitoring Dashboard
 *	[host]/home or [host]/dashboard
 *	
****/

$(document).ready( function() {
	
	let setElementHeight = function () {
	    let col_height = $("#column_2").height();
	    $('#map-canvas').css('min-height', col_height-20);
	};

	$(window).on("resize", function () {
	    setElementHeight();
	}).resize();

	$(window).on("resize", function () {
	    $('#page-wrapper').css('min-height', ($(window).height()));
	}).resize();


	/*****************************************
	 * 
	 * 		BUILD THREE TABLES AVAILABLE
	 * 
	******************************************/

	let isTableInitialized = false;
	let latest_table = null, extended_table = null, overdue_table = null, candidate_table =null;

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
		            		return "<a onclick='sendViaAlertMonitor("+JSON.stringify(full)+")'><span class='glyphicon glyphicon-phone'></span></a> &ensp; <a><span class='glyphicon glyphicon-envelope' id='" + full.latest_release_id + "'></span></a>";
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
	            		return "<b><a href='../monitoring_events/" + full.event_id + "'>" + full.name.toUpperCase() + "</a></b>";
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
	            		return "<a onclick='sendViaAlertMonitor("+JSON.stringify(full)+")'><span class='glyphicon glyphicon-phone'></span></a>&ensp;&ensp;<a><span class='glyphicon glyphicon-envelope' id='" + full.latest_release_id + "'></span></a>";
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
	            	case 1: $(row).addClass("day-one"); break;
	                case 2: $(row).addClass("day-two"); break;
	                case 3: $(row).addClass("day-three"); break;
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
	 					if( full.latest_trigger_timestamp == null )	return "No new triggers";
	            		else return moment(full.latest_trigger_timestamp).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "latest_trigger_timestamp"
	        	},
	        	{ 
	            	"data": "trigger",
	            	"render": function (data, type, full) {
	            		if( full.trigger == "No new triggers" ) return full.trigger;
	            		return full.trigger.toUpperCase();
	            	},
	            	"name": "trigger",
		        },
	            { 
	            	"data": "validity",
	            	"render": function (data, type, full) {
	            		if ( full.validity == null ) return "END OF VALIDITY"
	            		else return moment(full.validity).format("DD MMMM YYYY HH:mm");
	            	},
	            	"name": "validity"
	        	},
	        	{
	        		"render": function (data, type, full) {
	            		return "<a><span class='glyphicon glyphicon-ok' title='Approve'></span></a>&ensp;<a><span class='glyphicon glyphicon-remove' title='Dismiss'></span></a>";
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
	}

	function tableCSSifEmpty( table ) 
	{
		if ($("#" + table).dataTable().fnSettings().aoData.length == 0)
	    {
	        $("#" + table + " .dataTables_empty").css({"font-size": "20px", "padding": "20px", "width": "600px"})
	        $("#" + table + " thead").remove();
	    }
	}

	/********** END OF TABLE BUILDING **********/


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
	 * 		AUTOMATED PDF SENDING
	 * 
	******************************************/

	let id = null, text = null, filename = null, subject = null;

	reposition("#bulletinLoadingModal");
	reposition("#resultModal");

	$("#latest, #extended").on( "click", 'tbody tr .glyphicon-envelope', function(x) {
		id = $(this).prop('id');
		loadBulletin(id);
	});

	$("#send").click(function () {
		$('#bulletinModal').modal('hide');
		$.when(renderPDF(id))
        .then(function (x) {
            if( x == "Success.")
            {
            	$('#bulletinLoadingModal .progress-bar').text('Sending EWI and Bulletin...');
                text = $("#info").html();
                subject = $("#subject").text();
                filename = $("#filename").text();
                sendMail(text, subject, filename);
            }
        });
	});

	/********** END OF AUTOMATED PDF SENDING **********/ 


	/*****************************************
	 * 
	 * 		AUTOMATED EWI SITE RELEASE
	 * 
	******************************************/
	reposition("#releaseModal");

	let realtime_cache = [],
		ongoing = [], candidate_triggers = [];

	function getRealtimeAlerts() {
		return $.ajax ({
		    url: "../temp/data/PublicAlert.json",
		    type: "GET",
		    dataType: "json",
		    cache: false
		})
		.then(function (data) {
			if( realtime_cache.length == 0 || ( typeof realtime_cache.alerts !== 'undefined' && realtime_cache.alerts[0].timestamp !== data[0].alerts[0].timestamp))
			{
				realtime_cache = data.slice(0).pop();
				
				// Save sites with no alerts
				realtime_cache.no_alerts = realtime_cache.alerts.filter(function (x) {
					return x.alert == "A0";
				});

				// Get only alerts with alerts
				realtime_cache.alerts = realtime_cache.alerts.filter(function (x) {
					return x.alert != "A0";
				});

				return realtime_cache;
			}
			else {
				return $.Deferred().reject("No new data.").promise();
			}
		});
	}

	function getOnGoingAndExtended() {
		return $.ajax ({
		    url: "../monitoring/getOnGoingAndExtended",
		    type: "GET",
		    dataType: "json",
		    cache: false
		})
		.done(function (data) {
			ongoing = jQuery.extend(true, {}, data);
			return data;
		})
		.fail(function (x) {
			console.log(x.responseText);
		});
	};

	function checkCandidateTriggers(cache) {
		let alerts = cache.alerts,
			invalids = cache.invalids,
			no_alerts = cache.no_alerts,
			final = [];

		// Get all the latest and overdue releases on site
		let merged_arr = jQuery.merge(jQuery.merge([], ongoing.latest), ongoing.overdue);

		alerts.forEach( function (x) {
			let index = invalids.map( y => y.site ).indexOf(x.site);
			if(index > -1)
			{
				console.log("INVALID", x.site);
				// Check sites if it is in invalid list yet
				// have legitimate alerts
			}
			else 
			{	
				let obj = x.retriggerTS;
				let maxDate = moment( Math.max.apply(null, obj.map(x => new Date(x.timestamp)))).format("YYYY-MM-DD HH:mm:ss");
				let max = null;
				for (let i = 0; i < obj.length; i++) {
					if(obj[i].timestamp === maxDate) { max = obj[i]; break; }
				}
				//console.log(max, obj);
				x.latest_trigger_timestamp = max.timestamp;
				x.trigger = max.retrigger;

				// Check if alert entry is already updated on latest/overdue table
				let k = true;
				for (let i = 0; i < merged_arr.length; i++) 
				{
					//console.log(merged_arr[i]);
					if( merged_arr[i].name == x.site )
					{
						// Tag the site on merged_arr as cleared
						// else if not, it is candidate for lowering already
						merged_arr[i].checked = true;

						if( moment(merged_arr[i].data_timestamp).isSame(x.timestamp) )
						{
							k = false; break;
						}

						if ( moment(merged_arr[i].trigger_timestamp).isSame(x.latest_trigger_timestamp) )
						{
							x.latest_trigger_timestamp = null;
							x.trigger = "No new triggers";
						}
					}
					
				}

				if(k) final.push(x);
			}
		});

		merged_arr.forEach(function (a) {
			if ( typeof a.checked == "undefined" )
			{
				let index = no_alerts.map( x => x.site ).indexOf(a.name);
				let x = no_alerts[index];
				console.log(x);

				x.latest_trigger_timestamp = null;
				x.trigger = "No new triggers";
				x.validity = null;
				final.push(x);
			}
		});

		return final;
	}

	function reloadTable(table, data) {
		table.clear();
	    table.rows.add(data).draw();

	    ["latest", "extended", "overdue", "candidate"].forEach(function (data) { tableCSSifEmpty(data); });
	}

	let modalForm = null, entry = {};

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

		let merged_arr = jQuery.merge(jQuery.merge([], ongoing.latest), ongoing.overdue);
		let index = merged_arr.map(x => x.name).indexOf(site);
		let previous = null;

		if(index > -1)
		{
			previous = merged_arr[index];
			entry.trigger_list = showModalTriggers(row.retriggerTS, previous.trigger_timestamp);
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
			console.log("NEW EVENT");

			let index_ex = ongoing.extended.map(x => x.name).indexOf(site);
			if(index_ex > -1) entry.previous_event_id = ongoing.extended[index_ex].event_id;

			entry.trigger_list = showModalTriggers(row.retriggerTS, null);
			
			// Put internal alert checker here if there's invalid trigger
			entry.status = "new";

			$("#release").prop("disabled", false);
		}

		$("#timestamp_entry").val(row.timestamp);
		$("#internal_alert_level").val(row.internal_alert);
		$("#site option:contains("+ row.site.toUpperCase() +")").attr('selected', true);
		$("#comments").val("");
		$("#releaseModal").modal("show");
		
		console.log(entry);

	});

	let lookup = { "r1":["rain","rain","R"], "r2":["rain","rain","R"], "l2":["ground","ground_1","g"], "l3":["ground","ground_2","G"], "L2":["sensor","sensor_1","s"], "L3":["sensor","sensor_2","S"], "e1":["eq","eq","E"] };

	function showModalTriggers(list, latest) 
	{
		let arr = [];
		list.forEach(function (x) {
			if( moment(x.timestamp).isAfter(latest) || latest == null )
			{
				arr.push(x);
			}
		});

		["r1","e1","l2","l3","L2","L3"].forEach(function (x) {
			let y = lookup[x];
			$("#" + y[0] + "_area").hide();
			$("#trigger_" + y[1]).val("").prop({readonly:false, disabled:true});
			$("#trigger_" + y[1] + "_info").val("").prop("disabled", true);
		});

		let retriggers = [];
		arr.forEach(function (x) {
			let y = lookup[x.retrigger];
			$("#" + y[0] + "_area").show();
			$("#trigger_" + y[1]).val(x.timestamp).prop({readonly:true, disabled:false});
			$("#trigger_" + y[1] + "_info").val("").prop("disabled", false);
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

	modalForm = $("#modalForm").validate(
	{
	    debug: true,
	    rules: {
	    	site: "required",
	        timestamp_entry: "required",
	        release_time: "required",
	        trigger_rain: "required",
	        trigger_eq: "required",
	        trigger_ground_1: "required",
	        trigger_ground_2: "required",
	        trigger_sensor_1: "required",
	       	trigger_sensor_2: "required",
	        trigger_rain_info: "required",
	        trigger_eq_info: "required",
	        trigger_ground_1_info: "required",
	        trigger_ground_2_info: "required",
	        trigger_sensor_1_info: "required",
	        trigger_sensor_2_info: "required",
	        reporter_2: "required",
	        comments: {
	        	"isInvalid": true
	        }
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
	    	let data = $( "#modalForm" ).serializeArray();
	        let temp = {};
	        data.forEach(function (value) { temp[value.name] = value.value == "" ? null : value.value; });
	        let aX = temp.internal_alert_level.slice(0,2);
	        temp.public_alert_level = aX == "ND" ? "A1" : aX;
	        temp.status = entry.status;
	        temp.trigger_list = entry.trigger_list.length == 0 ? null : entry.trigger_list;
	        temp.reporter_1 = "<?php echo $user_id; ?>";

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

	        	if( temp.trigger_list == null && moment(entry.previous_validity).isSame( moment(temp.timestamp_entry).add(30, 'minutes') ) && temp.trigger_list == null && extend )
	        	{
	        		temp.extend_ND = true;
	        	}
	        }

	        console.log(temp);
	     	$.ajax({
	            url: "../pubrelease/insert",
	            type: "POST",
	            data : temp,
	            success: function(result, textStatus, jqXHR)
	            {
	                $("#releaseModal").modal('hide');
	                console.log(result);

	                let f2 = getOnGoingAndExtended();
	                $.when(f2)
					.done(function (a) 
					{
						candidate = checkCandidateTriggers(realtime_cache);

						reloadTable(latest_table, ongoing.latest);
						reloadTable(extended_table, ongoing.extended);
						reloadTable(overdue_table, ongoing.overdue);
						reloadTable(candidate_table, candidate);

						initialize_map();
					});

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

	// Contains last release id for refreshing test
	let last_id = null;

	function getLastRelease() {
		return $.get( "../monitoring/getLastRelease", function( data ) {}, "json");
	}

	function main(toRefresh)
	{
		getLastRelease().done( function (x) {
			last_id = x.release_id;
		});

		let f1 = getRealtimeAlerts(),
			f2 = getOnGoingAndExtended();

		if( toRefresh )
		{
			$.when(f1)
			.then(
				function (a) {
					console.log("DONE", a);
					console.log("Cache", realtime_cache);
				},

				function (a) {
					console.log("FAIL", a);
				}
			);
		}
		
		setTimeout( () =>
		$.when(f2)
		.done(function (a) 
		{
			candidate = checkCandidateTriggers(realtime_cache);
			console.log("CANDI", candidate);

			if(isTableInitialized) 
			{
				reloadTable(latest_table, ongoing.latest);
				reloadTable(extended_table, ongoing.extended);
				reloadTable(overdue_table, ongoing.overdue);
				reloadTable(candidate_table, candidate);
			}
			else buildTable(ongoing.latest, ongoing.extended, ongoing.overdue, candidate);

			initialize_map();
		}), 1000);
	}

	main(true);
	setInterval(function () 
	{
		let second = moment().second();
		let minute = moment().minute();
		let toRefresh = false;

		getLastRelease().done(function (data) 
		{ 
			let x = data.release_id;
			if(x > last_id) {
				toRefresh = true;
				last_id = x;
			}
			//console.log(toRefresh);
		
			if( second == 0 || toRefresh )
			{
				if(toRefresh) console.log("TOREFRESH")
				switch(minute)
				{
					case 15: case 25:
					case 45: case 51:
					console.log("MINUTES", minute);
					main(toRefresh); break;
					default: if(toRefresh) main(toRefresh);
					console.log("Not yet time");
				} 
			}
		});

	}, 1000);

});