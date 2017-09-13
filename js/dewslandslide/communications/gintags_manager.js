$(document).ready(function(e){

	getGintags(); // Initialize gintag autocomplete
    
	initGintagsTable();

    $('#btn-confirm').on('click',function(){
    	if ($('#gintag-ipt').val().trim() != "" && $('#gintag-description-ipt').val().trim() != "" &&
    		$('#narrative-ipt').val().trim() != "") {

    		if ($('#gintag-ipt').val().charAt(0) != "#") {
    			$('#gintag-ipt').val("#"+$('#gintag-ipt').val());
    		}

    		var data = {
	    		'tag': $('#gintag-ipt').val(),
	    		'tag_description': $('#gintag-description-ipt').val(),
	    		'narrative_input': $('#narrative-ipt').val()
	    	}

			$.post( "../gintags_manager/insertGintagNarratives/", {gintags: data})
			.done(function(response) {
				if (response == "true") {
					$.notify("Tag successfully added.", {
		    			position: "top center",
		    			className: "success"

		    		});
				} else {
		    		$.notify("Error occured, duplicate entry.", {
		    			position: "top center",
		    			className: "error"
		    		});
				}
			});
    	} else {
    		$.notify("All fields are required.", {
    			position: "top center",
    			className:"error"
    		});
    	}
    });

});

function insertGintags() {

}

function getGintags() {
	$.get( "../gintags_manager/getTagsForAutocomplete", function( data ) {
		var tag_list = JSON.parse(data);
		var input = document.getElementById("gintag-ipt");
		new Awesomplete(input, {
			list: tag_list,
			minChars: 3,
			maxItems: 10
		});
	});
}

function updateGintags() {

}

function deleteToNarraitves() {
	
}

function initGintagsTable() {
    var gintags_table = $('#gintags-datatable').DataTable( {
        "processing": true,
        "serverSide": false,
        "ajax": '../gintags_manager/getGintagTable',
        columns: [
        	{"data" : "id", title:"ID"},
            {"data" : "tag_name", title:"TAG"},
            {"data" : "description", title:"DESCRIPTION"},
            {"data" : "narrative_input", title:"NARRATIVE INPUT"},
            {"data" : "functions", title: "*"}
        ]
    });
}