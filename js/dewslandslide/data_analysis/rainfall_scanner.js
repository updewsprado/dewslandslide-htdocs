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
           // var result1 = ["[{\"site\":\"agb\",\"1D cml\":9.0,\"half of 2yr max\":61.2,\"3D cml\":9.5,\"2yr max\":122.5,\"DataSource\":\"agbtaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"bak\",\"1D cml\":0.0,\"half of 2yr max\":115.8,\"3D cml\":0.0,\"2yr max\":231.7,\"DataSource\":\"bakw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"ban\",\"1D cml\":4.0,\"half of 2yr max\":43.8,\"3D cml\":46.0,\"2yr max\":87.7,\"DataSource\":\"bantaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"bar\",\"1D cml\":0.0,\"half of 2yr max\":71.4,\"3D cml\":0.0,\"2yr max\":142.9,\"DataSource\":\"imesbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"bay\",\"1D cml\":0.0,\"half of 2yr max\":94.4,\"3D cml\":0.0,\"2yr max\":188.8,\"DataSource\":\"rain_noah_1976\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"blc\",\"1D cml\":7.0,\"half of 2yr max\":58.3,\"3D cml\":7.0,\"2yr max\":116.7,\"DataSource\":\"blcsaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"bol\",\"1D cml\":34.0,\"half of 2yr max\":65.1,\"3D cml\":179.5,\"2yr max\":130.1,\"DataSource\":\"rain_noah_1236\",\"alert\":\"r1\",\"advisory\":\"Start\\\/Continue monitoring\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"bto\",\"1D cml\":10.0,\"half of 2yr max\":39.0,\"3D cml\":23.0,\"2yr max\":78.1,\"DataSource\":\"btow\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"car\",\"1D cml\":74.0,\"half of 2yr max\":83.1,\"3D cml\":166.0,\"2yr max\":166.2,\"DataSource\":\"cartaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"cud\",\"1D cml\":0.0,\"half of 2yr max\":77.3,\"3D cml\":0.0,\"2yr max\":154.6,\"DataSource\":\"cudtaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"dad\",\"1D cml\":14.0,\"half of 2yr max\":80.9,\"3D cml\":27.0,\"2yr max\":161.8,\"DataSource\":\"dadtbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"gaa\",\"1D cml\":14.0,\"half of 2yr max\":45.4,\"3D cml\":18.5,\"2yr max\":90.8,\"DataSource\":\"rain_noah_1972\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"gam\",\"1D cml\":77.4,\"half of 2yr max\":89.0,\"3D cml\":126.2,\"2yr max\":178.0,\"DataSource\":\"rain_noah_782\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"hin\",\"1D cml\":0.0,\"half of 2yr max\":67.7,\"3D cml\":36.0,\"2yr max\":135.4,\"DataSource\":\"rain_noah_619\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"hum\",\"1D cml\":0.5,\"half of 2yr max\":43.8,\"3D cml\":1.5,\"2yr max\":87.6,\"DataSource\":\"platw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"ime\",\"1D cml\":0.0,\"half of 2yr max\":73.1,\"3D cml\":0.0,\"2yr max\":146.2,\"DataSource\":\"imesbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"imu\",\"1D cml\":0.0,\"half of 2yr max\":98.2,\"3D cml\":0.0,\"2yr max\":196.4,\"DataSource\":\"imuw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"ina\",\"1D cml\":4.0,\"half of 2yr max\":57.4,\"3D cml\":4.0,\"2yr max\":114.8,\"DataSource\":\"inatbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"jor\",\"1D cml\":0.0,\"half of 2yr max\":76.1,\"3D cml\":0.0,\"2yr max\":152.3,\"DataSource\":\"jortaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lab\",\"1D cml\":0.0,\"half of 2yr max\":96.4,\"3D cml\":0.0,\"2yr max\":192.8,\"DataSource\":\"labtw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lay\",\"1D cml\":0.0,\"half of 2yr max\":65.6,\"3D cml\":71.0,\"2yr max\":131.2,\"DataSource\":\"laysaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lip\",\"1D cml\":26.0,\"half of 2yr max\":65.7,\"3D cml\":135.5,\"2yr max\":131.3,\"DataSource\":\"liptw\",\"alert\":\"r1\",\"advisory\":\"Start\\\/Continue monitoring\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"loo\",\"1D cml\":10.8,\"half of 2yr max\":48.9,\"3D cml\":19.8,\"2yr max\":97.7,\"DataSource\":\"rain_noah_489\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lpa\",\"1D cml\":0.0,\"half of 2yr max\":69.6,\"3D cml\":0.0,\"2yr max\":139.2,\"DataSource\":\"lpasbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lte\",\"1D cml\":0.5,\"half of 2yr max\":65.9,\"3D cml\":76.5,\"2yr max\":131.7,\"DataSource\":\"ltew\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"lun\",\"1D cml\":13.5,\"half of 2yr max\":60.6,\"3D cml\":64.5,\"2yr max\":121.1,\"DataSource\":\"rain_noah_89\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"mag\",\"1D cml\":34.5,\"half of 2yr max\":54.3,\"3D cml\":60.5,\"2yr max\":108.7,\"DataSource\":\"magw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"mam\",\"1D cml\":2.0,\"half of 2yr max\":104.1,\"3D cml\":2.0,\"2yr max\":208.2,\"DataSource\":\"mambw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"mar\",\"1D cml\":4.5,\"half of 2yr max\":57.7,\"3D cml\":4.5,\"2yr max\":115.3,\"DataSource\":\"marw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"mca\",\"1D cml\":38.0,\"half of 2yr max\":80.7,\"3D cml\":99.0,\"2yr max\":161.4,\"DataSource\":\"mcataw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"mng\",\"1D cml\":9.0,\"half of 2yr max\":41.5,\"3D cml\":24.5,\"2yr max\":83.1,\"DataSource\":\"mngsaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"msl\",\"1D cml\":24.0,\"half of 2yr max\":58.1,\"3D cml\":27.5,\"2yr max\":116.2,\"DataSource\":\"rain_noah_1457\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"msu\",\"1D cml\":24.0,\"half of 2yr max\":58.1,\"3D cml\":27.5,\"2yr max\":116.2,\"DataSource\":\"rain_noah_1457\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"nag\",\"1D cml\":1.2,\"half of 2yr max\":102.1,\"3D cml\":3.4,\"2yr max\":204.2,\"DataSource\":\"rain_noah_849\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"nur\",\"1D cml\":164.0,\"half of 2yr max\":87.0,\"3D cml\":282.0,\"2yr max\":173.9,\"DataSource\":\"nurtbw\",\"alert\":\"r1\",\"advisory\":\"Start\\\/Continue monitoring\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"osl\",\"1D cml\":null,\"half of 2yr max\":87.1,\"3D cml\":null,\"2yr max\":174.3,\"DataSource\":\"No Alert! No ASTI\\\/SENSLOPE Data\",\"alert\":\"nd\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"par\",\"1D cml\":0.0,\"half of 2yr max\":65.6,\"3D cml\":92.0,\"2yr max\":131.2,\"DataSource\":\"partaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"pep\",\"1D cml\":1.0,\"half of 2yr max\":56.2,\"3D cml\":1.0,\"2yr max\":112.3,\"DataSource\":\"pepw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"pin\",\"1D cml\":0.0,\"half of 2yr max\":91.7,\"3D cml\":0.0,\"2yr max\":183.3,\"DataSource\":\"pintaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"pla\",\"1D cml\":0.5,\"half of 2yr max\":42.8,\"3D cml\":1.5,\"2yr max\":85.6,\"DataSource\":\"platw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"png\",\"1D cml\":0.0,\"half of 2yr max\":68.2,\"3D cml\":0.0,\"2yr max\":136.4,\"DataSource\":\"pngtaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"pug\",\"1D cml\":0.0,\"half of 2yr max\":96.7,\"3D cml\":0.0,\"2yr max\":193.4,\"DataSource\":\"pugw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"sag\",\"1D cml\":0.0,\"half of 2yr max\":84.5,\"3D cml\":0.0,\"2yr max\":169.0,\"DataSource\":\"sagtaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"sib\",\"1D cml\":87.5,\"half of 2yr max\":85.7,\"3D cml\":179.0,\"2yr max\":171.4,\"DataSource\":\"sibtaw\",\"alert\":\"r1\",\"advisory\":\"Start\\\/Continue monitoring\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"sin\",\"1D cml\":0.0,\"half of 2yr max\":114.6,\"3D cml\":0.0,\"2yr max\":229.2,\"DataSource\":\"sinw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"sum\",\"1D cml\":31.0,\"half of 2yr max\":49.6,\"3D cml\":56.5,\"2yr max\":99.2,\"DataSource\":\"sumtaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"tal\",\"1D cml\":0.0,\"half of 2yr max\":63.1,\"3D cml\":0.0,\"2yr max\":126.2,\"DataSource\":\"talsaw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"tga\",\"1D cml\":0.0,\"half of 2yr max\":65.0,\"3D cml\":0.0,\"2yr max\":130.0,\"DataSource\":\"tgatbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"tue\",\"1D cml\":0.0,\"half of 2yr max\":96.0,\"3D cml\":0.0,\"2yr max\":192.1,\"DataSource\":\"tuetbw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"},{\"site\":\"umi\",\"1D cml\":14.5,\"half of 2yr max\":56.7,\"3D cml\":14.5,\"2yr max\":113.4,\"DataSource\":\"umiw\",\"alert\":\"r0\",\"advisory\":\"---\",\"ts\":\"2017-03-09 17:30:00\"}]"]
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
            day1.push(data[i]["1D cml"])
            day3.push(data[i]["3D cml"])
            year2max.push(data[i]["2yr max"])
            year2maxhalf.push(data[i]["half of 2yr max"])
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
             data_filtered_site.push(data[i])
         }
     }
     criteria_process(data_filtered_site,"container")
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
function criteria_process(data,id) {
    var site = [];
    var day1 =[];
    var day3 =[];
    var year2max =[];
    var year2maxhalf =[];
    for (i = 0; i <  data.length; i++) {
        site.push(data[i].site.toUpperCase())
        day1.push(data[i]["1D cml"])
        day3.push(data[i]["3D cml"])
        year2max.push(data[i]["2yr max"])
        year2maxhalf.push(data[i]["half of 2yr max"])
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
            text: 'cummulative'
        }
    }, {
        title: {
            text: 'Threshold'
        },
        opposite: true
    }],
    legend: {
        shadow: false
    },
    tooltip: {
        shared: true
    },
    plotOptions: {
        column: {
            grouping: false,
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
            name: '2 year max half',
            data: data.y2maxhalf,
            pointPadding: 0.3,
            pointPlacement: -0.2,
             yAxis: 1
        }, {

            name: '1 Day cummulative',
            data: data.day1,
            pointPadding: 0.4,
            pointPlacement: -0.2,
        },{
           name: '2 year max ',
           data: data.y2max,
           pointPadding: 0.3,
           pointPlacement: 0.2,
           yAxis: 1
       },{
        name: '3 Day cummulative',
        data: data.day3,
        pointPadding: 0.4,
        pointPlacement: 0.2,
    }]
});

}