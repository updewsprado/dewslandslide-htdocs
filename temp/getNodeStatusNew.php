<?php

	function getNodeStatus($pid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM node_status WHERE post_id > $pid ORDER BY post_id ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		echo "post_id,post_timestamp,date_of_identification,flagger,site,node,status,comment,inUse" . "\n";

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['post_id'] = $row['post_id'];
			$dbreturn[$ctr]['post_timestamp'] = $row['post_timestamp'];
			$dbreturn[$ctr]['date_of_identification'] = $row['date_of_identification'];
			$dbreturn[$ctr]['flagger'] = $row['flagger'];
			$dbreturn[$ctr]['site'] = $row['site'];
			$dbreturn[$ctr]['node'] = $row['node'];
			$dbreturn[$ctr]['status'] = $row['status'];
			$dbreturn[$ctr]['comment'] = $row['comment'];
			$dbreturn[$ctr]['inUse'] = $row['inUse'];

			echo $dbreturn[$ctr]['post_id'] . ",";
			echo $dbreturn[$ctr]['post_timestamp'] . ",";
			echo $dbreturn[$ctr]['date_of_identification'] . ",";
			echo $dbreturn[$ctr]['flagger'] . ",";
			echo $dbreturn[$ctr]['site'] . ",";
			echo $dbreturn[$ctr]['node'] . ",";
			echo $dbreturn[$ctr]['status'] . ",";
			echo $dbreturn[$ctr]['comment'] . ",";
			echo $dbreturn[$ctr]['inUse'] . "\n";

			$ctr = $ctr + 1;
		}

	   //echo json_encode( $dbreturn );
	   mysqli_close($con);
	}	

	function getNodeStatusJSON($pid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM node_status WHERE post_id > $pid ORDER BY post_id ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['post_id'] = $row['post_id'];
			$dbreturn[$ctr]['post_timestamp'] = $row['post_timestamp'];
			$dbreturn[$ctr]['date_of_identification'] = $row['date_of_identification'];
			$dbreturn[$ctr]['flagger'] = $row['flagger'];
			$dbreturn[$ctr]['site'] = $row['site'];
			$dbreturn[$ctr]['node'] = $row['node'];
			$dbreturn[$ctr]['status'] = $row['status'];
			$dbreturn[$ctr]['comment'] = $row['comment'];
			$dbreturn[$ctr]['inUse'] = $row['inUse'];

			$ctr = $ctr + 1;
		}

	   mysqli_close($con);
	   return json_encode( $dbreturn );
	}		

?>


































