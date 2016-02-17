<?php
	require_once('connectDB.php'); 

	if(isset($_GET['site'])) {
		$siteColumn = $_GET['site'];
		
		switch ($siteColumn) {
		  case "blcb":
		  case "blct":
			$site = 204; break;
		  case "bolb":
		  case "lipb":
		  case "lipt":
			$site = 1236; break;
		  case "gamt":
		  case "gamb":
			$site = 782; break;
		  case "humb":
		  case "humt":
		  case "plab":
		  case "plat":	  
			$site = 789; break;
		  case "labb":
		  case "labt":
		  case "mamb":
		  case "mamt":
			$site = 389; break;
		  case "oslb":
		  case "oslt":
			$site = 152; break;
		  case "pugb":	
		  case "pugt":
			$site = 65; break;
		  case "sinb":
		  case "sint":
		  case "sinu":
			$site = 454; break;		
		  default:
			$site = 204; break;
		}
	}
	else {
		$site = 204;
	}

	date_default_timezone_set("Asia/Manila");
	
	if(isset($_GET['from'])) {
		$date_range = $_GET['from'];
		
		if(isset($_GET['to'])) {
			$date_cur = $_GET['to'];
		}
		else {
			$date_cur = "'" . date('Y-m-d H:i:s') . "'";
		}
	}
	else {
		$date_cur = "'" . date('Y-m-d H:i:s') . "'";
		
		$date_string = "-" . "14" . " days";
		$date_range =  "'" . date('Y-m-d H:i:s',strtotime($date_string)) . "'";	
	}

	//$homepage = file_get_contents('http://localhost/test/datapres/blcb/196');
	//$homepage = file_get_contents('http://weather.asti.dost.gov.ph/home/index.php/api/data/204/from/2014-10-01/to/2014-10-31');
	//echo $homepage;
	
	$url = "http://weather.asti.dost.gov.ph/home/index.php/api/data/" . $site . "/from/" . $date_range . "/to/" . $date_cur;
	$homepage = file_get_contents($url);
	
	$arr = json_decode($homepage);
	$rain = $arr->data;
	
	$con = mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$queryLatestEntry = "SELECT * FROM rain_noah WHERE site = $site ORDER BY timestamp DESC LIMIT 1";
	$result  = mysqli_query($con, $queryLatestEntry);
	//$lastEntry = mysqli_fetch_row($result);
	
	while($row = mysqli_fetch_array($result)) {
		//$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
		$lastEntry = $row['timestamp'];
		
		echo "latest timestamp = " . $lastEntry;
	}	
	
	$i = 0;
	foreach ($rain as $value) {
		//echo $value->dateTimeRead;
		if ($value->dateTimeRead > $lastEntry) {
			$query = "INSERT INTO rain_noah(id, site, timestamp, rval) VALUES ('','$site', '$value->dateTimeRead', '$value->rain_value')";
	
			if (!mysqli_query($con,$query)) {
				die('Error: ' . mysqli_error($con));
			}
			echo "#$i th record added <Br/>";
	
			$i++;
		}
		else {
			echo "timestamp: " . $value->dateTimeRead . " is less than Latest <Br/>";
		}
	}
?>





























