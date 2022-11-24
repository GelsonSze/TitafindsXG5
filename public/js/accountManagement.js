$(function () {
    $("#user-grid").w2grid({
        name: "user-grid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 120,
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
                render: function (record, extra) {
                    var html =
                        '<p style="white-space: normal; word-wrap: break-word">' +
                        record.name +
                        "</p>";
                    // var html = '<p>' + record.name + '</p>';
                    return html;
                },
                sortable: true,
            },
            { field: "firstName", text: "First Name", size: "5%", sortable: true },
            { field: "lastName", text: "Last Name", size: "5%", sortable: true },
            {
                field: "edit",
                size: "5%",
                render: function (record, extra) {
                    var html =
                        '<button type="button" class="table-edit-btn" id="rec-' +
                        record.code +
                        '">Edit</button>';
                    return html;
                },
            },
        ],
    });
});
