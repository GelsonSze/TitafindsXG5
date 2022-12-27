"use strict";
$(function () {
    var newPassField = $("#new-password")[0];
    var confirmPassField = $("#confirm-password")[0];

    $("#password-form :submit").on("click", function (e) {
        e.preventDefault();

        let fields = [newPassField, confirmPassField];
        let emptyFields = [];
        let wrongFields = [];

        var newPassword = $("#new-password").val();
        var confirmPassword = $("#confirm-password").val();
        var error = $(".text-error")[0];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        if (newPassword != confirmPassword) {
            wrongFields = [newPassField, confirmPassField];
            showError(error, "Password and Confirm password do not match", wrongFields);
            return;
        }

        const data = new FormData($("#password-form")[0]);
        data.delete("confirmPassword");

        $.ajax({
            url: "/changeOwnPassword",
            data: JSON.stringify(Object.fromEntries(data)),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                console.log("success");
                swal("Password changed!", { icon: "success" });
                $("#password-form")[0].reset();
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                let message = jqXHR.responseJSON.message;
                let fields = jqXHR.responseJSON.fields;
                let details = jqXHR.responseJSON.details;

                if (fields) {
                    let wrongFields = [];
                    fields.forEach(async function (field) {
                        wrongFields.push($(`#${field}`)[0]);
                    });
                    showError(error, message, wrongFields);
                } else {
                    showError(error, message, []);
                    if (details) console.log(details);
                }
            },
        });
    });
});
