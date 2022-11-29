var Items = [];
var AddPopupQuantity = 0;

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllItems(refreshGrid = false) {
    try {
        $.ajax({
            url: "/getItems",
            type: "GET",
            processData: false,
            contentType: "application/json; charset=utf-8",
            success: function (items) {
                Items = [];

                var dfd = $.Deferred().resolve();

                items.forEach(function (product) {
                    dfd = dfd.then(function () {
                        return pushItem(product);
                    });
                });

                dfd.done(function () {
                    if (refreshGrid) {
                        w2ui["item-grid"].records = Items;
                        w2ui["item-grid"].refresh();
                    }
                });
            },
        });
    } catch (error) {
        console.log(error);
        SnackBar({
            message: "Error: Getting all items failed",
            status: "error",
            icon: "error",
            position: "br",
            timeout: 5000,
            fixed: true,
        });
    }
}

function item(
    image,
    name,
    code,
    type,
    classification,
    size,
    weight,
    quantity,
    sellingPrice,
    purchasePrice,
    status
) {
    return {
        recid: Items.length + 1,
        image: image,
        name: name,
        code: code,
        type: type,
        classification: classification,
        size: size,
        weight: weight,
        quantity: quantity,
        purchasePrice: purchasePrice,
        sellingPrice: sellingPrice,
        status: status,
    };
}

function pushItem(product) {
    var dfd = $.Deferred();

    Items.push(
        new item(
            product.image,
            product.name,
            product.code,
            product.type,
            product.classification,
            product.size,
            product.weight,
            product.quantity,
            product.sellingPrice,
            product.purchasePrice,
            product.status
        )
    );

    dfd.resolve();

    return dfd.promise();
}

function getSpecifiedItems(refreshGrid = false, classification, type, status, weight, size) {
    /*Records it as 0 if the user did not select a category*/
    Items = [];
    var check = $("#filter-search").val().toLowerCase();

    /*Process gets all items given a specific condition, which is if the item has the following category. The ==0 condition
    is only for the instances where the category was not changed.*/
    $.ajax({
        url: "/getItems",
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (items) {
            for (var product of items) {
                if (
                    (product.type == $("#dropdown-type-select").text().trim() || type == 0) &&
                    (product.classification == $("#dropdown-classification-select").text().trim() ||
                        classification == 0) &&
                    (product.status == $("#dropdown-status-select").text().trim() || status == 0) &&
                    ((product.weight >= $("#weight-min").val() &&
                        product.weight <= $("#weight-max").val()) ||
                        weight == 0) &&
                    ((product.size >= $("#size-min").val() &&
                        product.size <= $("#size-max").val()) ||
                        size == 0) &&
                    (product.name.toLowerCase().search(check) != -1 ||
                        product.code.toLowerCase().search(check) != -1) //||
                    //check == ""
                ) {
                    Items.push(
                        new item(
                            product.image,
                            product.name,
                            product.code,
                            product.type,
                            product.classification,
                            product.size,
                            product.weight,
                            product.quantity,
                            product.sellingPrice,
                            product.purchasePrice,
                            product.status
                        )
                    );
                }
            }
            if (refreshGrid) {
                w2ui["item-grid"].clear();
                w2ui["item-grid"].records = Items;
                w2ui["item-grid"].refresh();
            }
        },
    });
}
function increase() {
    AddPopupQuantity = $("#add-popup #quantity").val();
    if (!isNaN(AddPopupQuantity)) {
        AddPopupQuantity = Number(AddPopupQuantity);
        AddPopupQuantity += 1;
        $("#add-popup #quantity").val(AddPopupQuantity);
    }
}

function decrease() {
    AddPopupQuantity = $("#add-popup #quantity").val();
    if (!isNaN(AddPopupQuantity) && AddPopupQuantity > 0) {
        AddPopupQuantity = Number($("#add-popup #quantity").val());
        AddPopupQuantity -= 1;
        $("#add-popup #quantity").val(AddPopupQuantity);
    }
}

// On document ready
$(function () {
    $("#weight-min").val(0);
    $("#size-min").val(0);
    getAllItems(true);

    $("#item-grid").w2grid({
        name: "item-grid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 120,
        columns: [
            {
                field: "image",
                text: "Image",
                size: "7%",
                render: function (record, extra) {
                    var html =
                        '<img id="w2ui-image" src="/img/' +
                        record.image +
                        '" alt="' +
                        record.image +
                        '">';
                    return html;
                },
                sortable: true,
            },
            {
                field: "name",
                text: "Name",
                size: "10%",
                render: function (record, extra) {
                    var html = `<a href="/item/${record.code}" target="_blank" class="item-anchor-link">${record.name}</a>`;
                    return html;
                },
                sortable: true,
            },
            { field: "code", text: "Code", size: "5%", sortable: true },
            { field: "type", text: "Type", size: "5%", sortable: true },
            {
                field: "classification",
                text: "Classifications",
                size: "5%",
                sortable: true,
            },
            { field: "size", text: "Size", size: "3%", sortable: true },
            { field: "weight", text: "Weight", size: "3%", sortable: true },
            { field: "quantity", text: "Quantity", size: "3%", sortable: true },
            {
                field: "sellingPrice",
                text: "Selling Price",
                size: "5%",
                sortable: true,
                render: function (record) {
                    return record.sellingPrice.toLocaleString("en-US");
                },
            },
            {
                field: "purchasePrice",
                text: "Purchase Price",
                size: "6%",
                sortable: true,
                render: function (record) {
                    return record.purchasePrice.toLocaleString("en-US");
                },
            },
            { field: "status", text: "Status", size: "7%", sortable: true },
            // {
            //     field: "edit",
            //     size: "5%",
            //     render: function (record, extra) {
            //         var html =
            //             '<button type="button" class="table-edit-btn" id="rec-' +
            //             record.code +
            //             '">Edit</button>';
            //         return html;
            //     },
            // },
        ],
        records: Items,
        onDblClick: function (recid) {
            // Redirects to item page

            var record = w2ui["item-grid"].get(recid.recid);
            //console.log(record)

            window.open(`/item/${record.code}`, "_blank");
        },
    });

    $("#restock-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
        onclose: function () {
            $("#restock-popup #restock-form")[0].reset();
        },
    });

    $("#restock-popup form .command :reset").on("click", async function () {
        $("#restock-popup").popup("hide");
    });

    $("#restock-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#restock-popup #restock-code")[0];
        var quantityField = $("#restock-popup #restock-quantity")[0];
        var error = $("#restock-popup .text-error")[0];

        var fields = [codeField, quantityField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const code = $("#restock-popup #restock-code").val();
        const data = new FormData($("#restock-form")[0]);
        data.append("dateRestocked", new Date());

        var recID = w2ui["item-grid"].find({ code: code });
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/restockItem",
                    data: JSON.stringify(Object.fromEntries(data)),
                    type: "POST",
                    processData: false,
                    contentType: "application/json; charset=utf-8",

                    success: async function (foundData) {
                        $.ajax({
                            url: `/getItem=${code}`,
                            type: "GET",
                            processData: false,
                            contentType: false,

                            success: async function (newData) {
                                w2ui["item-grid"].set(recID, { quantity: newData.quantity });
                            },
                        });

                        $("#restock-popup #restock-form")[0].reset();
                        $("#restock-popup").popup("hide");
                        SnackBar({
                            message: "Item restocked successfully",
                            status: "success",
                            position: "br",
                            timeout: 5000,
                            fixed: true,
                        });
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
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                if (fields) {
                    fields.forEach(async function (field) {
                        if (field == "code") {
                            field = `restock-${field}`;
                        }
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
    });

    $("#sell-popup").popup({
        blur: false,
        onclose: function () {
            $("#sell-popup #sell-form")[0].reset();
        },
    });

    $("#sell-popup form .command :reset").on("click", function () {
        $("#sell-popup").popup("hide");
    });

    $("#sell-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#sell-popup #sell-code")[0];
        var quantityField = $("#sell-popup #sell-quantity")[0];
        var sellingPriceField = $("#sell-popup #sell-selling-price")[0];
        var error = $("#sell-popup .text-error")[0];

        var fields = [codeField, quantityField, sellingPriceField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const code = $("#sell-popup #sell-code").val();
        const data = new FormData($("#sell-form")[0]);
        data.append("dateSold", new Date());
        var recID = w2ui["item-grid"].find({ code: code });
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                $.ajax({
                    url: "/sellItem",
                    data: JSON.stringify(Object.fromEntries(data)),
                    type: "POST",
                    processData: false,
                    contentType: "application/json; charset=utf-8",

                    success: async function (foundData) {
                        $.ajax({
                            url: `/getItem=${code}`,
                            type: "GET",
                            processData: false,
                            contentType: false,

                            success: async function (newData) {
                                w2ui["item-grid"].set(recID, {
                                    quantity:
                                        newData.quantity /*, sellingPrice: newData.sellingPrice*/,
                                });
                            },
                        });
                        $("#sell-popup #sell-form")[0].reset();
                        $("#sell-popup").popup("hide");

                        SnackBar({
                            message: "Item sold successfully",
                            status: "success",
                            position: "br",
                            timeout: 5000,
                            fixed: true,
                        });
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
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                if (fields) {
                    fields.forEach(async function (field) {
                        if (field == "code") {
                            field = `sell-${field}`;
                        }
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
    });

    $("#add-popup").popup({
        blur: false,
        onclose: function () {
            $("#add-popup #add-form")[0].reset();
            $("#image-preview").attr("src", "/img/product-images/default.png");
        },
    });

    $("#add-popup form .command :reset").on("click", function (e) {
        $("#add-popup").popup("hide");
    });

    $("#add-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var name = $("#add-popup #name")[0];
        var code = $("#add-popup #code")[0];
        var type = $("#add-popup #type")[0];
        var sellingType = $("#add-popup #selling-type")[0];
        var weight = $("#add-popup #weight")[0]; // required if selling type is per gram
        var quantity = $("#add-popup #quantity")[0];
        var error = $("#add-popup .text-error")[0];

        let fields = [name, code, type, sellingType, quantity];
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

        const data = new FormData($("#add-form")[0]);
        data.append("dateAdded", new Date());
        data.append("dateUpdated", new Date());

        //TO BE REMOVED
        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: "/addItem",
            data: data,
            type: "POST",
            processData: false,
            contentType: false,

            success: async function (foundData) {
                console.log("success");
                Items = [];
                getAllItems(true);
                console.log("reloaded");
                $("#add-popup #add-form")[0].reset();
                $("#add-popup").popup("hide");
                $("#image-preview").attr("src", "/img/product-images/default.png");

                SnackBar({
                    message: "Item added successfully",
                    status: "success",
                    position: "br",
                    timeout: 5000,
                    fixed: true,
                });
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
                        $("#add-popup #image").val("");
                        showError($("#add-popup .text-error")[0], "Image file exceeds 5mb", [
                            $("#image-preview")[0],
                        ]);
                    }
                } else {
                    $("#add-popup #image").val("");
                    showError($("#add-popup .text-error")[0], "Please select an image file", [
                        $("#image-preview")[0],
                    ]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    $(".dropdown-type").click(function () {
        var text = $(this).html();
        $("#dropdown-type-select").html(text);
    });

    $(".dropdown-classification").click(function () {
        var text = $(this).html();
        $("#dropdown-classification-select").html(text);
    });

    $(".dropdown-status").click(function () {
        var text = $(this).html();
        console.log(text);
        $("#dropdown-status-select").html(text);
    });

    $("#filter-search").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $("#table-filter-apply").click();
        }
    });

    $("#table-filter-apply").click(function () {
        if ($("#dropdown-type-select").text().trim() == "Type") {
            var type = 0;
        }
        if ($("#dropdown-classification-select").text().trim() == "Classification") {
            var classification = 0;
        }
        if ($("#dropdown-status-select").text().trim() == "Status") {
            var status = 0;
        }
        if ($("#weight-min").val() == "" || $("#weight-max").val() == "") {
            var weight = 0;
        }
        if ($("#size-min").val() == "" || $("#size-max").val() == "") {
            var size = 0;
        }

        getSpecifiedItems(true, classification, type, status, weight, size);
    });

    $("#table-filter-clear").click(function () {
        /*Records it as 0 if the user did not select a category*/
        $("#dropdown-type-select").html("Type");
        $("#dropdown-classification-select").html("Classification");
        $("#dropdown-status-select").html("Status");
        $("#weight-min").val(0);
        $("#size-min").val(0);
        $("#weight-max").val("");
        $("#size-max").val("");
        $("#filter-search").val("");
        getSpecifiedItems(true, 0, 0, 0, 0, 0);
    });

    //hover on image
    $(document).on("mouseover", "#w2ui-image", function (e) {
        // console.log(e.target.src);
        $("#w2ui-enlarged-image").attr("src", e.target.src);
        $("#w2ui-enlarged-image").css("display", "block");
    });
    //leave hover on image
    $(document).on("mouseleave", "#w2ui-image", function (e) {
        // console.log("leave");
        $("#w2ui-enlarged-image").css("display", "none");
    });
    //refresh grid when window is resized
    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // console.log("refresh/resize");
            w2ui["item-grid"].refresh();
        }, 510);
    });
});
