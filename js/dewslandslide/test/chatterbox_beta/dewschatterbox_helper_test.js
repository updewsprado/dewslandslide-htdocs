const { expect } = chai;

function appendInput (type, selector, name, value) {

}

describe("arraysEqual", () => {
    it("should be equal to false", () => {
        const trigger = arraysEqual([1,2,3],[1,2,3]);
        console.log(trigger);
        expect(trigger).to.equal(true);
    });
});

describe("trimmedContactNum", () => {
    it("should return an array with value \"9121231234\" at index 0", () => {
        const trigger = trimmedContactNum("09121231234");
        console.log(trigger);
        expect(trigger[0]).to.equal("9121231234");
    });
});

describe("normalizedContactNum", () => {
    it("should return a String value 639121231234", () => {
        const trigger = normalizedContactNum("09121231234");
        console.log(trigger);
        expect(trigger).to.equal("639121231234");
    });
});

describe("[SKIPPED] loadSearchedMessage", () => {   // ON HOLD. 
    it("should return ...", () => {
        let msg = {
            type: "searchMessage",
            data: "Hello world",
            user: "You",
            sender: "You",
            status: "Success",
            name: null,
            isyou: 1
        };
        const trigger = loadSearchedMessage("po");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});

describe("[SKIPPED] updateGlobalMessage", () => {
    it("should ...", () => {
        const trigger = updateGlobalMessage("");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});

describe("[SKIPPED] paginate", () => {
    it("should ...", () => {
        const trigger = paginate("");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});

describe("[SKIPPED] reset_ec", () => {
    it("should ...", () => {
        const trigger = paginate("");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});

describe("[SKIPPED] reset_ec", () => {
    it("should ...", () => {
        const trigger = reset_ec("");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});

describe("[SKIPPED] reset_cc", () => {
    it("should ...", () => {
        const trigger = reset_cc("");
        console.log(trigger);
        expect(trigger).to.equal("Error");
    });
});
