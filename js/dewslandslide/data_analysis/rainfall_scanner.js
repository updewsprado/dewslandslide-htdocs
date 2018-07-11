
let RESULT = [];
let SLIDER = null;
let DYNA_SITES = null;
let CHART = null;

$(document).ready(() => {
    $("#loading").modal("show");

    initializeInputOnChange();
    initializeChartViewSelectOnChange();
    initializeCriteriaSelectOnChange();
    initializeRainfallValueInputOnChange();
    adjustHeightOnResize();
    SLIDER = $("#percentage").bootstrapSlider();

    // getRainfallPercentages()
    // .then((return_val) => {
    //     RESULT = JSON.parse(return_val);
    //     console.log(RESULT);
    //     processRainfallData(RESULT);
    //     $(window).trigger("resize");
    //     $("#loading").modal("hide");
    // });

    RESULT = [{"site":"agb","1D cml":0,"half of 2yr max":61.2,"3D cml":0.5,"2yr max":122.5,"DataSource":"agbtaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"bak","1D cml":10,"half of 2yr max":115.8,"3D cml":17,"2yr max":231.7,"DataSource":"rain_noah_450","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"ban","1D cml":0,"half of 2yr max":43.8,"3D cml":0,"2yr max":87.7,"DataSource":"bantbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"bar","1D cml":0,"half of 2yr max":71.4,"3D cml":0.5,"2yr max":142.9,"DataSource":"bartbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"bay","1D cml":10,"half of 2yr max":94.4,"3D cml":11.5,"2yr max":188.8,"DataSource":"rain_noah_1976","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"blc","1D cml":2.5,"half of 2yr max":58.3,"3D cml":44.5,"2yr max":116.7,"DataSource":"blcsaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"bol","1D cml":0,"half of 2yr max":65.1,"3D cml":0.5,"2yr max":130.1,"DataSource":"bolraw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"bto","1D cml":0,"half of 2yr max":39,"3D cml":0,"2yr max":78.1,"DataSource":"btow","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"car","1D cml":0,"half of 2yr max":83.1,"3D cml":0,"2yr max":166.2,"DataSource":"cartaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"cud","1D cml":6,"half of 2yr max":77.3,"3D cml":12,"2yr max":154.6,"DataSource":"cudtaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"dad","1D cml":0,"half of 2yr max":80.9,"3D cml":0,"2yr max":161.8,"DataSource":"dadtbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"gaa","1D cml":0,"half of 2yr max":45.4,"3D cml":15.5,"2yr max":90.8,"DataSource":"gaatcw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"gam","1D cml":0,"half of 2yr max":89,"3D cml":0,"2yr max":178,"DataSource":"rain_noah_1574","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"hin","1D cml":0,"half of 2yr max":67.7,"3D cml":12,"2yr max":135.4,"DataSource":"hinsbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"hum","1D cml":0,"half of 2yr max":43.8,"3D cml":0,"2yr max":87.6,"DataSource":"No Alert! No ASTI/SENSLOPE Data","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"ime","1D cml":0,"half of 2yr max":73.1,"3D cml":5,"2yr max":146.2,"DataSource":"imeraw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"imu","1D cml":6.1,"half of 2yr max":98.2,"3D cml":39,"2yr max":196.4,"DataSource":"rain_noah_1283","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"ina","1D cml":0.5,"half of 2yr max":57.4,"3D cml":22.5,"2yr max":114.8,"DataSource":"inaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"jor","1D cml":0,"half of 2yr max":76.1,"3D cml":3,"2yr max":152.3,"DataSource":"jortaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lab","1D cml":22,"half of 2yr max":96.4,"3D cml":49,"2yr max":192.8,"DataSource":"labtw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lay","1D cml":0,"half of 2yr max":65.6,"3D cml":0,"2yr max":131.2,"DataSource":"partaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lip","1D cml":0,"half of 2yr max":65.7,"3D cml":2,"2yr max":131.3,"DataSource":"lipraw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"loo","1D cml":19.8,"half of 2yr max":48.9,"3D cml":27.2,"2yr max":97.7,"DataSource":"rain_noah_489","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lpa","1D cml":0,"half of 2yr max":69.6,"3D cml":18.5,"2yr max":139.2,"DataSource":"lpasbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lte","1D cml":0,"half of 2yr max":65.9,"3D cml":0.5,"2yr max":131.7,"DataSource":"rain_noah_535","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"lun","1D cml":4.5,"half of 2yr max":60.6,"3D cml":12,"2yr max":121.1,"DataSource":"rain_noah_89","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"mag","1D cml":0,"half of 2yr max":54.3,"3D cml":0.8,"2yr max":108.7,"DataSource":"rain_noah_505","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"mam","1D cml":22,"half of 2yr max":104.1,"3D cml":49,"2yr max":208.2,"DataSource":"labtw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"mar","1D cml":0,"half of 2yr max":57.7,"3D cml":26.5,"2yr max":115.3,"DataSource":"marw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"mca","1D cml":0,"half of 2yr max":80.7,"3D cml":0,"2yr max":161.4,"DataSource":"mcataw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"mng","1D cml":0,"half of 2yr max":41.5,"3D cml":1.5,"2yr max":83.1,"DataSource":"rain_noah_1492","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"msl","1D cml":0,"half of 2yr max":58.1,"3D cml":0,"2yr max":116.2,"DataSource":"msutaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"msu","1D cml":0,"half of 2yr max":58.1,"3D cml":0,"2yr max":116.2,"DataSource":"msutaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"nag","1D cml":11,"half of 2yr max":102.1,"3D cml":60,"2yr max":204.2,"DataSource":"nagtbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"nur","1D cml":0,"half of 2yr max":87,"3D cml":0,"2yr max":173.9,"DataSource":"nurtbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"osl","1D cml":0,"half of 2yr max":87.1,"3D cml":0,"2yr max":174.3,"DataSource":"No Alert! No ASTI/SENSLOPE Data","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"par","1D cml":0,"half of 2yr max":65.6,"3D cml":0,"2yr max":131.2,"DataSource":"partaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"pep","1D cml":2.5,"half of 2yr max":56.2,"3D cml":57.5,"2yr max":112.3,"DataSource":"rain_noah_1794","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"pin","1D cml":0,"half of 2yr max":91.7,"3D cml":0,"2yr max":183.3,"DataSource":"rain_noah_1096","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"pla","1D cml":0,"half of 2yr max":42.8,"3D cml":0,"2yr max":85.6,"DataSource":"No Alert! No ASTI/SENSLOPE Data","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"png","1D cml":0,"half of 2yr max":68.2,"3D cml":0.5,"2yr max":136.4,"DataSource":"pngtaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"pug","1D cml":0,"half of 2yr max":96.7,"3D cml":0,"2yr max":193.4,"DataSource":"rain_noah_1390","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"sag","1D cml":19.5,"half of 2yr max":84.5,"3D cml":35.5,"2yr max":169,"DataSource":"sagtaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"sib","1D cml":0,"half of 2yr max":85.7,"3D cml":0,"2yr max":171.4,"DataSource":"rain_noah_1450","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"sin","1D cml":11.8,"half of 2yr max":114.6,"3D cml":33.8,"2yr max":229.2,"DataSource":"rain_noah_454","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"sum","1D cml":8.5,"half of 2yr max":49.6,"3D cml":16.5,"2yr max":99.2,"DataSource":"sumtaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"tal","1D cml":0,"half of 2yr max":63.1,"3D cml":34,"2yr max":126.2,"DataSource":"talsaw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"tga","1D cml":11.5,"half of 2yr max":65,"3D cml":40.5,"2yr max":130,"DataSource":"tgatbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"tue","1D cml":30.5,"half of 2yr max":96,"3D cml":101,"2yr max":192.1,"DataSource":"tuetbw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"},{"site":"umi","1D cml":0,"half of 2yr max":56.7,"3D cml":26.5,"2yr max":113.4,"DataSource":"marw","alert":"r0","advisory":"---","ts":"2018-07-10 14:00:00"}];
    processRainfallData(RESULT);
    $(window).trigger("resize");
    $("#loading").modal("hide");

    getSitesWithRegions()
    .done((result) => { DYNA_SITES = result; });
});

function adjustHeightOnResize () {
    $(window).resize(() => {
        const height = $(window).height();
        let final;
        if (height > 720) final = 550;
        else final = 400;
        CHART.setSize(null, final);
    });
}

function processRainfallData (result) {
    const filtered = {
        data_timestamp: result[0].ts,
        site_codes: [],
        cumulative_1d: [],
        cumulative_3d: []
    };

    const chart_view = $("#chart-view").val();
    const region = $("#regions").val();
    const province = $("#provinces").val();
    const percentage = SLIDER.bootstrapSlider("getValue");
    const rain_value = $("#rainfall-value").val();
    const operand = $("#operand").val();
    const criteria = $("#criteria").val();
    const criteria_quantifier = $(`#${criteria}`).val();

    result.forEach((record) => {
        const {
            site: site_code,
            "1D cml": cumulative_1d,
            "3D cml": cumulative_3d,
            "half of 2yr max": threshold_1d,
            "2yr max": threshold_3d
        } = record;
        let data = {};

        if (chart_view !== "sites") {
            const site_details = DYNA_SITES.find(x => x.name === site_code);
            const parameter = chart_view === "regions" ? region : province;
            const site_property = chart_view === "regions" ? site_details.region : site_details.province;

            const is_member = isMemberOfParameter(parameter, site_property);
            if (!is_member) {
                return;
            }
        }

        if (criteria_quantifier === "1") {
            data = {
                cummulative_data: cumulative_1d,
                threshold: threshold_1d
            };
        } else {
            data = {
                cummulative_data: cumulative_3d,
                threshold: threshold_3d
            };
        }

        let compare_var;
        const { cummulative_data } = data;
        if (criteria === "threshold") {
            const { threshold } = data;
            compare_var = threshold * (percentage / 100);
        } else {
            compare_var = rain_value;
        }

        const bool = evaluateSiteRainfall(operand, cummulative_data, compare_var);

        if (bool) {
            const cum_1d = {
                y: (cumulative_1d / threshold_1d) * 100,
                data_value: `- Cumulative Data: <b>${cumulative_1d} mm</b><br>- Threshold: <b>${threshold_1d} mm</b>`
            };
            const cum_3d = {
                y: (cumulative_3d / threshold_3d) * 100,
                data_value: `- Cumulative Data: <b>${cumulative_3d} mm</b><br>- Threshold: <b>${threshold_3d} mm</b>`
            };

            filtered.site_codes.push(site_code.toUpperCase());
            filtered.cumulative_1d.push(cum_1d);
            filtered.cumulative_3d.push(cum_3d);
        }
    });

    createRainfallPercentagesPlot(filtered);
}

function getRainfallPercentages () {
    return $.getJSON("../../rainfall_scanner/getRainfallPercentages")
    .catch(({ responseText, status, statusText }) => {
        console.log(`%c► Error Rainfall Scanner\n► Status ${status}: ${statusText}\n\n${responseText}`, "background: rgba(255,127,80,0.3); color: black");
    });
}

function getSitesWithRegions () {
    return $.getJSON("../../rainfall_scanner/getSitesWithRegions")
    .catch(({ responseText, status, statusText }) => {
        console.log(`%c► Error Rainfall Scanner\n► Status ${status}: ${statusText}\n\n${responseText}`, "background: rgba(255,127,80,0.3); color: black");
    });
}

function isMemberOfParameter (parameter, site_property) {
    return parameter === site_property;
}

function evaluateSiteRainfall (operand, cummulative_data, compare_var) {
    let bool;
    switch (operand) {
        case "greater-than-equal":
            bool = (cummulative_data >= compare_var);
            break;
        case "greater-than":
            bool = (cummulative_data > compare_var);
            break;
        case "equal":
            bool = (cummulative_data === compare_var);
            break;
        case "less-than":
            bool = (cummulative_data < compare_var);
            break;
        case "less-than-equal":
            bool = (cummulative_data <= compare_var);
            break;
        default:
            bool = false;
            break;
    }
    return bool;
}

function createRainfallPercentagesPlot (data) {
    const {
        cumulative_1d, cumulative_3d,
        site_codes, data_timestamp
    } = data;

    if (CHART !== null) {
        CHART.xAxis[0].setCategories(site_codes);
        [cumulative_1d, cumulative_3d].forEach((arr, i) => {
            CHART.series[i].update({ data: arr });
        });
        CHART.redraw();
        return;
    }

    CHART = Highcharts.chart("rainfall-percentages-plot", {
        chart: {
            type: "column",
            height: 400,
            animation: { duration: 1000 }
        },
        title: {
            text: "<b>Cumulative Rainfall Data vs Threshold Plot of Dynaslope Sites</b>",
            y: 22
        },
        subtitle: {
            text: `As of: <b>${moment(data_timestamp).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "13px" }
        },
        xAxis: {
            categories: site_codes,
            title: {
                text: "<b>Sites</b>"
            }
        },
        yAxis: [{
            min: 0,
            title: {
                text: "<b>Threshold Ratio</b>"
            }
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            formatter () {
                const num = this.series.name.charAt(0);
                const percentage = this.point.y;
                let str = `<b>${num}-Day</b><br/>- Percentage: <b>${percentage.toFixed(2)}%</b><br/>`;
                str += this.point.data_value;
                return str;
            }
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: "1-Day Cumulative Data Ratio",
            color: "rgba(73, 105, 252, 0.9)",
            data: cumulative_1d,
            pointPadding: 0.17,
            pointPlacement: -0.2
        }, {
            name: "3-Day Cumulative Data Ratio",
            color: "rgba(239, 69, 50, 0.9)",
            data: cumulative_3d,
            pointPadding: 0.17,
            pointPlacement: 0.2
        }]
    });
}

function initializeInputOnChange () {
    $("#threshold, #operand, #percentage, #regions, #provinces").change(() => {
        processRainfallData(RESULT);
    });
}

function initializeRainfallValueInputOnChange () {
    $("#rainfall-value").bind("keyup mouseup", () => {
        processRainfallData(RESULT);
    });
}

function initializeChartViewSelectOnChange () {
    $("#chart-view").change(({ currentTarget }) => {
        const { value } = currentTarget;
        const $region = $("#regions-div");
        const $province = $("#provinces-div");
        const $parent = $(currentTarget).parent();

        $region.prop("hidden", true);
        $province.prop("hidden", true);

        if (value === "sites") {
            $parent.addClass("col-sm-offset-1");
        } else {
            $parent.removeClass("col-sm-offset-1");
            SLIDER.bootstrapSlider("setValue", 0);
            $("#criteria").val("threshold").trigger("change");

            if (value === "regions") $region.prop("hidden", false);
            else $province.prop("hidden", false);
        }

        processRainfallData(RESULT);
    });
}

function initializeCriteriaSelectOnChange () {
    $("#criteria").change(({ currentTarget }) => {
        const { value } = currentTarget;
        $(".value-input-div").prop("hidden", true);
        if (value === "threshold") $("#percentage-div").prop("hidden", false);
        else $("#rainfall-value-div").prop("hidden", false);

        $(".criteria-detail").each((i, elem) => {
            const temp_id = `${value}-div`;
            if (temp_id === elem.id) $(elem).show();
            else $(elem).hide();
        });

        processRainfallData(RESULT);
    });
}
