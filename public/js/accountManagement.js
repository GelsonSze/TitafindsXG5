var Users = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllUsers(refreshGrid = false) {
    $.ajax({
        url: "/getUsers",
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (users) {
            for (var account of users) {
                account = new user(
                    account.username,
                    account.password,
                    account.firstName,
                    account.lastName,
                    account.isAdmin,
                    account.isSuspended,
                    account.dateCreated,
                    account.lastLogin
                );
                console.log(account);
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
    username,
    password,
    firstName,
    lastName,
    isAdmin,
    isSuspended,
    dateCreated,
    lastLogin
) {
    return {
        recid: Users.length + 1,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin,
        isSuspended: isSuspended,
        dateCreated: dateCreated,
        lastLogin: lastLogin,
    };
}

$(function () {
    getAllUsers(true);

    $("#user-popup").popup({
        blur: false,
    });

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
                size: "10%",
                sortable: true,
            },
            {
                field: "username",
                text: "Username",
                size: "10%",
                sortable: true,
            },
            { field: "firstName", text: "First Name", size: "5%", sortable: true },
            { field: "lastName", text: "Last Name", size: "5%", sortable: true },
            {
                field: "edit",
                size: "5%",
                render: function (record, extra) {
                    var html = `
                    <div class='admin-actions'>
                    <button class = "update-popup_open"><i class='bx bxs-edit' data-recid='${record.username}'></i></button>
                    <button class = "reset-popup_open"><i class='bx bx-reset' data-recid='${record.username}'></i></button>
                    <button class = "suspend-popup_open"><i class='bx bx-block' data-recid='${record.username}'></i></button>
                    </div>
                    `;
                    return html;
                },
            },
        ],
    });

    $("#reset-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
    });

    $("#reset-popup .reset-popup_close").on("click", async function () {
        $("#reset-popup #reset-form")[0].reset();
    });

    $("#reset-popup form .command :reset").on("click", async function () {
        $("#reset-popup #reset-form")[0].reset();
        $("#reset-popup").popup("hide");
    });

    $("#suspend-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
    });

    $("#suspend-popup .suspend-popup_close").on("click", async function () {
        $("#reset-popup #reset-form")[0].reset();
    });

    $("#suspend-popup form .command :reset").on("click", async function () {
        $("#suspend-popup #reset-form")[0].reset();
        $("#suspend-popup").popup("hide");
    });

    $("#update-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
    });

    $("#update-popup .update-popup_close").on("click", async function () {
        $("#reset-popup #reset-form")[0].reset();
    });

    $("#update-popup form .command :reset").on("click", async function () {
        $("#suspend-popup #reset-form")[0].reset();
        $("#suspend-popup").popup("hide");
    });

    $("#user-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var username = $("#user-popup #username")[0];
        var firstName = $("#user-popup #first-name")[0];
        var lastName = $("#user-popup #last-name")[0];
        var password = $("#user-popup #password")[0];
        var confirm = $("#user-popup #confirm-password")[0];
        var error = $("#user-popup .user-text-error")[0];
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
        
        if ($("#user-popup #password").val() != $("#user-popup #confirm-password").val())
        {
            wrongFields = [password, confirm];
            showError(error, "Password and confirm password do not match!", wrongFields);
            return;
        }
        else
        {
            showError(error, "", emptyFields);
        }

        const data = new FormData($("#form")[0]);
        data.append("dateAdded", new Date());
        data.append("dateUpdated", new Date());

        //TO BE REMOVED
        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: "/auth/addUser",
            data: data,
            type: "POST",
            processData: false,
            contentType: false,
    
            success: async function (flag, status) {
                if (flag) {
                    console.log("success");
                    Users = [];
                    getAllUsers(true);
                    console.log("reloaded");
                    $("#user-popup").popup("hide");
    
                    // Reset form after successful submit
                    $("#user-popup #form")[0].reset();
               }
            },
            error: async function (jqXHR, textStatus, errorThrown) {
                
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.details;

                fields.forEach(async function (field) {
                    emptyFields.push($(`#${field}`)[0]);
                });

                showError(error, message, emptyFields);
            },
        });

    });
});
