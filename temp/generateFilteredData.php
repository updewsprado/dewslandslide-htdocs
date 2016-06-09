<?php   
	function getOS() { 
	    $user_agent     =   $_SERVER['HTTP_USER_AGENT'];
	    $os_platform    =   "Unknown OS Platform";
	    $os_array       =   array(
	                            '/windows nt 10/i'     =>  'Windows 10',
	                            '/windows nt 6.3/i'     =>  'Windows 8.1',
	                            '/windows nt 6.2/i'     =>  'Windows 8',
	                            '/windows nt 6.1/i'     =>  'Windows 7',
	                            '/windows nt 6.0/i'     =>  'Windows Vista',
	                            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
	                            '/windows nt 5.1/i'     =>  'Windows XP',
	                            '/windows xp/i'         =>  'Windows XP',
	                            '/windows nt 5.0/i'     =>  'Windows 2000',
	                            '/windows me/i'         =>  'Windows ME',
	                            '/win98/i'              =>  'Windows 98',
	                            '/win95/i'              =>  'Windows 95',
	                            '/win16/i'              =>  'Windows 3.11',
	                            '/macintosh|mac os x/i' =>  'Mac OS X',
	                            '/mac_powerpc/i'        =>  'Mac OS 9',
	                            '/linux/i'              =>  'Linux',
	                            '/ubuntu/i'             =>  'Ubuntu',
	                            '/iphone/i'             =>  'iPhone',
	                            '/ipod/i'               =>  'iPod',
	                            '/ipad/i'               =>  'iPad',
	                            '/android/i'            =>  'Android',
	                            '/blackberry/i'         =>  'BlackBerry',
	                            '/webos/i'              =>  'Mobile'
	                        );

	    foreach ($os_array as $regex => $value) { 
	        if (preg_match($regex, $user_agent)) {
	            $os_platform    =   $value;
	        }
	    }   
	    return $os_platform;
	}

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

	$os = getOS();
	echo "Operating System: $os";

	//For Linux (Remember to set one for windows as well)
    $pythonPath = '/home/ubuntu/anaconda2/bin/python';
    $fileName = 'outputFilteredData.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$node.' '.$start.' '.$end.' '.$msgid;

    //echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    echo($output[1]);
?>