$(document).ready(function(e){
    gintags_table = $('#gintags-datatable').DataTable( {
        "processing": true,
        "serverSide": false,
        columns: [
            {title:"TAG"},
            {title:"DESCRIPTION"},
            {title:"NARRATIVE INPUT"}
        ]
    });
});