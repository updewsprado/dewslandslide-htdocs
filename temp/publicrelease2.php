<!DOCTYPE html>
<html lang="en">
<head>
  <title>Public Announcements</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
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
$site = null;
$alertid = null;

$siteColumnInfo;
$siteAlertPublic;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_GET['alertid'])) {
  $alertid = $_GET['alertid'];

  $sql = "SELECT * FROM public_alert WHERE public_alert_id = $alertid";
  $result = mysqli_query($conn, $sql);

  $row = mysqli_fetch_assoc($result);
  $site = $row["site"]; 
}
elseif (isset($_GET['site'])) {
  $site = $_GET['site'];
} 
else {
  echo "No site and alertid data. Will just return.";
  return;
}

$sql = "SELECT * FROM site_column WHERE name LIKE '".$site."%'";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        //echo "id: " . $row["s_id"]. " - Name: " . $row["name"]. ", " . $row["rain_noah"]. ", " . $row["rain_senslope"] . "<br>";
        $siteColumnInfo[$numSites]["s_id"] = $row["s_id"];
        $siteColumnInfo[$numSites]["name"] = $row["name"];
        $siteColumnInfo[$numSites]["lat"] = $row["lat"];
        $siteColumnInfo[$numSites]["long"] = $row["lon"];
        $siteColumnInfo[$numSites]["address"] = null;

        $segmentCtr=0;
        if ($row["sitio"]) {
          $siteColumnInfo[$numSites]["address"] = $row["sitio"];
          $segmentCtr++;
        } 
        if ($row["barangay"]) {
          if ($segmentCtr > 0) {
            $siteColumnInfo[$numSites]["address"] = $siteColumnInfo[$numSites]["address"] . ", " . $row["barangay"];
          }
          else {
            $siteColumnInfo[$numSites]["address"] = $row["barangay"];
          }
          $segmentCtr++;
        } 
        if ($row["municipality"]) {
          if ($segmentCtr > 0) {
            $siteColumnInfo[$numSites]["address"] = $siteColumnInfo[$numSites]["address"] . ", " . $row["municipality"];
          }
          else {
            $siteColumnInfo[$numSites]["address"] = $row["municipality"];
          }         
          $segmentCtr++;  
        } 
        if ($row["province"]) {
          if ($segmentCtr > 0) {
            $siteColumnInfo[$numSites]["address"] = $siteColumnInfo[$numSites]["address"] . ", " . $row["province"];
          }
          else {
            $siteColumnInfo[$numSites]["address"] = $row["province"];
          }          
          $segmentCtr++;
        } 
        if ($row["region"]) {
          if ($segmentCtr > 0) {
            $siteColumnInfo[$numSites]["address"] = $siteColumnInfo[$numSites]["address"] . ", " . $row["region"];
          }
          else {
            $siteColumnInfo[$numSites]["address"] = $row["region"];
          }          
        } 
        
        $siteColumnInfo[$numSites]["affected_households"] = $row["affected_households"];
        $siteColumnInfo[$numSites]["installation_status"] = $row["installation_status"];
        $numSites++;
    }
} else {
    echo "0 results A";
}

if ($alertid) {
  $sql = "SELECT 
            public_alert.public_alert_id,
            public_alert.entry_timestamp,
            public_alert.site,
            public_alert.time_released,
            public_alert.recipient,
            public_alert.acknowledged,
            public_alert.flagger,
            lut_alerts.public_alert_level,
            lut_alerts.public_alert_desc,
            lut_responses.response_llmc_lgu,
            lut_responses.response_community
          FROM 
            public_alert 
          INNER JOIN lut_alerts
            ON public_alert.internal_alert_level = lut_alerts.internal_alert_level
          INNER JOIN lut_responses
            ON lut_alerts.public_alert_level=lut_responses.public_alert_level
          WHERE public_alert_id = $alertid";
}
elseif ($site) {
  $sql = "SELECT 
            public_alert.public_alert_id,
            public_alert.entry_timestamp,
            public_alert.site,
            public_alert.time_released,
            public_alert.recipient,
            public_alert.acknowledged,
            public_alert.flagger,
            lut_alerts.public_alert_level,
            lut_alerts.public_alert_desc,
            lut_responses.response_llmc_lgu,
            lut_responses.response_community
          FROM 
            public_alert 
          INNER JOIN lut_alerts
            ON public_alert.internal_alert_level = lut_alerts.internal_alert_level
          INNER JOIN lut_responses
            ON lut_alerts.public_alert_level=lut_responses.public_alert_level
          WHERE site LIKE '".$site."%' ORDER BY entry_timestamp DESC LIMIT 1";
}

$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        //echo "id: " . $row["s_id"]. " - Name: " . $row["name"]. ", " . $row["rain_noah"]. ", " . $row["rain_senslope"] . "<br>";
        $siteAlertPublic[$numSites]["entry_id"] = $row["public_alert_id"];
        $siteAlertPublic[$numSites]["timestamp"] = $row["entry_timestamp"];
        $siteAlertPublic[$numSites]["name"] = $row["site"];
        $siteAlertPublic[$numSites]["time_released"] = $row["time_released"];
        $siteAlertPublic[$numSites]["alert_level"] = $row["public_alert_level"];
        $siteAlertPublic[$numSites]["desc"] = $row["public_alert_desc"];
        $siteAlertPublic[$numSites]["recipient"] = $row["recipient"];
        $siteAlertPublic[$numSites]["acknowledged"] = $row["acknowledged"];
        $siteAlertPublic[$numSites]["response_llmc_lgu"] = $row["response_llmc_lgu"];
        $siteAlertPublic[$numSites]["response_community"] = $row["response_community"];
        $siteAlertPublic[$numSites]["flagger"] = $row["flagger"];

        $numSites++;
    }
} else {
    echo "0 results B";
}

$testRecipient = explode(";", $siteAlertPublic[0]["recipient"]);
$testAcknowledged = explode(";", $siteAlertPublic[0]["acknowledged"]);

$sql = "SELECT * FROM public_alert_extra WHERE public_alert_id = " . $siteAlertPublic[0]["entry_id"];

$result = mysqli_query($conn, $sql);

$siteAlertPublicExtra = null;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $siteAlertPublicExtra["comments"] = $row["comments"];
        //echo $siteAlertPublicExtra["comments"];
    }
}

$sqlHistory = "SELECT 
                public_alert.public_alert_id,
                public_alert.entry_timestamp,
                lut_alerts.public_alert_level
              FROM 
                public_alert 
              INNER JOIN 
                lut_alerts
              ON 
                public_alert.internal_alert_level = lut_alerts.internal_alert_level
              WHERE 
                site = '".substr($siteColumnInfo[0]["name"],0,3)."' ORDER BY entry_timestamp desc";
$result = mysqli_query($conn, $sqlHistory);

$numEntries = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $siteAlertHistory[$numEntries]["entry_id"] = $row["public_alert_id"];
        $siteAlertHistory[$numEntries]["timestamp"] = $row["entry_timestamp"];
        $siteAlertHistory[$numEntries]["alert_level"] = $row["public_alert_level"];

        $numEntries++;
    }
} else {
    echo "0 results C";
}

mysqli_close($conn);
?>

<div class="container">
  <div class="page-header">
    <h2>DEWS-Landslide Latest Announcement for <?php echo strtoupper($siteColumnInfo[0]["name"]); ?> <small><?php echo $siteAlertPublic[0]["timestamp"]; ?></small>
    </h2>
  </div>
  <div class="row">
    <div class="col-sm-4">
      <div id="map-canvas" ><p>MAP CANVASS</p></div>
      <p><b>Reporter:</b> <?php echo $siteAlertPublic[0]["flagger"]; ?></p>
    </div>
    <div class="col-sm-8">
      <p><b>Address: </b><?php echo $siteColumnInfo[0]["address"]; ?></p>
      <p><b>Affected Households: </b> <?php echo $siteColumnInfo[0]["affected_households"]; ?></p>

  <?php if($siteColumnInfo[0]["installation_status"] != null) : ?>
      <p><b>Sensor Installation Status:</b> <?php echo $siteColumnInfo[0]["installation_status"]; ?></p>
  <?php endif; ?>

      <Br>
      <p><b>Time Release:</b> <?php echo $siteAlertPublic[0]["time_released"]; ?></p>
      <p><b>Alert Level:</b> <?php echo $siteAlertPublic[0]["alert_level"]; ?></p>
      <p><b>Description:</b> <?php echo $siteAlertPublic[0]["desc"]; ?></p>

  <?php if(true) : ?>
      <p><?php echo $siteAlertPublicExtra["comments"]; ?></p>
  <?php endif; ?>

      <p><b>Response to LLMC and LGU:</b> <?php echo $siteAlertPublic[0]["response_llmc_lgu"]; ?></p>
      <p><b>Response to Community:</b> <?php echo $siteAlertPublic[0]["response_community"]; ?></p>
      <p><b>Acknowledgements:</b><Br>
        <ul>

        <?php for($x = 0; $x < count($testRecipient)-1; $x++): ?>
            <li><?php echo $testRecipient[$x]." - ".$testAcknowledged[$x]; ?></li>
        <?php endfor; ?>

        </ul>
      </p>

      <Br><Br>

      <p>
        <div class="dropdown">
          <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><b>Alerts History:</b>
          <span class="caret"></span></button>
          <ul class="dropdown-menu">

          <?php foreach ($siteAlertHistory as $alertHistory): ?>
            <li><a href='publicrelease2.php?alertid=<?php echo $alertHistory["entry_id"]; ?>'><?php echo $alertHistory["timestamp"]." (".$alertHistory["alert_level"].")"; ?></a></li>
          <?php endforeach; ?>

          </ul>
        </div>
      </p>
    </div>    
  </div><Br>
</div>

<script>
var gmapJSON;
function initialize_map() {
  gmapJSON = <?php echo json_encode($siteColumnInfo); ?>;
  var siteCoords = gmapJSON;
  
  var mapOptions = {
    //center: new google.maps.LatLng(14.5995, 120.9842),
    center: new google.maps.LatLng(siteCoords[0]['lat'], siteCoords[0]['long']),
    zoom: 12
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  marker = [];
  for (var i = 0 ; i < siteCoords.length; i++){
    marker[i] = new google.maps.Marker({
      position: new google.maps.LatLng(
        parseFloat(siteCoords[i]['lat']), 
        parseFloat(siteCoords[i]['long'])
      ),
      map: map,
      title: siteCoords[i]['name'].toLowerCase() + '\n'
          + siteCoords[i]['address']
    });

    var siteName = siteCoords[i]['name'].toLowerCase();
    var mark = marker[i];
    google.maps.event.addListener(mark, 'click', (function(name) {
                return function(){
                    alert(name);
                };
    })(siteName));
  }
}   

google.maps.event.addDomListener(window, 'load', initialize_map);
</script>

</body>
</html>