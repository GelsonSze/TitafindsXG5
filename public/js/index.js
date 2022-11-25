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
            contentType: false,
            headers: {
                "Content-Type": "application/json",
            },
            success: function (items) {
                for (var product of items) {
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
                if (refreshGrid) {
                    w2ui["item-grid"].records = Items;
                    w2ui["item-grid"].refresh();
                }
            },
        });
    } catch (err) {
        console.log(err);
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
                    var html =
                        '<p style="white-space: normal; word-wrap: break-word">' +
                        record.name +
                        "</p>";
                    // var html = '<p>' + record.name + '</p>';
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
            },
            {
                field: "purchasePrice",
                text: "Purchase Price",
                size: "6%",
                sortable: true,
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

            window.location.href = "/item/" + record.code;
        },
    });

    $("#restock-popup").popup({
        blur: false /* pop-up must be only closed with X button, not by clicking outside */,
    });

    $("#restock-popup .restock-popup_close").on("click", async function () {
        $("#restock-popup #restock-form")[0].reset();
    });

    $("#restock-popup form .command :reset").on("click", async function () {
        $("#restock-popup #restock-form")[0].reset();
        $("#restock-popup").popup("hide");
    });

    $("#restock-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#restock-popup #code")[0];
        var quantityField = $("#restock-popup #quantity")[0];
        var error = $("#restock-popup .text-error")[0];

        var fields = [codeField, quantityField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        const code = $("#restock-popup #code").val();
        const data = new FormData($("#restock-form")[0]);
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
                    data: data,
                    type: "POST",
                    processData: false,
                    contentType: false,

                    success: async function (foundData) {
                        $.ajax({
                            url: `/getItem=${code}`,
                            type: "GET",
                            processData: false,
                            contentType: false,

                            success: async function (foundData) {
                                w2ui["item-grid"].set(recID, { quantity: foundData.quantity });
                            },
                        });

                        $("#restock-popup #restock-form")[0].reset();
                        $("#restock-popup").popup("hide");
                    },

                    error: async function (jqXHR, textStatus, errorThrown) {
                        message = jqXHR.responseJSON.message;
                        fields = jqXHR.responseJSON.fields;

                        fields.forEach(async function (field) {
                            emptyFields.push($(`#${field}`)[0]);
                        });

                        showError(error, message, emptyFields);
                    },
                });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                fields.forEach(async function (field) {
                    emptyFields.push($(`#${field}`)[0]);
                });

                showError(error, message, emptyFields);
            },
        });
    });

    $("#sell-popup").popup({
        blur: false,
    });

    $("#sell-popup .sell-popup_close").on("click", function () {
        $("#sell-popup #sell-form")[0].reset();
    });

    $("#sell-popup form .command :reset").on("click", function () {
        $("#sell-popup #sell-form")[0].reset();
        $("#sell-popup").popup("hide");
    });

    $("#sell-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var codeField = $("#sell-popup #code")[0];
        var quantityField = $("#sell-popup #quantity")[0];
        var error = $("#sell-popup .text-error")[0];

        var fields = [codeField, quantityField];
        var emptyFields = [];

        fields.forEach(async function (field) {
            if (isEmptyOrSpaces(field.value)) {
                emptyFields.push(field);
            }
        });

        if (emptyFields.length > 0) {
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        const code = $("#sell-popup #code").val();
        const data = new FormData($("#sell-form")[0]);
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
                    data: data,
                    type: "POST",
                    processData: false,
                    contentType: false,

                    success: async function (foundData) {
                        $.ajax({
                            url: `/getItem=${code}`,
                            type: "GET",
                            processData: false,
                            contentType: false,

                            success: async function (foundData) {
                                w2ui["item-grid"].set(recID, { quantity: foundData.quantity });
                            },
                        });
                        $("#sell-popup #sell-form")[0].reset();
                        $("#sell-popup").popup("hide");
                    },

                    error: async function (jqXHR, textStatus, errorThrown) {
                        message = jqXHR.responseJSON.message;
                        fields = jqXHR.responseJSON.fields;

                        fields.forEach(async function (field) {
                            emptyFields.push($(`#${field}`)[0]);
                        });

                        showError(error, message, emptyFields);
                    },
                });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                fields.forEach(async function (field) {
                    emptyFields.push($(`#${field}`)[0]);
                });

                showError(error, message, emptyFields);
            },
        });
    });

    /* pop-up must be only closed with X button, not by clicking outside */
    $("#add-popup").popup({
        blur: false,
    });

    /* clicking on the X button of the popup clears the form */

    $("#add-popup .add-popup_close").on("click", function () {
        $("#add-popup #add-form")[0].reset();
        $("#image-preview").attr("src", "/img/product-images/default.png");
    });

    $("#add-popup form .command :reset").on("click", function (e) {
        $("#add-popup #add-form")[0].reset();
        $("#image-preview").attr("src", "/img/product-images/default.png");
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
            showError(error, "Please fill out all the fields.", emptyFields);
            return;
        }

        const data = new FormData($("#add-form")[0]);
        data.append("dateAdded", new Date());
        data.append("dateUpdated", new Date());

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
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;
                console.log(fields);

                fields.forEach(async function (field) {
                    emptyFields.push($(`#${field}`)[0]);
                });

                showError(error, message, emptyFields);
            },
        });
    });
    //on change of image
    $("#image").on("change", function () {
        try {
            if(this.files[0]){
                console.log(this.files[0]);
                console.log($(".text-error"));
                if (this.files[0].type.match(/image.(jpg|png|jpeg)/)) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $("#image-preview").attr("src", e.target.result);
                    };
                    reader.readAsDataURL(this.files[0]);
                } else {
                    console.log("not an image");
                    showError($("#add-popup .text-error")[0], "Please select an image file", [
                        $("#image-preview")[0],
                    ]);
                }
            }
        } catch (err) {
            console.log(err);
        }
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
