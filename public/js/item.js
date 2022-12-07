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
                                `Item ${trans.type} - ${item.name} (${item.code})`,
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
            // Note from Erik: length is undefined ata sa database hence it being an outlier with system colors
            PageItem = new Item(
                item._id,
                item.image,
                item.name,
                item.code,
                item.type,
                item.classification,
                item.size,
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
            $("#weight").val(PageItem.weight);
            $("#available").val(PageItem.available);
            $("#selling-type").val(PageItem.sellingType);
            $("#purchase-price").val(PageItem.purchasePrice);
            $("#selling-price").val(PageItem.sellingPrice);
            $("#edit-popup").popup("show");
        }
    });

    $(".remove-image").on("click", function () {
        $("#image-preview").attr("src", `../img/product-images/default.png`);
        $("#image").val("");
    });

    $("#edit-popup").popup({
        blur: false,
        transition: "all 0.3s",
        onclose: function () {
            $("#update-form").trigger("reset");
        },
    });

    $("#edit-form .command :reset").on("click", function () {
        $("#edit-popup").popup("hide");
    });

    $("#edit-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var name = $("#edit-popup #name")[0];
        var code = $("#edit-popup #code")[0];
        var type = $("#edit-popup #type")[0];
        var sellingType = $("#edit-popup #selling-type")[0];
        var weight = $("#edit-popup #weight")[0]; // required if selling type is per gram
        var error = $("#edit-popup .text-error")[0];

        let fields = [name, code, type, sellingType];
        let emptyFields = [];
        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        // If selling type is per gram, weight is required
        if (sellingType.value == "per gram") {
            if (isEmptyOrSpaces(weight.value)) {
                emptyFields.push(weight);
            }
        }

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const data = new FormData($("#edit-form")[0]);
        data.append("dateUpdated", new Date());

        // if ($("#image-preview").attr("src") == "/img/product-images/default.png") {
        //     data.append("noImage", true);
        // }
        let imagePreview = $("#image-preview").attr("src").replace("../img/", "");
        if (imagePreview == PageItem.image) {
            data.append("noEdit", true);
        }
        if (code.value == PageItem.code) {
            data.append("noNewCode", true);
        }

        //TO BE REMOVED
        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: `/editItem=${PageItem.code}`,
            data: data,
            type: "POST",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                console.log("success");
                let newCode = code.value;
                $("#edit-popup").popup("hide");
                $("#image-preview").attr("src", "/img/product-images/default.png");

                swal({
                    title: "Item edited!",
                    text: "The page will now reload to view changes.",
                    icon: "success",
                }).then(() => {
                    window.location.href = `/item/${newCode}`;
                });
                // SnackBar({
                //     message: "Item edited successfully",
                //     status: "success",
                //     position: "br",
                //     timeout: 5000,
                //     fixed: true,
                //     actions: [
                //         {
                //             text: "Reload",
                //             function: () => {
                //                 window.location.href = `/item/${newCode.value}`;
                //             },
                //         },
                //     ],
                // });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                if (fields) {
                    fields.forEach(async function (field) {
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
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

    //on change of image
    $("#image").on("change", function () {
        try {
            if (this.files[0]) {
                //console.log(this.files[
                if (this.files[0].type.match(/image.(jpg|png|jpeg)/)) {
                    if (this.files[0].size <= 1024 * 1024 * 5) {
                        //add in here validation for size
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $("#image-preview").attr("src", e.target.result);
                        };
                        reader.readAsDataURL(this.files[0]);
                    } else {
                        $("#edit-popup #image").val("");
                        showError($("#edit-popup .text-error")[0], "Image file exceeds 5mb", [
                            $("#image-preview")[0],
                        ]);
                    }
                } else {
                    $("#edit-popup #image").val("");
                    showError($("#edit-popup .text-error")[0], "Please select an image file", [
                        $("#image-preview")[0],
                    ]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    //refresh grid when window is resized
    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // console.log("refresh/resize");
            w2ui["details-grid"].refresh();
        }, 510);
    });
});
