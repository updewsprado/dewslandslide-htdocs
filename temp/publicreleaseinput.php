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
  <script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
  
  <link rel="stylesheet" type="text/css" href="bootstrap-datetimepicker.css">

  <style type="text/css">
    #map-canvas { 
      width: auto;
      height: 500px; 
    }    
  </style>
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
    echo "0 results";
}

//echo json_encode($siteAlertPublic);

mysqli_close($conn);
?>

<div class="container">
  <div class="page-header">
    <h2>DEWS-Landslide Public Announcement Input
    </h2>
  </div>
  <form role="form" action="publicreleaseinsert.php" method="post">
    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entryTimestamp">Timestamp</label>
        <div class='input-group date' id='datetimepickerTimestamp'>
            <input type='text' class="form-control" id="entryTimestamp" name="entryTimestamp" placeholder="Enter timestamp" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>        
      </div>
      <div class="form-group col-sm-6">
        <label for="entryRelease">Time of Info Release</label>
        <div class='input-group date' id='datetimepickerRelease'>
            <input type='text' class="form-control" id="entryRelease" name="entryRelease" placeholder="Enter timestamp" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>  
      </div>      
    </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entrySite">Site Name</label>
        <input type="text" class="form-control" id="entrySite" name="entrySite" placeholder="Enter site">
      </div>
      <div class="form-group col-sm-6">
        <label for="entryAlert">Alert Level</label>
        <input type="text" class="form-control" id="entryAlert" name="entryAlert" placeholder="Enter Alert Level">
      </div>
    </div>

    <div class="form-group">
      <label for="entryDesc">Description</label>
      <textarea class="form-control" rows="3" id="entryDesc" name="entryDesc" placeholder="Enter Description" maxlength="256"></textarea>
    </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entryResponse">Response</label>
        <input type="text" class="form-control" id="entryResponse" name="entryResponse" placeholder="Enter Response">
      </div>
      <div class="form-group col-sm-6">
        <label for="entryRecipient">Recipient</label>
        <input type="text" class="form-control" id="entryRecipient" name="entryRecipient" placeholder="Enter Recipient">
      </div>
    </div>

    <div class="row">
      <div class="form-group col-sm-6">
        <label for="entryAck">Acknowledged</label>
        <input type="text" class="form-control" id="entryAck" name="entryAck" placeholder="Enter Acknowledgement Info">
      </div>
      <div class="form-group col-sm-6">
        <label for="entryFlagger">Flagger</label>
        <input type="text" class="form-control" id="entryFlagger" name="entryFlagger" value="Dynaslope" placeholder="Enter Flagger">
      </div>
    </div>

    <button type="submit" class="btn btn-info">Submit</button>
  </form><Br>
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
  });
</script>

</body>
</html>