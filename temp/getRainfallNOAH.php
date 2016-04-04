<?php  

	/**
	 * Returns an array $rain_info containing all rows
	 * returned by the query from corresponding 
	 * rain_noah_[$id] table
	 *
	 * @param      string  		$id       	Rain NOAH table number/id
	 * @param      timestamp  	$start_date  
	 * @param      timestamp  	$end_date
	 * @param      int			$limit 		Number of row to be retrieved
	 * 
	 * @return     array 	$rain_info[x][property] 
	 * 						where:	x is the row number of result
	 *						property is field to access certain property
	 *						(return is in JSON format)
	 */
	function getRainfallNoah($id, $start_date, $end_date = NULL, $limit = null, $host, $db, $user, $pass)
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

		$query = "SELECT * FROM rain_noah_" . $id . " LIMIT 1";
	 	$result = mysqli_query($con, $query);
		
		if( $result == FALSE ) {
			echo "There is no 'rain_noah' table with id = '$id'.";
			return;
		}
		else {

			$query = "SELECT * FROM rain_noah_$id WHERE timestamp > '$start_date'";

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
	# getRainfallNoah('65', '2014-01-02', null, null, null, null, null, null);
?>