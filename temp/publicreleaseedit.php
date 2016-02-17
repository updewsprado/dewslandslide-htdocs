<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Public Announcements Edit Page</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  </head>
  <body>

<?php
// Database login information
$servername = "localhost";
$username = "updews";
$password = "october50sites";
$dbname = "senslopedb";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

//Generate the Site Information for filter selection
$sql = "SELECT DISTINCT LEFT(name , 3) as name, sitio, barangay, municipality, province FROM site_column ORDER BY name ASC";
$result = mysqli_query($conn, $sql);

$numSites = 0;
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $sitio = $row["sitio"];
        $barangay = $row["barangay"];
        $municipality = $row["municipality"];
        $province = $row["province"];

        if ($sitio == null) {
          $address = "$barangay, $municipality, $province";
        } 
        else {
          $address = "$sitio, $barangay, $municipality, $province";
        }

        $siteInfo[$numSites]["name"] = $row["name"];
        $siteInfo[$numSites++]["address"] = $address;
    }
} else {
    echo "0 results for site name";
}

mysqli_close($conn);
?>

    <div class="container-fluid">
      <div class="page-header">
        <h2>DEWS-Landslide Public Release Edit <small>Edit Entries for Public Releases</small>
        </h2>
      </div>
      <div class="row">
        <div class="form-group col-sm-4">
          <label for="entrySite">Filter by Site Name</label>
          <select class="form-control" id="entrySite" onchange="filteredPublicAlerts($('#entrySite').val())" >
            <option value="none">Select site...</option>

            <?php foreach($siteInfo as $singleSite): ?>
            <option value="<?php echo $singleSite['name']; ?>" >
              <?php echo $singleSite["name"] . " (" . $singleSite["address"] . ")"; ?>
            </option>
            <?php endforeach; ?>

          </select>
        </div>
      </div>
      <div class="row">
        <div class="table-responsive">          
          <table class="table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Data Timestamp</th>
                <th>Post Time</th>
                <th>Site</th>
                <th>IAL</th>
                <th>BLGU</th>
                <th>MLGU</th>
                <th>LLMC</th>
                <th>MDRRMC</th>
                <th>PDRRMC</th>
                <th>Reporter</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="reloadable-table-body"></tbody>
          </table>
        </div>
      </div><Br>

      <!-- Modal for Successful Entry -->
      <div class="modal fade" id="dataUpdateStatus" role="dialog">
        <div class="modal-dialog modal-md">
        
          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Public Alert Entry Update Notice</h4>
            </div>
            <div class="modal-body">
              <p id="pa-update-message">Successfully Updated the Entry!</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-dismiss="modal">Okay</button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  </body>
  <script type="text/javascript">
    function emptyPublicAlertTable() {
      $('#reloadable-table-body').empty();
    }

    function getPublicAlertRowClass(internalAlert) {
      var rowClass;

      switch (internalAlert) {
        case 'A2':
          rowClass = "danger";
          break;

        case 'A1':
        case 'ND-L':
          rowClass = "warning";
          break;

        case 'A0+':
        case 'A0-R':
        case 'A0-E':
        case 'A0-D':
        case 'ND-R':
        case 'ND-E':
        case 'ND-D':
          rowClass = "info";
          break;

        case 'A0':
        case 'ND':
          rowClass = "success";
          break;
        
        default:
          rowClass = "undefined";
          break;
      }

      return rowClass;
    }

    var prevValues = [];

    function parseStrings(inputString, separator) {
      var str = inputString;
      var str_array = str.split(separator);
      var outputArray = [];
      var ctr = 0;

      for(var i = 0; i < str_array.length; i++) {
        // Trim the excess whitespace.
        str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");

        if(str_array[i].length > 0) {
          outputArray[ctr++] = str_array[i];
        }
      }

      return outputArray;  
    }

    //Find the index of prevValues object given the alert id
    function prevValuesFindIndex(alertId) {
      var retObj = prevValues.filter(function(obj) {
                      return obj.id == alertId; //.toString();
                    });

      var targetIndex = -1;
      $.each(prevValues, function(index,key) {
        if(key.id == alertId) {
          targetIndex = index;
        }
      });

      return targetIndex;
    }

    //Store values of a row given the alert id
    function prevValuesPush(alertId) {
      var arrayTemp = [];
      $("#"+alertId).children().find("input").each(function() {
        arrayTemp.push(this.value);
      });

      if (arrayTemp.length <= 0) {
        return "no values retrieved. will not proceed to push.";
      } 
      else {
        prevValues.push({
                        0:arrayTemp[0],   //data timestamp
                        1:arrayTemp[1],   //time of post
                        2:arrayTemp[2],   //internal alert level
                        3:arrayTemp[3],   //blgu
                        4:arrayTemp[4],   //mlgu
                        5:arrayTemp[5],   //llmc
                        6:arrayTemp[6],   //mdrrmc
                        7:arrayTemp[7],   //pdrrmc
                        "id":alertId    //alert id
                      });
      }
    }

    //Get values of row from a previous value given the alert id
    function prevValuesGet(alertId) {
      var targetIndex = prevValuesFindIndex(alertId);

      if (targetIndex < 0) {
        return "target index does not exist.";
      } 
      else {
        return prevValues[targetIndex];
      }
    }

    //Remove a row from the prevValues array using alert id
    function prevValuesRemove(alertId) {
      var targetIndex = prevValuesFindIndex(alertId);

      if (targetIndex < 0) {
        return "target index does not exist.";
      } 
      else {
        return prevValues.splice(targetIndex,1);
      }
    }

    //Revert a row on display from the prevValues array using alert id
    function prevValuesRevert(alertId) {
      var targetIndex = prevValuesFindIndex(alertId);

      if (targetIndex < 0) {
        return "target index does not exist.";
      } 
      else {
        var targetValues = prevValues[targetIndex];
        var ctr = 0;

        $("#"+alertId).children().find("input").each(function() {
          this.value = targetValues[ctr++];
        });

        //revert the color of the row
        var curRowClass = getPublicAlertRowClass(targetValues[2]);

        //clean up color coding of rows
        $("#"+alertId).removeClass('danger');
        $("#"+alertId).removeClass('warning');
        $("#"+alertId).removeClass('info');
        $("#"+alertId).removeClass('success');

        //add appropriate color
        $("#"+alertId).addClass(curRowClass);
      }
    }

    function inputWarning(alertId, msgWarning) {
        $("#pa-update-message").text(msgWarning);

        //remove success class if ever it was activated
        $(".modal-footer").find(".btn").removeClass('success');
        //make sure that the button is orange/warning
        $(".modal-footer").find(".btn").addClass('warning');

        //show the modal
        $('#dataUpdateStatus').modal('show');

        //revert the values to original
        prevValuesRevert(alertId);
    }

    //Update the alertId using the current values received from inputs
    function curValuesUpdate(alertId) {
      var arrayTemp = [];
      //get the current value of the row inputs
      $("#"+alertId).children().find("input").each(function() {
        arrayTemp.push(this.value);
      });


      //change the color of the row
      var curRowClass = getPublicAlertRowClass(arrayTemp[2]);

      //clean up color coding of rows
      $("#"+alertId).removeClass('danger');
      $("#"+alertId).removeClass('warning');
      $("#"+alertId).removeClass('info');
      $("#"+alertId).removeClass('success');

      //add appropriate color
      $("#"+alertId).addClass(curRowClass);

      //Check if input texts have value
      //check entry timestamp
      if (arrayTemp[0] == "") {
        inputWarning(alertId, "Update failed... Please fill out 'Data Timestamp'");
        return;
      }

      //check entry time of post
      if (arrayTemp[1] == "") {
        inputWarning(alertId, "Update failed... Please fill out 'Post Time'");
        return;
      }

      //check entry Internal Alert Level
      if (arrayTemp[2] == "") {
        inputWarning(alertId, "Update failed... Please fill out 'IAL'");
        return;
      }

      //Make sure that the "time of acknowledgment" data has no empty values
      for (var i = 3; i < arrayTemp.length; i++) {
        if (arrayTemp[i] == "") {
          arrayTemp[i] = "none";
        }
      }

      //Update database values using alert id
      //create an ajax function for updating data for specific alert id
      var formData = {'alertid': alertId,
                      'entryts': arrayTemp[0],
                      'time_post': arrayTemp[1],
                      'ial': arrayTemp[2],
                      'recipient': 'BLGU;MLGU;LLMC;MDRRMC;PDRRMC',
                      'acknowledged': arrayTemp[3]+';'+arrayTemp[4]+';'+arrayTemp[5]+';'+arrayTemp[6]+';'+arrayTemp[7],
                      //TODO: replace the flagger name by the session user
                      'flagger': "Prado Bognot"
                    };

      $.ajax({
        url : "publicreleaseeditUpdateData.php",
        type: "GET",
        data : formData,
        success: function(result, textStatus, jqXHR) {
          $("#pa-update-message").text(result);

          //remove warning class if ever it was activated
          $(".modal-footer").find(".btn").removeClass('warning');
          //make sure that the button is green
          $(".modal-footer").find(".btn").addClass('success');

          $('#dataUpdateStatus').modal('show');

          $("#"+alertId).children().find("input").each(function() {
            this.value = arrayTemp[ctr++];
          });
        }
      });
    }

    //Public Alert Enable Edit
    function paEnableEdit(alertId) {
      if (alertId < 0) {
        return;
      }

      //store the previous values of item alertId
      prevValuesPush(alertId);

      $("#"+alertId).children().find("input").removeAttr("disabled");

      //hide the "Edit" and "Delete" buttons
      $("#"+alertId).children().find(".pa-edit").hide();
      $("#"+alertId).children().find(".pa-delete").hide();

      //show "Update" and "Cancel" buttons
      $("#"+alertId).children().find(".pa-update").show();
      $("#"+alertId).children().find(".pa-cancel").show();
    }

    //Public Alert Delete Row
    function paDeleteAlert(alertId) {
      $("#"+alertId).fadeOut( "slow", function() {
        $("#"+alertId).remove();

        //TODO: delete alertid from database
        var formData = {'alertid': alertId};

        $.ajax({
          url : "publicreleaseeditDeleteData.php",
          type: "GET",
          data : formData,
          success: function(result, textStatus, jqXHR) {
            $("#pa-update-message").text(result);

            //remove warning class if ever it was activated
            $(".modal-footer").find(".btn").removeClass('warning');
            //make sure that the button is green
            $(".modal-footer").find(".btn").addClass('success');

            $('#dataUpdateStatus').modal('show');
          }
        });
      });
    }

    //Public Alert Cancel Edit
    function paCancelEdit(alertId) {
      if (alertId < 0) {
        return;
      }

      //TODO: revert values back to previous values
      prevValuesRevert(alertId);

      //remove the stored previous values of item alertId
      prevValuesRemove(alertId);

      $("#"+alertId).children().find("input").attr("disabled","");

      //hide "Update" and "Cancel" buttons
      $("#"+alertId).children().find(".pa-update").hide();
      $("#"+alertId).children().find(".pa-cancel").hide();

      //show the "Edit" and "Delete" buttons
      $("#"+alertId).children().find(".pa-edit").show();
      $("#"+alertId).children().find(".pa-delete").show();
    }

    //Public Alert Edit Update
    function paUpdateEdit(alertId) {
      if (alertId < 0) {
        return;
      }

      //Update the database
      curValuesUpdate(alertId);

      //Remove the stored previous values of item alertId
      prevValuesRemove(alertId);

      $("#"+alertId).children().find("input").attr("disabled","");

      //hide "Update" and "Cancel" buttons
      $("#"+alertId).children().find(".pa-update").hide();
      $("#"+alertId).children().find(".pa-cancel").hide();

      //show the "Edit" and "Delete" buttons
      $("#"+alertId).children().find(".pa-edit").show();
      $("#"+alertId).children().find(".pa-delete").show();
    }

    var test, test2; //, recipient, timeAck;
    function filteredPublicAlerts(siteName) {
      emptyPublicAlertTable();
      var curSite = $('#entrySite').val();

      //create an ajax function for getting data of public alert for the chosen site
      var formData = {site: curSite};

      $.ajax({
        url : "publicreleaseeditReadData.php",
        type: "GET",
        data : formData,
        success: function(result, textStatus, jqXHR)
        {
          if (result != 0) {
            var pubAlertPerSite = $.parseJSON(result);
            test2 = pubAlertPerSite;

            for (var i=0; i < pubAlertPerSite.length; i++) {
              var rowClass = getPublicAlertRowClass(pubAlertPerSite[i].internal_alert);

              //Parse the community recipients and their time of acknowledgement
              var recipient = parseStrings(pubAlertPerSite[i].recipient, ";");
              var timeAck = parseStrings(pubAlertPerSite[i].acknowledged, ";");

              var commRecipients = [{lgu:"BLGU",ack:"none"},{lgu:"MLGU",ack:"none"},
                                  {lgu:"LLMC",ack:"none"},{lgu:"MDRRMC",ack:"none"},
                                  {lgu:"PDRRMC",ack:"none"}];

              for (var j=0; j < recipient.length; j++) {
                //go through the list of commRecipients
                for (var k=0; k < commRecipients.length; k++) {
                  if (recipient[j] == commRecipients[k].lgu) {
                    commRecipients[k].ack = timeAck[j];
                    break;
                  }
                }
              }

              //Create a row for the public alert entry
              $("#reloadable-table-body").append("<tr id='"+pubAlertPerSite[i].alert_id+"' class='"+rowClass+" form-group form-group-sm'></tr>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td>"+pubAlertPerSite[i].alert_id+"</td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td><input type='text' class='form-control' placeholder='Text input' value='"+pubAlertPerSite[i].ts_data+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+pubAlertPerSite[i].ts_post_creation+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td>"+pubAlertPerSite[i].name+"</td>");
              //$("#"+pubAlertPerSite[i].alert_id).append("<td>"+pubAlertPerSite[i].internal_alert+"</td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:6%'><input type='text' class='form-control' placeholder='Text input' value='"+pubAlertPerSite[i].internal_alert+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+commRecipients[0].ack+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+commRecipients[1].ack+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+commRecipients[2].ack+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+commRecipients[3].ack+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td style='width:8%'><input type='text' class='form-control' placeholder='Text input' value='"+commRecipients[4].ack+"'></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td>"+pubAlertPerSite[i].flagger+"</td>");
              //$("#"+pubAlertPerSite[i].alert_id).append("<td><a href='#'>Edit</a>&nbsp<a href='#'>Delete</a></td>");
              $("#"+pubAlertPerSite[i].alert_id).append("<td><button type='button' class='btn btn-success pa-edit'>Edit</button><button type='button' class='btn btn-danger pa-delete'>Delete</button><button type='button' class='btn btn-info pa-update'>Update</button><button type='button' class='btn btn-warning pa-cancel'>Cancel</button></td>");

              //Add "edit function" for "pa-edit" button
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-edit").attr("onclick","paEnableEdit("+pubAlertPerSite[i].alert_id+")");

              //TODO: Add function for "delete"
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-delete").attr("onclick","paDeleteAlert("+pubAlertPerSite[i].alert_id+")");

              //Add "update function" for "pa-update" button
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-update").attr("onclick","paUpdateEdit("+pubAlertPerSite[i].alert_id+")");

              //Add "cancel edit function" for "pa-cancel" button
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-cancel").attr("onclick","paCancelEdit("+pubAlertPerSite[i].alert_id+")");

              //hide the "Update" and "Cancel" buttons
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-update").hide();
              $("#"+pubAlertPerSite[i].alert_id).children().find(".pa-cancel").hide();

              //disable the form inputs for the initial display
              $("#"+pubAlertPerSite[i].alert_id).children().find("input").attr("disabled","");
            }
          }
          else {
            //Create a header
            $("#reloadable-table-body").append("<p>No public alert for: "+curSite+"</p>");
          }
        }
      });
    }
  </script>
</html>