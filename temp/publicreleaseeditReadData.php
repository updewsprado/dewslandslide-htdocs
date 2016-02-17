<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

//$site = $_GET["entrySite"];

//get site data
if(isset($_GET['site'])) {
    $site = $_GET["site"];
    //echo "Site: $site<Br>";
}
else {
    echo "Error: No Site selected<Br>";
    return;
}

//echo "Received Data: $timestamp, $site, $alert, $timeRelease, $comments, $recipient, $acknowledged, $flagger";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM public_alert WHERE site = '$site' ORDER BY entry_timestamp DESC";
$result = mysqli_query($conn, $sql);

$ctr = 0;
$siteAlertPublic = [];
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $siteAlertPublic[$ctr]["alert_id"] = $row["public_alert_id"];
        $siteAlertPublic[$ctr]["ts_data"] = $row["entry_timestamp"];
        $siteAlertPublic[$ctr]["name"] = $row["site"];
        $siteAlertPublic[$ctr]["internal_alert"] = $row["internal_alert_level"];
        $siteAlertPublic[$ctr]["ts_post_creation"] = $row["time_released"];
        $siteAlertPublic[$ctr]["recipient"] = $row["recipient"];
        $siteAlertPublic[$ctr]["acknowledged"] = $row["acknowledged"];
        $siteAlertPublic[$ctr]["flagger"] = $row["flagger"];
        $ctr++;
    }

    echo json_encode($siteAlertPublic); 
}
else {
    echo 0;
}

mysqli_close($conn);
?>
