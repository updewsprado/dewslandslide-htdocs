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
}

if(isset($_GET['ms1'])) {
  $ms1 = $_GET['ms1'];
}

if(isset($_GET['fdate'])) {
  $fdate = $_GET['fdate'];
}
if(isset($_GET['tdate'])) {
  $tdate = $_GET['tdate'];
}
if(isset($_GET['nid'])) {
  $nid = $_GET['nid'];

  $rainData = array();
  // $sql = "SELECT timestamp,crack_id,meas FROM senslopedb.gndmeas where timestamp >'2014-10-11' and site_id ='$site' order by site_id asc";
  $sql =  "SELECT timestamp , mval1 ,mval2 from senslopedb.$site where msgid='$ms1'  and timestamp between '$fdate' and '$tdate' and id='$nid'";
  $result = mysqli_query($conn, $sql);

  $ctr = 0;
  if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while($row = mysqli_fetch_assoc($result)) {
          $rainData[$ctr]["timestamp"] = $row["timestamp"];
          $rainData[$ctr++]["mval1"] = $row["mval1"];
     
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