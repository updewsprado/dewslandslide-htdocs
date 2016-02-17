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
$site = $_GET['site'];

$siteColumnInfo;
$siteAlertPublic;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
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
        $siteColumnInfo[$numSites]["long"] = $row["long"];
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
        $numSites++;
    }
} else {
    echo "0 results";
}

//echo json_encode($siteColumnInfo);

$sql = "SELECT * FROM alert_public WHERE site_name LIKE '".$site."%' order by timestamp desc limit 1";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        //echo "id: " . $row["s_id"]. " - Name: " . $row["name"]. ", " . $row["rain_noah"]. ", " . $row["rain_senslope"] . "<br>";
        $siteAlertPublic[$numSites]["entry_id"] = $row["entry_id"];
        $siteAlertPublic[$numSites]["timestamp"] = $row["timestamp"];
        $siteAlertPublic[$numSites]["name"] = $row["site_name"];
        $siteAlertPublic[$numSites]["alert_level"] = $row["alert_level"];
        $siteAlertPublic[$numSites]["desc"] = $row["desc"];
        $siteAlertPublic[$numSites]["response"] = $row["response"];
        $siteAlertPublic[$numSites]["time_released"] = $row["time_released"];
        $siteAlertPublic[$numSites]["recipient"] = $row["recipient"];
        $siteAlertPublic[$numSites]["acknowledged"] = $row["acknowledged"];
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
    <h2>Latest Announcement for <?php echo strtoupper($site); ?> <small><?php echo $siteAlertPublic[0]["timestamp"]; ?></small>
    </h2>
  </div>
  <div class="row">
    <div class="col-sm-4">
      <div id="map-canvas" ><p>MAP CANVASS</p></div>
    </div>
    <div class="col-sm-8">
      <p>Address: <?php echo $siteColumnInfo[0]["address"]; ?></p>
      <p>Affected Households: <?php echo $siteColumnInfo[0]["affected_households"]; ?></p>
      <p>Sensor Installation Status:</p><Br>
      <p>Time Release: <?php echo $siteAlertPublic[0]["time_released"]; ?></p>
      <p>Alert Level: <?php echo $siteAlertPublic[0]["alert_level"]; ?></p>
      <p>Description: <?php echo $siteAlertPublic[0]["desc"]; ?></p>
      <p>Response: <?php echo $siteAlertPublic[0]["response"]; ?></p>
      <p>Acknowledgements: <?php echo $siteAlertPublic[0]["acknowledged"]; ?></p>
    </div>    
  </div><Br>
</div>

<script>
var allWS = <?php echo json_encode($siteColumnInfo); ?>;
var prevWS = null;
var prevWSnoah = null;
var rainData = [];
var rainDataNoah = [];

var isVisible = [true, true, true, true];

  function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    if ($("#labels").is(':checked')) {
      var head = array[0];
      if ($("#quote").is(':checked')) {
        for (var index in array[0]) {
          var value = index + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[0]) {
          line += index + ',';
        }
      }

      line = line.slice(0, -1);
      str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
      var line = '';

      if ($("#quote").is(':checked')) {
        for (var index in array[i]) {
          var value = array[i][index] + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[i]) {
          line += array[i][index] + ',';
        }
      }

      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

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