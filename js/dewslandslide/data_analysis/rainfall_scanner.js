$(document).ajaxStart(function () {
  $('#loading').modal('toggle');
  $(".bootstrap-select").click(function () {
    $(this).addClass("open");
  });
});
$(document).ajaxStop(function () {
  $('#loading').modal('toggle');
  $(".bootstrap-select").click(function () {
    $(this).addClass("open");
  });
});

$(document).ready(function(e) {
  $('#region_id').hide()
  $('#region_view_div').hide()
  $('.val_rain').hide()
  $( "#container").show()
  $.ajax({url: "/api/rainfallScanner", dataType: "json",
    success: function(result){
      if(result.length != 0){
   var data = JSON.parse(result)
   document.getElementById("rain_header").innerHTML =
   "RAINFALL LEVEL PER SITE AS OF "+moment(data[0].ts).format('YYYY MMMM DD HH:mm:ss');
   var site = [];
   var day1 =[];
   var day3 =[];
   var year2max =[];
   var year2maxhalf =[];
   var data_filtered_site =[]
   var data_all_unfilterd =[]
     region_view(data)
    for (i = 0; i <  data.length; i++) {
      site.push(data[i].site.toUpperCase())
      day1.push(parseFloat(data[i]["1D cml"]))
      day3.push(parseFloat(data[i]["3D cml"]))
      year2max.push(parseFloat(data[i]["2yr max"]))
      year2maxhalf.push(parseFloat(data[i]["half of 2yr max"]))
    }
    $("#data-resolution").attr("data-slider-value","30")
    $("#data-resolution").attr("data-value","30")
    $("#data-resolution").attr("value","30")
    $("#chart_view").val("All Sites");
    $("#chart_view").selectpicker('refresh');
    $("#operands_value").val("> =");
    $("#operands_value").selectpicker('refresh');
    $("#criteria1").val("2 year max half");
    $("#criteria1").selectpicker('refresh');
    for (i = 0; i <  data.length; i++) {
      data_all_unfilterd.push(data[i])
      if((data[i]["half of 2yr max"] * (0.80)) <= data[i]["1D cml"] ){
       data_filtered_site.push(data[i]);
       var percent =(data[i]["half of 2yr max"] * (0.80));
     }
   }
   criteria_process(data_filtered_site,"container",percent)
   criteriaSelection(data_all_unfilterd,"container")
   percentage_select(data_all_unfilterd,"container")
   $("#chart_view").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
    var selected_view = $(this).find('option').eq(clickedIndex).text();
    $("#operands_value").val("....");
    $("#operands_value").selectpicker('refresh')
    $("#criteria").val("....");
    $("#criteria").selectpicker('refresh')
    if(selected_view == "All Sites"){
      $( "#container_region" ).slideUp()
      $( "#container" ).show()
      $('#region_id').slideUp("slow")
      $('#region_view_div').slideUp("slow")
      $('.percent_div').slideUp("slow")
      $('.val_rain').slideUp("slow")
      $("#criteria1").val("....");
      $("#criteria1").selectpicker('refresh');
      criteriaSelection(data,"container")
      document.getElementById("small_header").innerHTML ="&nbsp;Rainfall Scanner Page&nbsp;&nbsp;< &nbsp;&nbsp;All Sites";
    }else if (selected_view == "Region"){
     $('#region_id').slideDown("slow")
     $('#region_view_div').slideDown()
     $( "#container" ).slideUp()
     $( "#container_region" ).slideDown("slow")
     $('.percent_div').slideUp("slow")
     $('.val_rain').slideUp("slow")
     $("#criteria1").val("....");
     $("#criteria1").selectpicker('refresh');
     document.getElementById("small_header").innerHTML ="&nbsp;Rainfall Scanner Page&nbsp;&nbsp;< &nbsp;&nbsp;Region";
   }

   let dataJson = { 
    sites : site,
    day1 : day1, 
    day3 : day3,
    y2max : year2max,
    y2maxhalf : year2maxhalf
  }
  rainScannerBar(dataJson,"container")
});
 }else{
    document.getElementById("rain_header").innerHTML ="NO DATA";
 }
}
})   
});
function removeDuplicates(num) {
  var x,
  len=num.length,
  out=[],
  obj={};

  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  for (x in obj) {
    out.push(x);
  }
  return out;
}
function dropdowlistAppendValue(newitemnum, newitemdesc ,id) {
  $(id).append('<option val="'+newitemnum+'">'+newitemdesc+'</option>');
  $(id).selectpicker('refresh'); 
}
function region_view(data_result) {
  $.ajax({url: "../api/AllSiteDetails", dataType: "json",
    success: function(result){
      var data = result
      var region = []
      for (i = 0; i <  data.length; i++) {
        if(data[i].region != null){
          region.push(data[i].region.trim())
        }
      }
      var region_filter=removeDuplicates(region)
      region_filter.sort()
      $('#region_view').append('<option>....</option>');
      for (i = 0; i <  region_filter.length; i++) {
       dropdowlistAppendValue(region_filter[i], (region_filter[i]).toUpperCase(),'#region_view');
     } 
     region_select(data_result,data,region_filter) 
   }  
 });
}

function criteriaSelection(data,id){
 $('#criteria1').change(function(){
  $("#operands_value").val("....");
  $("#operands_value").selectpicker('refresh');
  $("#value_rain_num").val("");
  var criteria_val = $('#criteria1').val()
  if(criteria_val == "2 year max half" || criteria_val == "2 year max"){
    $('.percent_div').show()
    $('.val_rain').hide()
    percentage_select(data,id)
  }else if ( criteria_val == "72 hours" || criteria_val == "24 hours" ){
    $('.percent_div').hide()
    $('.val_rain').show()
    $(".slider slider-horizontal").addClass("slide_Addon");
    rainValue(data,id) 

  }
});
}

function rainValue(data,id) {
  $("#operands_value").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
    $("#value_rain_num").val("");
  });
  $("input[id='value_rain_num']").bind('keyup change click', function (e) {
    if (! $(this).data("previousValue") || $(this).data("previousValue") != $(this).val()){
      var criteria = $('#criteria1').val();
      var operand = $('#operands_value').val();
      var value_rain= $('#value_rain_num').val();
      var data_filtered_site= [];
      if(criteria == "24 hours"){
        if(operand == "="){
          for (i = 0; i <  data.length; i++) {
            if(value_rain == data[i]["1D cml"] ){
             data_filtered_site.push(data[i])
           }
         }
       }else if (operand == "< ="){
        for (i = 0; i <  data.length; i++) {
          if(value_rain >= data[i]["1D cml"] ){
           data_filtered_site.push(data[i])
         }
       }
     }else if (operand == "<"){
      for (i = 0; i <  data.length; i++) {
        if(value_rain > data[i]["1D cml"] ){
         data_filtered_site.push(data[i])
       }
     }
   }else if (operand == "> ="){
    for (i = 0; i <  data.length; i++) {
      if(value_rain <= data[i]["1D cml"] ){
       data_filtered_site.push(data[i])
     }
   }
 }else if (operand == ">"){
  for (i = 0; i <  data.length; i++) {
    if(value_rain < data[i]["1D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}
}else if(criteria == "72 hours"){
  if(operand == "="){
    for (i = 0; i <  data.length; i++) {
      if(value_rain == data[i]["3D cml"] ){
       data_filtered_site.push(data[i])
     }
   }
 }else if (operand == "< ="){
  for (i = 0; i <  data.length; i++) {
    if(value_rain >= data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if (operand == "<"){
  for (i = 0; i <  data.length; i++) {
    if(value_rain > data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if (operand == "> ="){
  for (i = 0; i <  data.length; i++) {
    if(value_rain <= data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if (operand == ">"){
  for (i = 0; i <  data.length; i++) {
    if(value_rain < data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}
}
criteria_process(data_filtered_site,id)
}      
});
}
function percentage_select(data,id) {
  $('#data-resolution').change(function(){
    var criteria = $('#criteria1').val();
    var operand = $('#operands_value').val();
    var percent = $('#data-resolution').val()
    var data_filtered_site= []
    if(criteria == "2 year max half"){
      if(operand == "="){
        for (i = 0; i <  data.length; i++) {
          if((data[i]["half of 2yr max"] * (percent/100)) == data[i]["1D cml"] ){
           data_filtered_site.push(data[i])
         }
       }
     }else if(operand == "< ="){
      for (i = 0; i <  data.length; i++) {
        if((data[i]["half of 2yr max"] * (percent/100)) >= data[i]["1D cml"] ){
         data_filtered_site.push(data[i])
       }
     }
   }else if(operand == "<"){
    for (i = 0; i <  data.length; i++) {
      if((data[i]["half of 2yr max"] * (percent/100)) > data[i]["1D cml"] ){
       data_filtered_site.push(data[i])
     }
   }
 }else if(operand == "> ="){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["half of 2yr max"] * (percent/100)) <= data[i]["1D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if(operand == ">"){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["half of 2yr max"] * (percent/100)) < data[i]["1D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}     
}else{
  if(operand == "="){
    for (i = 0; i <  data.length; i++) {
      if((data[i]["2yr max"] * (percent/100)) == data[i]["3D cml"] ){
       data_filtered_site.push(data[i])
     }
   }
 }else if(operand == "< ="){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["2yr max"] * (percent/100)) >= data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if(operand == "<"){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["2yr max"] * (percent/100)) > data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if(operand == "> ="){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["2yr max"] * (percent/100)) <= data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}else if(operand == ">"){
  for (i = 0; i <  data.length; i++) {
    if((data[i]["2yr max"] * (percent/100)) < data[i]["3D cml"] ){
     data_filtered_site.push(data[i])
   }
 }
}        
}
criteria_process(data_filtered_site,id)
})
}
function criteria_process(data,id,percent) {
  var site = [];
  var day1 =[];
  var day3 =[];
  var year2max =[];
  var year2maxhalf =[];
  for (i = 0; i <  data.length; i++) {
    site.push(data[i].site.toUpperCase())
    day1.push({y:(data[i]["1D cml"]/data[i]["half of 2yr max"]),data_value:data[i]["1D cml"]+"/"+data[i]["half of 2yr max"] +" = "+Math.round((data[i]["1D cml"]/data[i]["half of 2yr max"])*100)+"% of 2yr half max"})
    day3.push({y:(data[i]["3D cml"]/data[i]["2yr max"]),data_value:data[i]["3D cml"]+"/"+data[i]["2yr max"] +" = "+Math.round((data[i]["3D cml"]/data[i]["2yr max"])*100)+"% of 2yr half"})
        // year2max.push(data[i]["2yr max"])
        // year2maxhalf.push(data[i]["half of 2yr max"])
      }
      let dataJson = { 
        sites : site,
        day1 : day1, 
        day3 : day3,
        y2max : year2max,
        y2maxhalf : year2maxhalf
      }
      rainScannerBar(dataJson,id)
    }
    function region_select(data_result,data,region) {
      $("#region_view").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
        $("#operands_value").val("....");
        $("#operands_value").selectpicker('refresh')
        $("#criteria1").val("....");
        $("#criteria1").selectpicker('refresh')
        $("#value_rain_num").val("");
        $('.percent_div').slideUp("slow")
        $('.val_rain').slideUp("slow")
        var selected_region = $(this).find('option').eq(clickedIndex).text();
        document.getElementById("small_header").innerHTML ="&nbsp;Rainfall Scanner Page&nbsp;&nbsp;< &nbsp;&nbsp;Region"+
        "&nbsp;&nbsp;< &nbsp;&nbsp;"+selected_region;
        var region_collect =[]
        for (i = 0; i <  data.length; i++) {
          if(selected_region == data[i].region){
            region_collect.push(data[i].name.slice(0,3))
          }
        }
        var region_collect_sort = removeDuplicates(region_collect)
        region_collect_sort.sort()

        var site = [];
        var day1 =[];
        var day3 =[];
        var year2max =[];
        var year2maxhalf =[];
        var data_all=[]
        for (i = 0; i <  region_collect_sort.length; i++) {
          for (j = 0; j <  data_result.length; j++) {
            if(region_collect_sort[i] == data_result[j].site ){
              data_all.push(data_result[j])
              site.push(data_result[j].site.toUpperCase())
              day1.push(data_result[j]["1D cml"])      
              day3.push(data_result[j]["3D cml"])
              year2max.push(data_result[j]["2yr max"])
              year2maxhalf.push(data_result[j]["half of 2yr max"])

            }
          }
        }
        let dataJson = { 
          sites : site,
          day1 : day1, 
          day3 : day3,
          y2max : year2max,
          y2maxhalf : year2maxhalf
        }
        rainScannerBar(dataJson,"container_region")
        criteriaSelection(dataJson,"container_region")
      });

    }
    function rainScannerBar(data,id) {
      Highcharts.chart(id, {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Rainfall Scanner'
        },
        xAxis: {
          categories: data.sites,
          title: {
            text: null
          }
        },
        yAxis: [{
          min: 0,
          title: {
            text: 'Threshold ratio'
          },
        }],
        legend: {
          shadow: false
        },
        tooltip: {
         formatter: function() {
          return '<b>'+ this.series.name +'</b> '+this.point.data_value;
        }
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0
        }
      },
      series: [{
        //     name: '2 year max half',
        //     data: data.y2maxhalf,
        //     pointPadding: 0.3,
        //     pointPlacement: -0.2,
        //     yAxis: 1
        // }, {

          name: '1 Day cummulative',
          data: data.day1,
          pointPadding: 0.4,
          pointPlacement: -0.2,
        // },{
        //  name: '2 year max ',
        //  data: data.y2max,
        //  pointPadding: 0.3,
        //  pointPlacement: 0.2,
        //  yAxis: 1
      },{
        name: '3 Day cummulative',
        data: data.day3,
        pointPadding: 0.4,
        pointPlacement: 0.2,
      }]
    });

    }