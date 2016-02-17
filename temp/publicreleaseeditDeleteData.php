<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

//$site = $_GET["entrySite"];

//get alert id
if(isset($_GET['alertid'])) {
    $alertid = $_GET["alertid"];
}
else {
    echo "Error: No Entry for Alert ID input<Br>";
    return;
}

//echo "Received Data: $timestamp, $site, $alert, $timeRelease, $comments, $recipient, $acknowledged, $flagger";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "DELETE FROM
            public_alert
        WHERE 
            public_alert_id = $alertid";

$result = mysqli_query($conn, $sql);

if ($result > 0) {
    echo "Successfully deleted entry! (alert id: $alertid)";
}
else {
    echo "Delete Failed....";
}
mysqli_close($conn);
?>
