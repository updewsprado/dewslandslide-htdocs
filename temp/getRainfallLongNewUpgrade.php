<?php  
	require_once('connectDB.php'); 
	
	//Establish Database Connection
	$con = mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}		
	
	//get the NOAH IDs of the rain gauges that we would like to download
	//We now have 3 NOAH IDs that we are looking from
	$queryNoahFirst =
		"SELECT DISTINCT rain_noah AS noahid FROM site_rain_props WHERE rain_noah IS NOT NULL 
		UNION
		SELECT DISTINCT rain_noah2 AS noahid FROM site_rain_props WHERE rain_noah2 IS NOT NULL 
		UNION
		SELECT DISTINCT rain_noah3 AS noahid FROM site_rain_props WHERE rain_noah3 IS NOT NULL 
		ORDER BY noahid ASC";

	$ctrIds = 0;
	$site_noah = [];
	$result  = mysqli_query($con, $queryNoahFirst);
	while($row = mysqli_fetch_array($result)) {
		// $lastEntry = $row['timestamp'];
		$site_noah[$ctrIds++] = $row['noahid'];
	}

	//test case if code will still crash
	//$site_noah = array(789,389,204);

	date_default_timezone_set("Asia/Manila");
	

	//Loop through all available rainfall noah sites
	foreach ($site_noah as $site) {
		echo "Starting with: $site ...<Br/>";
		$lastEntry = 0;

		//reset the value for $output
		$output = [];
		
		$queryDoesTableExist = "SHOW TABLES LIKE 'rain_noah_$site'";
		if ($result = mysqli_query($con, $queryDoesTableExist)) {
			$rowCount = mysqli_num_rows($result);

			if ($rowCount > 0) {
				echo "... site: $site exists... downloading data <Br/>";

				//determine the latest timestamp for noah rainfall table
				$queryLatestEntry = "SELECT timestamp FROM rain_noah_$site ORDER BY timestamp DESC LIMIT 1";

				if ($result = mysqli_query($con, $queryLatestEntry)) {
					$timestampCount = mysqli_num_rows($result);

					if ($timestampCount > 0) {
						while($row = mysqli_fetch_array($result)) {
							$lastEntry = $row['timestamp'];
						}
					} else {
						//Rainfall Data starts from 2014
						$lastEntry = "2014-01-01 00:00:00";
					}
				}
				else {
					"Query failed... <Br/>";
					return;
				}
			} 
			else {
				echo "... site DOES NOT EXIST... Creating Table 'rain_noah_$site'... <Br/>";

				$queryCreateTable =
					"CREATE TABLE `senslopedb`.`rain_noah_$site` (
					  `timestamp` DATETIME NOT NULL,
					  `cumm` FLOAT NOT NULL,
					  `rval` FLOAT NOT NULL,
					  PRIMARY KEY (`timestamp`))
					ENGINE = InnoDB
					DEFAULT CHARACTER SET = utf8
					COMMENT = 'Downloaded Rainfall Data from NOAH Rain Gauge ID $site'";
				//echo "query: $queryCreateTable <Br/>";

				//create a table for the noah rain gauge
				if ($result = mysqli_query($con, $queryCreateTable)) {
					echo "Successfully Created 'rain_noah_$site' table!<Br/>";

					//Rainfall Data starts from 2014
					$lastEntry = "2014-01-01 00:00:00";
				} 
				else {
					echo "failed to create table...<Br/>";

					//there might be something wrong with the database setup
					return;
				}
				
			}

			echo "... latest timestamp = " . $lastEntry . "<Br/>";

			//Timestamp format
			$format = 'Y-m-d';
			//Create the start date
			$date = date_create($lastEntry);
			echo "... Start date: " . date_format($date, $format) . "<Br/>";
			$fdate =  date_format($date, $format);
			
			//Create the end data (60 days + start)
			$periodInterval = 50;
			date_add($date, date_interval_create_from_date_string("$periodInterval days"));
			echo "... End date: " . date_format($date, $format) . "<Br/>";
			$tdate = date_format($date, $format);

		    if (PHP_OS == "WINNT") {
		    	//exec('python rainfallNewGetData.py ' . $rsite, $output, $return);  
		    	echo "...Only downloadable on Linux AWS dewslandslide.com due to CORS restriction. <Br/>";
		    	//continue;
		    }
		    elseif (PHP_OS == 'Linux') {
				//call the python script for downloading and normalizing data
				exec('/home/ubuntu/anaconda/bin/python getRainfallNOAH.py ' . 
					$site . ' ' . $fdate . ' ' . $tdate, $output, $return); 
		    }
		    else {
		    	echo "...Port for current OS is non-existent. Write Executable Code for this OS. <Br/>";
		    	continue;
		    }

			//Used to be $output[0] until it was changed by NOAH by indicating 
			//the sensor status on the first part of the json
			//$rain = $output[0];
			//echo $rain;

/*		    echo "...Count of output: " . count($output) . "<Br/>";
		    return;*/

		    if (count($output) > 1) {
				//echo "output[0]";
				

				if($output[0]) {
					$rain = json_decode($output[0]);
				}
				elseif ($output[1]) {
					$rain = json_decode($output[1]);
				}
				elseif ($output[2]) {
					$rain = json_decode($output[2]);
				}
				elseif ($output[3]) {
					$rain = json_decode($output[3]);
				}
			
				//random default query value
				$queryInsertData = "SHOW TABLES LIKE 'rain_noah'";

				$i = 0;
				foreach ($rain as $value) {
					//echo $value->index;
					if ($value->index > $lastEntry) {
						if ($i == 0) {
							$queryInsertData = "INSERT INTO rain_noah_$site(timestamp, cumm, rval) 
									VALUES ('$value->index', '$value->cummulative', '$value->rain')";
						} 
						else {
							$queryInsertData = $queryInsertData . 
									", ('$value->index', '$value->cummulative', '$value->rain')";
						}
	
						$i++;
					}
				}

				if (!mysqli_query($con,$queryInsertData)) {
					die('Error: ' . mysqli_error($con));
				}
			
				$output = [];
				echo "...Finished with: $site ! Added $i Entries <Br/>";			
			}
			else {
				//create an entry with zero data for a point in an entire month for the NOAH id
				$now = time();
				$lastEntry = strtotime($lastEntry);
				$datediff = $now - $lastEntry;
				$secondsToDays = 60 * 60 * 24;
				$datediff = floor($datediff / $secondsToDays);

				echo "...No JSON data, Date diff between today and last entry: $datediff <Br/>";

				if ($datediff > $periodInterval) {
					echo "...Insert a zero entry for the NOAH ID <Br/>";

					$queryInsertData = "INSERT INTO rain_noah_$site(timestamp, cumm, rval) 
						VALUES ('$tdate', -1, -1)";

					if (!mysqli_query($con,$queryInsertData)) {
						die('Error: ' . mysqli_error($con));
					}
				}
			}
		}
	}
	
?>