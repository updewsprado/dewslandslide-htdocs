<?php
	function getCoord($host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT `name`,`lat`,`lon`, `sitio`, `barangay`, `municipality`, `province`, `region` FROM `site_column`";
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;
		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['lat'] = $row['lat'];
			$dbreturn[$ctr]['lon'] = $row['lon'];
			$dbreturn[$ctr]['sitio'] = $row['sitio'];
			$dbreturn[$ctr]['barangay'] = $row['barangay'];
			$dbreturn[$ctr]['municipality'] = $row['municipality'];
			$dbreturn[$ctr]['province'] = $row['province'];
			$dbreturn[$ctr]['region'] = $row['region'];
			$ctr = $ctr + 1;
		}

	   return json_encode( $dbreturn );

	   mysqli_close($con);
	}
?>		