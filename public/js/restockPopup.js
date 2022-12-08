$(function () {
    $("#restock-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
        onclose: function () {
            $("#restock-popup #restock-form")[0].reset();
        },
    });

    $("#restock-popup form .command :reset").on("click", async function () {
        $("#restock-popup").popup("hide");
    });

    $("#restock-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#restock-popup #restock-code")[0];
        var quantityField = $("#restock-popup #restock-quantity")[0];
        var error = $("#restock-popup .text-error")[0];

        var fields = [codeField, quantityField];
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

        const code = $("#restock-popup #restock-code").val();
        const data = new FormData($("#restock-form")[0]);
        data.append("dateRestocked", new Date());

        var recID = w2ui["item-grid"].find({ code: code });
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/restockItem",
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
                                w2ui["item-grid"].set(recID, { available: newData.available });
                            },
                        });

                        $("#restock-popup #restock-form")[0].reset();
                        $("#restock-popup").popup("hide");
                        SnackBar({
                            message: "Item restocked successfully",
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
                            field = `restock-${field}`;
                        }
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
    });
});
