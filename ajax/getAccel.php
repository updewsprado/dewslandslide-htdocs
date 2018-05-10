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
			  
			  if (isset($row['mvalue'])) $dbreturn[$ctr]['mvalue'] = $row['mvalue'];

			  $ctr = $ctr + 1;
		}

		if (!isset($dbreturn)) return null;
		else return json_encode($dbreturn);

	   mysqli_close($con);
	}
	
	function getAccelSite($q, $site, $limit = null, $host, $db, $user, $pass) {
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
			if ($limit == null) {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC LIMIT $limit";
			}
			
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
		}
		elseif ( ($version == 2) || ($version == 3) ) {
			if ($limit == null) {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC LIMIT $limit";
			}

			$result = mysqli_query($con, $sql);

			$dbreturn;
			$ctr = 0;

			echo "timestamp,id,msgid,xvalue,yvalue,zvalue,batt" . "\n";
			
			while($row = mysqli_fetch_array($result)) {
				$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				$dbreturn[$ctr]['id'] = $row['id'];
				$dbreturn[$ctr]['msgid'] = $row['msgid'];
				$dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				$dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				$dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				$dbreturn[$ctr]['batt'] = $row['batt'];
				
				echo $dbreturn[$ctr]['timestamp'] . ",";
				echo $dbreturn[$ctr]['id'] . ",";
				echo $dbreturn[$ctr]['msgid'] . ",";
				echo $dbreturn[$ctr]['xvalue'] . ",";
				echo $dbreturn[$ctr]['yvalue'] . ",";
				echo $dbreturn[$ctr]['zvalue'] . ",";
				echo $dbreturn[$ctr]['batt'] . "\n";

				$ctr = $ctr + 1;
			}
		}
		else {
			echo "Error: Either table does not exist or Version is $version";
		}

		//echo json_encode( $dbreturn );

		mysqli_close($con);
	}

	function getAccelSite2($from, $to, $site, $limit = null, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		//start of adapted
		$sql = "SELECT version FROM site_column WHERE name = '$site'";
		$result = mysqli_query($con, $sql);

		$version = 0;
		while($row = mysqli_fetch_array($result)) {
			$version = $row['version'];
		}
		
		if ($version == 1) {
			if ($limit == null) {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$from."' AND timestamp <= '".$to."' ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$from."' AND timestamp <= '".$to."' ORDER BY timestamp ASC LIMIT $limit";
			}
			
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
		}
		elseif ( ($version == 2) || ($version == 3) ) {
			if ($limit == null) {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$from."' AND timestamp <= '".$to."' ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE timestamp > '".$from."' AND timestamp <= '".$to."' ORDER BY timestamp ASC LIMIT $limit";
			}

			$result = mysqli_query($con, $sql);

			$dbreturn;
			$ctr = 0;

			echo "timestamp,id,msgid,xvalue,yvalue,zvalue,batt" . "\n";
			
			while($row = mysqli_fetch_array($result)) {
				$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				$dbreturn[$ctr]['id'] = $row['id'];
				$dbreturn[$ctr]['msgid'] = $row['msgid'];
				$dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				$dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				$dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				$dbreturn[$ctr]['batt'] = $row['batt'];
				
				echo $dbreturn[$ctr]['timestamp'] . ",";
				echo $dbreturn[$ctr]['id'] . ",";
				echo $dbreturn[$ctr]['msgid'] . ",";
				echo $dbreturn[$ctr]['xvalue'] . ",";
				echo $dbreturn[$ctr]['yvalue'] . ",";
				echo $dbreturn[$ctr]['zvalue'] . ",";
				echo $dbreturn[$ctr]['batt'] . "\n";

				$ctr = $ctr + 1;
			}
		}
		else {
			echo "Error: Either table does not exist or Version is $version";
		}

		mysqli_close($con);
	}
	
	function getAccel2($from, $to, $site, $nid, $dataset = null, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$dbreturn;
		$ctr = 0;

		if (strlen($site) == 4) {
			//version 1 sensors
			$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to ORDER BY timestamp ASC";

			$result = mysqli_query($con, $sql);

			while($row = mysqli_fetch_array($result)) {
				  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				  $dbreturn[$ctr]['mvalue'] = $row['mvalue'];

				  $ctr = $ctr + 1;
			}			
		} else {
			//version 2 sensors
			if ($dataset) {
				if ($dataset == 1) {
					$msgid = 32;
				}
				elseif ($dataset == 2) {
					$msgid = 33;
				}
				else {
					//default value
					$msgid = 32;
				}

				$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to and msgid = $msgid ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to and msgid = 32 ORDER BY timestamp ASC";
			}

			$result = mysqli_query($con, $sql);

			while($row = mysqli_fetch_array($result)) {
				  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];

				  $ctr = $ctr + 1;
			}
		}
		
		return json_encode( $dbreturn );

		mysqli_close($con);
	}

	function getAccel3($from, $to, $site, $nid, $dataset = null, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$dbreturn;
		$ctr = 0;

		if (strlen($site) == 4) {
			//version 1 sensors
			$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to ORDER BY timestamp ASC";

			$result = mysqli_query($con, $sql);

			while($row = mysqli_fetch_array($result)) {
				  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				  $dbreturn[$ctr]['mvalue'] = $row['mvalue'];

				  $ctr = $ctr + 1;
			}			
		} else {
			//version 2 sensors
			if ($dataset) {
				if ($dataset == 1) {
					$msgid = 32;
				}
				elseif ($dataset == 2) {
					$msgid = 33;
				}
				else {
					//default value
					$msgid = 32;
				}

				$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to and (msgid & 1) = ($msgid & 1) ORDER BY timestamp ASC";
			} else {
				$sql = "SELECT * FROM $site WHERE id = $nid and timestamp between $from and $to and (msgid & 1) = (32 & 0) ORDER BY timestamp ASC";
			}

			$result = mysqli_query($con, $sql);

			while($row = mysqli_fetch_array($result)) {
				  $dbreturn[$ctr]['timestamp'] = $row['timestamp'];
				  $dbreturn[$ctr]['xvalue'] = $row['xvalue'];
				  $dbreturn[$ctr]['yvalue'] = $row['yvalue'];
				  $dbreturn[$ctr]['zvalue'] = $row['zvalue'];
				  $dbreturn[$ctr]['batt'] = $row['batt'];

				  $ctr = $ctr + 1;
			}
		}
		
		return json_encode( $dbreturn );

		mysqli_close($con);
	}

	function getSomsSite($from, $to = null, $site, $limit = null, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM $site WHERE timestamp > '".$from."'";

		if ($to != null) {
			$sql = $sql . " AND timestamp <= '".$to."'";
		}

		if ($limit == null) {
			$sql = $sql . " ORDER BY timestamp ASC";
		} else {
			$sql = $sql . " ORDER BY timestamp ASC LIMIT $limit";
		}

		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		//echo "timestamp,id,msgid,mvalue" . "\n";
		
		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['timestamp'] = $row['timestamp'];
			$dbreturn[$ctr]['id'] = $row['id'];
			$dbreturn[$ctr]['msgid'] = $row['msgid'];
			$dbreturn[$ctr]['mval1'] = $row['mval1'];
			$dbreturn[$ctr]['mval2'] = $row['mval2'];
			
			/*
			echo $dbreturn[$ctr]['timestamp'] . ",";
			echo $dbreturn[$ctr]['id'] . ",";
			echo $dbreturn[$ctr]['msgid'] . ",";
			echo $dbreturn[$ctr]['mvalue'] . "\n";
			*/

			$ctr = $ctr + 1;
		}

		return json_encode($dbreturn);
		mysqli_close($con);
	}
?>




















































