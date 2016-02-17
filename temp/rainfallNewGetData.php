<?php   
    //echo "Current OS = ".PHP_OS."<Br>";

    $rsite = $_GET['rsite'];

    if (PHP_OS == "WINNT") {
      exec('python rainfallNewGetData.py ' . $rsite, $output, $return);  
    }
    elseif (PHP_OS == 'Linux') {
      exec('/home/ubuntu/anaconda/bin/python rainfallNewGetData.py ' . $rsite, $output, $return);  
    }
    else {
      echo "Write Executable Code for Mac OS Server";
    }
    
    //$fdate = $_GET['fdate'];
    //$tdate = $_GET['tdate'];
    //exec('/home/ubuntu/anaconda/bin/python getRainfall.py ' . $rsite . ' ' . $fdate . ' ' . $tdate, $output, $return);  
 
    if ($output[0]) {
        echo($output[0]);
    } else {
        echo($output[1]);
    }
    
    //echo($output[0]);
?>