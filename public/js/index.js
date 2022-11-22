var Items = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllItems(refreshGrid = false) {
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
                w2ui["itemGrid"].records = Items;
                w2ui["itemGrid"].refresh();
            }
        },
    });
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

// On document ready
$(function () {
    getAllItems(true);

    $("#itemGrid").w2grid({
        name: "itemGrid",
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
                        '<img id="w2ui-image" src="img/' +
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
        records: Items,
        onDblClick: function(recid) {
            // Redirects to item page

            var record = w2ui["itemGrid"].get(recid.recid);
            //console.log(record)

            window.location.href = "/item/"+record.code;
        },
    });

    $("#restock-popup").popup({
        blur: false,    /* pop-up must be only closed with X button, not by clicking outside */
    });

    $("#restock-popup .restock-popup_close").on("click", async function () {
        $("#restock-popup #restock-form")[0].reset();
        $("#restock-popup .item-wrapper #error-message").html("");
    });

    $("#restock-popup form .command :reset").on("click", async function (e) {
        $("#restock-popup #restock-form")[0].reset();
        $("#restock-popup .item-wrapper #error-message").html("");
    });

    $("#restock-popup form .command :submit").on("click", function(e) {
        e.preventDefault();

        const data = new FormData($("#restock-form")[0]);
        const code = $("#restock-popup #code").val();
        var recID = w2ui["itemGrid"].find({ code:  code});
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`, 
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (flag) {
                if (flag) {
                    $.ajax({
                        url: "/restockItem",
                        data: data,
                        type: "POST",
                        processData: false,
                        contentType: false,

                        success: async function (flag) {
                            if (flag) {
                                $.ajax({
                                        url: `/getItem=${code}`,
                                        type: "GET",
                                        processData: false,
                                        contentType: false,

                                        success: async function (flag) {
                                            w2ui['itemGrid'].set(recID, {quantity: flag.quantity});
                                        },
                                    });
                                $("#restock-popup #restock-form")[0].reset();
                                $("#restock-popup").popup("hide");
                            }
                        },
                    });
                }
                else {
                    $("#restock-popup .item-wrapper #error-message").html("Invalid Product Code.");
                }
            },
        });
    });

    $("#sell-popup").popup({
        blur: false,
    });

    $("#sell-popup .sell-popup_close").on("click", function () {
        $("#sell-popup #sell-form")[0].reset();
        $("#sell-popup .item-wrapper #error-message").html("");
    });

    $("#sell-popup form .command :reset").on("click", function (e) {
        $("#sell-popup #sell-form")[0].reset();
        $("#sell-popup .item-wrapper #error-message").html("");
    });

    $("#sell-popup form .command :submit").on("click", function(e) {
        e.preventDefault();

        const quantity = $('#sell-popup #quantity').val();
        const data = new FormData($("#sell-form")[0]);
        const code = $("#sell-popup #code").val();
        var recID = w2ui["itemGrid"].find({ code:  code});
        recID = recID[0];

        $.ajax({
            url: `/getItem=${code}`,
            type: "GET",
            processData: false,
            contentType: false,

            success: async function (flag) {
                if (flag) {
                    if (flag.quantity == 0) {
                        $("#sell-popup .item-wrapper #error-message").html("No available stock.");
                    }
                    else if ( (flag.quantity - quantity) < 0 ) {
                        $("#sell-popup .item-wrapper #error-message").html("Insufficient stock.");
                    }
                    else {
                        $.ajax({
                            url: "/sellItem",
                            data: data,
                            type: "POST",
                            processData: false,
                            contentType: false,

                            success: async function (flag) {
                                if (flag) {
                                    $.ajax({
                                        url: `/getItem=${code}`,
                                        type: "GET",
                                        processData: false,
                                        contentType: false,

                                        success: async function (flag) {
                                            w2ui['itemGrid'].set(recID, {quantity: flag.quantity});
                                        },
                                    });
                                    $("#sell-popup #sell-form")[0].reset();
                                    $("#sell-popup").popup("hide");
                                }
                            },
                        });
                    }
                }
                else {
                    $("#sell-popup .item-wrapper #error-message").html("Invalid Product Code.");
                }
            },
        });
    });

    /* pop-up must be only closed with X button, not by clicking outside */
    $("#add-popup").popup({
        blur: false,
    });

    /* WILL RENAME SELECTORS ONCE RENAMING OF THE FORM IDS ARE FINISHED*/
    /* clicking on the X button of the popup clears the form */

     $("#add-popup .add-popup_close").on("click", function () {
        $("#add-popup #add-form")[0].reset();
        $("#image-preview").attr("src", "/img/test.png");
    });

    $("#add-popup form .command :reset").on("click", function (e) {
        $("#add-popup #add-form")[0].reset();
        $("#image-preview").attr("src", "/img/test.png");
    });

    $("#add-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

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

            success: async function (flag) {
                if (flag) {
                    console.log("success");
                    Items = [];
                    getAllItems(true);
                    console.log("reloaded");
                    $("#add-popup #add-form")[0].reset();
                    $("#add-popup").popup("hide");
                }
            },
        });
    });
    //on change of image
    $("#image").on("change", function () {
        try {
            if (this.files[0].type.match(/image.{jpg|jpeg|png}/)) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#image-preview").attr("src", e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                showError($(".text-error")[0], "Please select an image file", [
                    $("#image-preview")[0],
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    });

    //hover on image
    $(document).on("mouseover", "#w2ui-image", function (e) {
        console.log(e.target.src);
        $("#w2ui-enlarged-image").attr("src", e.target.src);
        $("#w2ui-enlarged-image").css("display", "block");
    });
    //leave hover on image
    $(document).on("mouseleave", "#w2ui-image", function (e) {
        console.log("leave");
        $("#w2ui-enlarged-image").css("display", "none");
    });
});

$(window).resize(function () {
    console.log("refresh/resize");
    w2ui["itemGrid"].refresh();
});
