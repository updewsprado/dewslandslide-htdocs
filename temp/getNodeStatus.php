<?php
require_once('connectDB.php'); 

// Create connection
$con=mysqli_connect($mysql_host, $mysql_user, $mysql_password, $mysql_database);

// Check connection
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql_status = "SELECT post_timestamp,date_of_identification,flagger,site,node,status,comment FROM node_status WHERE status <> 'OK';";
$result = mysqli_query($con, $sql_status);
$statusAll = [];

$ctr_nodes = 0;
while($row = mysqli_fetch_array($result)) {
	$statusAll[$ctr_nodes]['post_timestamp'] = $row['post_timestamp'];
	$statusAll[$ctr_nodes]['date_of_identification'] = $row['date_of_identification'];
	$statusAll[$ctr_nodes]['flagger'] = $row['flagger'];
	$statusAll[$ctr_nodes]['site'] = $row['site'];
	$statusAll[$ctr_nodes]['node'] = $row['node'];
	$statusAll[$ctr_nodes]['status'] = $row['status'];
	$statusAll[$ctr_nodes]['comment'] = $row['comment'];
	
	$ctr_nodes = $ctr_nodes + 1;
}
 
// Print it out as JSON
echo json_encode($statusAll);
?>


































