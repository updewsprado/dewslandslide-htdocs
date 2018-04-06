const { expect } = chai;
function appendInput (type, selector, name, value) {
   const temp = { [selector]: name, type, value };
   $("body").append($("<input>", temp));
}

describe("createPlotCreatorContainer", () => {
   it("should create div with class <data-type>-plot-container", () => {

   });
});