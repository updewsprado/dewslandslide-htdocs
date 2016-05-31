<?php
	function getSiteColumn($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column WHERE s_id > $sid and s_id < 100";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		echo "s_id,name,date_install,date_activation,lat,lon,sitio,barangay,municipality,province,region,loc_desc" . "\n";

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['date_install'] = $row['date_install'];
			$dbreturn[$ctr]['date_activation'] = $row['date_activation'];
			$dbreturn[$ctr]['lat'] = $row['lat'];
			$dbreturn[$ctr]['lon'] = $row['lon'];
			$dbreturn[$ctr]['sitio'] = $row['sitio'];
			$dbreturn[$ctr]['barangay'] = $row['barangay'];
			$dbreturn[$ctr]['municipality'] = $row['municipality'];
			$dbreturn[$ctr]['province'] = $row['province'];
			$dbreturn[$ctr]['region'] = $row['region'];
			//$dbreturn[$ctr]['loc_desc'] = $row['loc_desc'];
			$dbreturn[$ctr]['loc_desc'] = "blank";		//This has been nulled on the API to avoid parsing error for data transfer

			echo $dbreturn[$ctr]['s_id'] . ",";
			echo $dbreturn[$ctr]['name'] . ",";
			echo $dbreturn[$ctr]['date_install'] . ",";
			echo $dbreturn[$ctr]['date_activation'] . ",";
			echo $dbreturn[$ctr]['lat'] . ",";
			echo $dbreturn[$ctr]['lon'] . ",";
			echo $dbreturn[$ctr]['sitio'] . ",";
			echo $dbreturn[$ctr]['barangay'] . ",";
			echo $dbreturn[$ctr]['municipality'] . ",";
			echo $dbreturn[$ctr]['province'] . ",";
			echo $dbreturn[$ctr]['region'] . ",";
			echo $dbreturn[$ctr]['loc_desc'] . "\n";

			$ctr = $ctr + 1;
		}

	   //echo json_encode( $dbreturn );
	   mysqli_close($con);
	}

	function getSiteNames($host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT name FROM site_column WHERE s_id < 100 ORDER BY name ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		$dbreturn[$ctr++] = "select";
		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr] = $row['name'];

			//echo $dbreturn[$ctr]['loc_desc'] . "\n";

			$ctr = $ctr + 1;
		}

	   echo json_encode( $dbreturn );
	   mysqli_close($con);
	}

	function getSiteColumnJSON($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column WHERE s_id > $sid and s_id < 100";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['date_install'] = $row['date_install'];
			$dbreturn[$ctr]['date_activation'] = $row['date_activation'];
			$dbreturn[$ctr]['lat'] = $row['lat'];
			$dbreturn[$ctr]['lon'] = $row['lon'];
			$dbreturn[$ctr]['sitio'] = $row['sitio'];
			$dbreturn[$ctr]['barangay'] = $row['barangay'];
			$dbreturn[$ctr]['municipality'] = $row['municipality'];
			$dbreturn[$ctr]['province'] = $row['province'];
			$dbreturn[$ctr]['region'] = $row['region'];
			$dbreturn[$ctr]['loc_desc'] = $row['loc_desc'];
			$dbreturn[$ctr]['affected_households'] = $row['affected_households'];
			$dbreturn[$ctr]['installation_status'] = $row['installation_status'];
			$dbreturn[$ctr]['version'] = $row['version'];

			$ctr = $ctr + 1;
		}

	   return json_encode( $dbreturn );
	   mysqli_close($con);
	}

	function getSingleSiteColumn($name = 'blcb', $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column WHERE name ='$name'";
		
		$result = mysqli_query($con, $sql);

		$dbreturn = null;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['date_install'] = $row['date_install'];
			$dbreturn[$ctr]['date_activation'] = $row['date_activation'];
			$dbreturn[$ctr]['lat'] = $row['lat'];
			$dbreturn[$ctr]['lon'] = $row['lon'];
			$dbreturn[$ctr]['sitio'] = $row['sitio'];
			$dbreturn[$ctr]['barangay'] = $row['barangay'];
			$dbreturn[$ctr]['municipality'] = $row['municipality'];
			$dbreturn[$ctr]['province'] = $row['province'];
			$dbreturn[$ctr]['region'] = $row['region'];
			$dbreturn[$ctr]['loc_desc'] = $row['loc_desc'];
			$dbreturn[$ctr]['affected_households'] = $row['affected_households'];
			$dbreturn[$ctr]['installation_status'] = $row['installation_status'];
			$dbreturn[$ctr]['version'] = $row['version'];

			$ctr = $ctr + 1;
		}

		if ($dbreturn) {
			return json_encode( $dbreturn );
		} else {
			echo "Error: Site name does not exist in web database";
		}
		
		mysqli_close($con);
	}

	function getSiteColumnProps($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column_props WHERE s_id > $sid AND s_id < 100 ORDER BY s_id ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		//echo "s_id,name,seg_length,num_nodes,col_length,pos_first_node,first_node_num" . "\n";

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['seg_length'] = $row['seg_length'];
			$dbreturn[$ctr]['num_nodes'] = $row['num_nodes'];
			$dbreturn[$ctr]['col_length'] = $row['col_length'];
			$dbreturn[$ctr]['pos_first_node'] = $row['pos_first_node'];
			$dbreturn[$ctr]['first_node_num'] = $row['first_node_num'];

			echo $dbreturn[$ctr]['s_id'] . ",";
			echo $dbreturn[$ctr]['name'] . ",";
			echo $dbreturn[$ctr]['seg_length'] . ",";
			echo $dbreturn[$ctr]['num_nodes'] . ",";
			echo $dbreturn[$ctr]['col_length'] . ",";
			echo $dbreturn[$ctr]['pos_first_node'] . ",";
			echo $dbreturn[$ctr]['first_node_num'] . "\n";

			$ctr = $ctr + 1;
		}
	
		mysqli_close($con);
	   //echo json_encode( $dbreturn );
	}	

	function getSiteColumnPropsJSON($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column_props WHERE s_id > $sid AND s_id < 100 ORDER BY s_id ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['seg_length'] = $row['seg_length'];
			$dbreturn[$ctr]['num_nodes'] = $row['num_nodes'];
			$dbreturn[$ctr]['col_length'] = $row['col_length'];
			$dbreturn[$ctr]['pos_first_node'] = $row['pos_first_node'];
			$dbreturn[$ctr]['first_node_num'] = $row['first_node_num'];

			$ctr = $ctr + 1;
		}

	   mysqli_close($con);
	   return json_encode( $dbreturn );
	}

	function getSingleSiteColumnProps($name = 'blcb', $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_column_props WHERE name ='$name'";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['s_id'] = $row['s_id'];
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['seg_length'] = $row['seg_length'];
			$dbreturn[$ctr]['num_nodes'] = $row['num_nodes'];
			$dbreturn[$ctr]['col_length'] = $row['col_length'];
			$dbreturn[$ctr]['pos_first_node'] = $row['pos_first_node'];
			$dbreturn[$ctr]['first_node_num'] = $row['first_node_num'];

			$ctr = $ctr + 1;
		}

		if ($dbreturn) {
			echo json_encode( $dbreturn );
		} else {
			echo "Error: Site name does not exist in web database";
		}

		mysqli_close($con);
	}	

	function getSiteRainProps($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_rain_props ORDER BY name ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		//echo "name,max_rain_2year,rain_noah,rain_senslope,rain_arq" . "\n";

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['max_rain_2year'] = $row['max_rain_2year'];
			$dbreturn[$ctr]['rain_noah'] = $row['rain_noah'];
			$dbreturn[$ctr]['rain_noah2'] = $row['rain_noah2'];
			$dbreturn[$ctr]['rain_noah3'] = $row['rain_noah3'];
			$dbreturn[$ctr]['rain_senslope'] = $row['rain_senslope'];
			$dbreturn[$ctr]['rain_arq'] = $row['rain_arq'];

			/*
			echo $dbreturn[$ctr]['name'] . ",";
			echo $dbreturn[$ctr]['max_rain_2year'] . ",";
			echo $dbreturn[$ctr]['rain_noah'] . ",";
			echo $dbreturn[$ctr]['rain_senslope'] . ",";
			echo $dbreturn[$ctr]['rain_arq'] . "\n";
			*/

			$ctr = $ctr + 1;
		}

	   mysqli_close($con);
	   return json_encode( $dbreturn );
	}	

	function getSiteRainPropsJSON($sid = 0, $host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT * FROM site_rain_props ORDER BY name ASC";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$dbreturn[$ctr]['name'] = $row['name'];
			$dbreturn[$ctr]['max_rain_2year'] = $row['max_rain_2year'];
			$dbreturn[$ctr]['rain_noah'] = $row['rain_noah'];
			$dbreturn[$ctr]['rain_noah2'] = $row['rain_noah2'];
			$dbreturn[$ctr]['rain_noah3'] = $row['rain_noah3'];
			$dbreturn[$ctr]['rain_senslope'] = $row['rain_senslope'];
			$dbreturn[$ctr]['rain_arq'] = $row['rain_arq'];

			$ctr = $ctr + 1;
		}

	   mysqli_close($con);
	   return json_encode( $dbreturn );
	}	

	function getSiteSomsJSON($host, $db, $user, $pass) {
		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$sql = "SELECT name 
				FROM site_column 
				WHERE s_id < 100 AND CHAR_LENGTH(name) = 5 AND SUBSTRING(name, 4, 1) = 's' 
				ORDER BY name ASC;";
		
		$result = mysqli_query($con, $sql);

		$dbreturn;
		$ctr = 0;

		while($row = mysqli_fetch_array($result)) {
			$name = $row['name'] . "m";

			//query to check if a table is existing on mysql
			$queryCheck = "SELECT COUNT(*) as isexisting 
							FROM information_schema.tables 
							WHERE table_schema = '".$db."' AND table_name = '".$name."';";
			
			$resultCheck = mysqli_query($con, $queryCheck);
			while($rowCheck = mysqli_fetch_array($resultCheck)) {
				if ($rowCheck['isexisting'] > 0) {
					$dbreturn[$ctr]['name'] = $name;
					$ctr = $ctr + 1;
				}
			}
		}

	   mysqli_close($con);
	   return json_encode( $dbreturn );
	}
?>




















































