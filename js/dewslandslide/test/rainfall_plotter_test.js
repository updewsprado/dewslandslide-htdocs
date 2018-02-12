const { expect } = chai;
function appendInput (type, selector, name, value) {
    const temp = { [selector]: name, type, value };
    $("body").append($("<input>", temp));
}

describe("createPlotCreatorContainer", () => {
    it("should create div with class <data-type>-plot-container", () => {
        $("body").append($("<div>", { id: "rainfall-plots" }));
        createPlotContainer("rainfall", "agbtaw");
        expect($("#agbtaw.rainfall-plot-container").length).to.equal(1);
    });
});
