<!DOCTYPE html>
<html lang="en">
<head>
  <title>Public Announcements</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script type="text/javascript" src="http://momentjs.com/downloads/moment.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="bootstrap-datetimepicker.js"></script>
  
  <link rel="stylesheet" type="text/css" href="bootstrap-datetimepicker.css">
</head>
<body>

<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

//Site Column Info

$siteColumnInfo;
$siteAlertPublic;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM alert_public ORDER BY timestamp DESC";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $siteAlertPublic[$numSites]["timestamp"] = $row["timestamp"];
        $siteAlertPublic[$numSites]["time_released"] = $row["time_released"];
        $siteAlertPublic[$numSites]["name"] = $row["site_name"];
        $siteAlertPublic[$numSites]["alert_level"] = $row["alert_level"];
        $siteAlertPublic[$numSites]["desc"] = $row["desc"];
        $numSites++;
    }
} else {
    echo "0 results for alert_public";
}

//$sql = "SELECT s_id, name FROM site_column ORDER BY name ASC";
$sql = "SELECT DISTINCT LEFT(name, 3) as name FROM site_column ORDER BY name ASC";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        //$siteInfo[$numSites]["s_id"] = $row["s_id"];
        $siteInfo[$numSites++]["name"] = $row["name"];
    }
} else {
    echo "0 results for site name";
}

$sql = "SELECT internal_alert_level FROM lut_alerts";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $internalAlerts[$numSites++]["internal_alert_level"] = $row["internal_alert_level"];
    }
} else {
    echo "0 results for internal alert level";
}

//echo json_encode($siteAlertPublic);

mysqli_close($conn);
?>

<div class="container">
  <div class="page-header">
    <h2>DEWS-Landslide Public Announcement Input
    </h2>
  </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entryTimestamp">Timestamp</label>
        <div class='input-group date' id='datetimepickerTimestamp'>
            <input type='text' class="form-control" id="entryTimestamp" name="entryTimestamp" placeholder="Enter timestamp (YYYY-MM-DD hh:mm:ss)" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>        
      </div>
      <div class="form-group col-sm-6">
        <label for="entryRelease">Time of Info Release</label>
        <div class='input-group date' id='datetimepickerRelease'>
            <input type='text' class="form-control" id="entryRelease" name="entryRelease" placeholder="Enter timestamp (hh:mm:ss)" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>  
      </div>      
    </div>

    <div class="row">
      <div class="form-group col-sm-4">
        <label for="entrySite">Site Name</label>
        <select class="form-control" id="entrySite">
          <option value="none">Select site...</option>

          <?php foreach($siteInfo as $singleSite): ?>
          <option value="<?php echo $singleSite['name']; ?>"><?php echo $singleSite["name"]; ?></option>
          <?php endforeach; ?>

        </select>
      </div>
      <div class="form-group col-sm-4">
        <label for="entryAlert">Internal Alert Level</label>
        <select class="form-control" id="entryAlert" onchange="autofillPublicAlertInfo();">
          <option value="none">Select internal alert level...</option>

          <?php foreach($internalAlerts as $singleAlert): ?>
          <option><?php echo $singleAlert["internal_alert_level"]; ?></option>
          <?php endforeach; ?>

        </select>        
      </div>
      <div class="form-group col-sm-4">
        <label for="publicAlertLevel">Public Alert Level</label>
        <input type="text" class="form-control" id="publicAlertLevel" name="publicAlertLevel" placeholder="Will be selected automatically..." disabled>     
      </div>
    </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="internalAlertDesc">Internal Alert Description</label>
        <textarea class="form-control" rows="3" id="internalAlertDesc" name="internalAlertDesc" placeholder="Will be selected automatically..." maxlength="128" disabled></textarea>
      </div>      
      <div class="form-group col-sm-6">
        <label for="publicAlertDesc">Public Alert Description</label>
        <textarea class="form-control" rows="3" id="publicAlertDesc" name="publicAlertDesc" placeholder="Will be selected automatically..." maxlength="128" disabled></textarea>
      </div>  
    </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="responseLlmcLgu">LLMC and LGU Response</label>
        <textarea class="form-control" rows="3" id="responseLlmcLgu" name="responseLlmcLgu" placeholder="Will be selected automatically..." maxlength="128" disabled></textarea>
      </div>      
      <div class="form-group col-sm-6">
        <label for="responseCommunity">Community Response</label>
        <textarea class="form-control" rows="3" id="responseCommunity" name="responseCommunity" placeholder="Will be selected automatically..." maxlength="128" disabled></textarea>
      </div>  
    </div>    

    <div class="form-group">
      <label for="comments">Extra Info (optional)</label>
      <textarea class="form-control" rows="3" id="comments" name="comments" placeholder="Enter Additional Info/Comments" maxlength="256"></textarea>
    </div>

    <label for="entryRecipient">Recipient</label>

    <div class="form-group col-sm-12">
      <div class="row">
        <div class="checkbox col-sm-6"><label><input id="cbox1" type="checkbox" value="BLGU" onclick='recipientChecker(this,"#entryTime1")'>BLGU</label></div>
        <div class='input-group date entryTime col-sm-6' id='time1'>
            <input type='text' class="form-control" id="entryTime1" name="entryTime1" placeholder="Enter time of acknowledgment for BLGU" disabled/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
      </div>
      <div class="row">
        <div class="checkbox col-sm-6"><label><input id="cbox2" type="checkbox" value="MLGU" onclick='recipientChecker(this,"#entryTime2")'>MLGU</label></div>
        <div class='input-group date entryTime col-sm-6' id='time2'>
            <input type='text' class="form-control" id="entryTime2" name="entryTime2" placeholder="Enter time of acknowledgment for MLGU" disabled/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>  
      </div>
      <div class="row">
        <div class="checkbox col-sm-6"><label><input id="cbox3" type="checkbox" value="LLMC" onclick='recipientChecker(this,"#entryTime3")'>LLMC</label></div>
        <div class='input-group date entryTime col-sm-6' id='time3'>
            <input type='text' class="form-control" id="entryTime3" name="entryTime3" placeholder="Enter time of acknowledgment for LLMC" disabled/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
      </div>
      <div class="row">
        <div class="checkbox col-sm-6"><label><input id="cbox4" type="checkbox" value="MDRRMC" onclick='recipientChecker(this,"#entryTime4")'>MDRRMC</label></div>
        <div class='input-group date entryTime col-sm-6' id='time4'>
            <input type='text' class="form-control" id="entryTime4" name="entryTime4" placeholder="Enter time of acknowledgment for MDRRMC" disabled/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
      </div>
      <div class="row">
        <div class="checkbox col-sm-6"><label><input id="cbox5" type="checkbox" value="PDRRMC" onclick='recipientChecker(this,"#entryTime5")'>PDRRMC</label></div>
        <div class='input-group date entryTime col-sm-6' id='time5'>
            <input type='text' class="form-control" id="entryTime5" name="entryTime5" placeholder="Enter time of acknowledgment for PDRRMC" disabled/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>  
      </div>
    </div>    

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entryFlagger">Reporter</label>
        <input type="text" class="form-control" id="entryFlagger" name="entryFlagger" value="Dynaslope" placeholder="Enter Flagger">
      </div>
    </div>

    <button type="submit" class="btn btn-info" onclick="insertNewEntry()">Submit</button>

  <Br><Br><Br>

  <!-- Modal for Successful Entry -->
  <div class="modal fade" id="dataEntrySuccessful" role="dialog">
    <div class="modal-dialog modal-md">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Entry Insertion Notice</h4>
        </div>
        <div class="modal-body">
          <p>Successfully Inserted the Entry!</p>
        </div>
        <div class="modal-footer">
          <a href="publicreleaseinput2.php" class="btn btn-info" role="button">Add More Entries</a>
          <a href="#" id="viewRecentEntry" class="btn btn-success" role="button">View Recent Entry</a>
        </div>
      </div>
      
    </div>
  </div>

  <!-- Modal for Warnings -->
  <div class="modal fade" id="dataEntryFailed" role="dialog">
    <div class="modal-dialog modal-md">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Entry Insertion Notice</h4>
        </div>
        <div class="modal-body">
          <p>Insertion of Data Failed</p>
          <p class="text-danger"><b id="entryFailedWarning">Insert helpful tip here</b></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Okay</button>
        </div>
      </div>
      
    </div>
  </div>  
  
</div>

<script>
  $(function () {
      $('#datetimepickerTimestamp').datetimepicker({
          format: 'YYYY-MM-DD HH:mm:ss',
          sideBySide: true
      });

      $('#datetimepickerRelease').datetimepicker({
          format: 'HH:mm:ss'
      });

      $('.entryTime').datetimepicker({
          format: 'HH:mm:ss'
      });
  });

  var testVar;
  function autofillPublicAlertInfo () {
    var internalAlert = $( "#entryAlert" ).val();

    if (internalAlert == "none") {
        $('#publicAlertLevel').val("Will be selected automatically...");
        $('#internalAlertDesc').val("Will be selected automatically...");
        $('#publicAlertDesc').val("Will be selected automatically...");
        $('#responseLlmcLgu').val("Will be selected automatically...");
        $('#responseCommunity').val("Will be selected automatically...");
    }
    else {
      $.ajax({url: "publicreleasequery.php?alertLevel=" + internalAlert, success: function(result){
          testVar = $.parseJSON(result);
          var data = $.parseJSON(result);

          $('#publicAlertLevel').val(data[0].public_alert_level);
          $('#internalAlertDesc').val(data[0].internal_alert_desc);
          $('#publicAlertDesc').val(data[0].public_alert_desc);
          $('#responseLlmcLgu').val(data[0].response_llmc_lgu);
          $('#responseCommunity').val(data[0].response_community);
      }});
    }
  }

  function recipientChecker (recipientID, timeID) {
    if($(recipientID).is(':checked')) {
        $(timeID).prop("disabled", false);
        return true;  //You can get the time data
    }
    else {
        $(timeID).prop("disabled", true);
        return false; //You can NOT get the time data
    }
  }

  function recipientData () {
    var recipients = "";
    var acktime = "";

    var listRecipients = ["#cbox1","#cbox2","#cbox3","#cbox4","#cbox5"];
    var listAckTime = ["#entryTime1","#entryTime2","#entryTime3","#entryTime4","#entryTime5"];

    var i;
    for (i = 0; i < listRecipients.length; i++) { 
        if (recipientChecker(listRecipients[i], listAckTime[i])) {
          recipients = recipients + $(listRecipients[i]).val() + ";";

          var singleAckTime = $(listAckTime[i]).val();

          if (singleAckTime == "") {
            acktime = acktime + "none;";
          } else{
            acktime = acktime + $(listAckTime[i]).val() + ";";
          };
        }        
    }

    return {entryRecipient: recipients, entryAckTime: acktime};
  }

  function insertNewEntry () {
    var timestamp = $("#entryTimestamp").val();
    var timereleased = $("#entryRelease").val();
    var site = $("#entrySite").val();
    var internalAlert = $("#entryAlert").val();
    var comments = $("#comments").val();
    var recAck = recipientData();
    var flagger = $("#entryFlagger").val();

    if (timestamp == "") {
      $('#entryFailedWarning').text("Please fill out 'Timestamp'");
      $('#dataEntryFailed').modal('show');
      return;
    };

    if (timereleased == "") {
      $('#entryFailedWarning').text("Please fill out 'Time of Info Release'");
      $('#dataEntryFailed').modal('show');
      return;
    };

    if (site == "none") {
      $('#entryFailedWarning').text("Please fill out 'Site Name'");
      $('#dataEntryFailed').modal('show');
      return;
    };

    if (internalAlert == "none") {
      $('#entryFailedWarning').text("Please fill out 'Internal Alert Level'");
      $('#dataEntryFailed').modal('show');
      return;
    };

    if (recAck.entryRecipient == "") {
      $('#entryFailedWarning').text("Please select at least one 'Recipient'");
      $('#dataEntryFailed').modal('show');
      return;
    };

    var formData = {entryTimestamp: timestamp,
                    entryRelease: timereleased,
                    entrySite: site,
                    entryAlert: internalAlert,
                    comments: comments,
                    entryRecipient: recAck.entryRecipient,
                    entryAck: recAck.entryAckTime,
                    entryFlagger: flagger};

    $.ajax({
      url : "publicreleaseinsert2.php",
      type: "POST",
      data : formData,
      success: function(result, textStatus, jqXHR)
      {
          testVar = result;
          $("#viewRecentEntry").attr("href", "publicrelease2.php?alertid="+result);
          $('#dataEntrySuccessful').modal('show');
      }     
    });
  }
</script>

</body>
</html>