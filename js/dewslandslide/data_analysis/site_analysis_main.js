
$(document).ready(() => {
    initializeTimestamps();
    initializeForm();
});

function initializeTimestamps () {
    $(".datetime").datetimepicker({
        format: "YYYY-MM-DD HH:mm:00",
        allowInputToggle: true,
        widgetPositioning: {
            horizontal: "right",
            vertical: "bottom"
        }
    }).on("dp.show", function (e) {
        $(this).data("DateTimePicker").maxDate(moment().second(0));
    });
}

function initializeForm () {
    $("#site-analysis-form").validate({
        debug: true,
        rules: {
            site_code: "required",
            data_timestamp: "required"
        },
        messages: { comments: "" },
        errorPlacement (error, element) {
            const placement = $(element).closest(".form-group");
            if ($(element).hasClass("cbox_trigger_switch")) {
                $("#errorLabel").append(error).show();
            } else if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(placement);
            } // remove on success

            element.parents(".form-group").addClass("has-feedback");

            // Add the span element, if doesn't exists, and apply the icon classes to it.
            const $next_span = element.next("span");
            if (!$next_span[0]) {
                if (element.is("select") || element.is("textarea")) $next_span.css({ top: "25px", right: "25px" });
            }
        },
        success (label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            if (!$(element).next("span")) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            }

            $(element).closest(".form-group").children("label.error").remove();
        },
        highlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-remove form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight (element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
            if ($(element).parent().is(".datetime") || $(element).parent().is(".time")) {
                $(element).nextAll("span.glyphicon").remove();
                $("<span class='glyphicon glyphicon-ok form-control-feedback' style='top:0px; right:37px;'></span>").insertAfter($(element));
            } else $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        },
        submitHandler (form) {
            const data = $("#site-analysis-form").serializeArray();
            const input = {};
            data.forEach(({ name, value }) => { input[name] = value === "" ? null : value; });

            // const temp = {
            //     end_date: input.data_timestamp,
            //     start_date: getStartDate("surficial"),
            //     site_code: input.site_code
            // };

            $("#loading").modal("show");
            $(".plot-container").remove();

            let site_name = $("#site_code").find("option:selected").text();
            [, site_name] = site_name.match(/\(([^)]+)\)/);
            $("#site_name").html(`Brgy. ${site_name} (${input.site_code.toUpperCase()})`);

            getRainDataSourcesPerSite(input.site_code)
            .done((sources) => {
                createRainSourcesButton(sources);
                $("#rainfall-plot-options").show();
                $rain_btn_group = $("#rainfall-sources-btn-group");
                $rain_btn_group.find("button:first").trigger("click");
            });

            $("#surficial-plot-options").show();
            $surficial_btn_group = $("#surficial-cracks-btn-group");
            $surficial_btn_group.find("button:first").trigger("click");
        }
    });
}

function getStartDate (plot_type) {
    let start_date = "";
    const end_date = moment($("#data_timestamp").val());
    let data = null;

    if (plot_type === "rainfall") data = $("#rainfall-duration li.active > a").data();
    else if (plot_type === "surficial") data = $("#surficial-duration li.active > a").data();

    const { value, duration } = data;

    if (value !== "All") {
        start_date = moment(end_date).subtract(value, duration)
        .format("YYYY-MM-DDTHH:mm:ss");
    }

    return start_date;
}

function createPlotContainer (data_type, source_table) {
    $(`#${data_type}-plots`)
    .append($("<div>", {
        class: `${data_type}-plot-container plot-container row`,
        id: source_table
    }));

    if (data_type === "rainfall") {
        ["instantaneous", "cumulative"].forEach((x) => {
            $(`#${source_table}`)
            .append($("<div>", {
                class: "col-sm-6 rainfall-chart",
                id: `${source_table}-${x}`
            }));
        });
    }
}
