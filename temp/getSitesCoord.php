<?php
	function getCoord($host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT `name`,`lat`,`long`, `place_installed` FROM `site_column`";
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;
		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['lat'] = $row['lat'];
			$dbreturn[$ctr]['long'] = $row['long'];
			$dbreturn[$ctr]['place_installed'] = $row['place_installed'];
			$ctr = $ctr + 1;
		}

	   echo json_encode( $dbreturn );

	   mysqli_close($con);
	}
?>		