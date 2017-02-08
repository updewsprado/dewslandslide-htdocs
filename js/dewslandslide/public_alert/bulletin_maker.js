/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for automated PDF rendering;
 *	File dependent on PhantomJS library
 *	
****/

var args = require('system').args;
var page = require('webpage').create();

page.viewportSize = { width: 1275, height: 1650 };
page.paperSize = { width: (8.5/0.55) + 'in', height: (11/0.55) + 'in'/*, border: (0.5/0.55) + 'in' */};
page.settings.dpi = 300;
//FOR UBUNTU
page.zoomFactor = 0.55;

page.onResourceError = function(resourceError) {
    console.error(resourceError.url + ': ' + resourceError.errorString);
};

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

page.open( args[1], function(status) {

	if (status === 'success') {

		console.log("Page " + args[1] + " loaded...");

		window.setTimeout(function () {
			// use ./../filename.pdf for relative paths
			page.render("bulletin.pdf");
			console.log("Capturing finished...");
			console.log("Exiting...");
			console.log("Success.");
			phantom.exit();
		}, 10000);
		
	} else {

		console.log("Error opening url \"" + page.reason_url
        	+ "\": " + page.reason
        );
		phantom.exit();	
	}

});