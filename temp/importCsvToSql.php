<?php
require_once('connectDB.php'); 

function importSiteRainPropsCSV($mysql_host, $mysql_user, $mysql_password, $mysql_database,
								$csv_file = "SiteRainProps.csv")
{
	// Create connection
	$con=mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	if (($handle = fopen($csv_file, "r")) !== FALSE) {
		fgetcsv($handle);   
		$ctr = 0;
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        $num = count($data);
	        for ($c=0; $c < $num; $c++) {
				$col[$ctr][$c] = $data[$c];
	        }
	        echo json_encode($col[$ctr]) . "<Br>";

	        //check if site name is existing already
	        $tempName = $col[$ctr][0];
	        $queryExistCheck = "SELECT r_id FROM site_rain_props WHERE LEFT(name, 3) = '$tempName'";
	        $result = mysqli_query($con, $queryExistCheck);

	        $sitesToUpdate = [];
	        $i = 0;
	        while($row = mysqli_fetch_array($result)) {
	        	$sitesToUpdate[$i++] = $row['r_id'];
	        }

	    	$noah1 = $col[$ctr][1];
	    	$noah2 = $col[$ctr][2];
	    	$noah3 = $col[$ctr][3];
	    	$max2years = $col[$ctr][4];

	        //If the site is existing and needs only to be updated
	        if (count($sitesToUpdate) > 0) {

	        	for ($j=0; $j < count($sitesToUpdate); $j++) { 
	        		$idToUpdate = $sitesToUpdate[$j];
	        		$queryUpdate = "UPDATE 
	        							site_rain_props 
	        						SET 
	        							max_rain_2year = $max2years,
	        							rain_noah = $noah1,
	        							rain_noah2 = $noah2,
	        							rain_noah3 = $noah3
	        						WHERE
	        							r_id = $idToUpdate";

					if (mysqli_query($con, $queryUpdate)) {
					    echo "Record updated successfully<Br>";
					} else {
					    echo "Error updating record: " . mysqli_error($con) . "<Br>";
					}
	        	}
	        }
	        //Insert data to db if the site doesn't exist yet
	        else {
	        	$siteName = $col[$ctr][0];
	        	$queryInsert = "INSERT INTO
	        						site_rain_props (name, 
	        											max_rain_2year, 
	        											rain_noah, 
	        											rain_noah2, 
	        											rain_noah3)
	        					VALUES 
	        						('$siteName',$max2years,$noah1,$noah2,$noah3)";

				if (mysqli_query($con, $queryInsert)) {
				    echo "Record inserted successfully<Br>";
				} else {
				    echo "Error inserting record: " . mysqli_error($con) . "<Br>";
				}
	        }

	        $ctr++;
		}
	    fclose($handle);
	}

	echo "File data successfully imported to database!!";
	mysqli_close($con);
}

function importSiteColumnGPSCSV($mysql_host, $mysql_user, $mysql_password, $mysql_database,
								$csv_file = "SiteGPS.csv")
{
	// Create connection
	$con=mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	if (($handle = fopen($csv_file, "r")) !== FALSE) {
		fgetcsv($handle);   
		$ctr = 0;
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        $num = count($data);
	        for ($c=0; $c < $num; $c++) {
				$col[$ctr][$c] = $data[$c];
	        }
	        echo json_encode($col[$ctr]) . "<Br>";

	        /*
			1. Check if the exact site name exists
				- get the s_id
				- Update lat,long,sitio,bgy,municipality,province,region
			2. Else if first 3 letter site name exists
				- No Updating will be done
				- just "continue" the while loop
			3. Else (the site is really new)
				- set s_id = max(s_id) + 1
				- insert data
	        */

			//3 Letter site code
			$tempName = $col[$ctr][0];
			$lat = $col[$ctr][1];
			$long = $col[$ctr][2];
			$sitio = $col[$ctr][3];
			$barangay = $col[$ctr][4];
			$municipality = $col[$ctr][5];
			$province = $col[$ctr][6];
			$region = $col[$ctr][7];

			//check if the exact site name exists
	        $queryExistExactCheck = "SELECT s_id, name FROM site_column WHERE name = '$tempName'";
	        if ($result = mysqli_query($con, $queryExistExactCheck)) {
	        	if ($row = mysqli_fetch_assoc($result)) {
			        $siteToUpdate = [];
		        	echo "update site id: ".$row['s_id'].", name: ".$row['name']."<Br>";
		        	$siteToUpdate = $row['s_id'];

		        	//Todo: Add code for Updating the site id
	        		$queryUpdate = "UPDATE 
	        							site_column 
	        						SET 
	        							lat = $lat,
	        							lon = $long";

	        		if ($sitio) {
	        			$queryUpdate = $queryUpdate.", sitio = '$sitio'";
	        		}

	        		if ($barangay) {
	        			$queryUpdate = $queryUpdate.", barangay = '$barangay'";
	        		}

	        		if ($municipality) {
	        			$queryUpdate = $queryUpdate.", municipality = '$municipality'";
	        		}

	        		if ($province) {
	        			$queryUpdate = $queryUpdate.", province = '$province'";
	        		}

	        		if ($region) {
	        			$queryUpdate = $queryUpdate.", region = '$region'";
	        		}

	        		$queryUpdate = $queryUpdate." WHERE s_id = $siteToUpdate;";

	        		//echo "$queryUpdate<Br>";

					if (mysqli_query($con, $queryUpdate)) {
					    echo "Record updated successfully<Br>";
					} else {
					    echo "Error updating record: " . mysqli_error($con) . "<Br>";
					}

		        	continue;
	        	}
	        }

	        //check if the sensor columns exist for the 3 letter site code
	        $queryExistSitesCheck = "SELECT s_id, name FROM site_column WHERE LEFT(name, 3) = '$tempName'";
	        if ($result = mysqli_query($con, $queryExistSitesCheck)) {
				// Return the number of rows in result set
				$rowcount=mysqli_num_rows($result);

				if ($rowcount > 0) {
		        	//Do nothing since existing sensor columns for the site code means that they
		        	//have their own specific GPS location
				} 
				else {
					//Not yet existing in the database
					echo "add site name: $tempName <Br>";

					//set s_id = max(s_id) + 1
					$insertID = 0;
					$queryGetMaxSid = "SELECT max(s_id) AS max FROM site_column";
		        	$result = mysqli_query($con, $queryGetMaxSid);

		        	$row = mysqli_fetch_assoc($result);
	        		$insertID = $row['max'] + 1;
	        		echo "target SID: $insertID <Br>";

					//insert new data to db
		        	$siteName = "'".$col[$ctr][0]."'";

	        		if ($sitio) {
	        			$sitio = "'".$sitio."'";
	        		}
	        		else {
	        			$sitio = 'null';
	        		}

	        		if ($barangay) {
	        			$barangay = "'".$barangay."'";
	        		}
	        		else {
	        			$barangay = 'null';
	        		}

	        		if ($municipality) {
	        			$municipality = "'".$municipality."'";
	        		}
	        		else {
	        			$municipality = 'null';
	        		}

	        		if ($province) {
	        			$province = "'".$province."'";
	        		}
	        		else {
	        			$province = 'null';
	        		}

	        		if ($region) {
	        			$region = "'".$region."'";
	        		}
	        		else {
	        			$region = 'null';
	        		}

		        	$queryInsert = "INSERT INTO
		        						site_column (s_id,
		        									name, 
        											lat, 
        											lon, 
        											sitio, 
        											barangay,
        											municipality,
        											province,
        											region)
		        					VALUES 
		        						($insertID,$siteName,$lat,$long,$sitio,
		        						$barangay,$municipality,$province,
		        						$region)";

					echo "$queryInsert<Br>";

					if (mysqli_query($con, $queryInsert)) {
					    echo "Record inserted successfully<Br>";
					} else {
					    echo "Error inserting record: " . mysqli_error($con) . "<Br>";
					}
				}
	        }

	        $ctr++;
		}
	    fclose($handle);
	}

	echo "File data successfully imported to database!!";
	mysqli_close($con);
}

//import site rain props csv from Dynaslope
/*importSiteRainPropsCSV($mysql_host, $mysql_user, $mysql_password, $mysql_database,
						$csv_file = "SiteRainProps.csv");*/

//import site column GPS data from Dynaslope
importSiteColumnGPSCSV($mysql_host, $mysql_user, $mysql_password, $mysql_database,
						$csv_file = "SiteGPS.csv");
?>