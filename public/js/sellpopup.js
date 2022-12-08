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

        var codeField = $("#sell-popup #sell-code")[0];
        var quantityField = $("#sell-popup #sell-quantity")[0];
        var sellingPriceField = $("#sell-popup #sell-selling-price")[0];
        var error = $("#sell-popup .text-error")[0];

        var fields = [codeField, quantityField, sellingPriceField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const code = $("#sell-popup #sell-code").val();
        const data = new FormData($("#sell-form")[0]);
        data.append("dateSold", new Date());
        var recID = w2ui["item-grid"].find({ code: code });
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
                        $.ajax({
                            url: `/getItem=${code}`,
                            type: "GET",
                            processData: false,
                            contentType: false,

                            success: async function (newData) {
                                w2ui["item-grid"].set(recID, {
                                    available:
                                        newData.available /*, sellingPrice: newData.sellingPrice*/,
                                });
                            },
                        });
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
                        message = jqXHR.responseJSON.message;
                        fields = jqXHR.responseJSON.fields;

                        if (fields) {
                            fields.forEach(async function (field) {
                                emptyFields.push($(`#${field}`)[0]);
                            });

                            showError(error, message, emptyFields);
                        }
                    },
                });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
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
            },
        });
    });
});
