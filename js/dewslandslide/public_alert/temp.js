
function loadBulletin(id) {
    $.ajax({
        url: '../../bulletin/main/' + id + '/0', 
        type: 'POST',
        success: function(data) {

            $("#bulletin_modal").html(data);
            let loc = $("#location").text();
            let alert = $("#alert_level_released").text().replace(/\s+/g,' ').trim().slice(0,2);
            let datetime = $("#datetime").text();
            let text = "<b>DEWS-L Bulletin for " + datetime + "<br/>" + alert + " - " + loc + "</b>";
            $("#info").html(text);
            $('#bulletinModal').modal('show');
        }
    }); 
}

function renderPDF(id) 
{
    console.log("ID", id);
    $('#bulletinModal').modal('hide');
    $('.progress-bar').text('Rendering Bulletin PDF...');
    $('.js-loading-bar').modal({ backdrop: 'static', show: 'true'});
    let address = '../../bulletin/run_script/' + id;

    return $.ajax ({
        url: address,
        type: "GET",
        cache: false
    })
    .done( function (response) {
        if(response == "Success.")
            console.log("PDF RENDERED");
    })
    .fail(function (a) {
        console.log("Error rendering:", a);
    });
}

function sendMail(text, subject, filename) {

    $('.progress-bar').text('Sending EWI and Bulletin...');

    let form = {
        text: text,
        subject: subject,
        filename: filename
    };

    $.ajax({
        url: '../../bulletin/mail/', 
        type: 'POST',
        data: form,
        success: function(data)
        {
            $('.js-loading-bar').modal('hide');
            $('#resultModal > .modal-header').html("<h4>Early Warning Information for " + subject.slice(0,3) + "</h4>");

            setTimeout(function () {
                if(data == "Sent.")
                {
                    console.log('Email sent');
                    $("#resultModal .modal-body").html('<p><strong>SUCCESS:</strong>&ensp;Early warning information and bulletin successfully sent through mail!</p>');
                    $("#resultModal").modal('show');
                }
                else
                {
                    console.log('EMAIL SENDING FAILED', data);
                    $("#resultModal .modal-body").html('<p><strong>ERROR:</strong>&ensp;Early warning information and bulletin sending failed!</p>');
                    $("#resultModal").modal('show');
                }   
            }, 500);
            
        },
        error: function(xhr, status, error) 
        {
          let err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    }); 
}