<?php
	require_once('connectDB.php'); 

	$site_noah = array(204,1236,782,789,389,152,65,454); 

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
		
		$date_string = "-" . "2" . " days";
		$date_range =  "'" . date('Y-m-d H:i:s',strtotime($date_string)) . "'";	
	}
	
	//Establish Database Connection
	$con = mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}	
	
	//Loop through all available rainfall noah sites
	foreach ($site_noah as $site) {
		echo "Starting with: $site ...<Br/>";

		$url = "http://weather.asti.dost.gov.ph/home/index.php/api/data/" . $site . "/from/" . $date_range . "/to/" . $date_cur;
		$homepage = file_get_contents($url);
		
		$arr = json_decode($homepage);
		$rain = $arr->data;
		
		$queryLatestEntry = "SELECT * FROM rain_noah WHERE site = $site ORDER BY timestamp DESC LIMIT 1";
		$result  = mysqli_query($con, $queryLatestEntry);
		//$lastEntry = mysqli_fetch_row($result);
		
		while($row = mysqli_fetch_array($result)) {
			//$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			$lastEntry = $row['timestamp'];
			
			//echo "latest timestamp = " . $lastEntry;
		}	
		
		$i = 0;
		foreach ($rain as $value) {
			//echo $value->dateTimeRead;
			if ($value->dateTimeRead > $lastEntry) {
				$query = "INSERT INTO rain_noah(id, site, timestamp, rval) 
						VALUES ('','$site', '$value->dateTimeRead', '$value->rain_value')";
		
				if (!mysqli_query($con,$query)) {
					die('Error: ' . mysqli_error($con));
				}
				echo "#$i th record added <Br/>";
		
				$i++;
			}
			else {
				//echo "timestamp: " . $value->dateTimeRead . " is less than Latest <Br/>";
			}
		}
	
		echo "Finished with: $site !<Br/>";
	}
?>





























