const { expect } = chai;

describe("createRainFallSVG", () => {
    it("should append 8 rain sources svg chart", () => {
        const input = {
            site_code: "agb",
            end_date: "2017-11-10 00:00:00",
            start_date: getStartDate("rainfall"),
            source: "all" // table
        };
        // const get_all_charts = Highcharts.charts;
        $loading_rain = $("#rainfall-plots .loading-bar");
        $loading_rain.show();
        getPlotDataForRainfall(input)
        .done((datalist) => {
            plotRainfall(datalist, input);
            createSVG("rainfall", input.site_code);
            const find_div = $("#rainfall_svg").children().length;
            console.log(find_div);
            expect(find_div).to.equal(8);
        })
        .catch(({ responseText, status: conn_status, statusText }) => {
            alert(`Status ${conn_status}: ${statusText}`);
            alert(responseText);
        });
    });
});

describe("createSurficialSVG", () => {
    it("should append surficial svg chart", () => {
        
    });
});

describe("createColumnSummarySVG", () => {

    before("describe plotter", () => {
        plotColumnSummaryForTest();
    });
    it("should append node health svg chart", () => {
        const find_div = $("#node_health_svg").children().length;
        console.log(find_div);
        expect(find_div).to.equal(1);
    });

    it("should append data presence svg chart", () => {

    });

    it("should append communication health svg chart", () => {

    });
});

describe("createSubsurfaceSVG", () => {
    it("should append column-position-downslope svg chart", () => {

    });

    it("should append column-position-across_slope svg chart", () => {

    });

    it("should append subsurface-displacement-downslope svg chart", () => {

    });

    it("should append subsurface-displacement-across_slope svg chart", () => {

    });

    it("should append velocity-alerts-downslope svg chart", () => {

    });

    it("should append velocity-alerts-across_slope svg chart", () => {

    });
});

describe("createNodeSVG", () => {
    it("should append x-accelerometer svg chart", () => {

    });

    it("should append y-accelerometer svg chart", () => {

    });

    it("should append z-accelerometer svg chart", () => {

    });

    it("should append battery svg chart", () => {

    });
});

describe("returnYaxisValue", () => {
    it("should return 400", () => {

    });

    it("should return 800", () => {

    });
});


function plotColumnSummaryForTest () {
    const form = {
        subsurface_column: "magta",
        start_date: "2017-10-11T12:00:00",
        end_date: "2017-10-12T12:00:00"
    };
    plotColumnSummaryCharts(form, 1);
}