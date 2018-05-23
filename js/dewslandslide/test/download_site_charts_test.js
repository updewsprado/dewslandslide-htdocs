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
            console.log(datalist);
            plotRainfall(datalist, input);
            $loading_rain.hide();
            createSVG("rainfall", input.site_code);
        })
        .catch(({ responseText, status: conn_status, statusText }) => {
            alert(`Status ${conn_status}: ${statusText}`);
            alert(responseText);
        });
    });

    it("should append 8 rain sources svg chart", () => {
        const find_div = $("#rainfall_svg").children().length;
        console.log(find_div);
        expect(find_div).to.equal(8);
    });
});

describe("createSurficialSVG", () => {
    it("should append surficial svg chart", () => {

    });
});

describe("createSurficialSVG", () => {
    it("should append node health svg chart", () => {

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
