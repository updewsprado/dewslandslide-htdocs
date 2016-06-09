

<?php   
    if(isset($_GET['site'])) {
        $site = $_GET['site'];
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
     if(isset($_GET['ms1'])) {
        $ms1 = $_GET['ms1'];
    }
    else {
        echo "Error: No value for ms1 has been set";
        return -1;
    }
     if(isset($_GET['ms2'])) {
        $ms2 = $_GET['ms2'];
    }
    else {
        echo "Error: No value for ms2 has been set";
        return -1;
    }
   
   
    $os = PHP_OS;
    //echo "Operating System: $os <Br>";

    if (strpos($os,'WIN') !== false) {
        $pythonPath = 'c:\Users\USER\Anaconda2\python.exe';
    }
    elseif ((strpos($os,'Ubuntu') !== false) || (strpos($os,'Linux') !== false)) {
        $pythonPath = '/home/ubuntu/anaconda2/bin/python';
        // echo "hoy nsa ubuntu ako";
    }
    else {
        echo "Unknown OS for execution... Script discontinued";
        return;
    }

    //For Linux (Remember to set one for windows as well)
    
    $fileName = 'soms.py';
    $command = $pythonPath.' '.$fileName.' '.$site.' '.$fdate.' '.$tdate.' '.$ms1.' '.$ms2;

    // echo "$command";
    exec($command, $output, $return);
    echo($output[0]);

    
?>