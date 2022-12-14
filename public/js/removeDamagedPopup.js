$(function () {
    $("#remove-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
        onclose: function () {
            $("#remove-popup #remove-form")[0].reset();
        },
    });

    $("#remove-popup form .command :reset").on("click", async function () {
        $("#remove-popup").popup("hide");
    });

    $("#remove-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#remove-popup #remove-code")[0];
        var quantityField = $("#remove-popup #remove-quantity")[0];
        var error = $("#remove-popup .text-error")[0];

        var fields = [codeField, quantityField];
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

        const code = $("#remove-popup #remove-code").val();
        const data = new FormData($("#remove-form")[0]);
        data.append("dateRemoved", new Date());

        var recID = w2ui["item-grid"].find({ code: code });
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/removeDamage",
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

                        $("#remove-popup #remove-form")[0].reset();
                        $("#remove-popup").popup("hide");
                        SnackBar({
                            message: "Item removed successfully",
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
                                let element = $(`#${field}`);
                                if (typeof element !== "undefined" && element !== null) {
                                    emptyFields.push(element[0]);
                                }
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
                            field = `remove-${field}`;
                        }
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
    });
});
