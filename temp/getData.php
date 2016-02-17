<?php
	$mysql_host = "mysql.hostinger.ph";
	$mysql_database = "u657292987_sens";
	$mysql_user = "u657292987_def";
	$mysql_password = "sept17";

	//$q = intval($_GET['q']);
	$q = $_GET['q'];
	$site = $_GET['site'];
	
	echo "Site: " . $site . "<Br/>Date: " . $q . "<Br/><Br/>";

	// Create connection
	$con=mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);
	
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	//mysqli_select_db($con,"ajax_demo");
	$sql="SELECT * FROM $site WHERE timestamp > '".$q."' ORDER BY timestamp ASC";
	$result = mysqli_query($con, $sql);

	echo "<table border='1'>
	<tr>
	<th>timestamp</th>
	<th>id</th>
	<th>xvalue</th>
	<th>yvalue</th>
	<th>zvalue</th>
	<th>mvalue</th>
	</tr>";

	while($row = mysqli_fetch_array($result)) {
	  echo "<tr>";
	  echo "<td>" . $row['timestamp'] . "</td>";
	  echo "<td>" . $row['id'] . "</td>";
	  echo "<td>" . $row['xvalue'] . "</td>";
	  echo "<td>" . $row['yvalue'] . "</td>";
	  echo "<td>" . $row['zvalue'] . "</td>";
	  echo "<td>" . $row['mvalue'] . "</td>";
	  echo "</tr>";
	}
	echo "</table>";

   mysqli_close($con);
?>	