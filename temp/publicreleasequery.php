<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

$internalAlertLevel = $_GET["alertLevel"];

$alertsResponses;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT 
          lut_alerts.internal_alert_level, 
          lut_alerts.internal_alert_desc, 
          lut_alerts.public_alert_level, 
          lut_alerts.public_alert_desc,
          lut_responses.response_llmc_lgu,
          lut_responses.response_community
        FROM 
          lut_alerts
        INNER JOIN 
          lut_responses
        ON 
          lut_alerts.public_alert_level=lut_responses.public_alert_level
        WHERE
          internal_alert_level='$internalAlertLevel'";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $alertsResponses[$numSites]["internal_alert_level"] = $row["internal_alert_level"];
        $alertsResponses[$numSites]["internal_alert_desc"] = $row["internal_alert_desc"];
        $alertsResponses[$numSites]["public_alert_level"] = $row["public_alert_level"];
        $alertsResponses[$numSites]["public_alert_desc"] = $row["public_alert_desc"];
        $alertsResponses[$numSites]["response_llmc_lgu"] = $row["response_llmc_lgu"];
        $alertsResponses[$numSites++]["response_community"] = $row["response_community"];
    }

    echo json_encode($alertsResponses);
} else {
    echo "0 results for internal alert level";
}

mysqli_close($conn);
?>