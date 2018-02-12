
const rainfall_colors = {
    "24h": "#4969FCE6",
    "72h": "#EF4532E6",
    rain: "#000000E6"
};

$(document).ready(() => {
    const temp = {
        site_code: "agb",
        start_date: "2017-11-16T00:00:00",
        end_date: "2017-11-22T00:00:00"
    };

    getPlotDataForRainfall(temp)
    .done((datalist) => {
        console.log(datalist);

        datalist.forEach((source) => {
            const { null_ranges } = source;
            let { source_table } = source;

            if (isFinite(source_table)) {
                source_table = `noah_${source_table}`;
                source.source_table = source_table;
            }

            createPlotContainer("rainfall", source_table);

            const series_data = [];
            const max_rval_data = [];
            Object.keys(rainfall_colors).forEach((name) => {
                const color = rainfall_colors[name];
                const entry = {
                    name,
                    step: true,
                    data: source[name],
                    color,
                    id: name,
                    fillOpacity: 1,
                    lineWidth: 1
                };
                if (name !== "rain") series_data.push(entry);
                else max_rval_data.push(entry);
            });

            const null_processed = null_ranges.map(({ from, to }) => ({ from, to, color: "#44AAD533" }));
            createInstantaneousRainfallChart(max_rval_data, temp, source, null_processed);
            createCumulativeRainfallChart(series_data, temp, source);
        });
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
});

function getPlotDataForRainfall ({ site_code, start_date, end_date }) {
    return $.getJSON(`../site_analysis/getPlotDataForRainfall/${site_code}/${start_date}/${end_date}`)
    .catch(err => err);
}

function createPlotContainer (data_type, source_table) {
    $(`#${data_type}-plots`)
    .append($("<div>", {
        class: `${data_type}-plot-container`,
        id: source_table
    }));

    if (data_type === "rainfall") {
        ["instantaneous", "cumulative"].forEach((x) => {
            $(`#${source_table}`)
            .append($("<div>", {
                class: "col-sm-6",
                id: `${source_table}-${x}`
            }));
        });
    }
}

function createCumulativeRainfallChart (data, temp, source) {
    const { site_code, start_date, end_date } = temp;
    const {
        distance, max_72h, max_rain_2year, source_table
    } = source;
    const subtitle = distance === null ? source_table.toUpperCase() : `${source_table.toUpperCase()} (${distance} KM)`;

    Highcharts.setOptions({ global: { timezoneOffset: -8 * 60 } });
    $(`#${source_table}-cumulative`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
        title: {
            text: `<b>Rainfall Data of ${site_code.toUpperCase()} (${moment(end_date).format("MM/DD/YYYY HH:mm")})</b>`,
            style: {
                fontSize: "12px"
            }
        },
        subtitle: {
            text: `Source : <b>${subtitle}</b>`,
            style: {
                fontSize: "10px"
            }
        },
        xAxis: {
            min: Date.parse(start_date),
            max: Date.parse(end_date),
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%b"
            },
            title: {
                text: "Date"
            },
            events: {
                afterSetExtremes () {
                    if (!this.chart.options.chart.isZoomed) {
                        const xMin = this.chart.xAxis[0].min;
                        const xMax = this.chart.xAxis[0].max;
                        const zmRange = 0.5;
                        zoomEvent(id, zmRange, xMin, xMax, "rain");
                    }
                }
            }
        },
        yAxis: {
            title: {
                text: "Value (mm)"
            },
            max: Math.max(0, (max_72h - parseFloat(max_rain_2year))) + parseFloat(max_rain_2year),
            min: 0,
            plotBands: [{
                value: Math.round(parseFloat(max_rain_2year / 2) * 10) / 10,
                color: rainfall_colors["24h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `24-hr threshold (${max_rain_2year / 2})`

                }
            }, {
                value: max_rain_2year,
                color: rainfall_colors["72h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `72-hr threshold (${max_rain_2year})`
                }
            }]

        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            },
            area: {
                marker: {
                    lineWidth: 3,
                    lineColor: null
                }
            },
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: "rgb(100,100,100)"
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    }, (chart) => {
        // syncronizeCrossHairs(chart, id, "rain");
    });
}

function createInstantaneousRainfallChart (data, temp, source, null_processed) {
    const { site_code, start_date, end_date } = temp;
    const {
        distance, max_rval, source_table
    } = source;
    const subtitle = distance === null ? source_table.toUpperCase() : `${source_table.toUpperCase()} (${distance} KM)`;

    Highcharts.setOptions({ global: { timezoneOffset: -8 * 60 } });
    $(`#${source_table}-instantaneous`).highcharts({
        series: data,
        chart: {
            type: "column",
            zoomType: "x",
            panning: true,
            height: 400
        },
        title: {
            text: `<b>Rainfall Data of ${site_code.toUpperCase()} (${moment(end_date).format("MM/DD/YYYY HH:mm")})</b>`,
            style: {
                fontSize: "12px"
            }
        },
        subtitle: {
            text: `Source : <b>${subtitle}</b>`,
            style: {
                fontSize: "10px"
            }
        },
        xAxis: {
            min: Date.parse(start_date),
            max: Date.parse(end_date),
            plotBands: null_processed,
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%b"
            },
            title: {
                text: "Date"
            },
            events: {
                afterSetExtremes () {
                    if (!this.chart.options.chart.isZoomed) {
                        const xMin = this.chart.xAxis[0].min;
                        const xMax = this.chart.xAxis[0].max;
                        const zmRange = 0.5;
                        zoomEvent(id, zmRange, xMin, xMax, "rain");
                    }
                }
            }

        },
        yAxis: {
            max: max_rval,
            min: 0,
            title: {
                text: "Value (mm)"
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: "rgb(100,100,100)"
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            },
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            },
            area: {
                marker: {
                    lineWidth: 3,
                    lineColor: null
                }
            }

        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    }, (chart) => {
        //syncronizeCrossHairs(chart, `${id}2`, "rain");
    });
}
