"use strict";
$(document).ready(function () {
    const error = $(".text-error")[0];
    if (!isEmptyOrSpaces(error.innerHTML)) {
        showError(error, error.innerHTML, []);
    }

    $("#login").on("click", function (e) {
        e.preventDefault();

        const username = $("#username")[0];
        const password = $("#password")[0];
        let fields = [username, password];

        let emptyFields = [];
        for (const input of fields) {
            if (isEmptyOrSpaces(input.value)) {
                emptyFields.push(input);
            }
        }

        if (isEmptyOrSpaces(username.value) || isEmptyOrSpaces(password.value)) {
            showError(error, "Please fill out all fields", emptyFields);
            return;
        }

        $.ajax({
            url: "/auth/login",
            type: "POST",
            data: JSON.stringify({
                username: username.value,
                password: password.value,
                lastLogin: new Date(),
            }),
            processData: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                window.location.replace(window.location.origin + "/");
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                let message = jqXHR.responseJSON.message;
                let fields = jqXHR.responseJSON.fields;
                let details = jqXHR.responseJSON.details;

                if (fields) {
                    fields.forEach(async function (field) {
                        emptyFields.push($(`#${field}`)[0]);
                    });
                    showError(error, message, emptyFields);
                } else if (details) {
                    showError(error, message, []);
                    console.log(details);
                }
            },
        });
    });
});
