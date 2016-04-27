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
$weatherStationsFull;
$weatherStations;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT DISTINCT
          LEFT(name,3) as name, 
          rain_noah,
          rain_noah2, 
          rain_noah3, 
          rain_senslope,
          rain_arq,
          max_rain_2year
        FROM 
          site_rain_props";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        //echo "id: " . $row["s_id"]. " - Name: " . $row["name"]. ", " . $row["rain_noah"]. ", " . $row["rain_senslope"] . "<br>";
        $weatherStationsFull[$numSites]["name"] = $row["name"];
        $weatherStationsFull[$numSites]["rain_noah"] = $row["rain_noah"];
        $weatherStationsFull[$numSites]["rain_noah2"] = $row["rain_noah2"];
        $weatherStationsFull[$numSites]["rain_noah3"] = $row["rain_noah3"];
        $weatherStationsFull[$numSites]["rain_senslope"] = $row["rain_senslope"];
        $weatherStationsFull[$numSites]["rain_arq"] = $row["rain_arq"];
        $weatherStationsFull[$numSites++]["max_rain_2year"] = $row["max_rain_2year"];
    }
} else {
    echo "0 results";
}

//echo json_encode($weatherStationsFull);
mysqli_close($conn);
?>

<div class="container">
  <div class="jumbotron">
    <h1>Rainfall Data Display</h1>      
    <p>Display Rain volume data on graphs</p>
  </div>

  <div class="row">
    <div class="col-sm-2">
      <form>
        <select id="mySelect" class="form-control" onchange="displayRainGraphs()">
          <option value="default">select site...</option>
          <?php
            $ctr = 0;
            foreach ($weatherStationsFull as $singleSite) {
              $curSite = $singleSite["name"];
              echo "<option value=\"$ctr\">$curSite</option>";
              $ctr++;
            }
          ?>
        </select>       
      </form>
    </div>    
  </div><Br>

  <div id="rainGraphSenslope" class="row rainPlot"></div><br>
  <div id="rainGraphARQ" class="row rainPlot"></div><br>
  <div id="rainGraphNoah" class="row rainPlot"></div><br>
  <div id="rainGraphNoah2" class="row rainPlot"></div><br>
  <div id="rainGraphNoah3" class="row rainPlot"></div><br>
</div>

<script>
var allWS = <?php echo json_encode($weatherStationsFull); ?>;
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

function displayRainGraphs() {
    var x = document.getElementById("mySelect").value;

    if (x != "default") {
        var rainSenslope = allWS[x]["rain_senslope"];
        var rainNOAH = allWS[x]["rain_noah"];
        var rainNOAH2 = allWS[x]["rain_noah2"];
        var rainNOAH3 = allWS[x]["rain_noah3"];
        var rainARQ = allWS[x]["rain_arq"];
        var max = allWS[x]["max_rain_2year"];
        // alert("senslope: " + rainSenslope + ", noah: " + rainNOAH +", noah2: " + rainNOAH2 +", noah3: " + rainNOAH3);
        // alert( " 2 year :" + max + ", arq: " + rainARQ);
        if(rainSenslope) {
            if (rainSenslope != prevWS) {
                getRainfallData(rainSenslope);
                prevWS = rainSenslope;
            }            
        }
        else {
            document.getElementById("rainGraphSenslope").innerHTML = null;
        }

        if(rainARQ) {
          if (rainARQ != prevWS) {
              getRainfallARQ(rainARQ);
              prevWS = rainARQ;
          }            
        }
        else {
          document.getElementById("rainGraphARQ").innerHTML = null;
        }

         if(rainNOAH) {
            if (rainNOAH != prevWSnoah) {
                getRainfallDataNOAH(rainNOAH);
                prevWSnoah = rainNOAH;
            }            
        }
        else {
            document.getElementById("rainGraphNoah").innerHTML = null;
        }

         if(rainNOAH2) {
            if (rainNOAH2 != prevWSnoah) {
                getRainfallDataNOAH2(rainNOAH2);
                prevWSnoah = rainNOAH2;
            }            
        }
        else {
            document.getElementById("rainGraphNoah2").innerHTML = null;
        }


         if(rainNOAH3) {
            if (rainNOAH3 != prevWSnoah) {
                getRainfallDataNOAH3(rainNOAH3);
                prevWSnoah = rainNOAH3;
            }            
        }
        else {
            document.getElementById("rainGraphNoah3").innerHTML = null;
        }
        
       
    };
}

var testResult;
function getRainfallData(str) {
    if (str.length == 0) { 
        document.getElementById("rainGraphSenslope").innerHTML = "";
        return;
    } else {
      $.ajax({url: "rainfallNewGetData.php?rsite="+ str, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        testResult = result;
        var x = document.getElementById("mySelect").value;
        var max = allWS[x]["max_rain_2year"];
        console.log(max);
        if ((result == "[]") || (result == "")) {
          document.getElementById("rainGraphSenslope").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        console.log(jsonData);
        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          
          //spinner.stop();
        
          g = new Dygraph(
              document.getElementById("rainGraphSenslope"), 
              data, 
              {
                  title: 'Rainfall Data from ' + str ,
                  stackedGraph: isStacked,
                  labels: ['timestamp','72h', 'cumm', 'rain'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,

                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,
                  underlayCallback: function(canvas, area, g2) {

                                  var c0 = g2.toDomCoords(g2.getValue(0,0), 0);

                                  canvas.fillStyle = '#ffb3b3';
                                  canvas.fillRect(area.x, area.y, area.w, area.h);

                                  var c1 = g2.toDomCoords(g2.getValue(0,0), max);
                                  canvas.fillStyle = '#FFFFCC';
                                  canvas.fillRect(area.x, c1[1], area.w, 5*(c0[1]-c1[1]));

                                  var c2 = g2.toDomCoords(g2.getValue(0,0), max/2);
                                  canvas.fillStyle = '#D1FFD1';
                                  canvas.fillRect(area.x, c2[1], area.w, 10*(c0[1]-c2[1]));
                  },
                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }

                  
              }
          );  
        }
        else {
            document.getElementById("rainGraphSenslope").innerHTML = "";
            return;
        }        
      }});
    }
}

function getRainfallARQ(str) {
    if (str.length == 0) { 
        document.getElementById("rainGraphARQ").innerHTML = "";
        return;
    } else {
      $.ajax({url: "rainfallNewGetDataARQVy.php?rsite="+str, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        testResult = result;
        var x = document.getElementById("mySelect").value;
        var max = allWS[x]["max_rain_2year"];
        console.log(max);
        if ((result == "[]") || (result == "")) {
          document.getElementById("rainGraphARQ").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        console.log(jsonData);
        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          
          //spinner.stop();
        
          g = new Dygraph(
              document.getElementById("rainGraphARQ"), 
              data, 
              {
                  title: 'Rainfall Data from ARQ ' + str ,
                  stackedGraph: isStacked,
                  labels: ['timestamp','72h', 'cumm', 'rain'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,

                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,
                  underlayCallback: function(canvas, area, g2) {

                                  var c0 = g2.toDomCoords(g2.getValue(0,0), 0);

                                  canvas.fillStyle = '#ffb3b3';
                                  canvas.fillRect(area.x, area.y, area.w, area.h);

                                  var c1 = g2.toDomCoords(g2.getValue(0,0), max);
                                  canvas.fillStyle = '#FFFFCC';
                                  canvas.fillRect(area.x, c1[1], area.w, 5*(c0[1]-c1[1]));

                                  var c2 = g2.toDomCoords(g2.getValue(0,0), max/2);
                                  canvas.fillStyle = '#D1FFD1';
                                  canvas.fillRect(area.x, c2[1], area.w, 10*(c0[1]-c2[1]));
                  },
                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }

                  
              }
          );  
        }
        else {
            document.getElementById("rainGraphARQ").innerHTML = "";
            return;
        }        
      }});
    }
}


function getRainfallDataNOAH(str) {
    if (str.length == 0) { 
        document.getElementById("rainGraphNoah").innerHTML = "";
        return;
    } else {
      $.ajax({url: "rainfallNewGetDataNoahVy.php?rsite=rain_noah_" + str, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        if ((result == "[]") || (result == "")) {
          document.getElementById("rainGraphNoah").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        var x = document.getElementById("mySelect").value;
        var max = allWS[x]["max_rain_2year"];
        console.log(max);
      console.log(str + "noah");

        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          
          //spinner.stop();
          
          g = new Dygraph(
              document.getElementById("rainGraphNoah"), 
              data, 
              {
                  title: 'Rainfall Data from NOAH WS ' + str,
                  stackedGraph: isStacked,
                  labels: ['timestamp', '72h','cumm', 'rain'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,
                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,
                   underlayCallback: function(canvas, area, g2) {

                                  var c0 = g2.toDomCoords(g2.getValue(0,0), 0);

                                  canvas.fillStyle = '#ffb3b3';
                                  canvas.fillRect(area.x, area.y, area.w, area.h);

                                  var c1 = g2.toDomCoords(g2.getValue(0,0), max);
                                  canvas.fillStyle = '#FFFFCC';
                                  canvas.fillRect(area.x, c1[1], area.w, 5*(c0[1]-c1[1]));

                                  var c2 = g2.toDomCoords(g2.getValue(0,0), max/2);
                                  canvas.fillStyle = '#D1FFD1';
                                  canvas.fillRect(area.x, c2[1], area.w, 10*(c0[1]-c2[1]));
                  },

                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },                
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }

              }
          );  
        }
        else {
            document.getElementById("rainGraphNoah").innerHTML = "";
            return;
        }        
      }});
    }
}


function getRainfallDataNOAH2(str) {
    if (str.length == 0) { 
        document.getElementById("rainGraphNoah2").innerHTML = "";
        return;
    } else {
      $.ajax({url: "rainfallNewGetDataNoahVy.php?rsite=rain_noah_" + str, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        if ((result == "[]") || (result == "")) {
          document.getElementById("rainGraphNoah2").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        var x = document.getElementById("mySelect").value;
        var max = allWS[x]["max_rain_2year"];
        console.log(max);
      console.log(str);

        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          
          //spinner.stop();
          
          g = new Dygraph(
              document.getElementById("rainGraphNoah2"), 
              data, 
              {
                  title: 'Rainfall Data from NOAH2 WS ' + str,
                  stackedGraph: isStacked,
                  labels: ['timestamp', '72h','cumm', 'rain'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,
                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,
                   underlayCallback: function(canvas, area, g2) {

                                  var c0 = g2.toDomCoords(g2.getValue(0,0), 0);

                                  canvas.fillStyle = '#ffb3b3';
                                  canvas.fillRect(area.x, area.y, area.w, area.h);

                                  var c1 = g2.toDomCoords(g2.getValue(0,0), max);
                                  canvas.fillStyle = '#FFFFCC';
                                  canvas.fillRect(area.x, c1[1], area.w, 5*(c0[1]-c1[1]));

                                  var c2 = g2.toDomCoords(g2.getValue(0,0), max/2);
                                  canvas.fillStyle = '#D1FFD1';
                                  canvas.fillRect(area.x, c2[1], area.w, 10*(c0[1]-c2[1]));
                  },

                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },                
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }

              }
          );  
        }
        else {
            document.getElementById("rainGraphNoah2").innerHTML = "";
            return;
        }        
      }});
    }
}


function getRainfallDataNOAH3(str) {
    if (str.length == 0) { 
        document.getElementById("rainGraphNoah3").innerHTML = "";
        return;
    } else {
      $.ajax({url: "rainfallNewGetDataNoahVy.php?rsite=rain_noah_" + str, success: function(result){
        /*
        testConsumption = JSON.parse(result);
        pcTarget = parseInt(testConsumption.targetmonthlyconsumption);
        */
        if ((result == "[]") || (result == "")) {
          document.getElementById("rainGraphNoah3").innerHTML = "";
          return;
        };

        var jsonData = JSON.parse(result);
        var x = document.getElementById("mySelect").value;
        var max = allWS[x]["max_rain_2year"];
        console.log(max);
      console.log(str);

        if(jsonData) {
          var data = JSON2CSV(jsonData);
          var isStacked = false;
          
          //spinner.stop();
          
          g = new Dygraph(
              document.getElementById("rainGraphNoah3"), 
              data, 
              {
                  title: 'Rainfall Data from NOAH3 WS ' + str,
                  stackedGraph: isStacked,
                  labels: ['timestamp', '72h','cumm', 'rain'],
                  visibility: isVisible,
                  rollPeriod: 1,
                  showRoller: true,
                  //errorBars: true,

                  highlightCircleSize: 2,
                  strokeWidth: 1,
                  strokeBorderWidth: isStacked ? null : 1,
                  connectSeparatedPoints: true,
                   underlayCallback: function(canvas, area, g2) {

                                  var c0 = g2.toDomCoords(g2.getValue(0,0), 0);

                                  canvas.fillStyle = '#ffb3b3';
                                  canvas.fillRect(area.x, area.y, area.w, area.h);

                                  var c1 = g2.toDomCoords(g2.getValue(0,0), max);
                                  canvas.fillStyle = '#FFFFCC';
                                  canvas.fillRect(area.x, c1[1], area.w, 5*(c0[1]-c1[1]));

                                  var c2 = g2.toDomCoords(g2.getValue(0,0), max/2);
                                  canvas.fillStyle = '#D1FFD1';
                                  canvas.fillRect(area.x, c2[1], area.w, 10*(c0[1]-c2[1]));
                  },

                  cumm : {
                    axis : { }
                  },
                  S : {
                    axis : 'cumm'
                  },                
                            
                  highlightSeriesOpts: {
                      strokeWidth: 1,
                      strokeBorderWidth: 1,
                      highlightCircleSize: 3
                  }

              }
          );  
        }
        else {
            document.getElementById("rainGraphNoah3").innerHTML = "";
            return;
        }        
      }});
    }
}

</script>

</body>
</html>