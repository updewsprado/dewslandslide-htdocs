<?php
	//Variables needed:
	//	site code (3 letters)
	//	crack id (optional)
	//	start date 				- YYYY-MM-DD HH:mm:SS
	//	end date (optional)		- YYYY-MM-DD HH:mm:SS
	function getGndMeas($site=null, $cid=null, $from=null, $to=null, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM gndmeas WHERE site_id = '$site' ";
		// $sql = $sql . "and timestamp > '".$q."' ORDER BY timestamp ASC";

		//if there is value for starting date
		if ($from != null) {
			$sql = $sql . "and timestamp > '$from' ";
		}

		//if there is value for ending date
		if ($to != null) {
			$sql = $sql . "and timestamp < '$to' ";
		}

		//if there is value for crack id
		if ($cid != null) {
			$sql = $sql . "and crack_id = '$cid' ";
		}

		$sql = $sql . "ORDER BY timestamp ASC;";
		// echo $sql."<Br><Br>";

		$result = 0;
		$result = mysqli_query($con, $sql);

		if (!$result) {
		    printf("Error: %s\n", mysqli_error($con));
		    exit();
		}

		$dbreturn = [];
		$ctr = 0;

		//TODO: comment this part
		// Return the number of rows in result set
		// $rowcount = mysqli_num_rows($result);
		// echo "Number of rows: $rowcount<Br>";

		while($row = mysqli_fetch_array($result)) {
			  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			  $dbreturn[$ctr]['meas_type'] = $row['meas_type'];
			  $dbreturn[$ctr]['site_id'] = $row['site_id'];
			  $dbreturn[$ctr]['crack_id'] = $row['crack_id'];
			  $dbreturn[$ctr]['observer_name'] = $row['observer_name'];
			  $dbreturn[$ctr]['meas'] = $row['meas'];
			  $dbreturn[$ctr]['weather'] = $row['weather'];
			  $dbreturn[$ctr]['reliability'] = $row['reliability'];

			  // echo json_encode($dbreturn[$ctr]);

			  $ctr = $ctr + 1;
		}

		mysqli_close($con);

		// echo json_encode($dbreturn);

		if (!isset($dbreturn)) 
			return null;
		else 
			return json_encode($dbreturn);
	}

?>




















































