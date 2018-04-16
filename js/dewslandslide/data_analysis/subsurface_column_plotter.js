
$(document).ready(() => {
    initializeColumnSummaryDurationDropdownOnClick();

    const form = {
        subsurface_column: "magta",
        start_date: "2016-10-11T12:00:00",
        end_date: "2016-10-12T12:00:00"
    };

    // plotColumnSummaryCharts(form);
    // plotSubsurfaceAnalysisCharts(form);
});

function processSubsurfaceColumnDropDown (site_code) {
    $("#subsurface_column").val("")
    .find("option.appended-option").remove();

    getSiteSubsurfaceColumns(site_code)
    .done(delegateSubsurfaceColumnsOnDropDown)
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function getSiteSubsurfaceColumns (site_code) {
    return $.getJSON(`../subsurface_column/getSiteSubsurfaceColumns/${site_code}`)
    .catch(err => err);
}

function delegateSubsurfaceColumnsOnDropDown (column_list) {
    console.log(column_list);
    column_list.forEach(({ name: site_code }) => {
        $("#subsurface_column").append($("<option>", {
            value: site_code,
            text: `${site_code.toUpperCase()}`,
            class: "appended-option"
        }));
    });
}

function initializeColumnSummaryDurationDropdownOnClick () {
    $("#column-summary-duration li, #subsurface-duration li").click(({ target }) => {
        const { value, duration } = $(target).data();
        const parent_id = $(target).parents(".btn-group").prop("id");

        $(`#${parent_id} li.active`).removeClass("active");
        $(target).parent().addClass("active");

        $(`#${parent_id}-btn`).empty()
        .append(`${value} ${duration}&emsp;<span class="caret"></span>`);
        
        const form = {
            subsurface_column: $("#subsurface_column").val(),
            start_date: getStartDate(parent_id.replace("-duration", "")),
            end_date: moment($("#data_timestamp").val()).format("YYYY-MM-DDTHH:mm")
        };

        if (parent_id === "column-summary-duration") {
            $("#subsurface-column-summary-plots .loading-bar").show();
            plotColumnSummaryCharts(form, 0);
        } else {
            $("#subsurface-plots .loading-bar").show();
            plotSubsurfaceAnalysisCharts(form);
        }
    });
}

/**
 * COLUMN SUMMARY CHARTS
 */

function plotColumnSummaryCharts (form, include_node_health = true) {
    $("#subsurface-column-summary-plots .loading-bar").show();
    getPlotDataForColumnSummary(form, include_node_health)
    .done((column_summary) => {
        delegateColumnSummaryDataForPlotting(column_summary, form);
        $("#subsurface-column-summary-plots .loading-bar").hide();
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function getPlotDataForColumnSummary (form, include_node_health) {
    const { subsurface_column, start_date, end_date } = form;
    return $.getJSON(`../site_analysis/getPlotDataForColumnSummary/${subsurface_column}/${start_date}/${end_date}/${include_node_health}`)
    .catch(err => err);
}

function delegateColumnSummaryDataForPlotting (column_summary, form) {
    column_summary.forEach(({ data, series_name }) => {
        switch (series_name) {
            case "node_summary": plotNodeHealthSummary(data, form); break;
            case "data_presence": plotDataPresence(data, form); break;
            case "communication_health": plotCommunicationHealth(data, form); break;
            default: break;
        }
    });
}

function plotNodeHealthSummary (series, { subsurface_column }) {
    createNodeHealthSummaryChart(series, subsurface_column);
}

function createNodeHealthSummaryChart (series, subsurface_column) {
    const divisor = Math.floor(series.length / 25);
    $("#node-health-summary").highcharts({
        series: [{
            name: "Nodes",
            borderColor: "#444444",
            borderWidth: 1,
            data: series,
            dataLabels: {
                enabled: true,
                color: "#222222",
                style: {
                    textShadow: "none"
                },
                formatter () {
                    return `${this.point.id}`;
                }
            }
        }],
        chart: {
            type: "heatmap",
            height: 120 + (divisor * 20),
            marginTop: 40,
            marginBottom: 40
        },
        title: {
            text: `<b>Node Health Summary of ${subsurface_column.toUpperCase()}</b>`,
            style: { fontSize: "14px" }
        },
        xAxis: {
            visible: false,
            categories: []
        },
        yAxis: {
            reversed: true,
            categories: [],
            title: null,
            labels: {
                format: "&ensp;",
                useHTML: true
            }
        },
        colorAxis: {
            stops: [
                [0, "#7cb5ec"],
                [0.5, "#ffed49"],
                [1, "#ff1414"]
            ],
            min: 0,
            max: 2
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter () {
                const {
                    timestamp, id_date, flagger,
                    status, comment, id
                } = this.point;
                let final_stat = "Ok";
                let added_info = "";

                if (typeof status !== "undefined") {
                    final_stat = status;
                    added_info = `Timestamp: <b>${moment(timestamp).format("DD MMM YYYY, HH:mm")}</b><br/>` +
                    `Identification Date: <b>${moment(id_date).format("DD MMM YYYY")}</b><br/>` +
                    `Comment: <b>${comment}</b><br/>Flagger: <b>${flagger}</b>`;
                }

                const tooltip = `Node ID: <b>${id}</b><br/>Status: <b>${final_stat}</b><br/>${added_info}`;
                return tooltip;
            }
        },
        credits: {
            enabled: false
        }
    });
}

function plotDataPresence (data, form) {
    createDataPresenceChart(data, form);
}

function createDataPresenceChart (data_presence, form) {
    const { subsurface_column, end_date } = form;
    const { data_presence: series, min_date, is_capped } = data_presence;
    const divisor = Math.floor(series.length / 20);
    $("#data-presence").highcharts({
        series: [{
            name: "Timestamps",
            borderColor: "#444444",
            borderWidth: 1,
            data: series,
            dataLabels: {
                enabled: true,
                color: "#222222",
                style: {
                    textShadow: "none"
                },
                formatter () {
                    return `${moment(this.point.id).format("h:mm")}`;
                }
            },
            turboThreshold: 2500
        }],
        chart: {
            type: "heatmap",
            height: 90 + (divisor * 20)
        },
        title: {
            text: `<b>Data Presence Chart of ${subsurface_column.toUpperCase()} (${moment(min_date).format("M/D/YYYY")} - ${moment(end_date).format("M/D/YYYY")})</b>`,
            style: { fontSize: "14px" }
        },
        subtitle: {
            text: (is_capped) ? "<b>Note:</b> Data Presence capped to 1 week max" : "",
            style: { fontSize: "10px" }
        },
        xAxis: {
            visible: false,
            categories: []
        },
        yAxis: {
            reversed: true,
            categories: [],
            title: null,
            labels: {
                format: "&ensp;",
                useHTML: true
            }
        },
        colorAxis: {
            stops: [
                [0, "#666666"],
                [0.5, "#7cb5ec"],
                [1, "#ffed49"]
            ],
            min: 0,
            max: 2
        },
        legend: {
            enabled: false,
            align: "right",
            layout: "vertical",
            margin: 0,
            verticalAlign: "top",
            y: 25,
            symbolHeight: 320
        },
        tooltip: {
            formatter () {
                let status;
                switch (this.point.value) {
                    default: // fall-through
                    case 0: status = "No data present"; break;
                    case 1: status = "Data present"; break;
                    case 2: status = "Data present for unexpected timestamp"; break;
                }
                return `Timestamp: <b>${moment(this.point.id).format("DD MMM YYYY, HH:mm")}</b><br/>Status: <b>${status}</b>`;
            }
        },
        credits: {
            enabled: false
        }
    });
}

function plotCommunicationHealth (data, form) {
    createCommunicationHealthChart(data, form);
}

function createCommunicationHealthChart (communication_health, form) {
    const { subsurface_column, start_date, end_date } = form;
    $("#communication-health").highcharts({
        series: communication_health,
        chart: {
            type: "column",
            height: 300
        },
        title: {
            text: `<b>Communication Health Chart of ${subsurface_column.toUpperCase()} (${moment(start_date).format("M/D/YYYY H:mm")} - ${moment(end_date).format("M/D/YYYY H:mm")})</b>`,
            style: { fontSize: "14px" }
        },
        xAxis: {
            min: 1,
            title: {
                text: "<b>Node number</b>"
            },
            allowDecimals: false
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: "<b>Health Percentage (%)</b>"
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            headerFormat: "Node {point.x}<br/>"
        },
        legend: {
            align: "right",
            verticalAlign: "middle",
            layout: "vertical"
        },
        credits: {
            enabled: false
        }
    });
}

/**
 * SUBSURFACE ANALYSIS CHARTS
 */

function plotSubsurfaceAnalysisCharts (form) {
    $("#subsurface-plots .loading-bar").show();
    getPlotDataForSubsurface(form)
    .done((subsurface_data) => {
        delegateSubsurfaceDataForPlotting(subsurface_data, form);
        $("#subsurface-plots .loading-bar").hide();
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function getPlotDataForSubsurface ({ subsurface_column, start_date, end_date }) {
    return $.getJSON(`../site_analysis/getPlotDataForSubsurface/${subsurface_column}/${start_date}/${end_date}`)
    .catch(err => err);
}

function delegateSubsurfaceDataForPlotting (subsurface_data, form) {
    subsurface_data.forEach(({ type, data }) => {
        if (type === "column_position") plotColumnPosition(data, form);
        else if (type === "displacement") plotDisplacement(data, form);
        else if (type === "velocity_alerts") plotVelocityAlerts(data, form);
    });
}

function plotColumnPosition (column_data, { subsurface_column }) {
    const { data: data_list } = column_data;
    data_list.forEach(({ orientation, data }) => {
        const col_data = { ...column_data };
        const colored_data = assignColorToEachSeries(data);
        col_data.data = colored_data;
        createColumnPositionChart(orientation, col_data, subsurface_column);
    });
}

function plotDisplacement (column_data, { subsurface_column }) {
    column_data.forEach((data, index) => {
        const { data: series_list, annotations } = data;

        const colored_data = assignColorToEachSeries(series_list);
        colored_data[0].type = "area";

        annotations.forEach((line) => {
            line.width = 0;
            line.label.style = { color: "gray" };
        });

        const col_data = {
            ...data,
            data: colored_data,
            annotations
        };

        createDisplacementChart(col_data, subsurface_column);
    });
}

function plotVelocityAlerts ({ velocity_alerts, timestamps_per_node }, { subsurface_column }) {
    const processed_data = assignColorToEachSeries(timestamps_per_node);
    velocity_alerts.forEach(({ orientation, data }) => {
        const alerts = data;
        const colored_data = [...processed_data];
        Object.keys(alerts).forEach((alert) => {
            const radius = alert === "L2" ? 7 : 10;
            const color = alert === "L2" ? "#FFFF00" : "#FF0000";
            const series = {
                data: alerts[alert],
                type: "scatter",
                zIndex: 5,
                name: alert,
                marker: {
                    symbol: "triangle",
                    radius,
                    fillColor: color,
                    lineColor: "#000000",
                    lineWidth: 2
                }
            };
            colored_data.push(series);
        });
        createVelocityAlertsChart(orientation, colored_data, subsurface_column);
    });
}

function createColumnPositionChart (orientation, column_data, subsurface_column) {
    const { data, max_position, min_position } = column_data;
    const xAxisTitle = orientation === "across_slope" ? "Across Slope" : "Downslope";

    $(`#column-position-${orientation}`).highcharts({
        series: data,
        chart: {
            type: "scatter",
            zoomType: "x",
            height: 800
        },
        title: {
            text: "<b>Column Position Plot</b>",
            style: { fontSize: "14px" }
        },
        subtitle: {
            text: `<b>Source: ${subsurface_column.toUpperCase()}</b>`,
            style: { fontSize: "12px" }
        },
        plotOptions: {
            series: {
                lineWidth: 2,
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: true,
                    radius: 3,
                    lineColor: null
                }
            }
        },
        tooltip: {
            formatter () {
                return `Timestamp: <b>${moment(this.series.name).format("dddd, MMM D, HH:mm")}</b><br>Depth: <b>${this.y}</b><br>Displacement: <b>${this.x}</b>`;
            }
        },
        xAxis: {
            min: min_position,
            max: (max_position + 0.02),
            gridLineWidth: 1,
            title: {
                text: `<b>Horizontal displacement, ${xAxisTitle} (m)</b>`
            }
        },
        yAxis: {
            title: {
                text: "<b>Depth (m)</b>"
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: "right",
            labelFormatter () {
                return `${moment(this.name).format("DD MMM YYYY, HH:mm")}`;
            }
        },
        credits: {
            enabled: false
        }
    });
}

function createDisplacementChart (column_data, subsurface_column) {
    const { orientation, data, annotations } = column_data;
    const xAxisTitle = orientation === "across_slope" ? "Across Slope" : "Downslope";

    $(`#subsurface-displacement-${orientation}`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 800,
            width: 400
        },
        title: {
            text: `<b>Displacement Plot, ${xAxisTitle}</b>`,
            style: { fontSize: "14px" }
        },
        subtitle: {
            text: `<b>Source: ${(subsurface_column).toUpperCase()}</b><br><br><b>Note: </b> + - consistently increasing/decreasing trend`,
            style: { fontSize: "12px" }
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%b"
            },
            title: {
                text: "<b>Date</b>"
            }
        },
        yAxis: {
            plotBands: annotations,
            title: {
                text: "<b>Relative Displacement (mm)</b>"
            }
        },
        tooltip: {
            header: "{point.x:%Y-%m-%d}: {point.y:.2f}"
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });
}

function createVelocityAlertsChart (orientation, data, subsurface_column) {
    const category = data.map(x => x.name).unshift();
    const xAxisTitle = orientation === "across_slope" ? "Across Slope" : "Downslope";
    $(`#velocity-alerts-${orientation}`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 800,
            width: 400
        },
        title: {
            text: `<b>Velocity Alerts Plot, ${xAxisTitle}</b>`,
            style: { fontSize: "14px" }
        },
        subtitle: {
            text: `<b>Source: ${subsurface_column.toUpperCase()}</b>`,
            style: { fontSize: "12px" }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%b"
            },
            title: {
                text: "<b>Time</b>"
            }
        },
        legend: {
            enabled: false
        },
        yAxis: {
            categories: category,
            reversed: true,
            title: {
                text: "<b>Depth (m)</b>"
            },
            labels: {
                formatter () {
                    return this.value;
                }
            }
        },
        tooltip: {
            formatter () {
                return `<b>${moment(this.x).format("DD MMM YYYY, HH:mm")}</b>`;
            }
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        },
        credits: {
            enabled: false
        }
    });
}

/**
 * HELPER FUNCTIONS
 */

function assignColorToEachSeries (data_array) {
    const size = data_array.length;
    const rainbow_colors = makeRainbowColors(size);
    for (let i = 0; i < size; i += 1) {
        if (data_array[i].name !== "Cumulative") data_array[i].color = rainbow_colors[i];
    }
    return data_array;
}

let rainbow_colors = [];
function makeRainbowColors (size) {
    const rainbow = [...rainbow_colors];
    if (rainbow.length !== size) {
        for (let i = 0; i < size; i += 1) {
            const obj = { index: i, size };
            const red = sinToHex(obj, 2 * Math.PI * 2 / 3);
            const blue = sinToHex(obj, 1 * Math.PI * 2 / 3);
            const green = sinToHex(obj, 0 * Math.PI * 2 / 3);
            rainbow[i] = `#${red}${green}${blue}`;
        }
        rainbow_colors = [...rainbow];
    }
    return rainbow;
}

function sinToHex ({ index, size }, phase) {
    console.log(phase);
    const sin = Math.sin(Math.PI / size * 2 * index + phase);
    const int = Math.floor(sin * 127) + 128;
    const hex = int.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
