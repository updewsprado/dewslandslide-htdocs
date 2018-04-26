describe("Add new GinTag", () => {
	it("Should add new GinTag", () => {
		$('#btn-confirm').text("ADD");
		$("gintag-ipt").val("#TestMocha");
		$("gintag-description-ipt").val("Test mocha description");
		$("narrative-ipt").val("Test mocha narrative input");
		$("#btn-confirm").trigger("click");
	});
});

describe("Update GinTag", () => {
	it("Should update existing GinTag", () => {
		$('#btn-confirm').text("UPDATE");
		$('#tag-id').val("24");
		$("gintag-ipt").val("#TestUpdateMocha");
		$("gintag-description-ipt").val("Test update mocha description");
		$("narrative-ipt").val("Test update mocha narrative input");
		$("btn-confirm").trigger("click");
	});
});

describe("Delete GinTag", () => {
	it("Should Delete existing Gintag", () => {
		const data = {
			"id" : "24"
		};
		$(".delete").trigger("click");
	});
});