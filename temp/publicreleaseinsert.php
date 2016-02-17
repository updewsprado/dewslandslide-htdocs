<!DOCTYPE html>
<html lang="en">
<head>
  <title>Public Announcements</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
  <script type="text/javascript"
    src="https://maps.googleapis.com/maps/api/js?client385290333225-1olmpades21is0bupii1fk76fgt3bf4k.apps.googleusercontent.com?key=AIzaSyBRAeI5UwPHcYmmjGUMmAhF-motKkQWcms">
  </script>
  
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

$timestamp = $_POST["entryTimestamp"];
$timeRelease = $_POST["entryRelease"];
$site = $_POST["entrySite"];
$alert = $_POST["entryAlert"];
$desc = $_POST["entryDesc"];
$response = $_POST["entryResponse"];
$recipient = $_POST["entryRecipient"];
$acknowledged = $_POST["entryAck"];
$flagger = $_POST["entryFlagger"];

$siteAlertPublic;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO alert_public VALUES (
          null,
          '$timestamp',
          '$site',
          '$alert',
          '$desc',
          '$response',
          '$timeRelease',
          '$recipient',
          '$acknowledged',
          '$flagger')";
//$result = mysqli_query($conn, $sql);

mysqli_close($conn);
?>

<div class="container">
  <div class="page-header">
    <h2>Successfully Created Entry!!!
    </h2>
  </div>
  <div class="row">
    <div class="col-sm-6">
      <p>Timestamp: <?php echo $timestamp; ?></p>
    </div>
    <div class="col-sm-6">
      <p>Time of Info Release: <?php echo $timeRelease; ?></p>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6">
      <p>Site Name: <?php echo $site; ?></p>
    </div>
    <div class="col-sm-6">
      <p>Alert Level: <?php echo $alert; ?></p>    
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12">
      <p>Description: <?php echo $desc; ?></p>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6">
      <p>Response: <?php echo $response; ?></p>
    </div>
    <div class="col-sm-6">
      <p>Recipient: <?php echo $recipient; ?></p>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6">
      <p>Acknowledged: <?php echo $acknowledged; ?></p>
    </div>
    <div class="col-sm-6">
      <p>Flagger: <?php echo $flagger; ?></p>
    </div>
  </div>
  <div class="page-header"></div>
  <a href="publicreleaseinput.php" class="btn btn-info" role="button">Insert Another Entry</a>
  <a href="publicrelease.php?site=<?php echo $site; ?>" class="btn btn-info" role="button">View Public Release Page</a>
</div>

<script>

</script>

</body>
</html>