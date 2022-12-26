"use strict";
$(function () {
    $("#restock-popup").popup({
        blur: false,
        transition: "all 0.3s",
        onclose: function () {
            $("#restock-popup #restock-form")[0].reset();
        },
    });

    $("#restock-popup form .command :reset").on("click", async function () {
        $("#restock-popup").popup("hide");
    });

    $("#restock-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var itemPage = window.location.pathname.includes("/item/");

        var codeField = $("#restock-popup #restock-code")[0];
        var quantityField = $("#restock-popup #restock-quantity")[0];
        var error = $("#restock-popup .text-error")[0];

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
            ? $("#restock-popup #restock-code").val()
            : window.location.pathname.split("/", 3)[2];

        const data = new FormData($("#restock-form")[0]);
        //if code does not exist in data, add it
        if (!data.has("code")) {
            data.append("code", code);
        }
        data.append("dateRestocked", new Date());

        var recID = !itemPage ? w2ui["item-grid"].find({ code: code }) : [null];
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
                                parseInt($("#main-attributes-available").text()) +
                                parseInt(quantityField.value);
                            $("#main-attributes-available").text(newTotalValue);

                            getTransactions(true);
                        }

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
                                field = `restock-${field}`;
                            }
                            emptyFields.push($(`#${field}`)[0]);
                        });

                        showError(error, message, emptyFields);
                    }
                }
            },
        });
    });

    // Shortcuts for "Shift+Alt+R"
    $(window).on("keydown", function (e) {
        if (e.keyCode == 82 && e.shiftKey && e.altKey) {
            e.preventDefault();
            // If .popup_wrapper_visible is present anywhere in the document, then return
            if ($(".popup_wrapper_visible").length) return;

            $("#restock-popup").popup("show");
        }
    });
});
