<?php  

	/**
	 * Returns an array $rain_info containing all rows
	 * returned by the query from corresponding rain_ARQ
	 * table of each site
	 *
	 * @param      string  		$site       
	 * @param      timestamp  	$start_date  
	 * @param      timestamp  	$end_date
	 * @param      int			$limit 		Number of row to be retrieved
	 * 
	 * @return     array 	$rain_info[x][property] 
	 * 						where:	x is the row number of result
	 *						property is field to access certain property
	 *						(return is in JSON format)
	 */
	function getRainfallARQ($site, $start_date, $end_date = NULL, $limit = null, $host, $db, $user, $pass)
	{
		/*
		$host = "localhost";
		$user = "root";
		$pass = "senslope";
		$db = "senslopedb";
		*/

		$con = mysqli_connect($host, $user, $pass, $db);
		if ( mysqli_connect_errno() ) {
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$query = "SELECT rain_arq FROM site_rain_props WHERE name = '$site'";
		$result = mysqli_query($con, $query);
		$table_name = mysqli_fetch_array($result);
		//echo $table_name[0];
		//var_dump($table_name);

		if( is_null($table_name[0]) ) {
			echo "Site \"$site\" has no corresponding \"rain_ARQ\" values.";
			return;
		}
		else { 
			$query = "SELECT * FROM $table_name[0] WHERE timestamp > '$start_date'";
			if (!is_null($end_date)) $query = $query . " AND timestamp <= '$end_date'";			
			if(!is_null($limit)) $query = $query . " LIMIT $limit";
			//echo $query;
			
			$result = mysqli_query($con, $query);

			$i = 0;
			while ($row = mysqli_fetch_assoc($result)) {
				$rain_info[$i] = $row;
				//var_dump($rain_info);
				$i = $i + 1;
			}
		}

		mysqli_close($con);
		return json_encode($rain_info);

	}

	# Testing Area
	# getRainfallARQ('agbsb', '2015-10-20', '2016-01-01');
?>