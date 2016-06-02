<?php
// Database login information
$servername = "localhost";
$username = "root";
$password = "senslope";
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
  $sql = "SELECT timestamp,crack_id,meas FROM senslopedb.gndmeas where timestamp >'2014-10-11' and site_id ='$site' order by site_id asc";
  $result = mysqli_query($conn, $sql);

  $ctr = 0;
  if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while($row = mysqli_fetch_assoc($result)) {
          $rainData[$ctr]["timestamp"] = $row["timestamp"];
          $rainData[$ctr]["crack_id"] = $row["crack_id"];
          $rainData[$ctr++]["meas"] = $row["meas"];
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