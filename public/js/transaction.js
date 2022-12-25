var Transactions = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllTransactions(refreshGrid = false) {
    $.ajax({
        url: "/getTransactions",
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (items) {
            Transactions = [];

            var dfd = $.Deferred().resolve();

            items.forEach(function (trans) {
                dfd = dfd.then(function () {
                    return pushTransaction(trans);
                });
            });

            dfd.done(function () {
                if (refreshGrid) {
                    w2ui["transaction-grid"].records = Transactions.reverse();
                    w2ui["transaction-grid"].refresh();
                }
                $("#table-last-refresh-text").html(
                    `<b>Last Refresh:</b> ${new Date().toLocaleString()}`
                );
                $("#table-filter-apply").attr("disabled", false);
            });
        },
    });
}
/**
 * This function pushes the transaction of the item in the transaction array
 * @param {Object} trans - transaction object
 */
function pushTransaction(trans) {
    var dfd = $.Deferred();

    $.ajax({
        url: `/getItemById=${trans.description}`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (item) {
            trans.date = formatDate(new Date(trans.date));
            let newCode = "deleted";
            if (item) newCode = item.code;
            Transactions.push(
                new transaction(
                    trans.date,
                    trans.type,
                    `Item ${trans.type} - ${trans.name} (${trans.code})`,
                    trans.quantity,
                    trans.sellingPrice,
                    trans.transactedBy,
                    newCode
                )
            );
            dfd.resolve();
        },
    });

    return dfd.promise();
}

function transaction(date, type, desc, quantity, sellingPrice, transactedBy, newCode) {
    return {
        recid: Transactions.length + 1,
        date: date,
        type: type,
        description: desc,
        quantity: quantity,
        sellingPrice: sellingPrice,
        transactedBy: transactedBy,
        newCode: newCode,
    };
}

function filter() {
    var searchBar = $("#filter-search").val();
    var typeBar = $("#filter-type").val();

    $("#table-filter-apply").attr("disabled", true);

    // Cheats the empty search bar
    if (!searchBar) {
        searchBar = "empty";
    }

    if ((searchBar == "empty" && typeBar == "Type") || typeBar == "All") {
        getAllTransactions(true);
    } else {
        $.ajax({
            url: `/searchTransactions=${typeBar}&${searchBar}`,
            type: "GET",
            processData: false,
            contentType: "application/json; charset=utf-8",
            success: function (items) {
                Transactions = [];

                var dfd = $.Deferred().resolve();

                items.forEach(function (trans) {
                    dfd = dfd.then(function () {
                        return pushTransaction(trans);
                    });
                });

                dfd.done(function () {
                    w2ui["transaction-grid"].records = Transactions.reverse();
                    w2ui["transaction-grid"].refresh();

                    $("#table-filter-apply").attr("disabled", false);
                });
            },
        });
    }
}

// On document ready
$(function () {
    $("#transaction-grid").w2grid({
        name: "transaction-grid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 60,
        columns: [
            { field: "date", text: "Date", size: "23%", sortable: true },
            { field: "type", text: "Type", size: "7%", sortable: true },
            { field: "description", text: "Description", size: "50%", sortable: true },
            { field: "quantity", text: "Quantity", size: "5%", sortable: true },
            {
                field: "sellingPrice",
                text: "Selling Price",
                size: "6%",
                sortable: true,
                render: function (record) {
                    return record.sellingPrice.toLocaleString("en-US");
                },
            },
            { field: "transactedBy", text: "Transacted By", size: "7%", sortable: true },
        ],
        records: Transactions,
        onDblClick: function (recid) {
            // var record = w2ui["transaction-grid"].get(recid.recid);
            // // Grabs the last string in description. This is the code.
            // var strArray = record.description.split(" ");
            // var str = strArray[strArray.length - 1];
            // var code = str.substring(str.indexOf("(") + 1, str.lastIndexOf(")"));
            try {
                var record = w2ui["transaction-grid"].get(recid.recid);
                var code = record.newCode;
                if (code != "deleted") window.open(`/item/${code}`, "_blank");
            } catch (error) {
                console.log(error);
            }
        },
    });

    getAllTransactions(true);

    $("#filter-search").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#table-filter-apply").click();
        }
    });

    $("#table-filter-refresh, #table-filter-apply").click(function () {
        filter();
    });

    // $(".dropdown-type").click(function () {
    //     var text = $(this).html();
    //     if (text != "Any") $("#dropdown-selected").html(text);
    //     else $("#dropdown-selected").html("Type");
    // });

    // Clears table filters
    $("#table-filter-clear").click(function () {
        $("#filter-search").val("");
        $("#filter-type").val("Type");
    });

    var resizeTimer;
    window.addEventListener(
        "resize",
        function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                w2ui["transaction-grid"].refresh();
            }, 510);
        },
        { passive: true }
    );
});
