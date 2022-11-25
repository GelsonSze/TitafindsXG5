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
                    <i class='bx bxs-edit' data-recid='${record.username}'></i>
                    <i class='bx bx-reset' data-recid='${record.username}'></i>
                    <i class='bx bx-block' data-recid='${record.username}'></i>
                    </div>`;
                    return html;
                },
            },
        ],
    });
});
