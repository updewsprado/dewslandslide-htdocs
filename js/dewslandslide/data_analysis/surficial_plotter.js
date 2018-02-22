
$(document).ready(() => {
    initializeSurficialCracksButton();
    initializeSurficialDurationDropDownOnClick();
});

function initializeSurficialCracksButton () {
    $(document).on("click", "#surficial-cracks-btn-group button", ({ target }) => {
        const isLoaded = $(target).data("loaded");
        const crack = $(target).val();
        if (isLoaded) {
            // $(`#${table}`).slideToggle({
            //     complete () {
            //         $(target).toggleClass("active");
            //     }
            // });
            console.log("loaded");
        } else {
            $("#loading").modal("show");
            const input = {
                site_code: $("#site_code").val(),
                end_date: $("#data_timestamp").val(),
                start_date: getStartDate("surficial")
            };

            if (crack === "surficial") {
                getPlotDataForSurficial(input)
                .done((series) => {
                    console.log(series);
                    createSurficialCracksButton(series);

                    $(`#${input.site_code}-${crack}`).show();
                    plotSurficial(series, input);
                    $(target).data("loaded", true);
                    $(target).addClass("active");
                    $("#loading").modal("hide");
                })
                .catch(({ responseText, status: conn_status, statusText }) => {
                    alert(`Status ${conn_status}: ${statusText}`);
                    alert(responseText);
                });
            }
        }
    });
}

function initializeSurficialDurationDropDownOnClick () {
    $("#surficial-duration li").click(({ target }) => {
        const { value, duration } = $(target).data();

        $("#surficial-duration li.active").removeClass("active");
        $(target).parent().addClass("active");

        $("#surficial-duration-btn").empty()
        .append(`${value} ${duration}&emsp;<span class="caret"></span>`);
    });
}

function getPlotDataForSurficial ({ site_code, start_date, end_date }) {
    return $.getJSON(`../site_analysis/getPlotDataForSurficial/${site_code}/${start_date}/${end_date}`)
    .catch(err => err);
}

function createSurficialCracksButton (series) {
    const cracks = [];
    series.forEach(({ name }) => {
        cracks.push(name);
    });

    $btn_group = $("#surficial-cracks-btn-group");
    $(".surficial-cracks").remove();
    cracks.forEach((crack) => {
        $btn_group.append($("<button>", {
            type: "button",
            class: "btn btn-primary btn-sm surficial-cracks",
            value: crack,
            text: crack,
            "data-loaded": false
        }));
    });
}

function plotSurficial (series, input) {
    const { site_code } = input;
    createPlotContainer("surficial", `${site_code}-surficial`);
    createSurficialChart(series, input);
    $("#loading").modal("hide");
}

function createSurficialChart (data, input) {
    const { site_code, start_date, end_date } = input;

    $(`#${site_code}-surficial`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
        title: {
            text: `<b>Surficial Data of ${site_code.toUpperCase()} as of ${moment(end_date).format("MM/DD/YYYY HH:mm")}</b>`
        },
        yAxis: {
            title: {
                text: "Displacement (cm)"
            }
        },
        xAxis: {
            min: Date.parse(start_date),
            max: Date.parse(end_date),
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%b"
            },
            title: {
                text: "Date"
            }
        },
        tooltip: {
            split: true,
            crosshairs: true
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true
                },
                dashStyle: "ShortDash"
            },
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer",
                point: {
                    events: {

                    }
                }
            }
        },
        credits: {
            enabled: false
        }
    });
}
