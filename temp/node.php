
        <div id="page-wrapper">

            <div class="container-fluid">

                <!-- Page Heading -->
                <div class="row">
                    <div class="col-lg-12">
                        <h1 class="page-header" id="header-site">Node Overview</h1>
                    </div>
                </div>
                <!-- /.row -->
                
                <!-- New Features!!! -->
                <div class="row">
                    <div class="col-lg-12">
                        <div class="alert alert-info alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            <i class="fa fa-info-circle"></i>  <strong>New Feature!</strong> Mini Alert Map for a more convenient way of mapping alerts on the node level analysis page
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="alert alert-info alert-dismissable">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            <i class="fa fa-info-circle"></i>  <strong>New Feature!</strong> All nodes from Alert Map are now clickable!
                        </div>
                    </div>                        
                </div>
                <!-- /.row -->                                             
                
                <div class="row">
                    <div class="col-lg-12">
                        <ol class="breadcrumb">
                            <li class="active">
                                <i class="fa fa-dashboard"></i> Monitoring
                            </li>
                        </ol>
                    </div>
                </div>
                <!-- /.row -->  

                <div class="row">
                     <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> Mini Alert Map</h3>
                            </div>
                            <div class="panel-body">
                                <div id="mini-alert-canvas" ></div>
                            </div>
                        </div>
                    </div>                                       
                </div>
                <!-- /.row -->   

                <div class="row">
                    <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> LSB Change Plot</h3>
                            </div>
                            <div class="panel-body">
                                <div id="lsb-change-canvas" ></div>
                            </div>
                        </div>
                    </div>                                   
                </div>
                <!-- /.row -->                             

                <!-- Heading for Date Dependent Charts -->
                <div class="row">
                    <div class="col-lg-12">
                        <ol class="breadcrumb">
                            <li class="active">Date Dependent Charts</li>
                        </ol>
                    </div>
                </div>

				<div class="row">
                     <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> Accelerometer: X Value</h3>
                            </div>
                            <div class="panel-body">
								<div id="accel-1-canvas">
									<div id="accel-1-timestamp"><b>Timestamp: </b></div>
									<div id="accel-1"></div>
								</div>                               	
                            </div>
                        </div>
                    </div>                                     
                </div>	
                <!-- /.row -->	   
                
                <div class="row">
                     <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> Accelerometer: Y Value</h3>
                            </div>
                            <div class="panel-body">
								<div id="accel-2-canvas">
									<div id="accel-2-timestamp"><b>Timestamp: </b></div>
									<div id="accel-2"></div>
								</div>                               	
                            </div>
                        </div>
                    </div>                                     
                </div>	
                <!-- /.row -->	
                
                <div class="row">
                     <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> Accelerometer: Z Value</h3>
                            </div>
                            <div class="panel-body">
								<div id="accel-3-canvas">
									<div id="accel-3-timestamp"><b>Timestamp: </b></div>
									<div id="accel-3"></div>
								</div>                               	
                            </div>
                        </div>
                    </div>                                     
                </div>	
                <!-- /.row -->	 
                
                <div class="row">
                     <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><i class="fa fa-bar-chart-o fa-fw"></i> Soil Moisture</h3>
                            </div>
                            <div class="panel-body">
								<div id="accel-4-canvas">
									<div id="accel-4-timestamp"><b>Timestamp: </b></div>
									<div id="accel-4">
									</div>
								</div>                               	
                            </div>
                        </div>
                    </div>                                     
                </div>	
                <!-- /.row -->	
                		
            </div>
            <!-- /.container-fluid -->

        </div>
        <!-- /#page-wrapper -->
        
<script>
var curSite = "<?php echo $site; ?>";
var curNode = "<?php echo $node; ?>";
var fromDate = "" , toDate = "" , dataBase = "";

var options = ["select", "blcb", "blct", "bolb", "gamb", "gamt",
				"humb", "humt", "labb", "labt", "lipb",
				"lipt", "mamb", "mamt", "oslb", "oslt",
				"plab", "plat", "pugb", "pugt", "sinb",
				"sinu"];

function popDropDownGeneral() {
	var select = document.getElementById('sitegeneral');
	var i;
	for (i = 0; i < options.length; i++) {
		var opt = options[i];
		var el = document.createElement("option");
		el.textContent = opt.toUpperCase();
		
		if(opt == "select") {
			el.value = "none";
		}
		else {
			el.value = opt;
		}
		
		select.appendChild(el);
	}
}

function renameHeader() {
	document.getElementById("node").value = curNode;
	
	var element = document.getElementById("header-site");
	var targetForm = document.getElementById("formGeneral");
	element.innerHTML = targetForm.sitegeneral.value.toUpperCase() + " Node " + targetForm.node.value + ": Overview";	
}

function initNode() {
	if (curSite != "") {
		$('#sitegeneral').val(curSite);
		renameHeader();
		
		var targetForm = document.getElementById("formGeneral");
		showNodePlots(targetForm);
	}
}

window.onload = function() {
	nodeAlertJSON = <?php echo $nodeAlerts; ?>;
	nodeStatusJSON = <?php echo $nodeStatus; ?>;
	maxNodesJSON = <?php echo $siteMaxNodes; ?>;		
	
	//positionPlot.init_dims();
	popDropDownGeneral();
	
	setTimeout(function(){
		initNode();
		initAlertPlot();
	}, 1500); 
}	

window.onresize = function() {
	curNode = document.getElementById("node").value;
	fromDate = document.getElementById("formDate").dateinput.value;
	toDate = document.getElementById("formDate").dateinput2.value;
	d3.select("#svg-alertmini").remove();
	svg.selectAll(".dot").remove();
		svg.selectAll(".dot1").remove();
		svg.selectAll(".dot2").remove();
		svg.selectAll(".line").remove();
		svg.selectAll(".legend").remove();
		svg.selectAll(".tick").remove();
		svg.selectAll(".axislabel").remove();
		
	initAlertPlot();
	showAccel();
}

function redirectNodePlots (frm) {
	if(frm.sitegeneral.value == "none") {
		//do nothing
	}
	else {
		curSite = document.getElementById("sitegeneral").value;
		curNode = document.getElementById("node").value;
		fromDate = document.getElementById("formDate").dateinput.value;
		toDate = document.getElementById("formDate").dateinput2.value;
		var urlExt = "gold/node/" + curSite + "/" + curNode;
		var urlBase = "<?php echo base_url(); ?>";
		
		window.location.href = urlBase + urlExt;
	}
}

function showNodePlots (frm) {
	if(frm.sitegeneral.value == "none") {
		//do nothing
	}
	else {
		curNode = document.getElementById("node").value;
		fromDate = document.getElementById("formDate").dateinput.value;
		toDate = document.getElementById("formDate").dateinput2.value;
		//showPositionPlotGeneral(frm);
		showLSBChange(frm);
		showAccel();
	}
}

function showAccelRelatedPlots (frm) {
	if(frm.sitegeneral.value == "none") {
		//do nothing
	}
	else {
		curNode = document.getElementById("node").value;
		fromDate = document.getElementById("formDate").dateinput.value;
		toDate = document.getElementById("formDate").dateinput2.value;
		renameHeader();
		
		showLSBChange(frm);
		showAccel();
	}
}

function showDateNodePlots (frm) {
	if(frm.sitegeneral.value == "none") {
		//do nothing
	}
	else {
		curNode = document.getElementById("node").value;
		fromDate = document.getElementById("formDate").dateinput.value;
		toDate = document.getElementById("formDate").dateinput2.value;
		showAccel();
	}
}

</script>