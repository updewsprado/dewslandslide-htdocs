<?php  
	require_once('connectDB.php'); 
	
	//Establish Database Connection
	$con = mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}		

	//Sagada - 467; Tadian, Mt Province - 469; Hingyon, Ifugao - 391
	/* 02. Baretto -> Abucay (Device ID: 1103)
	04. Dadong -> Tarragona (Device ID: 733)
	05. Sibahay -> Brgy. Cabasagan, Boston (Device ID: 1450)
	06. Agbatuan-> Brgy. Rapulang, Maayon (Device ID: 557)
	07. Bayabas -> CNSC, Jose Panganiban (Device ID: 79)
	08. Lunas -> PSTC SOUTHERN LEYTE, MAASIN (Device ID: 89)
	10. Sumalsag -> ARCH BRIDGE, MALITBOG (Device ID: 760)
	11. Magsaysay -> Dangcagan (Device ID: 867)
	12. McArthur -> DON FLAVIA, SAN LUIS (Device ID: 607)
	14. Pitu -> SULOP, POBLACION, SULOP (Device ID: 363)
	15. Kanaan -> MDRRM OFFICE, IGACOS (Device ID: 1459)


	16. Sto. Nino -> Talaingod, Davao del Norte (Device ID: 858)
	17. Monte Duali -> Laak, Davao del Norte (Device ID: 1289)
	18. San Carlos -> Siargao Island, Surigao del Norte (Device ID: 180)
	19. Nurcia -> Carmen, Surigao del Sur (Device ID: 1561)
	20. Inabasan -> Maasin, Iloilo (Device ID: 289)
	21. Umingan -> Alimodian, Iloilo (Device ID: 204)
	22. Pepe -> Alimodian, Iloilo (Device ID: 204)
	23. Marirong -> Alimodian, Iloilo (Device ID: 204)
	24. Pinagkamaligan -> Brgy. Villahermosa, Quezon (Device ID: 1096)
	25. Magsaysay -> Dangcagan, Bukidnon (Device ID: 867)	 */
	
	
	$site_noah = array(204,1236,782,789,389,152,65,454,467,469,391,
					1103,733,1450,557,79,89,760,867,607,363,1459,
					858,1289,180,1561,289,1096);
	

	//test case if code will still crash
	//$site_noah = array(789,389,204);

	date_default_timezone_set("Asia/Manila");
	
	//Loop through all available rainfall noah sites
	foreach ($site_noah as $site) {
		echo "Starting with: $site ...<Br/>";
		
		//Find the latest entry
		$queryLatestEntry = "SELECT * FROM rain_noah WHERE site = $site ORDER BY timestamp DESC LIMIT 1";
		$result  = mysqli_query($con, $queryLatestEntry);
		
		$lastEntry = "2014-01-01 00:00:00";
		while($row = mysqli_fetch_array($result)) {
			$lastEntry = $row['timestamp'];
		}
		
		echo "latest timestamp = " . $lastEntry . "<Br/>";

		$format = 'Y-m-d';
		$date = date_create($lastEntry);
		echo "Start date: " . date_format($date, $format) . "<Br/>";
		$fdate =  date_format($date, $format);
		
		date_add($date, date_interval_create_from_date_string("50 days"));
		echo "End date: " . date_format($date, $format) . "<Br/>";
		$tdate = date_format($date, $format);
		
		exec('/home/ubuntu/anaconda2/bin/python getRainfallNOAH.py ' . $site . ' ' . $fdate . ' ' . $tdate, $output, $return); 
		
		//Used to be $output[0] until it was changed by NOAH by indicating the sensor status on the first part of the json
		//$rain = $output[0];
		//echo $rain;
		
		if($output[0]) {
			echo "output[0]";
			$rain = json_decode($output[0]);
		
			$i = 0;
			foreach ($rain as $value) {
				//echo $value->index;
				if ($value->index > $lastEntry) {
					//$query = "INSERT INTO rain_noah(id, site, timestamp, cumm, rval) 
					//		VALUES ('','$site', '$value->index', '$value->cummulative', '$value->rain')";
							
					$query = "INSERT INTO rain_noah(site, timestamp, cumm, rval) 
							VALUES ('$site', '$value->index', '$value->cummulative', '$value->rain')";		
			
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
		
			$output[0] = 0;
			echo "Finished with: $site ! Added $i Entries <Br/>";			
		}
		elseif($output[1]) {
			echo "output[1]";
			$rain = json_decode($output[1]);
		
			$i = 0;
			foreach ($rain as $value) {
				//echo $value->index;
				if ($value->index > $lastEntry) {
					//$query = "INSERT INTO rain_noah(id, site, timestamp, cumm, rval) 
					//		VALUES ('','$site', '$value->index', '$value->cummulative', '$value->rain')";
							
					$query = "INSERT INTO rain_noah(site, timestamp, cumm, rval) 
							VALUES ('$site', '$value->index', '$value->cummulative', '$value->rain')";		
			
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
		
			$output[1] = 0;
			echo "Finished with: $site ! Added $i Entries <Br/>";			
		}
		elseif($output[2]) {
			echo "output[0]";
			$rain = json_decode($output[2]);
		
			$i = 0;
			foreach ($rain as $value) {
				//echo $value->index;
				if ($value->index > $lastEntry) {
					//$query = "INSERT INTO rain_noah(id, site, timestamp, cumm, rval) 
					//		VALUES ('','$site', '$value->index', '$value->cummulative', '$value->rain')";
							
					$query = "INSERT INTO rain_noah(site, timestamp, cumm, rval) 
							VALUES ('$site', '$value->index', '$value->cummulative', '$value->rain')";		
			
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
		
			$output[2] = 0;
			echo "Finished with: $site ! Added $i Entries <Br/>";			
		}
		elseif($output[3]) {
			echo "output[0]";
			$rain = json_decode($output[3]);
		
			$i = 0;
			foreach ($rain as $value) {
				//echo $value->index;
				if ($value->index > $lastEntry) {
					//$query = "INSERT INTO rain_noah(id, site, timestamp, cumm, rval) 
					//		VALUES ('','$site', '$value->index', '$value->cummulative', '$value->rain')";
							
					$query = "INSERT INTO rain_noah(site, timestamp, cumm, rval) 
							VALUES ('$site', '$value->index', '$value->cummulative', '$value->rain')";		
			
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
		
			$output[3] = 0;
			echo "Finished with: $site ! Added $i Entries <Br/>";			
		}
		else {
			echo "No JSON data <Br/>";
		}			
		
	}
	
?>