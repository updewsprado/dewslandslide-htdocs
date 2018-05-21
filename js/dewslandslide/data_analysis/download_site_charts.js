$(document).ready(() => {
    initializePlottedCharts();
    initializeDownloadChartsButton();
});

function initializeDownloadChartsButton () {
    $("body").on("click", "#download-charts", ({ currentTarget }) => {
        $("#chart-options").modal({ backdrop: "static", keyboard: false });
        $(".download_chart_checkbox").prop("checked", false);
        initializePlottedCharts();
        downloadSelectedCharts();
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
    SITE_LEVEL_CONTAINER.forEach(function (rain_chart) {
        const tag = `#${rain_chart} div:first`;
        const get_svg = $(tag).html();
        $("#rainfall_svg").append(get_svg);
        delegateChartSVGPosition("rainfall");
    });
    // return $("#rain_charts").html();
}

function createSurficialSVG () {
    $("#surficial_svg").empty();
    const tag = ".surficial-plot-container div:first";
    const get_svg = $(tag).html();
    $("#surficial_svg").append(get_svg);
    // return $("#surficial_chart").html();
}

function createColumnSummarySVG (type) {
    let tag = null;
    let chart_append_id = null;
    let chart_id = null;
    switch (type) {
        case "node_health":
            $("#node_health_svg").empty();
            tag = "#node-health-summary div:first";
            chart_append_id = "#node_health_svg";
            chart_id = "#node_health_chart";
            console.log("node_health");
            break;
        case "data_presence":
            $("#data_presence_svg").empty();
            tag = "#data-presence div:first";
            chart_append_id = "#data_presence_svg";
            chart_id = "#data_presence_chart";
            console.log("data_presence");
            break;
        case "communication_health":
            $("#communication_health_svg").empty();
            tag = "#communication-health div:first";
            chart_append_id = "#communication_health_svg";
            chart_id = "#communication_health_chart";
            console.log("communication_health");
            break;
        default:
            break;
    }

    const get_svg = $(tag).html();
    $(chart_append_id).append(get_svg);
    // return $(chart_id).html();
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

    subsurface_charts.forEach(function (subsurface_chart) {
        const tag = `#${subsurface_chart} div:first`;
        const get_svg = $(tag).html();
        $("#subsurface_svg").append(get_svg);
        delegateChartSVGPosition("subsurface");
    });
    // return $("#column-position").html();
}

function createNodeSVG (type) {
    let tag = null;
    let chart_append_id = null;
    let chart_id = null;
    switch (type) {
        case "x-accelerometer":
            $("#x_accelerometer_svg").empty();
            tag = "#x-accelerometer-graph div:first";
            chart_append_id = "#x_accelerometer_svg";
            chart_id = "#x_accelerometer_chart";
            break;
        case "y-accelerometer":
            $("#y_accelerometer_svg").empty();
            tag = "#y-accelerometer-graph div:first";
            chart_append_id = "#y_accelerometer_svg";
            chart_id = "#y_accelerometer_chart";
            break;
        case "z-accelerometer":
            $("#z_accelerometer_svg").empty();
            tag = "#z-accelerometer-graph div:first";
            chart_append_id = "#z_accelerometer_svg";
            chart_id = "#z_accelerometer_chart";
            break;
        case "battery":
            $("#battery_svg").empty();
            tag = "#battery-graph div:first";
            chart_append_id = "#battery_svg";
            chart_id = "#battery_chart";
            break;
        default:
            break;
    }

    const get_svg = $(tag).html();
    $(chart_append_id).append(get_svg);
    return $(chart_id).html();
}

function deleteAllChartPlotted () {
    chart_plots.forEach(function (plotted) {
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
                x: 400,
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
            console.log(chart_checked);
            console.log(charts_svg);
        });
        console.log(charts_svg);
        // const site_detail = "agb";
        // const plot_type = "sample";
        $.post("/../site_analysis_charts/renderSelectedChart", { charts: charts_svg })
        .done((data) => {
            console.log("done");
        });
    });
}
