var PageItem = null;
var Transactions = [];

/**
 * Constructor for the item file
 */
function Item(
    id,
    image,
    name,
    code,
    type,
    classification,
    size,
    unit,
    weight,
    available,
    sellingType,
    purchasePrice,
    sellingPrice,
    dateAdded,
    dateUpdated,
    addedBy
) {
    return {
        id: id,
        image: image,
        name: name,
        code: code,
        type: type,
        classification: classification,
        size: size,
        unit: unit,
        weight: weight,
        available: available,
        sellingType: sellingType,
        purchasePrice: purchasePrice,
        sellingPrice: sellingPrice,
        dateAdded: dateAdded,
        dateUpdated: dateUpdated,
        addedBy: addedBy,
    };
}

/**
 * Constructor for transaction file
 */
function transaction(date, type, desc, quantity, sellingPrice, transactedBy) {
    return {
        recid: Transactions.length + 1,
        date: date,
        type: type,
        description: desc,
        quantity: quantity,
        sellingPrice: sellingPrice,
        transactedBy: transactedBy,
    };
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
            Transactions.push(
                new transaction(
                    trans.date,
                    trans.type,
                    `Item ${trans.type} - ${item.name} (${item.code})`,
                    trans.quantity,
                    trans.sellingPrice,
                    trans.transactedBy
                )
            );
            dfd.resolve();
        },
    });

    return dfd.promise();
}

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getTransactions(refreshGrid = false) {
    var itemCode = window.location.pathname.split("/").pop();

    $.ajax({
        url: `/getItem=${itemCode}`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (item) {
            $.ajax({
                url: `/getItemTransactions=${item._id.toString()}`,
                type: "GET",
                processData: false,
                contentType: "application/json; charset=utf-8",
                success: function (transactions) {
                    console.log(transactions);
                    Transactions = [];

                    var dfd = $.Deferred().resolve();
                    transactions.forEach(function (trans) {
                        trans.date = formatDate(new Date(trans.date));
                        Transactions.push(
                            new transaction(
                                trans.date,
                                trans.type,
                                `Item ${trans.type} - ${trans.name} (${trans.code})`,
                                trans.quantity,
                                trans.sellingPrice,
                                trans.transactedBy
                            )
                        );
                    });

                    dfd.done(function () {
                        if (refreshGrid) {
                            w2ui["details-grid"].records = Transactions.reverse();
                            w2ui["details-grid"].refresh();
                        }
                    });
                },
            });
        },
    });
}

/**
 * Requests item from database. Currently feeds it to the Item object so it's not dynamic yet.
 * It will then append it to the fileds-table to display all the attributes.
 */
function getItem() {
    var item_code = window.location.pathname.split("/").pop();
    $.ajax({
        url: `/getItem=${item_code}`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        data: { code: item_code },
        success: function (item) {
            PageItem = new Item(
                item._id,
                item.image,
                item.name,
                item.code,
                item.type,
                item.classification,
                item.size,
                item.unit,
                item.weight,
                item.available,
                item.sellingType,
                item.purchasePrice,
                item.sellingPrice,
                formatDate(new Date(item.dateAdded)),
                formatDate(new Date(item.dateUpdated)),
                item.addedBy
            );

            // Changes image source of img element into the item image
            $("#left-wrapper img").attr("src", `../img/${item.image}`);

            // Empties then appends a row into the #attributes-table
            $("#table-body").empty();
            for (var attribute in PageItem) {
                if (
                    attribute == "type" ||
                    attribute == "sellingType" ||
                    attribute == "available" ||
                    attribute == "damaged"
                )
                    continue;

                $("#table-body").append(
                    `<tr><td>${attribute}</td> <td>${PageItem[attribute]}</td></tr>`
                );
            }
        },
    });
}

/**
 * Creates the HTML wrapper for each item being added to fields-table.
 * @param  {String} [field] - Is the field name for the table item
 * @param  {String} [desc] - Is the field description for the table item
 */
function itemDesc(field, desc) {
    const html = `
    <div class="item-desc-wrapper">
        <div class="field">
            ${field}
        </div>
        <div class="desc">
            ${desc}
        </div>
    </div>
    
    `;

    return html;
}

$(document).ready(function () {
    // Loads item for the page.
    getItem();
    getTransactions(true);

    $("#details-grid").w2grid({
        name: "details-grid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 60,
        columns: [
            { field: "date", text: "Date", size: "15%", sortable: true },
            { field: "type", text: "Type", size: "5%", sortable: true },
            { field: "description", text: "Description", size: "30%", sortable: true },
            { field: "quantity", text: "Quantity", size: "7%", sortable: true },
            {
                field: "sellingPrice",
                text: "Selling Price",
                size: "9%",
                sortable: true,
                render: function (record) {
                    return record.sellingPrice.toLocaleString("en-US");
                },
            },
            { field: "transactedBy", text: "Transacted By", size: "10%", sortable: true },
        ],
        records: Transactions,
    });

    $(document).on("click", (e) => {
        // console.log(e.target);
        if (e.target.closest(".edit-popup_open")) {
            $("#edit-popup").popup("hide");
            $("#image-preview").attr("src", `../img/${PageItem.image}`);
            $("#name").val(PageItem.name);
            $("#code").val(PageItem.code);
            $("#type").val(PageItem.type);
            $("#classification").val(PageItem.classification);
            $("#length").val(PageItem.length);
            $("#size").val(PageItem.size);
            $("#unit").val(PageItem.unit);
            $("#weight").val(PageItem.weight);
            $("#available").val(PageItem.available);
            $("#selling-type").val(PageItem.sellingType);
            $("#purchase-price").val(PageItem.purchasePrice);
            $("#selling-price").val(PageItem.sellingPrice);
            $("#edit-popup").popup("show");
        }
    });

    $(".delete-popup_open").on("click", function () {
        swal({
            title: "Are you sure?",
            text: "This will permanently delete the item",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: `/deleteItem=${PageItem.code}`,
                    type: "DELETE",
                    success: function (foundData) {
                        console.log("success");
                        swal({
                            title: "Item deleted!",
                            text: "The page will now redirect to inventory.",
                            icon: "success",
                            button: "Go to inventory",
                        }).then(() => {
                            window.location.href = `/`;
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("error");
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                });
            }
        });
    });

    //refresh grid when window is resized
    var resizeTimer;
    window.addEventListener(
        "resize",
        function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                w2ui["details-grid"].refresh();
            }, 510);
        },
        { passive: true }
    );
});
