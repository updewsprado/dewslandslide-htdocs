
/****
 *
 *	Created by Kevin Dhale dela Cruz
 *	JS file for Individual Monitoring Event Page [public_alert/monitoring_events_individual.php]
 *  [host]/public_alert/monitoring_events/[release_id]
 *	
****/

$(document).ready(function() 
{
    $('.datetime').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    });
    
    $('.time').datetimepicker({
        format: 'HH:mm:ss',
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    });
    
    let setElementHeight = function () {
        let window_h = $(window).height();
        let offset = $('#column_2').offset().top;
        let nav_height_top = $(".navbar-fixed-top").height();
        let nav_height_bottom = $(".navbar-fixed-bottom").height();
        let final = window_h - offset - nav_height_bottom - 80;
        $('#map-canvas').css('min-height', final);
    };

    $(window).on("resize", function () {
        setElementHeight();
    }).resize();

    $(window).on("resize", function () {
        $('#page-wrapper').css('min-height', ($(window).height()));
    }).resize();

    reposition("#edit");
    reposition("#outcome");
    reposition("#bulletinLoadingModal");

    setTimeout(function (a) {
        let to_highlight = $("#to_highlight").attr("value");
        if(to_highlight != "") $(".timeline-panel#" + to_highlight).focus()
    }, 1000)

    let current_release = {};

    $("span.glyphicon-edit").click(function () 
    {
        let release_id = this.id;
        $.get( "../../pubrelease/getRelease/" + release_id, 
        function (release) 
        {
            $("#data_timestamp").val(release.data_timestamp);
            $("#release_time").val(release.release_time);
            $("#comments").val(release.comments);

            console.log("release ", release);
            current_release = jQuery.extend(true, {}, release);
            $.get( "../../pubrelease/getAllEventTriggers/" +  release.event_id + "/" + release_id, 
            function (triggers) 
            {
                let lookup = { "G":"ground", "g":"ground", "S":"sensor", "s":"sensor", "E":"eq", "R":"rain", "D":"od" };
                for (let k in lookup) { $("#" + lookup[k] + " input").prop("disabled", true); $("#" + lookup[k] + "_area").hide(); }

                current_release.trigger_list = [];
                triggers.forEach(function (a) 
                {
                    let delegate = function (x,a) { $(x).val(a).prop("disabled", false); }
                    switch(a.trigger_type)
                    {
                        case "g": case "s": $("#trigger_" + lookup[a.trigger_type] + "_1").val(a.timestamp).prop("disabled", false);  $("#trigger_" + lookup[a.trigger_type] + "_1_info").val(a.info).prop("disabled", false); current_release.trigger_list.push( ["trigger_" + lookup[a.trigger_type] + "_1", a.trigger_id] ); break;
                        case "G": case "S": $("#trigger_" + lookup[a.trigger_type] + "_2").val(a.timestamp).prop("disabled", false); $("#trigger_" + lookup[a.trigger_type] + "_2_info").val(a.info).prop("disabled", false); current_release.trigger_list.push( ["trigger_" + lookup[a.trigger_type] + "_2", a.trigger_id] ); break;
                        case "E": delegate("#magnitude", a.eq_info[0].magnitude); delegate("#latitude", a.eq_info[0].latitude); delegate("#longitude", a.eq_info[0].longitude);
                        default: $("#trigger_" + lookup[a.trigger_type]).val(a.timestamp).prop("disabled", false); $("#trigger_" + lookup[a.trigger_type] + "_info").val(a.info).prop("disabled", false); current_release.trigger_list.push( ["trigger_" + lookup[a.trigger_type], a.trigger_id] );
                    }
                    $("#" + lookup[a.trigger_type] + "_area").show();
                })

            }, "json")
            .done(function () 
            {
                $("#edit").modal('show');
            });
        }, "json");

    });

    $("#modalForm").validate(
    {
        debug: true,
        rules: {
            data_timestamp: "required",
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
            magnitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
            latitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
            longitude: {
                required: {
                    depends: function () {
                        return $(".cbox_trigger[value='E']").is(":checked");
                }},
                step: false
            },
        },
        errorPlacement: function ( error, element ) {

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
            $("#edit").modal('hide');
            let data = $( "#modalForm" ).serializeArray();
            let temp = {};
            data.forEach(function (value) { temp[value.name] = value.value == "" ? null : value.value; })
            temp.release_id = current_release.release_id;
            temp.trigger_list = current_release.trigger_list.length == 0 ? null : current_release.trigger_list;
            console.log(temp);
            $.post( "../../pubrelease/update", temp)
            .done(function( data ) 
            {
                $("#outcome").modal({backdrop: "static"});
                console.log("Updated");
            });
        }
    });

    $("#refresh").click(function() { location.reload(); });

    let id = null, text = null, filename = null, subject = null;

     $(".print").click(function () 
    {
        id = $(this).val();
        loadBulletin(id);
    })

    $('#download').click(function () {
       $.when(renderPDF(id))
       .then(function () {
            $('#bulletinLoadingModal').modal('hide');
            filename = $("#filename").text();
            window.location.href = "../bulletin/view/DEWS-L Bulletin for " + filename + ".pdf";
       });
    });

    $("#send").click(function () {
        $.when(renderPDF(id))
        .then(function (x) {
            if( x == "Success.")
            {
                text = $("#info").html();
                subject = $("#subject").text();
                filename = $("#filename").text();
                sendMail(text, subject, filename);
            }
        })
    });

    function initialize_map() 
    {
        var lat = "<?php echo $event->latitude; ?>";
        var lon = "<?php echo $event->longitude; ?>";
        var name = "<?php echo strtoupper($event->name); ?>";
        var address = '<?php echo $event->barangay . ", " . $event->municipality . ", " . $event->province; ?>';
      
        var mapOptions = {
            //center: new google.maps.LatLng(14.5995, 120.9842),
            center: new google.maps.LatLng(lat, lon),
            zoom: 12
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        marker = [];
        marker[0] = new google.maps.Marker({
        position: new google.maps.LatLng(
            parseFloat(lat), 
            parseFloat(lon)
        ),
        map: map,
        title: name + '\n'
            + address
        });

        var siteName = name;
        var mark = marker[0];
        google.maps.event.addListener(mark, 'click', (function(name) {
            return function() {
                alert(name);
            };
        }) (siteName));
    }   

    google.maps.event.addDomListener(window, 'load', initialize_map);

});