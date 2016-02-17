<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Public Announcements</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?client385290333225-1olmpades21is0bupii1fk76fgt3bf4k.apps.googleusercontent.com?key=AIzaSyBRAeI5UwPHcYmmjGUMmAhF-motKkQWcms">
    </script>
    
    <style type="text/css">
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

$sql = "SELECT DISTINCT
          public_alert.public_alert_id,
          max(public_alert.entry_timestamp) as entry_timestamp,
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
        GROUP BY site
        ORDER BY public_alert.entry_timestamp DESC";

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

//echo json_encode($siteAlertPublic);

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
                <th>Timestamp</th>
                <th>Alert Level</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($siteAlertPublic as $publicAlert): ?>
              <tr>
                <td><?php echo $publicAlert["region"]; ?></td>
                <td><?php echo $publicAlert["province"]; ?></td>
                <td><?php echo $publicAlert["municipality"]; ?></td>
                <td><a href='publicrelease2.php?alertid=<?php echo $publicAlert["alert_id"]; ?>'><?php echo $publicAlert["barangay"]; ?></a></td>
                <td><?php echo $publicAlert["timestamp"]; ?></td>
                <td><?php echo $publicAlert["public_alert"]; ?></td>
                <td><?php echo $publicAlert["public_alert_desc"]; ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div><Br>
    </div>

  </body>
</html>