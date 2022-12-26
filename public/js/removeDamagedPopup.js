"use strict";
$(function () {
    $("#remove-damaged-popup").popup({
        blur: false,
        transition: "all 0.3s",
        onclose: function () {
            $("#remove-damaged-popup #remove-form")[0].reset();
        },
    });

    $("#remove-damaged-popup form .command :reset").on("click", async function () {
        $("#remove-damaged-popup").popup("hide");
    });

    $("#remove-damaged-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var itemPage = window.location.pathname.includes("/item/");

        var codeField = $("#remove-damaged-popup #remove-code")[0];
        var quantityField = $("#remove-damaged-popup #remove-quantity")[0];
        var error = $("#remove-damaged-popup .text-error")[0];

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

        const code = !itemPage
            ? $("#remove-damaged-popup #remove-code").val()
            : window.location.pathname.split("/", 3)[2];
        const data = new FormData($("#remove-form")[0]);
        //if code does not exist in data, add it
        if (!data.has("code")) {
            data.append("code", code);
        }
        data.append("dateRemoved", new Date());

        var recID = !itemPage ? w2ui["item-grid"].find({ code: code }) : [null];
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/removeDamagedItem",
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
                                    w2ui["item-grid"].set(recID, { available: newData.available });
                                },
                            });
                        }

                        if (itemPage) {
                            var newTotalValue =
                                parseInt($("#main-attributes-damaged").text()) -
                                parseInt(quantityField.value);
                            $("#main-attributes-damaged").text(newTotalValue);

                            getTransactions(true);
                        }

                        $("#remove-damaged-popup #remove-form")[0].reset();
                        $("#remove-damaged-popup").popup("hide");
                        SnackBar({
                            message: "Damaged item removed successfully",
                            status: "success",
                            position: "br",
                            timeout: 5000,
                            fixed: true,
                        });
                    },

                    error: async function (jqXHR, textStatus, errorThrown) {
                        let message = jqXHR.responseJSON.message;
                        let fields = jqXHR.responseJSON.fields;

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
                let message = jqXHR.responseJSON.message;
                let fields = jqXHR.responseJSON.fields;

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
