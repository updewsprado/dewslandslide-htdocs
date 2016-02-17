<?php
	function getAccel($q, $site, $nid, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM $site WHERE id = $nid and timestamp > '".$q."' ORDER BY timestamp ASC";
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;
		while($row = mysqli_fetch_array($result)) {
			  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
			  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
			  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];
			  $dbreturn[$ctr]['mvalue'] = $row['mvalue'];

			  $ctr = $ctr + 1;
		}

	   echo json_encode( $dbreturn );

	   mysqli_close($con);
	}
	
	function getAccelSite($q, $site, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT version FROM site_column WHERE name = '$site'";
		$result = mysqli_query($con, $sql);

		$version = 0;
		while($row = mysqli_fetch_array($result)) {
			$version = $row['version'];
		}
		
		if ($version == 1) {
			$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
			$result = mysqli_query($con, $sql);

			$dbreturn;
			$ctr = 0;

			//echo "timestamp,id,xvalue,yvalue,zvalue,mvalue" . "\n";
			$string = "timestamp,id,xvalue,yvalue,zvalue,mvalue" . "\n";
			
			while($row = mysqli_fetch_array($result)) {
				$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				$dbreturn[$ctr]['id'] = $row['id'];
				$dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				$dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				$dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				$dbreturn[$ctr]['mvalue'] = $row['mvalue'];
				
				/*
				echo $dbreturn[$ctr]['timestamp'] . ",";
				echo $dbreturn[$ctr]['id'] . ",";
				echo $dbreturn[$ctr]['xvalue'] . ",";
				echo $dbreturn[$ctr]['yvalue'] . ",";
				echo $dbreturn[$ctr]['zvalue'] . ",";
				echo $dbreturn[$ctr]['mvalue'] . "\n";
				*/
				$string = $string . $dbreturn[$ctr]['timestamp'] . "," . $dbreturn[$ctr]['id'] . "," .
					$dbreturn[$ctr]['xvalue'] . "," . $dbreturn[$ctr]['yvalue'] . "," .
					$dbreturn[$ctr]['zvalue'] . "," . $dbreturn[$ctr]['mvalue'] . "\n";

				$ctr = $ctr + 1;
			}

			echo $string;
		}
		elseif ($version == 2) {
			//echo "version 2";

			$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
			$result = mysqli_query($con, $sql);

			$dbreturn;
			$ctr = 0;

			//echo "timestamp,id,msgid,xvalue,yvalue,zvalue,batt" . "\n";
			$string = "timestamp,id,msgid,xvalue,yvalue,zvalue,batt" . "\n";
			
			while($row = mysqli_fetch_array($result)) {
				$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				$dbreturn[$ctr]['id'] = $row['id'];
				$dbreturn[$ctr]['msgid'] = $row['msgid'];
				$dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				$dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				$dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				$dbreturn[$ctr]['batt'] = $row['batt'];
				
				/*
				echo $dbreturn[$ctr]['timestamp'] . ",";
				echo $dbreturn[$ctr]['id'] . ",";
				echo $dbreturn[$ctr]['msgid'] . ",";
				echo $dbreturn[$ctr]['xvalue'] . ",";
				echo $dbreturn[$ctr]['yvalue'] . ",";
				echo $dbreturn[$ctr]['zvalue'] . ",";
				echo $dbreturn[$ctr]['batt'] . "\n";
				*/

				$string = $string . $dbreturn[$ctr]['timestamp'] . "," . $dbreturn[$ctr]['id'] . "," .
					$dbreturn[$ctr]['msgid'] . "," . $dbreturn[$ctr]['xvalue'] . "," . 
					$dbreturn[$ctr]['yvalue'] . "," . $dbreturn[$ctr]['zvalue'] . "," . 
					$dbreturn[$ctr]['batt'] . "\n";

				$ctr = $ctr + 1;
			}

			echo $string;
		}
		else {
			echo "entered else. Version is $version";
		}

		//echo json_encode( $dbreturn );

		mysqli_close($con);
	}

	function getAccelSite2($from, $to, $site, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM $site WHERE timestamp > '".$from."' AND timestamp <= '".$to."' ORDER BY timestamp ASC";
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;
		
		echo "timestamp,id,xvalue,yvalue,zvalue,mvalue" . "\n";
		
		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			$dbreturn[$ctr]['id'] = $row['id'];
			$dbreturn[$ctr]['xvalue'] = $row['xvalue'];
			$dbreturn[$ctr]['yvalue'] = $row['yvalue'];
			$dbreturn[$ctr]['zvalue'] = $row['zvalue'];
			$dbreturn[$ctr]['mvalue'] = $row['mvalue'];
			
			echo $dbreturn[$ctr]['timestamp'] . ",";
			echo $dbreturn[$ctr]['id'] . ",";
			echo $dbreturn[$ctr]['xvalue'] . ",";
			echo $dbreturn[$ctr]['yvalue'] . ",";
			echo $dbreturn[$ctr]['zvalue'] . ",";
			echo $dbreturn[$ctr]['mvalue'] . "\n";

			$ctr = $ctr + 1;
		}

		//echo json_encode( $dbreturn );

		mysqli_close($con);
	}
	
	function getAccel2($from, $to, $site, $nid, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		//$sql = "SELECT * FROM $site WHERE id = $nid and timestamp > '".$from."' ORDER BY timestamp ASC";
		$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to ORDER BY timestamp ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;
		while($row = mysqli_fetch_array($result)) {
			  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
			  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
			  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];
			  $dbreturn[$ctr]['mvalue'] = $row['mvalue'];

			  $ctr = $ctr + 1;
		}

	   echo json_encode( $dbreturn );

	   mysqli_close($con);
	}
?>




















































