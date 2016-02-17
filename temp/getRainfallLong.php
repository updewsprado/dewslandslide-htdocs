<?php  
	require_once('connectDB.php'); 
	
	//Establish Database Connection
	$con = mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}		

	//Sagada - 467; Tadian, Mt Province - 469; Hingyon, Ifugao - 391
	$site_noah = array(204,1236,782,789,389,152,65,454);
	date_default_timezone_set("Asia/Manila");

    //$rsite = $_GET['rsite'];
    //$fdate = $_GET['fdate'];
    //$tdate = $_GET['tdate'];
	
	//Loop through all available rainfall noah sites
	foreach ($site_noah as $site) {
		echo "Starting with: $site ...<Br/>";
		
		$date_cur = "'" . date('Y-m-d H:i:s') . "'";
		
		$date_string2 = "-" . "5" . " days";
		$fdate =  "'" . date('Y-m-d H:i:s',strtotime($date_string2)) . "'";
		//$fdate =  date('Y-m-d',strtotime($date_string2));	
		
		//$date_string = "-" . "0" . " days";
		//$tdate =  "'" . date('Y-m-d H:i:s',strtotime($date_string)) . "'";
		//$tdate =  date('Y-m-d',strtotime($date_string));
		$tdate = "'" . date('Y-m-d H:i:s') . "'";
		
		exec('/home/ubuntu/anaconda/bin/python getRainfallNOAH.py ' . $site . ' ' . $fdate . ' ' . $tdate, $output, $return); 
		
		//$rain = $output[0];
		//echo $rain;
		
		if($output[0]) {
			$rain = json_decode($output[0]);
		
			//echo "test: " . $rain[0]->index;
			
			$queryLatestEntry = "SELECT * FROM rain_noah WHERE site = $site ORDER BY timestamp DESC LIMIT 1";
			$result  = mysqli_query($con, $queryLatestEntry);
			
			$lastEntry = "2014-01-01 00:00:00";
			while($row = mysqli_fetch_array($result)) {
				$lastEntry = $row['timestamp'];
				
				echo "latest timestamp = " . $lastEntry;
			}		
			
			$i = 0;
			foreach ($rain as $value) {
				//echo $value->index;
				if ($value->index > $lastEntry) {
					$query = "INSERT INTO rain_noah(id, site, timestamp, cumm, rval) 
							VALUES ('','$site', '$value->index', '$value->cummulative', '$value->rain')";
			
					if (!mysqli_query($con,$query)) {
						die('Error: ' . mysqli_error($con));
					}
					//echo "#$i th record added <Br/>";
			
					$i++;
				}
				else {
					//echo "timestamp: " . $value->index . " is less than Latest <Br/>";
				}
			}
		
			echo "Finished with: $site ! Added $i Entries <Br/>";			
		}
		else {
			echo "No JSON data";
		}
	}
	
?>