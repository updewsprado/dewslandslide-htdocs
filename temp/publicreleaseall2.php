<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Public Announcements</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/sb-admin.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?client385290333225-1olmpades21is0bupii1fk76fgt3bf4k.apps.googleusercontent.com?key=AIzaSyBRAeI5UwPHcYmmjGUMmAhF-motKkQWcms">

    </script>
    
    <style type="text/css">
      body {
      background-color:#fff; 
      }

      .rainPlot {
        margin-left: auto;
        margin-right: auto;
        min-width: 100%;
        height: auto;
      }
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

//Site Column Info

$siteColumnInfo;
$siteAlertPublic;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

//+++ PANB new query fix 
$sql = "SELECT DISTINCT
          public_alert.public_alert_id,
          public_alert.entry_timestamp,
          public_alert.site,
          public_alert.internal_alert_level,
          site_column.barangay,
          site_column.municipality,
          site_column.province,
          site_column.region,
          lut_alerts.public_alert_level,
          lut_alerts.public_alert_desc
        FROM
          public_alert
        INNER JOIN site_column 
          ON LEFT(public_alert.site, 3) = LEFT(site_column.name, 3)
        INNER JOIN lut_alerts 
          ON public_alert.internal_alert_level = lut_alerts.internal_alert_level
        WHERE
          public_alert.public_alert_id IN 
          (
            SELECT DISTINCT
              max(public_alert.public_alert_id) as public_alert_id
            FROM
              public_alert
            INNER JOIN site_column 
              ON LEFT(public_alert.site, 3) = LEFT(site_column.name, 3)
            GROUP BY site
          )
        GROUP BY site
        ORDER BY entry_timestamp DESC";
//--- PANB

$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $siteAlertPublic[$numSites]["alert_id"] = $row["public_alert_id"];
        $siteAlertPublic[$numSites]["timestamp"] = $row["entry_timestamp"];
        $siteAlertPublic[$numSites]["name"] = $row["site"];
        $siteAlertPublic[$numSites]["internal_alert"] = $row["internal_alert_level"];
        $siteAlertPublic[$numSites]["barangay"] = $row["barangay"];
        $siteAlertPublic[$numSites]["municipality"] = $row["municipality"];
        $siteAlertPublic[$numSites]["province"] = $row["province"];
        $siteAlertPublic[$numSites]["region"] = $row["region"];
        $siteAlertPublic[$numSites]["public_alert"] = $row["public_alert_level"];
        $siteAlertPublic[$numSites]["public_alert_desc"] = $row["public_alert_desc"];

        $numSites++;
    }
} else {
    echo "0 results";
}

$sql = "SELECT * FROM public_alert_extra";

$result = mysqli_query($conn, $sql);
$comments = null;
$i = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $comments[$i]["alert_id"] = $row["public_alert_id"];
        $comments[$i++]["comments"] = $row["comments"];
    }
}

function getComments($alert_id) {
    $i = 0;
    global $comments;
    for( $i = 0; $i < count($comments); $i++) {
      if ($comments[$i]["alert_id"] == $alert_id) 
      return $comments[$i]["comments"];
    }
}


function dependentInfoProcessor($internal_alert_level, $suppInfoDesc, $suppInfo) {

  if($internal_alert_level == "A0-D" || $internal_alert_level == "ND-D") {
    $list = explode(";", $suppInfo);
    $groups = str_replace(",", "/", $list[0]);
    $suppInfoDesc = str_replace("[LGU/LLMC/Community]", $groups, $suppInfoDesc);
    $suppInfoDesc = str_replace("[reason for request]", $list[1], $suppInfoDesc);
  } 

  return $suppInfoDesc;
}

mysqli_close($conn);

?>

    <div class="container">
      <div class="page-header">
        <h2>DEWS-Landslide Latest Announcements <small><?php echo $siteAlertPublic[0]["timestamp"]; ?></small>
        </h2>
      </div>
      <div class="row">
        <div class="table-responsive">          
          <table class="table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Province</th>
                <th>Municipality</th>
                <th>Site Name</th>
                <th>Time of Info Release</th>
                <th>Alert Level</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($siteAlertPublic as $publicAlert): ?>
              <?php
                switch ($publicAlert["public_alert"]) {
                
                      case 'a2':
                      case 'A2':
                         $tableRowClass= "alert_01";
                        break;
                      case 'a1':
                      case 'A1':
                         $tableRowClass = "alert_02";
                        break;
                      case 'a3':
                      case 'A3':
                         $tableRowClass = "alert_00";
                        break;
                      case 'a0':
                      case 'A0':
                        $tableRowClass = "alert_03";
                        break;
                      case 'nd':
                      case 'ND':
                        $tableRowClass = "alert_nd";
                        break;
                      default:
                        $tableRowClass = "undefined";
                        break;
                }
              ?>
              <tr class="<?php echo $tableRowClass; ?>">
                <td><?php echo $publicAlert["region"]; ?></td>
                <td><?php echo $publicAlert["province"]; ?></td>
                <td><?php echo $publicAlert["municipality"]; ?></td>
                <td><a href='publicrelease2.php?alertid=<?php echo $publicAlert["alert_id"]; ?>'><?php echo $publicAlert["barangay"]; ?></a></td>
                <td><?php echo $publicAlert["timestamp"]; ?></td>
                <td><?php echo $publicAlert["public_alert"]; ?></td>
                <td><?php if ($publicAlert["internal_alert"] == "A0-D" || "ND-D") {
                    echo dependentInfoProcessor($publicAlert["internal_alert"], $publicAlert["public_alert_desc"], getComments($publicAlert["alert_id"]));
                  } else echo $publicAlert["public_alert_desc"]; ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div><Br>
    </div>

  </body>
</html>