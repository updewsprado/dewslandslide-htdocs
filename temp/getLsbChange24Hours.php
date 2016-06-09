<?php   
    $site = $_GET['site'];
    $node = $_GET['node'];
    exec('/home/ubuntu/anaconda2/bin/python getLsbChange24Hours.py ' . $site . ' ' . $node, $output, $return);  
    echo($output[0]);
    echo($output[1]);
?>