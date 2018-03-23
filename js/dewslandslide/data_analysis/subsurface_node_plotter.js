
$(document).ready(() => {
    const input = {
        column_name: "agbta",
        start_date: "2016-01-15",
        end_date: "2016-01-21",
        node: "1-3-5"
    };

    $("#loading").modal("show");
    plotNodeLevelCharts(input);

    initializeNodeDropdown();
    initializeNodeSummaryDurationOnDropdownClick();
    initializeNodeClearButtonOnClick();
});

function processNodeDropDown (column_name) {
    getSiteColumnNodeCount(column_name)
    .done(delegateNodeNumbersOnDropdown)
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function getSiteColumnNodeCount (column_name) {
    return $.getJSON(`../site_analysis/getSiteColumnNodeCount/${column_name}`)
    .catch(err => err);
}

function delegateNodeNumbersOnDropdown (node_count) {
    console.log(node_count);
    $nodes = $("#node-list");
    $nodes.empty();
    for (let counter = 0; counter < node_count; counter += 1) {
        const count = counter + 1;
        $nodes.append("<li>" +
            `<a class="small" tabIndex="3" data-value="${count}" data-event="${count}">` +
            `<input type="checkbox" class="node-checkbox"/>&nbsp;Node ${count}` +
            "</a></li>");
    }
}

function initializeNodeClearButtonOnClick () {
    $("#clear-nodes").click((argument) => {
        $(".node-checkbox").prop("checked", false);
        $("#nodes").val("");
    });
}

function delegateNodeNumbersOnDropdown (node_count) {
    $nodes = $("#node-list");
    $nodes.empty();
    for (let counter = 0; counter < node_count; counter += 1) {
        const count = counter + 1;
        $nodes.append(`${"<li>" +
            "<a class=\"small\" tabIndex=\"3\" data-value=\""}${count}" data-event="${count}">` +
            `<input type="checkbox" class="node-checkbox"/>&nbsp;Node ${count}` +
            "</a>" +
            "</li>");
    }
}

function initializeNodeDropdown () {
    const nodes = [];
    const event_ids = [];

    $("body").on("click", "#node-list.dropdown-menu a", ({ target }) => {
        const $target = $(target);
        const val = $target.attr("data-value");
        const event_id = $target.attr("data-event");
        const $inp = $target.find("input");
        const idx = nodes.indexOf(val);

        if (idx > -1) {
            nodes.splice(idx, 1);
            event_ids.splice(idx, 1);
            setTimeout(() => { $inp.prop("checked", false); }, 0);
        } else {
            nodes.push(val);
            event_ids.push(event_id);
            setTimeout(() => { $inp.prop("checked", true); }, 0);
        }

        $(target).blur();
        let str = nodes.toString();
        String.prototype.replaceAll = function (search, replacement) {
            const target = this;
            return target.replace(new RegExp(search, "g"), replacement);
        };

        str = str.replaceAll(",", ", ");
        $("#nodes").val(str);

        return false;
    });
}

function initializeNodeSummaryDurationOnDropdownClick () {
    $("#node-summary-duration li").click(({ target }) => {
        const { value, duration } = $(target).data();
        const parent_id = $(target).parents(".btn-group").prop("id");
        $(`#${parent_id} li.active`).removeClass("active");
        $(target).parent().addClass("active");

        $(`#${parent_id}-btn`).empty()
        .append(`${value} ${duration}&emsp;<span class="caret"></span>`);

        const form = {
            column_name: "agbta",
            start_date: getStartDate(parent_id.replace("-duration", "")),
            end_date: moment($("#data_timestamp").val()).format("YYYY-MM-DDTHH:mm"),
            node: "1-3-5"
        };

        $("#loading").modal("show");

        plotNodeLevelCharts(form);
    });
}

function plotNodeLevelCharts (input) {
    getPlotDataForNode(input)
    .done((subsurface_node_data) => {
        console.log(subsurface_node_data);
        subsurface_node_data.forEach((series) => {
            createGeneralNodeChart(series, input);
            // if (series_name === "battery") createBatteryChart(data);
            // else if (series_name === "x-accelerometer") createXAccelerometerChart(data);
            // else if (series_name === "y-accelerometer") createYAccelerometerChart(data);
            // else if (series_name === "z-accelerometer") createZAccelerometerChart(data);
        });
        $("#loading").modal("hide");
    })
    .catch(({ responseText, status: conn_status, statusText }) => {
        alert(`Status ${conn_status}: ${statusText}`);
        alert(responseText);
    });
}

function getPlotDataForNode ({
    column_name, start_date, end_date, node
}) {
    return $.getJSON(`../site_analysis/getPlotDataForNode/${column_name}/${start_date}/${end_date}/${node}`)
    .catch(err => err);
}

function createGeneralNodeChart ({ series_name, data }, input) {
    const { column_name, start_date, end_date } = input;
    const cap = series_name === "battery" ? 1 : 3;
    const title = series_name.slice(0, cap).toUpperCase() + series_name.slice(cap);

    $(`#${series_name}-graph`).highcharts({
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400
        },
        title: {
            text: `<b>${title} Plot of ${column_name.toUpperCase()}</b>`,
            style: {
                fontSize: "16px"
            }
        },
        subtitle: {
            text: `<b>(${moment(start_date).format("M/D/YYYY")} - ${moment(end_date).format("M/D/YYYY")})</b>`,
            style: {
                fontSize: "13px"
            }
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%Y"
            },
            title: {
                text: "Date"
            }
        },
        yAxis: {
            title: {
                text: "ADC Value"
            }
        },
        tooltip: {
            crosshairs: true,
            split: true
        },

        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            borderWidth: 0
        },
        credits: {
            enabled: false
        }
    });
}
