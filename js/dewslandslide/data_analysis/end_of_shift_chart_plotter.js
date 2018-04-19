$(document).ready(() => {
    initializeChartData();
});

function initializeChartData () {
    const values = window.location.href.split("/");
    const user_id = values[5];
    const category = values[6]; // if rain, suficial or subsurface
    const site_detail = values[7];
    const start_date = values[8].replace("%20", " ");
    const end_date = values[9].replace("%20", " ");

    const end = moment(end_date).subtract(1, "hour").format("YYYY-MM-DDTHH:mm");
    const start = eosGetStartDate(category, end_date);
    console.log(end, start);
    // alert(eosGetStartDate(category, end_date));
    let site_code = null;
    let column_name = null;
    if (category === "subsurface") column_name = site_detail;
    else site_code = site_detail;

    let title = `${site_detail.toUpperCase()} - Rainfall`;
    if (category === "surficial") title = `${site_code.toUpperCase()} - Surficial`;
    else if (category === "subsurface") title = column_name.toUpperCase();
    const tab_title = `EOS : ${title}`;

    $("head title", window.parent.document).text(tab_title);

    switch (category) {
        case "rain":
            plotEoSRainfall(site_code, start, end);
            break;
        case "surficial":
            plotEoSSurficial(site_code, start, end);
            break;
        case "subsurface":
            plotEoSSubsurface(column_name, start, end);
            break;
        default: break;
    }
}

function svgChart (idBox) {
    const values = window.location.href.split("/");
    const connection_id = values[5];
    const category = values[6];
    const site = values[7];

    const name_site = ((($("tspan").text()).split(".")));
    const extracted_name = (name_site[0]).split(" ");
    $(".highcharts-contextbutton").attr("visibility", "hidden");

    if (idBox == "rain") {
        $(".highcharts-root").removeAttr("xmlns");
        $(".highcharts-root").removeAttr("version");

        const idsSub = $(".collapse").map(function () {
            return this.id;
        }).get();

        var ids0 = [];
        const ids1 = [];
        for (var i = 0; i < idsSub.length; i++) {
            if (idsSub[i].length < 6 || idsSub[i] == "rain_arq" || idsSub[i] == "rain_senslope") {
                ids0.push(idsSub[i]);
            } else {
                ids1.push(idsSub[i]);
            }
        }
        const ids2 = $(".rainGraph .in").map(function () {
            return this.id;
        }).get();
        const ids4 = [];
        for (var i = 0; i < ids0.length; i++) {
            for (var a = 0; a < ids2.length; a++) {
                if (ids0[i] == ids2[a]) {
                    ids4.push(ids0[i]);
                }
            }
        }

        for (var i = 0; i < ids4.length; i++) {
            $(`#${ids4[i]} .highcharts-container  .highcharts-root`).attr("x", 760);
            $(`#${ids4[i]} .highcharts-container  .highcharts-root`).attr("y", (i) * 300);
        }

        const ids5 = [];
        for (var i = 0; i < ids0.length; i++) {
            for (var a = 0; a < ids2.length; a++) {
                if (ids1[i] == ids2[a]) {
                    ids5.push(ids1[i]);
                }
            }
        }

        for (var i = 0; i < ids5.length; i++) {
            $(`#${ids5[i]} .highcharts-container  .highcharts-root`).attr("x", 100);
            $(`#${ids5[i]} .highcharts-container  .highcharts-root`).attr("y", (i) * 300);
        }

        var ids = $(".highcharts-container").map(function () {
            return this.id;
        }).get();

        if (ids.length == 4) {
            $("#rainBox").attr("height", "1100");
        } else if (ids.length == 5) {
            $("#rainBox").attr("height", "1600");
        }

        for (var i = 0; i < ids.length; i++) {
            $("#rainBox").append($(`#${ids[i]}`).html());
        }

        var all_data = $("#rainAll").html();
    } else if (idBox == "subsurface") {
        $(".highcharts-root").removeAttr("xmlns");
        $(".highcharts-root").removeAttr("version");

        var ids0 = ["colspangraph", "dis", "velocity"];
        const idsall = [];
        for (var i = 0; i < ids0.length; i++) {
            $(`#${ids0[i]}1 .highcharts-container  .highcharts-root`).attr("x", 50);
            $(`#${ids0[i]}1 .highcharts-container  .highcharts-root`).attr("y", i * 900);
            $("#subBox").append($(`#${ids0[i]}1 .highcharts-container `).html());
        }

        for (var i = 0; i < ids0.length; i++) {
            $(`#${ids0[i]}2 .highcharts-container  .highcharts-root`).attr("x", 660);
            $(`#${ids0[i]}2 .highcharts-container  .highcharts-root`).attr("y", i * 900);
            $("#subBox").append($(`#${ids0[i]}2 .highcharts-container`).html());
        }

        var all_data = $("#subAll").html();
    } else if (idBox == "surficial") {
        var ids = $(".highcharts-container").map(function () {
            return this.id;
        }).get();

        var all_data = $(`#${ids[0]}`).html();
    }

    $.post("/../chart_export/saveChartSVG", {
        svg: all_data, site, type: category, connection_id
    })
    .done((data) => {
        console.log("done");
        $("#loading").modal("hide");
        $(".modal-backdrop").remove();

        const values = window.location.href.split("/");
        const to_time = values[9];
        const from_time = values[8];
        const t0 = $("#tester_id_time").html();
        const t1 = performance.now();
        const total = [site, (t1 - t0).toFixed(4), from_time, to_time];
    });
}

function eosGetStartDate (category, end_date) {
    let start_date = "";
    let value = "";
    let duration = "";
    switch (category) {
        case "rain":
            value = 10;
            duration = "days";
            break;
        case "surficial":
            value = 10;
            duration = "days";
            break;
        case "subsurface":
            value = 3;
            duration = "days";
            break;
        default: break;
    }
    start_date = moment(end_date).subtract(value, duration).subtract(1, "hour").format("YYYY-MM-DDTHH:mm");
    return start_date;
}

function plotEoSRainfall (site_code, start, end) {
    $("#site-plots-container, #rainfall-plots").show();
    $("#surficial-plots, #site-plots-container > div > .plot-title-hr").hide();

    const input = {
        site_code,
        start_date: start,
        end_date: end,
        source: "all" // table
    };

    const $loading_rain = $("#rainfall-plots .loading-bar");
    $loading_rain.show();

    getPlotDataForRainfall(input, true)
    .done((datalist) => {
        plotRainfall(datalist, input);
        $loading_rain.hide();
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });

    svgChart("rain");
}

function plotEoSSurficial (site_code, start, end) {
    $("#site-plots-container, #surficial-plots").show();
    $("#rainfall-plots, #site-plots-container > div > .plot-title-hr").hide();

    const $loading_surficial = $("#surficial-plots .loading-bar");
    $loading_surficial.show();

    $("#surficial-plots").show();
    const input = {
        site_code,
        start_date: start,
        end_date: end
    };

    getPlotDataForSurficial(input, true)
    .done((series) => {
        console.log(series);
        createSurficialMarkersButton(series);

        $(`#${input.site_code}-surficial`).show();
        plotSurficial(series, input);
        $loading_surficial.hide();
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function plotEoSSubsurface (column_name, start, end) {
    $("#subsurface-column-plots-container, #subsurface-plots").show();
    $("#subsurface-column-summary-plots, #subsurface-column-plots-container > div > .plot-title-hr").hide();
    $("#subsurface-plots .loading-bar").show();

    const input = {
        subsurface_column: column_name,
        start_date: start,
        end_date: end
    };

    getPlotDataForSubsurface(input, true)
    .done((subsurface_data) => {
        delegateSubsurfaceDataForPlotting(subsurface_data, input);
        $("#subsurface-plots .loading-bar").hide();
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}
