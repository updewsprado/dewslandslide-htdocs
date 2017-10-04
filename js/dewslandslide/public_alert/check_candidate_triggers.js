
fs = require('fs');
var moment = require('moment');

let json = null;
let alerts = null;

json = fs.readFileSync(process.argv[2]);
alerts = fs.readFileSync(process.argv[3]);

json = JSON.parse(json); // Note that PublicAlert.json is really wrapped in an array
alerts = JSON.parse(alerts);

let response = {};

try {
	response.candidate = checkCandidateTriggers(json[0], alerts);
} catch (err) {
	response.candidate = null;
	response.error = err;
	console.log(err);
}

console.log( JSON.stringify(response) );

function checkCandidateTriggers(cache, ongoing) {

	var all_alerts = cache.alerts,
		invalids = cache.invalids,
		alerts = [],
		no_alerts = [],
		final = [];

	// Separate all sites with A0 to higher ones
	all_alerts.forEach( function (x) {
		if( x.alert == "A0" ) no_alerts.push(x);
		else alerts.push(x);
	});

	// Get all the latest and overdue releases on site
	let merged_arr = ongoing.latest.concat(ongoing.overdue);
	let merged_arr_sites = merged_arr.map(x => x.name);

	alerts.forEach( function (alert) {

		let retriggers = alert.retriggerTS;
		alert.invalid_list = []; //initialize list of invalid triggers for dashboard showing

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

		alert.status = "valid"; // Set trigger/alert status to valid
		                        // if seen invalid, or partially invalid, overwrite it
		let site_invalids = getAllInvalids(invalids, alert.site);

		let isInvalid = false;
		let isValidButNeedsManual = false;
		site_invalids.forEach(function (invalid)
		{
			//console.log("INVALID", invalid);
			
			let alertIndexIfReleased = merged_arr_sites.indexOf(invalid.site);

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

					function setAsInvalid( trigger ) {
						let trig = {};
						for ( var key in trigger ) {
							trig[key] = trigger[key];
						}
						trig['invalid'] = true;
						return trig;
					}
					
					// Bind this invalid trigger and source on alert
					alert.invalid_list.push(invalid);

					// Check if alert exists on database
					// Mark isInvalid TRUE to prevent being pushed to final
					// if alert is really invalid and has no active alert
					if( alertIndexIfReleased == -1 && alerts_source.length == 1 )
					{ alert.status = "invalid"; /*isInvalid = true;*/ }
					else { alert.status = "partial"; }

					let trigger_letter = null;
					switch(source) {
						case "sensor": trigger_letter = "S"; break;
						case "rain": trigger_letter = "R"; break;
						default: trigger_letter = 'Z'; break;
					}

					let temp = new RegExp(trigger_letter, "i");
					if( alertIndexIfReleased == -1 || (alertIndexIfReleased > -1 && merged_arr[alertIndexIfReleased].internal_alert_level.search(temp) == -1) ) 
					{
						if (source == "sensor") {
							let isL2Available = retriggers.map(x => x.retrigger).indexOf("L2");
							if(isL2Available > -1 && invalid.alert == "A3") {
								alert.alert =  "A2";
								alert.internal_alert = alert.internal_alert.replace(/S0*/g, "s").replace("A3", "A2");
								
								// alert.retriggerTS.splice(getRetriggerIndex("L3"), 1);
								let index = getRetriggerIndex("L3");
								alert.retriggerTS[index] = setAsInvalid( alert.retriggerTS[index] );
							} else {
								alert.alert =  "A1";
								alert.internal_alert = alert.internal_alert.replace(/[sS]0*/g, "");

								let hasSensorData = alert.sensor_alert.filter( x => x.alert != "ND" );
								if ( hasSensorData == 0 && alert.ground_alert == "g0" ) alert.internal_alert = alert.internal_alert.replace(/A[1-3]/g, "ND");
								else alert.internal_alert = alert.internal_alert.replace(/A[1-3]/g, "A1");

								// alert.retriggerTS.splice(getRetriggerIndex("L2"), 1);
								let index = getRetriggerIndex("L2");
								alert.retriggerTS[index] = setAsInvalid( alert.retriggerTS[index] );
							}
						}
						else if(source == "rain")
						{
							// Check if alert exists on database already
							if( alertIndexIfReleased > -1 
								&& merged_arr[alertIndexIfReleased].internal_alert_level.includes("R") == true )
							{
								// If already exist and it has rain that became invalid,
								// recommend manual input
								isValidButNeedsManual = true;
							}
							else {
								// Rain trigger is plain invalid
								alert.internal_alert = alert.internal_alert.replace(/R0*/g, "");
								// alert.retriggerTS.splice(getRetriggerIndex("r1"), 1);
								let index = getRetriggerIndex("r1");
								alert.retriggerTS[index] = setAsInvalid( alert.retriggerTS[index] );
							}
						}
					}
					// }
				}
			});
		});	

		if(alert.internal_alert.length <= 3) { alert.status = "invalid"; /*isInvalid = true;*/ }
		
		let forUpdating = true;
		retriggers = alert.retriggerTS;

		if( !isValidButNeedsManual && !isInvalid )
		{
			// let maxDate = moment( Math.max.apply(null, retriggers.map(x => new Date(x.timestamp)))).format("YYYY-MM-DD HH:mm:ss");
			// let max = null;
			// for (let i = 0; i < retriggers.length; i++) {
			// 	if(retriggers[i].timestamp === maxDate) { max = retriggers[i]; break; }
			// }

			let max = null;
			for (let i = 0; i < retriggers.length; i++) {
				if( max == null || moment(max.timestamp).isSameOrAfter(retriggers[i].timestamp) )
				{
					if ( typeof retriggers[i].invalid != "undefined" ) {
						if ( alert.status == "valid" || alert.status == "partial" ) {
							break;
						}
					}

					max = retriggers[i];

					// if ( typeof retriggers[i].invalid == "undefined" ) {
					// 	max = retriggers[i];
					// } else {
					// 	if ( alert.status == "invalid" ) {
					// 		max = retriggers[i];
					// 	}
					// }
				}
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
				merged_arr[i].forRelease = true;

				if( moment(merged_arr[i].data_timestamp).isSame(alert.timestamp) )
				{
					forUpdating = false; break;
				}

				if ( moment(merged_arr[i].trigger_timestamp).isSameOrAfter(alert.latest_trigger_timestamp) )
				{

					// alert.status = "valid";
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

		//if(forUpdating && !isInvalid) final.push(alert);
		if(forUpdating) final.push(alert);

	});

	let no_alerts_map = no_alerts.map( x => x.site );

	// Tag a site as candidate for lowering if it has alert
	// on site but already A0 on json
	merged_arr.forEach(function (a) {
		if ( typeof a.forRelease == "undefined" )
		{
			let index = no_alerts_map.indexOf(a.name);
			let x = no_alerts[index];
			//console.log(a);
			
			// Check if alert for site is A0 and not yet released
			if( !moment(a.data_timestamp).isSame( x.timestamp ) && a.internal_alert_level != "A0" )
			{
				x.status = "valid";
				x.latest_trigger_timestamp = "end";
				x.trigger = "No new triggers";
				x.validity = "end";
				final.push(x);
			}
		}
	});

	// Prepare releases for extended sites if it is 11:30 for data timestamp
	let extended_sites = ongoing.extended;
	extended_sites.forEach( function (site) 
	{
		let index = no_alerts_map.indexOf(site.name);
		if( index > -1 ) 
		{
			let x = no_alerts[index];

			// Check if alert for site is not yet released and not Day 0
			if( !moment(site.data_timestamp).isSame( x.timestamp ) && site.day > 0 ) {
				// Check if JSON entry data timestamp is 11:30 for release
				if( moment(x.timestamp).hour() == "11" && moment(x.timestamp).minute() == "30"  ) {
					x.status = "extended";
					x.latest_trigger_timestamp = "extended";
					x.trigger = "extended";
					x.validity = "extended";
					final.push(x);
				}
			}
		}
	});

	return final;
}
