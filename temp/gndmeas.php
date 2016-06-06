<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if(isset($_GET['site'])) {
  $site = $_GET['site'];

  $rainData = array();
  $sql = "SELECT timestamp, rval, cumm FROM rain_noah WHERE site = $site AND timestamp > '2015-03-01'";
  $result = mysqli_query($conn, $sql);

  $ctr = 0;
  if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while($row = mysqli_fetch_assoc($result)) {
          $rainData[$ctr]["timestamp"] = $row["timestamp"];
          $rainData[$ctr]["cumm"] = $row["cumm"];
          $rainData[$ctr++]["rain"] = $row["rval"];
      }
  } else {
      //echo "{}";
  }

  if ($rainData) {
    echo json_encode($rainData);
  } else {
    echo null;
  }
   
}
else {
  echo "ERROR: site does not exist<Br/>"; 
}

mysqli_close($conn);      

?>