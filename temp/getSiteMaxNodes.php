<?php
require_once('connectDB.php'); 

// Create connection
$con=mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

// Check connection
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql_sites = "SELECT name FROM site_column;";
$result = mysqli_query($con, $sql_sites);
$sitesAll = [];

$ctr_nodes = 0;
while($row = mysqli_fetch_array($result)) {
	$sitesAll[$ctr_nodes]['site'] = $row['name'];
	
	$sql_maxnode = "SELECT * FROM site_column_props WHERE s_id IN (SELECT s_id FROM site_column WHERE name = '" . $row['name'] . "') ;";
	$resultNode = mysqli_query($con, $sql_maxnode);
	$rowNode = mysqli_fetch_array($resultNode);
	$sitesAll[$ctr_nodes]['nodes'] = $rowNode['num_nodes'];
	
	$ctr_nodes = $ctr_nodes + 1;
}
 
// Print it out as JSON
echo json_encode($sitesAll);
?>


































