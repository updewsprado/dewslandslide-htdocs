$(document).ready(function(e){
    $('#template_table').DataTable( {
        "processing": true,
        "serverSide": false,
        "ajax": '../communications/fetchalltemplate',
        columns: [
            { "data" : "id" , title:"ID"},
            { "data" : "alert_lvl", title:"ALERT LEVEL"},
            { "data" : "possible_scenario", title:"POSSIBLE SCENARIO"},
            { "data" : "recommended_response", title:"RECOMMENDED RESPONSE"},
            { "data" : "functions", title: "*"}
        ]
    });

    $('#add_template').on('click',function(){
    	$('#add_template_modal').modal('toggle');
    });
});