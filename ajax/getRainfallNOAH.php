<?php  

	/**
	 * Author: Kevin Dhale dela Cruz
	 *
	 * Returns an array $rain_info containing 
	 * max_rainfall_2year data andall rows
	 * returned by the query from corresponding 
	 * rain_noah_[$id] tables
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
	function getRainfallNoah($site, $start_date, $end_date = NULL, $limit = null, $host, $db, $user, $pass)
	{
		
		$host = "localhost";
		$user = "root";
		$pass = "senslope";
		$db = "senslopedb";


		/**
		* A class that carries data to be returned
		*/
		class Noah
		{
			public $rain_noah = [];
			public $rain_noah2 = [];
			public $rain_noah3 = [];
			public $max_rain_2year;
			
			public function getData($con, $noahArray, $table_no, $start_date, $end_date, $limit)
			{
				$query = "SELECT * FROM rain_noah_$table_no WHERE timestamp > '$start_date'";

				if (!is_null($end_date)) $query = $query . " AND timestamp <= '$end_date'";			
				if(!is_null($limit)) $query = $query . " LIMIT $limit";
				//echo $query;
				
				global $con;
		 		$result = mysqli_query($con, $query);

		 		$i = 0;
				while ($row = mysqli_fetch_assoc($result)) {
					if($noahArray == 'rain_noah') $this->rain_noah[$i] = $row;
					else if($noahArray == 'rain_noah2') $this->rain_noah2[$i] = $row;
					else if($noahArray == 'rain_noah3') $this->rain_noah3[$i] = $row;

					$i = $i + 1;
				}
			}
		}

		global $con;
		$con = mysqli_connect($host, $user, $pass, $db);
		if ( mysqli_connect_errno() ) {
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}


		$query = "SELECT max_rain_2year, rain_noah, rain_noah2, rain_noah3 FROM site_rain_props WHERE LEFT(name,3) = '$site'";
		$result = mysqli_query($con, $query);
		$maxAndTables = mysqli_fetch_assoc($result);
		//var_dump($maxAndTables);
		

		$noahArray = ['rain_noah', 'rain_noah2', 'rain_noah3'];
		$rain_info = new Noah;
		//var_dump($noah);
		$rain_info->max_rain_2year = $maxAndTables['max_rain_2year'];
		

		foreach ($noahArray as $name) 
		{	
			$rain_info->getData($con, $name, $maxAndTables[$name], $start_date, $end_date, $limit);
		}
		//var_dump($rain_info);


		mysqli_close($con);
		//echo json_encode($rain_info);
		return json_encode($rain_info);
	}

	# Testing Area
	# getRainfallNoah('agb', '2015-01-21', null, null, null, null, null, null);
?>