var Users = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllUsers(refreshGrid = false) {
    $.ajax({
        url: "/auth/getUsers",
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (users) {
            for (var account of users) {
                account.dateCreated = formatDate(new Date(account.dateCreated));
                account.dateUpdated = formatDate(new Date(account.dateUpdated));
                account.lastLogin = formatDate(new Date(account.lastLogin));
                account = new user(
                    account._id,
                    account.username,
                    account.password,
                    account.firstName,
                    account.lastName,
                    account.isAdmin,
                    account.isSuspended,
                    account.dateCreated,
                    account.dateUpdated,
                    account.lastLogin
                );
                Users.push(account);
            }
            if (refreshGrid) {
                w2ui["user-grid"].records = Users;
                w2ui["user-grid"].refresh();
            }
        },
    });
}

//function that returns user object
function user(
    id,
    username,
    password,
    firstName,
    lastName,
    isAdmin,
    isSuspended,
    dateCreated,
    dateUpdated,
    lastLogin
) {
    return {
        recid: Users.length + 1,
        id: id,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin,
        isSuspended: isSuspended,
        dateCreated: dateCreated,
        dateUpdated: dateUpdated,
        lastLogin: lastLogin,
        w2ui: {
            style: `background-color: ${isSuspended ? "#f76f72" : "white"}`,
        },
    };
}

$(function () {
    getAllUsers(true);

    $("#user-grid").w2grid({
        name: "user-grid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 70,
        columns: [
            {
                field: "dateCreated",
                text: "Date Created",
                size: "7%",
                sortable: true,
            },
            {
                field: "username",
                text: "Username",
                size: "7%",
                sortable: true,
            },
            { field: "firstName", text: "First Name", size: "5%", sortable: true },
            { field: "lastName", text: "Last Name", size: "5%", sortable: true },
            {
                field: "dateUpdated",
                text: "Date Updated",
                size: "7%",
                sortable: true,
            },
            {
                field: "lastLogin",
                text: "Last Login",
                size: "7%",
                sortable: true,
            },
            {
                field: "edit",
                size: "7%",
                render: function (record, extra) {
                    var resetButton = `<button class="reset-popup_open" data-id='${record.id}'><i class='material-symbols-outlined'>replay</i></button>`;
                    var suspendButton = `<button class="suspend-popup_open" data-id='${record.id}'><i class='material-symbols-outlined'>block</i></button>`;
                    var resumeButton = `<button class="resume-popup_open" data-id='${record.id}'><i class='material-symbols-outlined'>play_arrow</i></button>`;
                    var html = `
                <div class='admin-actions'>
                    <button class="update-popup_open" data-id='${
                        record.id
                    }'><i class='material-symbols-outlined'>edit</i></button>
                    ${record.isAdmin ? "" : resetButton}
                    ${record.isAdmin ? "" : record.isSuspended ? resumeButton : suspendButton}
                </div>
                    `;
                    return html;
                },
            },
        ],
    });

    $("#create-popup").popup({
        blur: false,
        onclose: function () {
            $("#create-form").trigger("reset");
        },
    });

    $("#create-form .command :reset").on("click", function () {
        $("#create-popup").popup("hide");
    });

    $("#create-form .command :submit").on("click", function (e) {
        e.preventDefault();

        var username = $("#create-username")[0];
        var firstName = $("#create-first-name")[0];
        var lastName = $("#create-last-name")[0];
        var password = $("#create-password")[0];
        var confirm = $("#create-confirm-password")[0];
        var error = $(".create-text-error")[0];
        let fields = [username, firstName, lastName, password];
        let emptyFields = [];
        let wrongFields = [];
        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        if ($("#create-password").val() != $("#create-confirm-password").val()) {
            wrongFields = [password, confirm];
            showError(error, "Password and confirm password do not match", wrongFields);
            return;
        }

        const data = new FormData($("#create-form")[0]);
        data.delete("confirmPassword");
        data.append("dateCreated", new Date());

        //TO BE REMOVED
        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: "/auth/addUser",
            data: JSON.stringify(Object.fromEntries(data)),
            type: "POST",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#create-popup").popup("hide");
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
    });

    $("#update-popup").popup({
        blur: false,
        onclose: function () {
            $("#update-form").trigger("reset");
        },
    });

    $("#update-form .command :reset").on("click", function () {
        $("#update-popup").popup("hide");
    });

    $(document).on("click", (e) => {
        // console.log(e.target);
        if (e.target.closest(".update-popup_open")) {
            $("#update-popup").popup("hide");
            var id = e.target.closest(".update-popup_open").dataset.id;
            $("#update-form").data("id", id);
            //get ajax call and display in form
            $.ajax({
                url: `/auth/getUser=${id}`,
                type: "GET",
                processData: false,
                contentType: false,
                success: async function (user, status) {
                    if (user) {
                        $("#update-username").val(user.username);
                        $("#update-first-name").val(user.firstName);
                        $("#update-last-name").val(user.lastName);
                        $("#update-popup").popup("show");
                    } else {
                        console.log("Error: User not found");
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
        }

        if (e.target.closest(".reset-popup_open")) {
            var id = e.target.closest(".reset-popup_open").dataset.id;
            $("#reset-form").data("id", id);
            $.ajax({
                url: `/auth/getUser=${id}`,
                type: "GET",
                processData: false,
                contentType: false,
                success: async function (user, status) {
                    if (user) {
                        $("#reset-username").text(user.username);
                    } else {
                        console.log("Error: User not found");
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
        }

        if (e.target.closest(".suspend-popup_open")) {
            var id = e.target.closest(".suspend-popup_open").dataset.id;
            $("#suspend-form").data("id", id);
            $.ajax({
                url: `/auth/getUser=${id}`,
                type: "GET",
                processData: false,
                contentType: false,
                success: async function (user, status) {
                    if (user) {
                        $("#suspend-username").text(user.username);
                    } else {
                        console.log("Error: User not found");
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
        }

        //resume

        if (e.target.closest(".resume-popup_open")) {
            var id = e.target.closest(".resume-popup_open").dataset.id;
            $("#resume-form").data("id", id);
            $.ajax({
                url: `/auth/getUser=${id}`,
                type: "GET",
                processData: false,
                contentType: false,
                success: async function (user, status) {
                    if (user) {
                        $("#resume-username").text(user.username);
                    } else {
                        console.log("Error: User not found");
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
        }
    });

    $("#update-form .command :submit").on("click", function (e) {
        e.preventDefault();

        var username = $("#update-username")[0];
        var firstName = $("#update-first-name")[0];
        var lastName = $("#update-last-name")[0];
        var error = $(".update-text-error")[0];
        let fields = [username, firstName, lastName];
        let emptyFields = [];
        let wrongFields = [];
        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        const data = new FormData($("#update-form")[0]);
        data.append("id", $("#update-form").data("id"));
        data.append("dateUpdated", new Date());

        //TO BE REMOVED
        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: "/auth/updateUser",
            data: JSON.stringify(Object.fromEntries(data)),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#update-popup").popup("hide");
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
    });

    $("#reset-popup").popup({
        blur: false,
    });

    $("#reset-form .command :submit").on("click", function (e) {
        e.preventDefault();

        $.ajax({
            url: "/auth/resetPassword",
            data: JSON.stringify({ id: $("#reset-form").data("id") }),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#reset-popup").popup("hide");
                }
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                details = jqXHR.responseJSON.details;

                if (details) console.log(details);
            },
        });
    });

    $("#suspend-popup").popup({
        blur: false,
    });

    $("#suspend-form .command :submit").on("click", function (e) {
        e.preventDefault();

        $.ajax({
            url: "/auth/suspendUser",
            data: JSON.stringify({ id: $("#suspend-form").data("id") }),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#suspend-popup").popup("hide");
                }
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                details = jqXHR.responseJSON.details;

                if (details) console.log(details);
            },
        });
    });

    $("#resume-popup").popup({
        blur: false,
    });

    $("#resume-form .command :submit").on("click", function (e) {
        e.preventDefault();

        $.ajax({
            url: "/auth/resumeUser",
            data: JSON.stringify({ id: $("#resume-form").data("id") }),
            type: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#resume-popup").popup("hide");
                }
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                details = jqXHR.responseJSON.details;

                if (details) console.log(details);
            },
        });
    });

    //refresh grid when window is resized
    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // console.log("refresh/resize");
            w2ui["user-grid"].refresh();
        }, 510);
    });
});
