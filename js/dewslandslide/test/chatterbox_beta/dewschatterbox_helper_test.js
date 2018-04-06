const { expect } = chai;

function appendInput (type, selector, name, value) {

}

describe("setTargetTime", () => {
    it("should be equal to ...", () => {
        const trigger = setTargetTime(1,45);
        console.log(trigger);
        expect(trigger).to.equal("Thu Apr 05 2018 01:45:00 GMT+0800 (+08)");
    });
});

describe("arraysEqual", () => {
    it("should be equal to false", () => {
        const trigger = arraysEqual([1,2,3],[1,2,3]);
        console.log(trigger);
        expect(trigger).to.equal(true);
    });
});

describe("trimmedContactNum", () => {
    it("should be equal to false", () => {
        const trigger = trimmedContactNum();
        console.log(trigger);
        expect(trigger).to.equal(true);
    });
});