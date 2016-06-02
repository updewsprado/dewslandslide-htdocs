<?php  

	/**
	 * Author: Kevin Dhale dela Cruz
	 *
	 * Returns an array $rain_info containing all rows
	 * returned by the query from corresponding rain_ARQ
	 * table of each site
	 *
	 * @param      string  		$site       
	 * @param      timestamp  	$start_date  
	 * @param      timestamp  	$end_date
	 * @param      int			$limit 		Number of row to be retrieved
	 * 
	 * @return     object 	$rain_info->[property] 
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

		/**
		* Object that will be returned
		*/
		class ARQ
		{
			public $max_rain_2year;
			public $rain_arq = [];
		}

		$con = mysqli_connect($host, $user, $pass, $db);
		if ( mysqli_connect_errno() ) {
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$query = "SELECT rain_arq, max_rain_2year FROM site_rain_props WHERE LEFT(name,3) = '$site' AND rain_arq IS NOT NULL";
		$result = mysqli_query($con, $query);
		$output = mysqli_fetch_object($result);
		//echo $output[0];
		//var_dump($output);

		if( is_null($output->rain_arq) ) {
			echo "Site \"$site\" has no corresponding \"rain_ARQ\" values.";
			return;
		}
		else { 
			$query = "SELECT * FROM $output->rain_arq WHERE timestamp > '$start_date'";
			if (!is_null($end_date)) $query = $query . " AND timestamp <= '$end_date'";			
			if(!is_null($limit)) $query = $query . " LIMIT $limit";
			//echo $query;
			
			$result = mysqli_query($con, $query);

			$rain_info = new ARQ;
			$rain_info->max_rain_2year = $output->max_rain_2year;

			$i = 0;
			while ($row = mysqli_fetch_assoc($result)) {
				$rain_info->rain_arq[$i] = $row;
				//var_dump($rain_info);
				$i = $i + 1;
			}
		}

		mysqli_close($con);
		return json_encode($rain_info);

	}

	# Testing Area
	# getRainfallARQ('agb', '2015-10-20', '2016-01-01');
?>