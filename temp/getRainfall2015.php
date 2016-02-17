<?php   
    $rsite = $_GET['rsite'];
    //$fdate = $_GET['fdate'];
    //$tdate = $_GET['tdate'];
    //exec('/home/ubuntu/anaconda/bin/python getRainfall.py ' . $rsite . ' ' . $fdate . ' ' . $tdate, $output, $return);  
    //echo($output[0]);
    //echo "site=$rsite";

    exec('python getRainfall2015.py ' . $rsite, $output, $return);  
    echo($output[0]);    
?>