$(document).ready(() => {
    initializePlottedCharts();
    initializeDownloadChartsButton();
});

function initializeDownloadChartsButton () {
    $("body").on("click", "#download-charts", ({ currentTarget }) => {
        $("#chart-options").modal({ backdrop: "static", keyboard: false });
        $(".download_chart_checkbox").prop("checked", false);
        $("#select-chart-message").hide();
        initializePlottedCharts();
        downloadSelectedCharts();
    });
}

function initializePlottedCharts () {
    $(".download_chart_checkbox").prop("disabled", true);
    chart_plots.forEach((plotted) => {
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
    // debugger;
    // let svg = null;
    $(".highcharts-root").removeAttr("xmlns").removeAttr("version");
    // console.log(plot_type);
    switch (plot_type) {
        case "rainfall":
            createRainfallSVG();
            break;
        case "surficial":
            createSurficialSVG();
            break;
        case "node_health":
            createColumnSummarySVG(plot_type);
            break;
        case "data_presence":
            createColumnSummarySVG(plot_type);
            break;
        case "communication_health":
            createColumnSummarySVG(plot_type);
            break;
        case "subsurface_column":
            createSubsurfaceSVG();
            break;
        case "x-accelerometer":
            createNodeSVG(plot_type);
            break;
        case "y-accelerometer":
            createNodeSVG(plot_type);
            break;
        case "z-accelerometer":
            createNodeSVG(plot_type);
            break;
        case "battery":
            createNodeSVG(plot_type);
            break;
        default: break;
    }
}

function createRainfallSVG () {
    $("#rainfall_svg").empty();
    const tag = "rainfall-chart";
    const charts = Highcharts.charts.filter((x) => {
        if (typeof x !== "undefined") return $(x.renderTo).hasClass(tag);
        return false;
    });
    charts.forEach((chart) => {
        const rain_svg = chart.getSVG();
        $("#rainfall_svg").append(rain_svg);
    });
    delegateChartSVGPosition("rainfall");
}

function createSurficialSVG () {
    $("#surficial_svg").empty();
    const tag = "surficial-plot-container";
    const [chart] = Highcharts.charts.filter((x) => {
        if (typeof x !== "undefined") return $(x.renderTo).hasClass(tag);
        return false;
    });
    const get_svg = chart.getSVG();
    $("#surficial_svg").append(get_svg);
}

function createColumnSummarySVG (type) {
    let chart_id = null;
    let chart_append_id = null;
    switch (type) {
        case "node_health":
            chart_id = "node-health-summary";
            chart_append_id = "#node_health_svg";
            break;
        case "data_presence":
            chart_id = "data-presence";
            chart_append_id = "#data_presence_svg";
            break;
        case "communication_health":
            chart_id = "communication-health";
            chart_append_id = "#communication_health_svg";
            break;
        default:
            break;
    }
    const charts = Highcharts.charts.filter((x) => {
        if (typeof x !== "undefined") return $(x.renderTo).prop("id") === chart_id;
        return false;
    });
    charts.forEach((chart) => {
        const column_summary_svg = chart.getSVG();
        $(chart_append_id).append(column_summary_svg);
    });
}

function createSubsurfaceSVG () {
    $("#subsurface_svg").empty();
    const subsurface_charts = [
        "column-position-downslope",
        "column-position-across_slope",
        "subsurface-displacement-downslope",
        "subsurface-displacement-across_slope",
        "velocity-alerts-downslope",
        "velocity-alerts-across_slope"
    ];

    subsurface_charts.forEach((subsurface_chart) => {
        const [chart] = Highcharts.charts.filter((x) => {
            if (typeof x !== "undefined") return $(x.renderTo).prop("id") === subsurface_chart;
            return false;
        });
        const subsurface_svg = chart.getSVG();
        $("#subsurface_svg").append(subsurface_svg);
    });
    delegateChartSVGPosition("subsurface");
}

function createNodeSVG (type) {
    let chart_append_id = null;
    let chart_id = null;
    switch (type) {
        case "x-accelerometer":
            $("#x_accelerometer_svg").empty();
            chart_append_id = "#x_accelerometer_svg";
            chart_id = "x-accelerometer-graph";
            break;
        case "y-accelerometer":
            $("#y_accelerometer_svg").empty();
            chart_append_id = "#y_accelerometer_svg";
            chart_id = "y-accelerometer-graph";
            break;
        case "z-accelerometer":
            $("#z_accelerometer_svg").empty();
            chart_append_id = "#z_accelerometer_svg";
            chart_id = "z-accelerometer-graph";
            break;
        case "battery":
            $("#battery_svg").empty();
            chart_append_id = "#battery_svg";
            chart_id = "battery-graph";
            break;
        default:
            break;
    }
    const charts = Highcharts.charts.filter((x) => {
        if (typeof x !== "undefined") return $(x.renderTo).prop("id") === chart_id;
        return false;
    });
    charts.forEach((chart) => {
        const node_svg = chart.getSVG();
        $(chart_append_id).append(node_svg);
    });
}

function deleteAllChartPlotted () {
    chart_plots.forEach((plotted) => {
        chart_plots.delete(plotted);
    });
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
                x: 600,
                y: y_axis_even
            });
            y_axis_even += returnYaxisValue(type);
        } else {
            $(tag).attr({
                x: 0,
                y: y_axis_odd
            });
            y_axis_odd += returnYaxisValue(type);
        }
    }
}

function returnYaxisValue (type) {
    if (type === "rainfall") return 400;
    return 800;
}

function downloadSelectedCharts () {
    $("body").on("click", "#download-charts-selected", ({ currentTarget }) => {
        const chart_checked = [];
        const charts_svg = [];
        $("#chart_checkboxes input:checked").each(function () {
            const chart_name = $(this).attr("value");
            chart_checked.push(`${chart_name}_chart`);
            charts_svg.push($(`#${chart_name}_chart`).html());
        });

        if (charts_svg.length < 1 || charts_svg === undefined) {
            $("#select-chart-message").show(300);
        } else {
            renderSelectedChartsOnSiteAnalysis(charts_svg)
            .done((data) => {
                console.log("done");
                if (data === "Finished") {
                    //download compiled pdf code here
                } else {
                    //error downloading code here
                }
            })
            .catch((x) => {
                // showErrorModal(x, "rendering and downloading charts");
            });
        }
    });
}

function renderSelectedChartsOnSiteAnalysis (charts_svg) {
    return $.post("/../chart_export/renderSelectedChartsOnSiteAnalysis", { charts: charts_svg });
}
