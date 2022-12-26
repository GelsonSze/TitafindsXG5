$(function () {
    $("#sell-popup").popup({
        blur: false,
        transition: "all 0.3s",
        onclose: function () {
            $("#sell-popup #sell-form")[0].reset();
        },
    });

    $("#sell-popup form .command :reset").on("click", function () {
        $("#sell-popup").popup("hide");
    });

    $("#sell-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var itemPage = window.location.pathname.includes("/item/");

        var codeField = $("#sell-popup #sell-code")[0];
        var quantityField = $("#sell-popup #sell-quantity")[0];
        var sellingPriceField = $("#sell-popup #sell-selling-price")[0];
        var error = $("#sell-popup .text-error")[0];

        var fields = [codeField, quantityField, sellingPriceField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (typeof field !== "undefined" && field !== null && isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const code = !itemPage
            ? $("#sell-popup #sell-code").val()
            : window.location.pathname.split("/", 3)[2];

        const data = new FormData($("#sell-form")[0]);
        //if code does not exist in data, add it
        if (!data.has("code")) {
            data.append("code", code);
        }
        data.append("dateSold", new Date());

        var recID = !itemPage ? w2ui["item-grid"].find({ code: code }) : [null];
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/sellItem",
                    data: JSON.stringify(Object.fromEntries(data)),
                    type: "POST",
                    processData: false,
                    contentType: "application/json; charset=utf-8",

                    success: async function (foundData) {
                        if (recID != null) {
                            $.ajax({
                                url: `/getItem=${code}`,
                                type: "GET",
                                processData: false,
                                contentType: false,

                                success: async function (newData) {
                                    w2ui["item-grid"].set(recID, {
                                        available: newData.available,
                                        sold: newData.sold,
                                    });
                                },
                            });
                        }

                        if (itemPage) {
                            var newAvailableValue =
                                parseInt($("#main-attributes-available").text()) -
                                parseInt(quantityField.value);
                            $("#main-attributes-available").text(newAvailableValue);

                            var newSoldValue =
                                parseInt($("#main-attributes-sold").text()) +
                                parseInt(quantityField.value);
                            $("#main-attributes-sold").text(newSoldValue);
                            getTransactions(true);
                        }

                        $("#sell-popup #sell-form")[0].reset();
                        $("#sell-popup").popup("hide");

                        SnackBar({
                            message: "Item sold successfully",
                            status: "success",
                            position: "br",
                            timeout: 5000,
                            fixed: true,
                        });
                    },

                    error: async function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.hasOwnProperty("responseJSON")) {
                            message = jqXHR.responseJSON.message;
                            fields = jqXHR.responseJSON.fields;

                            if (fields) {
                                fields.forEach(async function (field) {
                                    let element = $(`#${field}`);
                                    if (typeof element !== "undefined" && element !== null) {
                                        emptyFields.push(element[0]);
                                    }
                                });

                                if (emptyFields.length !== 0)
                                    showError(error, message, emptyFields);
                            }
                        }
                    },
                });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.hasOwnProperty("responseJSON")) {
                    message = jqXHR.responseJSON.message;
                    fields = jqXHR.responseJSON.fields;

                    if (fields) {
                        fields.forEach(async function (field) {
                            if (field == "code") {
                                field = `sell-${field}`;
                            }
                            emptyFields.push($(`#${field}`)[0]);
                        });

                        showError(error, message, emptyFields);
                    }
                }
            },
        });
    });

    // Shortcuts for "Shift+S"
    $(document).on("keydown", function (e) {
        if (e.which == 83 && e.shiftKey) {
            e.preventDefault();
            $("#sell-popup").popup("show");
        }
    });
});
