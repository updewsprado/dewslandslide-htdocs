<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

$timestamp = $_POST["entryTimestamp"];
$site = $_POST["entrySite"];
$alert = $_POST["entryAlert"];
$timeRelease = $_POST["entryRelease"];
$recipient = $_POST["entryRecipient"];
$acknowledged = $_POST["entryAck"];
$flagger = $_POST["entryFlagger"];

$comments = $_POST["comments"];

//echo "Received Data: $timestamp, $site, $alert, $timeRelease, $comments, $recipient, $acknowledged, $flagger";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT MAX(public_alert_id) AS id FROM public_alert";
$result = mysqli_query($conn, $sql);

$alertId = 1;
while($row = mysqli_fetch_assoc($result)) {
    if ($row["id"] != null) {
      $alertId = $row["id"] + 1;
    }
}

echo json_encode($alertId);

$sql = "INSERT INTO public_alert VALUES (
          '$alertId',
          '$timestamp',
          '$site',
          '$alert',
          '$timeRelease',
          '$recipient',
          '$acknowledged',
          '$flagger')";

$result = mysqli_query($conn, $sql);

if ($comments != "") {
  $sql = "INSERT INTO public_alert_extra VALUES (
            '$alertId',
            '$comments')";
  
  $result = mysqli_query($conn, $sql);
}

mysqli_close($conn);
?>
