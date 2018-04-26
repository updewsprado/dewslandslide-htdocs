describe("Add new Keyinput template", () => {
	it("should add new key input template", () => {
		$("#submit_template").trigger("click");
	});
});

describe("Add new backbone template", () => {
	it("should add new backbone template", () => {
		$("#submit_backbone").trigger("click");
	});	
})

describe("Update Keyinput template", () => {
	it("should update keyinput tempalte", () =>{
		const tableId = 86;
		$("#techinfo_template").val("UPDATE TECH INFO");
		$("#response_template").val("TECH RESPONSE");
		$("#submit_template").trigger("click");
	})
});

describe("Update Backbone template", () => {
	it("should update backbone tempalte", () =>{
		const tableId = 37;
		$("#update-backbone").val("UPDATE BACKBONE");
		$("#bb_alert_status").val("Routine")
		$("#submit_backbone").trigger("click");
	})
});

describe("Delete Keyinput template", () => {
	it("Should delete keyinput template",() => {
		const tableId = 86;
		$("#delete_template").trigger("click");
	})
});

describe("Delete Backbone template", () => {
	it("Should delete backbone template",() => {
		const tableId = 37;
		$("#delete_backbone").trigger("click");
	})
})