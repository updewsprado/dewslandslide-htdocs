<?php
	//header('Content-type: application/json');

	require_once('connectDB.php'); 
	require_once('getHealth.php'); 
	require_once('getSiteHealth.php'); 
	require_once('getAccel.php');
	require_once('getSitesCoord.php');
	require_once('getSiteColumnInfo.php');
	require_once('getNodeStatusNew.php');
	require_once('getRainfallARQ.php');
	require_once('getRainfallSenslope.php');
	//require_once('getAlert.php');
	
	if(isset($_GET['db'])) {
		$mysql_database = $_GET['db'];
		//echo "db exists: $mysql_database<Br/>";	
	}
	/*
	else {
		echo "ERROR: DB does not exist<Br/>";	
	}*/
	
	if(isset($_GET['sitenames'])) {
		$a = getSiteNames($mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;

	}

	if(isset($_GET['health'])) {
		//echo "health exists<Br/>";
		$site = $_GET['site'];
		$a = getHealth($site, $mysql_host, $mysql_database, $mysql_user, $mysql_password);

		if (isset($a)) echo 'No value returned.';
		else echo $a;
	}
	
	if(isset($_GET['sitehealth'])) {
		//echo "site health exists<Br/>";
		$site = $_GET['site'];
		$date = $_GET['q'];
		
		if(isset($_GET['site']) && isset($_GET['q'])) {
			//echo "site info & date data is incomplete<Br/>";
			$a = getSiteHealth($date, $site, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		else {
			echo "ERROR: site info & date data is incomplete<Br/>";
		}
	}
	
	if(isset($_GET['accel'])) {
		//echo "accel exists <Br/>";	
		$q = $_GET['q'];
		$site = $_GET['site'];
		$nid = (int)($_GET['nid']);
		
		$a = getAccel($q, $site, $nid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);

		if (is_null($a)) echo 'Error retrieving data with ' . $site . ', ' . $q .', ' . $nid;
		else echo $a;
	}
	
	if(isset($_GET['accelsite'])) {
		$from_flag = false;
		$to_flag = false;
		$site_flag = false;
		
		if(isset($_GET['site']) && !empty($_GET['site'])) {
			$site = $_GET['site'];
			$site_flag = true;
		}
		else {
			echo "ERROR: site info is incomplete<Br/>";
			return;
		}
		
		if(isset($_GET['start']) && !empty($_GET['start'])) {
			$from = $_GET['start'];
			$from_flag = true;
		}
		else {
			echo "ERROR: start date info is incomplete<Br/>";
			return;
		}
		
		if(isset($_GET['end']) && !empty($_GET['end'])) {
			$to = $_GET['end'];
			$to_flag = true;
		}

		if (isset($_GET['limit']) && !empty($_GET['limit'])) {
			$limit = $_GET['limit'];
		}
		else {
			$limit = null;
		}
		
		if($site_flag && $from_flag && $to_flag) {
			//echo "site info & date data is incomplete<Br/>";
			$a = getAccelSite2($from, $to, $site, $limit, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		elseif($site_flag && $from_flag && !$to_flag) {
			//echo "site info & date data is incomplete<Br/>";
			$a = getAccelSite($from, $site, $limit, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		else {
			echo "ERROR: site info or date data is incomplete<Br/>";
		}
	}	
	
	if(isset($_GET['accel2'])) {
		//echo "accel exists <Br/>";	
		$from = "'" . $_GET['from'] . "'";
		$to = $_GET['to'];
		$site = $_GET['site'];
		$nid = (int)($_GET['nid']);

		if(isset($_GET['dataset']) && !empty($_GET['dataset'])) {
			$dataset = (int)($_GET['dataset']);
		}
		else {
			$dataset = null;
		}	
		
		$to = "'" . date('Y-m-d H:i:s', strtotime($to. '+1 days +7 hours +45 minutes')) . "'";
		
		$a = getAccel2($from, $to, $site, $nid, $dataset, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}

	//Testing code for inclusion of battery level
	if(isset($_GET['accel3'])) {
		//echo "accel exists <Br/>";	
		$from = "'" . $_GET['from'] . "'";
		$to = $_GET['to'];
		$site = $_GET['site'];
		$nid = (int)($_GET['nid']);

		if(isset($_GET['dataset']) && !empty($_GET['dataset'])) {
			$dataset = (int)($_GET['dataset']);
		}
		else {
			$dataset = null;
		}	
		
		$to = "'" . date('Y-m-d H:i:s', strtotime($to. '+1 days +7 hours +45 minutes')) . "'";
		
		$a = getAccel3($from, $to, $site, $nid, $dataset, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}

	if(isset($_GET['coord'])) {
		//echo "coord exists<Br/>";
		$a = getCoord($mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}
	
	if(isset($_GET['alert'])) {
		//echo "accel exists <Br/>";	
		$q = $_GET['q'];
		$site = $_GET['site'];
		$nid = (int)($_GET['nid']);
		
		getAlert($site, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
	}	
	
	if(isset($_GET['sitecolumn'])) {
		//echo "sitecolumn getter exists <Br/>";	

		if(isset($_GET['sidlatest']) && !empty($_GET['sidlatest'])) {
			$sid = (int)($_GET['sidlatest']);
		}
		else {
			$sid = 0;
		}		
		
		//echo "sid = " . $sid;
		getSiteColumn($sid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
	}

	if(isset($_GET['sitecolumnjson'])) {
		//echo "sitecolumn getter exists <Br/>";	

		if(isset($_GET['sidlatest']) && !empty($_GET['sidlatest'])) {
			$sid = (int)($_GET['sidlatest']);
		}
		else {
			$sid = 0;
		}		
		
		//echo "sid = " . $sid;
		$a = getSiteColumnJSON($sid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}

	if(isset($_GET['singlesitecolumn'])) {

		if(isset($_GET['name']) && !empty($_GET['name'])) {
			$name = $_GET['name'];
			$a = getSingleSiteColumn($name, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		else {
			echo "site name is empty";
		}		
	}	

	if(isset($_GET['columninfo'])) {
		//echo "columninfo getter exists <Br/>";	

		if(isset($_GET['sidlatest']) && !empty($_GET['sidlatest'])) {
			$sid = (int)($_GET['sidlatest']);
		}
		else {
			$sid = 0;
		}		

		getSiteColumnProps($sid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
	}	

	if(isset($_GET['columninfojson'])) {
		$a = getSiteColumnPropsJSON(0, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}		

	if(isset($_GET['singlecolumninfo'])) {

		if(isset($_GET['name']) && !empty($_GET['name'])) {
			$name = $_GET['name'];
			getSingleSiteColumnProps($name, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		}
		else {
			echo "site name is empty";
		}		
	}	

	if(isset($_GET['siteraininfo'])) {
		//echo "siteraininfo getter exists <Br/>";	

		if(isset($_GET['sidlatest']) && !empty($_GET['sidlatest'])) {
			$sid = (int)($_GET['sidlatest']);
		}
		else {
			$sid = 0;
		}		
		
		//echo "sid = " . $sid;
		$a = getSiteRainProps($sid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}	

	if(isset($_GET['raininfojson'])) {
		$a = getSiteRainPropsJSON(0, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}	

	if(isset($_GET['nodestatus'])) {
		//echo "nodestatus getter exists <Br/>";	

		if(isset($_GET['pid']) && !empty($_GET['pid'])) {
			$pid = (int)($_GET['pid']);
		}
		else {
			$pid = 0;
		}		
		
		//echo "pid = " . $pid;

		if(isset($_GET['json'])) {
			$a = getNodeStatusJSON($pid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		else {
			getNodeStatus($pid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		}

		//getNodeStatus($pid, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
	}		

	if(isset($_GET['sitesomsjson'])) {
		$a = getSiteSomsJSON($mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}

	if(isset($_GET['sitesomsdata'])) {
		$from_flag = false;
		$to_flag = false;
		$site_flag = false;
		
		if(isset($_GET['site']) && !empty($_GET['site'])) {
			$site = $_GET['site'];
			$site_flag = true;
		}
		else {
			echo "ERROR: site info is incomplete<Br/>";
			return;
		}
		
		if(isset($_GET['start']) && !empty($_GET['start'])) {
			$from = $_GET['start'];
			$from_flag = true;
		}
		else {
			echo "ERROR: start date info is incomplete<Br/>";
			return;
		}
		
		if(isset($_GET['end']) && !empty($_GET['end'])) {
			$to = $_GET['end'];
			$to_flag = true;
		}

		if (isset($_GET['limit']) && !empty($_GET['limit'])) {
			$limit = $_GET['limit'];
		}
		else {
			$limit = null;
		}
		
		if($site_flag && $from_flag && $to_flag) {
			//echo "site info & date data is incomplete<Br/>";
			$a = getSomsSite($from, $to, $site, $limit, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		elseif($site_flag && $from_flag && !$to_flag) {
			//echo "site info & date data is incomplete<Br/>";
			$a = getSomsSite($from, null, $site, $limit, $mysql_host, $mysql_database, $mysql_user, $mysql_password);
			echo $a;
		}
		else {
			echo "ERROR: site info or date data is incomplete<Br/>";
		}
	}

	if (isset($_GET['rainarq'])) {
		if ( !isset($_GET['site']) || !isset($_GET['start_date']) ) {
			echo "ERROR: No input placed for 'site' and/or 'start_date'.\n";
			exit;
		}

		if ( !isset($_GET['end_date']) ) $_GET['end_date'] = NULL;
		if ( !isset($_GET['limit']) ) $_GET['limit'] = NULL;
		$a = getRainfallARQ($_GET['site'], $_GET['start_date'], $_GET['end_date'], $_GET['limit'], $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}

	if (isset($_GET['rainsenslope'])) {
		if ( !isset($_GET['site']) || !isset($_GET['start_date']) ) {
			echo "ERROR: No input placed for 'site' and/or 'start_date'.\n";
			exit;
		}

		if ( !isset($_GET['end_date']) ) $_GET['end_date'] = NULL;
		if ( !isset($_GET['limit']) ) $_GET['limit'] = NULL;
		$a = getRainfallSenslope($_GET['site'], $_GET['start_date'], $_GET['end_date'], $_GET['limit'], $mysql_host, $mysql_database, $mysql_user, $mysql_password);
		echo $a;
	}
?>	




















































