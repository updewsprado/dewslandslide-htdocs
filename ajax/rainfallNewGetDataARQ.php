

<?php   
    if(isset($_GET['rsite'])) {
        $rsite = $_GET['rsite'];
    }
    else {
        echo "Error: No value for site has been set";
        return -1;
    }
    if(isset($_GET['fdate'])) {
        $fdate = $_GET['fdate'];
    }
    else {
       echo "Error: No value for fdate has been set";
        return -1;
    }
     if(isset($_GET['tdate'])) {
        $tdate = $_GET['tdate'];
    }
    else {
         echo "Error: No value for tdate has been set";
        return -1;
    }



    $os = PHP_OS;
    //echo "Operating System: $os <Br>";

    if (strpos($os,'WIN') !== false) {
        $pythonPath = 'c:\Users\USER\Anaconda2\python.exe';
    }
    elseif ((strpos($os,'Ubuntu') !== false) || (strpos($os,'Linux') !== false)) {
        $pythonPath = '/home/ubuntu/anaconda/bin/python';
         // echo "python problem";
    }
    else {
        echo "Unknown OS for execution... Script discontinued";
        return;
    }

    //For Linux (Remember to set one for windows as well)
    
    $fileName = 'rainfallNewGetDataARQ.py';
    $command = $pythonPath.' '.$fileName.' '.$rsite.' '.$fdate.' '.$tdate;

    //echo "$command";
    exec($command, $output, $return);
    echo($output[0]);
    
?>