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
		    		reloadGintagsTable();
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

    $('#gintags-datatable tbody').on('click','tr:has(td) .delete',function(){
    	var table = $('#template_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		console.log(data);
    });

    $('#gintags-datatable tbody').on('click','.update',function(){
		var table = $('#backbone_table').DataTable();
		var data = table.row($(this).closest('tr')).data();
		tableId = data.id;
		console.log(data);
		$('#btn-confirm').text('UPDATE');
		$('#btn-reset').text('CANCEL');
		$("#btn-confirm").attr('class', 'btn-success');
		$("#btn-reset").attr('class', 'btn-danger');
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

function reloadGintagsTable() {
	var gintags_table = $('#gintags-datatable').DataTable();
	$('#gintags-datatable').DataTable().clear();
	$('#gintags-datatable').DataTable().destroy();
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