<?php
	//function getSiteHealth($site, $host, $db, $user, $pass) {
	function getSiteHealth($q, $site, $host, $db, $user, $pass) {
	//function getSiteHealth($q, $site, $nid, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql_maxnode = "SELECT * FROM site_column_props WHERE s_id IN (SELECT s_id FROM site_column WHERE name = '" . $site . "') ;";
		$result = mysqli_query($con, $sql_maxnode);
		
		$row = mysqli_fetch_array($result);
		$maxnode = $row['num_nodes'];
		
		//$sql = "SELECT DISTINCT timestamp FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
		$sql = "SELECT FROM_UNIXTIME( CEILING(UNIX_TIMESTAMP(`timestamp`)/1800)*1800 ) 
				AS timeslice , COUNT(*) AS mycount FROM $site WHERE timestamp > '".$q."'
				and id <= $maxnode GROUP BY timeslice";
		$result = mysqli_query($con, $sql);

		$dbtstamp;
		$ctr_ts = 0;
		while($row = mysqli_fetch_array($result)) {
			$dbtstamp[$ctr_ts]['timestamp'] = $row['timeslice'];
			$dbtstamp[$ctr_ts]['count'] = $row['mycount'];
			$ctr_ts = $ctr_ts + 1;
		}
		
		/*
		while($row = mysqli_fetch_array($result)) {
			$dbtstamp[$ctr_ts]['timestamp'] = $row['timestamp'];

			$ctr_ts = $ctr_ts + 1;
		}
		
		$i = 0;
		while($i < $ctr_ts) {
			$cur_ts = $dbtstamp[$i]['timestamp'];
			$sql_health = "select count(timestamp) as totalRows from $site where timestamp = '" . $cur_ts . "'";
			$result = mysqli_query($con, $sql_health);
			$row = mysqli_fetch_array($result);
			
			$dbtstamp[$i]['count'] = $row['totalRows'];
			$i = $i + 1;
		}
		*/

		return json_encode( $dbtstamp );

		mysqli_close($con);
	}
?>