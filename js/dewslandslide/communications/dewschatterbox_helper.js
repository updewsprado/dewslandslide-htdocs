$(document).ready(function(){

});

function setTargetTime (hour, minute) {
    var t = new Date();
    t.setHours(hour);
    t.setMinutes(minute);
    t.setSeconds(0);
    t.setMilliseconds(0);

    return t;
}

function updateRemainingCharacters () {
    remChars = 800 - $("#msg").val().length - footer.length;
    $("#remaining_chars").text(remChars);
}

function arraysEqual (a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let counter = 0; counter < a.length; counter += 1) { // originally ++counter: subject to debugging
        if (a[counter] !== b[counter]) return false;
    }
    return true;
}

function trimmedContactNum (inputContactNumber) {
    var numbers = /^[0-9]+$/;
    var trimmed_collection = [];
    var trimmed;
    var raw = inputContactNumber.split("-");
    if (raw.length == 1) {
        var targetNumber = raw[0].split(",");
    } else {
        var targetNumber = raw[1].split(",");
    }
    for (var counter = 0; counter < targetNumber.length; counter++) {
        if (targetNumber[counter].trim().match(numbers) && targetNumber[counter].trim() != "") {
            var size = targetNumber[counter].trim().length;

            if (size == 12) {
                trimmed = targetNumber[counter].trim().slice(2, size);
            } else if (size == 11) {
                trimmed = targetNumber[counter].trim().slice(1, size);
            } else if (size == 10) {
                trimmed = targetNumber[counter].trim();
            } else {
                console.log("Error: No such number in the Philippines");
                return -1;
            }

            trimmed_collection.push(trimmed);
        } else {
            console.log("Please input numeric characters only");
            return -1;
        }
    }

    return trimmed_collection;
}

function normalizedContactNum (targetNumber) {
    var trimmed = trimmedContactNum(targetNumber);

    if (trimmed < 0) {
        console.log("Error: Invalid Contact Number");
        return -1;
    }

    return `63${trimmed}`;
}

function paginate (data) {
    // Initialize pages
    temp = [];
    for (var item_counter = 1; item_counter <= data.totalItems; item_counter++) {
        if (item_counter % 50 != 0) {
            temp.push(data.data[item_counter]);
        } else {
            searched_cache.push(temp);
            temp = [];
            temp.push(data.data[item_counter]);
        }
    }

    $("#searched-key-pages").show();
    $("#searched-key-pages").twbsPagination({
        totalPages: data.totalPages,
        visiblePages: 7,
        onPageClick (event, page) {
            for (var paginate_counter = 0; paginate_counter < searched_cache[page - 1].length; paginate_counter++) {
                updateGlobalMessage(searched_cache[page - 1][paginate_counter]);
            }
            var messages_html = messages_template_both({ messages: search_results });
            $("#search-global-result").html(messages_html);
            var maxScroll = $(document).height() - $(window).height();
            $("#search-global-result").scrollTop(maxScroll);
            search_results = [];
        }
    });
}

function reset_ec () {
    $("#firstname_ec").val("");
    $("#lastname_ec").val("");
    $("#grouptags_ec").val("");
    $("#nickname_ec").val("");
    $("#email_ec").val("");
    $("#numbers_ec").val("");
    $("#grouptags_ec").val("");
    $("#numbers_ec").tagsinput("removeAll");
    $("#grouptags_ec").tagsinput("removeAll");
}
$("#btn-clear-cc").on("click", () => {
    if ($("#settings-cmd").val() == "updatecontact") {
        $("#community-contact-wrapper").attr("hidden", true);
        getComContact();
    } else {
        reset_cc();
    }
});

function reset_cc () {
    $("#firstname_cc").val("");
    $("#lastname_cc").val("");
    $("#prefix_cc").val("");
    $("#rel_cc").val("");
    $("#numbers_cc").val("");
    $("#numbers_cc").tagsinput("removeAll");
    $("#office_cc").val("LLMC");
    $("#sitename_cc").val("AGB");
    $("#rel").val("Y");
    $("#ewirecipient").val("1");

    $("#other-officename").val("");
    $("#other-sitename").val("");

    $("#other-officename").hide();
    $("#other-sitename").hide();
}