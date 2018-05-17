
$(document).ready(() => {
    const input = {
        subsurface_column: "agbta",
        start_date: "2016-01-15",
        end_date: "2016-01-21",
        node: "1-3-5"
    };

    // plotNodeLevelCharts(input);

    initializeNodeDropdown();
    initializeNodeSummaryDurationDropdownOnClick();
    initializeNodeClearButtonOnClick();
});

function processNodeDropDown (subsurface_column) {
    clearSelectedNodes();

    getSiteColumnNodeCount(subsurface_column)
    .done(delegateNodeNumbersOnDropdown)
    .catch((x) => {
        showErrorModal(x, "node count dropdown");
    });
}

function getSiteColumnNodeCount (subsurface_column) {
    return $.getJSON(`../site_analysis/getSiteColumnNodeCount/${subsurface_column}`);
}

function delegateNodeNumbersOnDropdown (node_count) {
    $nodes = $("#node-list");
    $nodes.empty();
    for (let counter = 0; counter < node_count; counter += 1) {
        const count = counter + 1;
        $nodes.append("<li>" +
            `<a class="small" tabIndex="3" data-value="${count}" data-event="${count}">` +
            `<input type="checkbox" class="node-checkbox" name="node-checkbox"/>&nbsp;Node ${count}` +
            "</a></li>");
    }
}

let selected_nodes = [];
function initializeNodeDropdown () {
    $("body").on("click", "#node-list.dropdown-menu a", ({ currentTarget }) => {
        const $target = $(currentTarget);
        const val = parseInt($target.attr("data-value"), 10);
        const $inp = $target.find("input");
        const idx = selected_nodes.indexOf(val);

        if (idx > -1) {
            selected_nodes.splice(idx, 1);
            setTimeout(() => { $inp.prop("checked", false); }, 0);
        } else {
            selected_nodes.push(val);
            setTimeout(() => { $inp.prop("checked", true); }, 0);
        }

        const sorted = selected_nodes.sort((a, b) => a - b);

        $(currentTarget).blur();
        $("#nodes").val(sorted.join(", "));

        updateBreadcrumb("node");

        return false;
    });
}

function initializeNodeClearButtonOnClick () {
    $("#clear-nodes").click(clearSelectedNodes);
}

function clearSelectedNodes () {
    selected_nodes = [];
    $(".node-checkbox").prop("checked", false);
    $("#nodes").val("");
}

function initializeNodeSummaryDurationDropdownOnClick () {
    $("#node-summary-duration li").click(({ target }) => {
        const { value, duration } = $(target).data();
        const parent_id = $(target).parents(".btn-group").prop("id");
        $(`#${parent_id} li.active`).removeClass("active");
        $(target).parent().addClass("active");

        $(`#${parent_id}-btn`).empty()
        .append(`${value} ${duration}&emsp;<span class="caret"></span>`);

        const form = {
            subsurface_column: $("#subsurface_column").val(),
            start_date: getStartDate(parent_id.replace("-duration", "")),
            end_date: moment($("#data_timestamp").val()).format("YYYY-MM-DDTHH:mm"),
            nodes: $("#nodes").val().replace(/, /g, "-")
        };

        plotNodeLevelCharts(form);
    });
}

function plotNodeLevelCharts (input) {
    $("#subsurface-node-plots .loading-bar").show();
    getPlotDataForNode(input)
    .done((subsurface_node_data) => {
        console.log(subsurface_node_data);
        subsurface_node_data.forEach((series) => {
            createGeneralNodeChart(series, input);
        });
        $("#subsurface-node-plots .loading-bar").hide();
    })
    .catch((x) => {
        showErrorModal(x, "node charts");
    });
}

function getPlotDataForNode ({
    subsurface_column, start_date, end_date, nodes
}) {
    return $.getJSON(`../site_analysis/getPlotDataForNode/${subsurface_column}/${start_date}/${end_date}/${nodes}`);
}

function createGeneralNodeChart ({ series_name, data }, input) {
    const { subsurface_column, start_date, end_date } = input;
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
            text: `<b>${title} Plot of ${subsurface_column.toUpperCase()}</b>`,
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
                text: "Value"
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
            itemStyle: {
                fontSize: "11px"
            },
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
