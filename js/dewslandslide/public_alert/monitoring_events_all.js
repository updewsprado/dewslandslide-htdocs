
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Monitoring Events Table [public_alert/monitoring_events_all.php]
 *  [host]/public_alert/monitoring_events
 *	
****/

$(document).ready(function() 
{
	 $('#table').DataTable({
        columnDefs : [
            { className: "text-right", "targets": [4,5] },
            { className: "text-left", "targets": [1, 2, 3] },
            {
                'sortable' : false,
                'targets' : [ 1, 2, 3 ]
            },
        ],
        "processing": true,
        "pagingType": "full_numbers",
        "displayLength": 25,
        "order": [[0, 'desc']],
        "initComplete": function () 
        {

            this.api().columns([1]).every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
  
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
  
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                });
            });

            this.api().columns([2]).every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
  
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
  
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                });
            });
        }

    });

    let setElementHeight = function () {
        let window_h = $(window).height();
        $('#page-wrapper').css('min-height', window_h-60);
    };

    $(window).on("resize", function () {
        setElementHeight();
    }).resize();

});