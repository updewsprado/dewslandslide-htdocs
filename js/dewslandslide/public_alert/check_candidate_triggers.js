
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
					if( merged_arr_sites.indexOf(invalid.site) == -1 && alerts_source.length == 1 )
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

		if(alert.internal_alert.length <= 3) isInvalid = true;
		
		let forUpdating = true;
		retriggers = alert.retriggerTS;

		if( !isValidButNeedsManual && !isInvalid )
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

				if ( moment(merged_arr[i].trigger_timestamp).isSameOrAfter(alert.latest_trigger_timestamp) )
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