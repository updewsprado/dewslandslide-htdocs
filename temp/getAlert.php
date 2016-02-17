<?php
/*
 * Combines the data from "xy_cs_0" and "xy_cs" to form data for plotting
 */
 
header('Content-type: application/json');

$file = 'lsbalerts2.csv';
//$path = '../ajax/csvmonitoring/';
$path = '';

// Set your CSV feed
$feed = $path . $file;

// Arrays we'll use later
$keys = array();
$arrayAlert = array();
$arrayPlot = array();
 
// Function to convert CSV into associative array
function csvToArray($file, $delimiter) { 
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
      for ($j = 0; $j < count($lineArray); $j++) { 
        $arr[$i][$j] = $lineArray[$j]; 
      } 
      $i++; 
    } 
    fclose($handle); 
  } 
  return $arr; 
}
 
// Do it
$dataAlert = csvToArray($feed, ',');
 
// Set number of elements (minus 1 because we shift off the first row)
$count = count($dataAlert);

//Use first row for names
$labels = ["site","node","xalert","yalert","zalert"];
 
foreach ($labels as $label) {
  $keys[] = $label;
}

// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $dX = array_combine($keys, $dataAlert[$j]);
  $arrayAlert[$j] = $dX;
}

// Print as JSON data
echo json_encode($arrayAlert);
?>


































