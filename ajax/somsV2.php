<?php   
    if(isset($_GET['site'])) {
        $site = $_GET['site'];
    }
    if(isset($_GET['fdate'])) {
        $fdate = $_GET['fdate'];
    }
     if(isset($_GET['tdate'])) {
        $tdate = $_GET['tdate'];
    }
    if(isset($_GET['nid'])) {
        $nid = $_GET['nid'];
    }
    else {
         echo "Error";
        return -1;
    }



    $os = PHP_OS;
    //echo "Operating System: $os <Br>";

    if (strpos($os,'WIN') !== false) {
        $pythonPath = 'c:\Users\USER\Anaconda2\python.exe';
    }
    elseif ((strpos($os,'Ubuntu') !== false) || (strpos($os,'Linux') !== false)) {
<<<<<<< HEAD
        $pythonPath = '/home/dews/anaconda/bin/python';
=======
        $pythonPath = '/home/ubuntu/anaconda2/bin/python';
>>>>>>> 689de32cd89f5608111837387342245cca39a362
    }
    else {
        echo "Unknown OS for execution... Script discontinued";
        return;
    }

    //For Linux (Remember to set one for windows as well)
    
    $fileName = 'somsV2.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$fdate.' '.$tdate.' '.$nid;

    // echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    
?>