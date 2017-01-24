var args = require('system').args;
var page = require('webpage').create();
/*page.viewportSize = { width: 1366, height : 720 };
page.paperSize = { format : 'Letter', orientation: 'portrait', border : '0.5in'}
page.settings.dpi= 300;
*/

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

//http://localhost/gold/bulletin-builder/
page.open( args[1], function(status) {

	if (status === 'success') {

		console.log("Page " + args[1] + " loaded...");

		// var sample = page.evaluate( function () {
		// 	$('input[name="username"]').val('ksdelacruz');
		// 	$('input[name="password"]').val('senslope');
		// 	$('input[name="submit"]').click();
		// });

		// setTimeout(function () {
			
		// 	page.open( 'http://localhost/gold/bulletin', function (status) {
			
		// 		if (status === 'success') {

		// 			console.log("Page 'http://localhost/gold/bulletin'... loaded.");

		// 			setTimeout( function () {
		// 				page.render('z.pdf');
		// 				console.log("Capturing finished...");
		// 				console.log("Exiting.");
		// 				phantom.exit();
		// 			}, 1000);

		// 		} else {

		// 			console.log("Error opening url \"" + page.reason_url
		// 	        	+ "\": " + page.reason
		// 	        );
		// 			phantom.exit();	

		// 		}

		// 	});

		// }, 20000);

		window.setTimeout(function () {
			// use ./../filename.pdf for relative paths
			page.render("bulletin.pdf");
			console.log("Capturing finished...");
			console.log("Exiting...");
			console.log("Success.");
			phantom.exit();
		}, 10000);
		
  		// page.render('z.pdf');
		// phantom.exit();
		
	} else {

		console.log("Error opening url \"" + page.reason_url
        	+ "\": " + page.reason
        );
		phantom.exit();	
	}

});

/*var system = require('system');
var fs = require('fs');

var Guid = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

var keyStr = "ABCDEFGHIJKLMNOP" +
              "QRSTUVWXYZabcdef" +
              "ghijklmnopqrstuv" +
              "wxyz0123456789+/" +
              "=";

function encode64(input) {
    input = escape(input);
    var output = btoa(input);

    return output;
}


if (system.args.length != 2) {
    console.log('Usage: printer.js URL');
    phantom.exit(1);
} else {
    var address = system.args[1];
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {

            //create temporary file (current dir)
            var tmpfileName = Guid() + '.pdf';

            //render page 
            page.render(tmpfileName);

            //read tmp file + convert to base64 
            var content = encode64(fs.read(tmpfileName));

            //send (or log)
            //console.log(content);
            var path = 'output.txt';
			fs.write(path, content, 'w');

            //delete
            fs.remove(tmpfileName);

            phantom.exit();
        }
    });
}
*/


