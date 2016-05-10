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
}
 if(isset($_GET['crack'])) {
  $crack = $_GET['crack'];
}

  $rainData = array();
  // $sql = "SELECT timestamp, rval, cumm FROM rain_noah WHERE site = $site AND timestamp > '2015-03-01'";
  $sql = "SELECT timestamp ,meas FROM senslopedb.gndmeas where site_id ='$site' AND timestamp > '2013-03-01' and crack_id ='$crack'";
  $result = mysqli_query($conn, $sql);

  $ctr = 0;
  if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while($row = mysqli_fetch_assoc($result)) {
          $rainData[$ctr]["timestamp"] = $row["timestamp"];
          // $rainData[$ctr]["crack_id"] = $row["crack_id"];
          $rainData[$ctr++]["meas"] = $row["meas"];
      }
 

  if ($rainData) {
    echo json_encode($rainData);
  } else {
    echo null;
  }
   
}

mysqli_close($conn);      

?>