$(document).ready(() => {
    initializePlottedCharts();
    initializeDownloadChartsButton();
});

function initializeDownloadChartsButton () {
    $("body").on("click", "#download-charts", ({ currentTarget }) => {
        $("#chart-options").modal({ backdrop: "static", keyboard: false });
        $(".download_chart_checkbox").prop("checked", false);
        initializePlottedCharts();
    });
}

function initializePlottedCharts () {
    $(".download_chart_checkbox").prop("disabled", true);
    chart_plots.forEach(function (plotted) {
        switch (plotted) {
            case plotted:
                $(`#${plotted}`).prop("disabled", false);
                break;
            default:
                break;
        }
    });
}

function createSVG (plot_type, site_detail) {
    let svg = null;
    $(".highcharts-root").removeAttr("xmlns").removeAttr("version");

    switch (plot_type) {
        case "rainfall":
            svg = createRainfallSVG();
            break;
        case "surficial":
            svg = createSurficialSVG();
            break;
        case "subsurface":
            svg = createSubsurfaceSVG();
            break;
        default: break;
    }
    console.log(svg);
    $.post("/../site_analysis_charts/saveSiteAnalysisChart", {
        svg, site: site_detail, type: plot_type
    })
    .done((data) => {
        console.log("done");
    });
}

function createRainfallSVG () {
    $("#rainfall_svg").empty();
    SITE_LEVEL_CONTAINER.forEach(function (rain_chart) {
        console.log(rain_chart);
        const tag = `#${rain_chart} div:first`;
        const get_svg = $(tag).html();
        $("#rainfall_svg").append(get_svg);
        delegateChartSVGPosition("rainfall");
    });
    return $("#rain_charts").html();
}

function delegateChartSVGPosition (type) {
    let y_axis_even = 0;
    let y_axis_odd = 0;
    let chart_count = 0;

    if (type === "rainfall") chart_count = 8;
    else if (type === "subsurface") chart_count = 6;

    for (let counter = 1; counter <= chart_count; counter += 1) {
        const tag = `#${type}_svg svg:nth-child(${counter})`;
        if (counter % 2 === 0) {
            $(tag).attr({
                x: 400,
                y: y_axis_even,
                id: `sample_${counter}`
            });
            y_axis_even += returnYaxisValue(type);
        } else {
            $(tag).attr({
                x: 0,
                y: y_axis_odd,
                id: `sample_${counter}`
            });
            y_axis_odd += returnYaxisValue(type);
        }
    }
}

function returnYaxisValue (type) {
    if (type === "rainfall") return 400;
    return 800;
}

function createSurficialSVG () {

}

function createSubsurfaceSVG () {

}

function deleteAllChartPlotted () {
    chart_plots.forEach(function (plotted) {
        chart_plots.delete(plotted);
    });
}
