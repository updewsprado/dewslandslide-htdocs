<?php   
    if(isset($_GET['site'])) {
	    $site = $_GET['site'];
	}
	else {
		echo "Error: No value for site has been set";
		return -1;
	}

	//assign the string value "nil" for parameters that are empty for the values
	//being passed to the python code
    if(isset($_GET['node'])) {
	    $node = $_GET['node'];
	}
	else {
		$node = "nil";
	}

	if(isset($_GET['start'])) {
	    $temp = $_GET['start'];
	    $date = date_create($temp);
		$start = date_format($date, 'Y-m-d+H:i:s');
	}
	else {
		$start = "nil";
	}

	if(isset($_GET['end'])) {
	    $temp = $_GET['end'];
	    $date = date_create($temp);
		$end = date_format($date, 'Y-m-d+H:i:s');
	}
	else {
		$end = "nil";
	}

	if(isset($_GET['msgid'])) {
	    $msgid = $_GET['msgid'];
	}
	else {
		$msgid = "nil";
	}

	$os = PHP_OS;
	//echo "Operating System: $os <Br>";

	if (strpos($os,'WIN') !== false) {
	    $pythonPath = 'C:\Anaconda\python.exe';
	}
	elseif ((strpos($os,'Ubuntu') !== false) || (strpos($os,'Linux') !== false)) {
		$pythonPath = '/home/ubuntu/anaconda2/bin/python';
	}
	else {
		echo "Unknown OS for execution... Script discontinued";
		return;
	}

	//For Linux (Remember to set one for windows as well)
    
    $fileName = 'generateFilteredData.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$node.' '.$start.' '.$end.' '.$msgid;

    //echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    //echo($output[1]);
?>