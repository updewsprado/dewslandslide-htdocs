
$(document).ready(() => {
    $("#loading").modal("show");
    getPlotDataForSubsurface("magta", "2016-10-13T13:00:00")
    .done((subsurface_data) => {
        console.log(subsurface_data);

        subsurface_data.forEach(({ type, data }) => {
            if (type === "column_position") plotColumnPosition(data);
            else if (type === "displacement") plotDisplacement(data);
            else if (type === "velocity_alerts") plotVelocityAlerts(data);
        });
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
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

function getSiteSubsurfaceColumns (site_code, end_date) {
    return $.getJSON(`../subsurface_column/getSiteSubsurfaceColumns/${site_code}/${end_date}`)
    .catch(err => err);
}

function delegateSubsurfaceColumnsOnDropDown (column_list) {
    column_list.forEach(({ name: site_code }) => {
        $("#subsurface_column").append($("<option>", {
            value: site_code,
            text: `${site_code.toUpperCase()}`,
            class: "appended-option"
        }));
    });
}

function getPlotDataForSubsurface (site_column, end_date) {
    return $.getJSON(`../site_analysis/getPlotDataForSubsurface/${site_column}/${end_date}`)
    .catch(err => err);
}

function plotColumnPosition (column_data) {
    const { data: data_list } = column_data;
    data_list.forEach(({ orientation, data }) => {
        const col_data = { ...column_data };
        const colored_data = assignColorToEachSeries(data);
        col_data.data = colored_data;
        createColumnPositionChart(orientation, col_data, "agbta");
    });
    $("#loading").modal("hide");
}

function plotDisplacement (column_data) {
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

        createDisplacementChart(col_data, "agbta");
    });
    $("#loading").modal("hide");
}

function plotVelocityAlerts ({ velocity_alerts, timestamps_per_node }) {
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
        createVelocityAlertsChart(orientation, colored_data, "agbta");
    });
}

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
    const sin = Math.sin(Math.PI / size * 2 * index + phase);
    const int = Math.floor(sin * 127) + 128;
    const hex = int.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

function createColumnPositionChart (orientation, column_data, site_column) {
    const { data, max_position, min_position } = column_data;
    const xAxisTitle = orientation === "across_slope" ? "Across Slope" : "Downslope";

    $(`#column-position-${orientation}`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            height: 800
        },
        title: {
            text: "<b>Column Position Plot</b>"
        },
        subtitle: {
            text: `<b>Source: ${site_column.toUpperCase()}</b>`
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
                return `<b>Timestamp:</b> ${moment(this.series.name).format("dddd, MMM D, HH:mm")}<br><b>Depth: </b>${this.y}<br><b>Displacement: </b>${this.x}`;
            }
        },
        xAxis: {
            min: min_position,
            max: (max_position + 0.02),
            gridLineWidth: 1,
            title: {
                text: `Horizontal displacement, ${xAxisTitle} (m)`
            }
        },
        yAxis: {
            title: {
                text: "Depth (m)"
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
        }
    });
}

function createDisplacementChart (column_data, site_column) {
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
            text: `<b>Displacement Plot, ${xAxisTitle}</b>`
        },
        subtitle: {
            text: `<b>Source: ${(site_column).toUpperCase()}</b><br><br><b>Note: </b> + - consistently increasing/decreasing trend`
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%b"
            },
            title: {
                text: "Date"
            }
        },
        yAxis: {
            plotBands: annotations,
            title: {
                text: "Relative Displacement (mm)"
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
        }
    });
}

function createVelocityAlertsChart (orientation, data, site_column) {
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
            text: `<b>Velocity Alerts Plot, ${xAxisTitle}</b>`
        },
        subtitle: {
            text: `<b>Source: ${site_column.toUpperCase()}</b>`
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
                text: "Time"
            }
        },
        legend: {
            enabled: false
        },
        yAxis: {
            categories: category,
            reversed: true,
            title: {
                text: "Depth (m)"
            },
            labels: {
                formatter () {
                    return this.value;
                }
            }
        },
        tooltip: {
            formatter () {
                return `${moment(this.x).format("DD MMM YYYY, HH:mm")}`;
            }
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        }
    });
}
