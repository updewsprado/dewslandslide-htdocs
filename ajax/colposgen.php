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
    
    $fileName = 'colposgen.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$fdate.' '.$tdate;

    // echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    
?>