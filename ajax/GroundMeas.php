<!DOCTYPE html>
<html lang="en">
<head>
  <title>*NEW* Rainfall Data</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

  <script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
  <style type="text/css">
    .rainPlot {
      margin-left: auto;
      margin-right: auto;
      min-width: 100%;
      height: auto;
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

//Weather Stations
$GndMeasurementFull;
$GndMeasurement;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT DISTINCT site_id FROM senslopedb.gndmeas order by site_id asc";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $GndMeasurementFull[$numSites++]["site_id"] = $row["site_id"];
    
    }
} 


$sql2 = "SELECT DISTINCT crack_id FROM senslopedb.gndmeas where site_id ='agb' order by site_id asc";
$result2 = mysqli_query($conn, $sql2);

$numSites2 = 0;
if (mysqli_num_rows($result2) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result2)) {
        $GndMeasurement[$numSites2++]["crack_id"] = $row["crack_id"];
    
    }
} 

//echo json_encode($GndMeasurementFull);
mysqli_close($conn);
?>

<div class="container">
  <div class="jumbotron">
    <h1>GROUND MEASUREMENT</h1>      
  </div>

  <div class="row">
    <div class="col-sm-2">
      <form>
        <select id="mySelect" class="form-control" onchange="displayGroundGraphs()">
          <option value="default">select site...</option>
          <?php
            $ctr = 0;
            foreach ($GndMeasurementFull as $singleSite) {
              $curSite = $singleSite["site_id"];
              echo "<option value=\"$ctr\">$curSite</option>";
              $ctr++;
            }
          ?>
        </select>    
          <select id="mySelect2" class="form-control" onchange="displayGroundGraphs()">
          <option value="default">select site...</option>
          <?php
            $ctr = 0;
            foreach ($GndMeasurement as $singleSite) {
              $curSite = $singleSite["crack_id"];
              echo "<option value=\"$ctr\">$curSite</option>";
              $ctr++;
            }
          ?>
        </select>     
      </form>
    </div>    
  </div><Br>

  <div id="Groundfull" class="row rainPlot"></div><br>
  <div id="GroundMeas" class="row rainPlot"></div><br>
</div>

<script>
var allWS = <?php echo json_encode($GndMeasurementFull);  ?>;
var allWS2 = <?php echo json_encode($GndMeasurement);  ?>;
var prevWS = null;
var prevWSnoah = null;
var GroundData = [];
var GroundDataFull = [];
var isVisible = [true, true, true, true,true,true, true, true,true];

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

function displayGroundGraphs() {
    var x = document.getElementById("mySelect").value;
    var y = document.getElementById("mySelect2").value;

    if (x != "default") {
        var GndName = allWS[x]["site_id"];
        var crack = allWS2[y]["crack_id"];
        alert("ground:" + GndName + " Crack: " + crack );

        if(GndName && crack) {
            if (GndName != prevWS) {
                getRainfallData(GndName);
                prevWS = GndName;
            }            
        }
        else {
            document.getElementById("Groundfull").innerHTML = null;
        }
        
        if(GndName && crack) {
            if (GndName != prevWSnoah && crack != prevWSnoah) {
                getRainfallDataNOAH(GndName , crack);
                prevWSnoah = GndName;
                prevWSnoah = crack;
            }            
        }
        else {
            document.getElementById("GroundMeas").innerHTML = null;
        }
    };
}

var testResult;
function getRainfallData(str) {
    if (str.length == 0) { 
        document.getElementById("Groundfull").innerHTML = "";
        return;
    } else {
      
      $.ajax({url: "gndmeasfull.php?gsite="+str , success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        testResult = result;
        // console.log(result);

        if ((result == "[]") || (result == "")) {
          document.getElementById("Groundfull").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        
        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var GndDyGraph = new Array();
          var newData = GndDyGraph.push(data);

          var isStacked = false;
    
          
          //spinner.stop();
          
          g = new Dygraph(
              document.getElementById("Groundfull"), 
           data, 
              {
                  title: 'Rainfall Data from ' + str,
                  stackedGraph: isStacked,
                  
                  labels: ['timestamp', 'A','B','C','D','E','F','G','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','Y','Z','A1','B1','C1','D1','E1','F1','G1','H1','I1'],
                  rollPeriod: 1,
                  showRoller: true,
                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,

            
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }
              }
          );  
        }
        else {
            document.getElementById("Groundfull").innerHTML = "";
            return;
        }        
      }});
    }
}

function getRainfallDataNOAH(str,str2) {
    if (str.length == 0) { 
        document.getElementById("GroundMeas").innerHTML = "";
        return;
    } else {
      var y = document.getElementById("mySelect2").value;
      var crack = allWS2[y]["crack_id"];
      $.ajax({url: "groundMeasBak.php?site="+ str +"&crack=" + crack, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        if ((result == "[]") || (result == "")) {
          document.getElementById("GroundMeas").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        
        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          console.log(data);
          
          //spinner.stop();
          
          g = new Dygraph(
              document.getElementById("GroundMeas"), 
              data, 
              {
                  title: 'Rainfall Data from NOAH WS ' + str,
                  stackedGraph: isStacked,
                  labels: ['timestamp', 'Ground Measurement'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,
                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 2,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,

                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },                
                            
                  highlightSeriesOpts: {
                      strokeWidth: 2,
                      strokeBorderWidth: 3,
                      highlightCircleSize: 3
                  }
              }
          );  
        }
        else {
            document.getElementById("GroundMeas").innerHTML = "";
            return;
        }        
      }});
    }
}
</script>

</body>
</html>