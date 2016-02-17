<?php
	function getHealth($site, $host, $db, $user, $pass) {
		//$site = $_GET['site'];
		//echo "site = $site, db = $db, user = $user, pass = $pass<Br/>";

		// Create connection
		$con=mysqli_connect($host, $user, $pass, $db);
		
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		
		$sql_maxnode = "SELECT * FROM site_column_props WHERE s_id IN (SELECT s_id FROM site_column WHERE name = '" . $site . "');";
		$result = mysqli_query($con, $sql_maxnode);
		$maxnode;
		
		$row = mysqli_fetch_array($result);
		$maxnode = $row['num_nodes'];
		
		$sql_nodes = "SELECT DISTINCT id FROM $site WHERE id <= $maxnode AND id != '0' ORDER BY id ASC";
		$result = mysqli_query($con, $sql_nodes);
		$result_nodes;
		
		$ctr_nodes = 0;
		while($row = mysqli_fetch_array($result)) {
			$result_nodes[$ctr_nodes]['node'] = $row['id'];
			$result_nodes[$ctr_nodes]['week'] = 0.0;
			$result_nodes[$ctr_nodes]['month'] = 0.0;
			$result_nodes[$ctr_nodes]['all'] = 0.0;
			$ctr_nodes = $ctr_nodes + 1;
		}	

		date_default_timezone_set("Asia/Manila");
		$date_cur = "'" . date('Y-m-d H:i:s') . "'";
		
		$date_range = "";
		
		$array_range = array(7,30,0); 

		foreach ($array_range as $range) {

			// Check if range is Overall date (0)
			if ((int)($range) === 0) {
				$sql_ts = "SELECT date_activation FROM site_column WHERE name = '" . $site . "' ;";
				$result = mysqli_query($con, $sql_ts);
				$row = mysqli_fetch_array($result);
				$date_range = "'" . $row['date_activation'] . "'";

				$sql_ts = "SELECT DATEDIFF($date_cur, $date_range) AS DiffDate";
				$result = mysqli_query($con, $sql_ts);
				$row = mysqli_fetch_array($result);
				$range = $row['DiffDate'];
			}
			else {
				$date_string = "-" . $range . " days";
				$date_range =  "'" . date('Y-m-d H:i:s',strtotime($date_string)) . "'";
			}
			
			$i = 0;
			
			while($i < $ctr_nodes) {
				$cur_node = $result_nodes[$i]['node'] ;	
				$sql_health = "select count(distinct timestamp) as totalRows from $site where id = $cur_node and xvalue IS NOT NULL and timestamp between $date_range and $date_cur";
				
				$result = mysqli_query($con, $sql_health);
				$row = mysqli_fetch_array($result);
				
				//30 days * 48 times per day expected report
				$max_report = (int)($range) * 48.0;
				
				if((int)($range) === 7)
					$result_nodes[$i]['week'] = round($row['totalRows'] / $max_report, 5);	
				elseif((int)($range) === 30)
					$result_nodes[$i]['month'] = round($row['totalRows'] / $max_report, 5);	
				else
					$result_nodes[$i]['all'] = round($row['totalRows'] / $max_report, 5);	
				
				$i = $i + 1;
			}
		}
			
		echo json_encode( $result_nodes );

		mysqli_close($con);
	}
?>		