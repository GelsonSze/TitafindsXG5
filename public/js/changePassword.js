

$(function() {
    var newPassField = $('#newPassword')[0];
    var confirmPassField = $('#confirm-password')[0];


    $('#change').on("click", function(e) {
        e.preventDefault();

        let fields = [newPassField, confirmPassField];
        let emptyFields = [];
        let wrongFields = [];

        var newPassword = $('#newPassword').val()
        var confirmPassword = $('#confirm-password').val()
        var error = $('#pass-text-error')[0];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        if (newPassword != confirmPassword) {
            wrongFields = [newPassField, confirmPassField];
            showError(error, "Password and confirm password do not match", wrongFields);
            return;
        }

        const data = new FormData($("#password-form")[0]);
        data.delete("confirm-password");
        
        $.ajax({
            url: "/changeOwnPassword",
            data: JSON.stringify(Object.fromEntries(data)),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    $(".pass-text-error").html("Password successfully changed!")
                }
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;
                details = jqXHR.responseJSON.details;

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
    })

})

