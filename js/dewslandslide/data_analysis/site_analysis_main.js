
$(document).ready(() => {
    let validator = null;
    initializeTimestamps();
    initializeForm();
    // validateForm();

    Highcharts.setOptions({ global: { timezoneOffset: -8 * 60 } });
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
    validator = $("#site-analysis-form").validate({
        debug: true,
        rules: {
            data_timestamp: "required",
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
            // console.log("Entered submitHandler");
            // return false;

            const data = $("#site-analysis-form").serializeArray();
            const input = {};
            data.forEach(({ name, value }) => { input[name] = value === "" ? null : value; });

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
            $surficial_btn_group = $("#surficial-markers-btn-group");
            $surficial_btn_group.find("button:first").data("loaded", false).trigger("click");

            processSubsurfaceColumnDropDown(input.site_code);
        }
    });
}

// function validateForm () {
//     $(".submit-btn").on("click", ({ target }) => {
//         const id = $(target).prop("id");
//         console.log(id);
//         $(".has-error").removeClass("has-error");
//         $(".glyphicon-remove, .glyphicon-ok").remove();

//         validator.resetForm();
//         $("#site_code").rules("remove");
//         $("#subsurface_column").rules("remove");

//         if (id === "plot-site-level") {
//             $("#site_code").rules("add", { required: true });
//         } else {
//             $("#subsurface_column").rules("add", { required: true });
//         }

//         $("#site-analysis-form").valid();
//     });
// }

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

function createPlotContainer (data_type, source_table, sub_type = null) {
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
    } else if (data_type === "surficial") {
        if (sub_type === "marker") {
            createMarkerTabs(source_table);
        }
    } else if (data_type === "subsurface") {
        if (sub_type === "column-position") {
            ["downslope", "across-slope"].forEach((x) => {
                $(`#${source_table}`)
                .append($("<div>", {
                    class: "col-sm-6 column-position-chart",
                    id: `${source_table}-${x}`
                }));
            });
        }
    }
}

function createMarkerTabs (source_table) {
    $(`#${source_table}`)
    .append($(`<div id="${source_table}-tab-group" class="marker-chart-tab-group col-sm-12"><ul class="nav nav-tabs nav-justified"></ul></div>`))
    .append($("<div>", {
        id: `${source_table}-tab-content`,
        class: "tab-content col-sm-12"
    }));

    const marker_tables = [
        { id: "vel_v_accel", label: "Velocity Acceleration Chart" },
        { id: "interpolation", label: "Displacement interpolation Chart" },
        { id: "vel_v_accel_v_time", label: "Velocity/Acceleration vs Time Chart" }
    ];

    marker_tables.forEach(({ id, label }) => {
        $(`#${source_table}-tab-group > ul`)
        .append($(`<li><a data-toggle='tab' href='#${source_table}-${id}'><strong>${label}</strong></a></li>`));

        $(`#${source_table}-tab-content`)
        .append($("<div>", {
            id: `${source_table}-${id}`,
            class: "tab-pane fade"
        }));
    });

    $(`#${source_table}-tab-group li:first > a`).trigger("click");
}
