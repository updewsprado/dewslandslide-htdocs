<?php   
    if(isset($_GET['site'])) {
        $site = $_GET['site'];
    }
    if(isset($_GET['cid'])) {
        $cid = $_GET['cid'];
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
        $pythonPath = '/home/ubuntu/anaconda2/bin/python';
    }
    else {
        echo "Unknown OS for execution... Script discontinued";
        return;
    }

    //For Linux (Remember to set one for windows as well)
    
    $fileName = 'ground.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$cid;

    // echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    
?>