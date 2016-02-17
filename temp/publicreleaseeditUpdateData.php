<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

//get alert id
if(isset($_GET['alertid'])) {
    $alertid = $_GET["alertid"];
}
else {
    echo "Error: No Entry for Alert ID input<Br>";
    return;
}

//get entry timestamp data
if(isset($_GET['entryts'])) {
    $entryts = $_GET["entryts"];
}
else {
    echo "Error: No Entry for Timestamp input<Br>";
    return;
}

//TODO: Get time of post
if(isset($_GET['time_post'])) {
    $time_post = $_GET["time_post"];
}
else {
    echo "Error: No Entry for Time of Post input<Br>";
    return;
}

//TODO: Get internal alert level
if(isset($_GET['ial'])) {
    $ial = $_GET["ial"];
}
else {
    echo "Error: No Entry for Internal Alert Level input<Br>";
    return;
}

//TODO: Get recipients
if(isset($_GET['recipient'])) {
    $recipient = $_GET["recipient"];
}
else {
    echo "Error: No Entry for recipient input<Br>";
    return;
}

//TODO: Get time of acknowledgment from recipients
if(isset($_GET['acknowledged'])) {
    $acknowledged = $_GET["acknowledged"];
}
else {
    echo "Error: No Entry for time of acknowledgment input<Br>";
    return;
}

//TODO: Get name of flagger
if(isset($_GET['flagger'])) {
    $flagger = $_GET["flagger"];
}
else {
    echo "Error: No Entry for flagger input<Br>";
    return;
}

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "UPDATE 
            public_alert 
        SET 
            entry_timestamp = '$entryts',
            time_released = '$time_post',
            internal_alert_level = '$ial',
            recipient = '$recipient',
            acknowledged = '$acknowledged',
            flagger = '$flagger'
        WHERE 
            public_alert_id = $alertid";
$result = mysqli_query($conn, $sql);

if ($result > 0) {
    echo "Successfully updated entry! (alert id: $alertid)";
}
else {
    echo "Update Failed....";
}

mysqli_close($conn);
?>
