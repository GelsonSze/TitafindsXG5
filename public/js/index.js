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
    unit,
    weight,
    available,
    sold,
    damaged,
    sellingPrice,
    purchasePrice
) {
    return {
        recid: Items.length + 1,
        image: image,
        name: name,
        code: code,
        type: type,
        classification: classification,
        size: size,
        unit: unit,
        weight: weight,
        available: available,
        sold: sold,
        damaged: damaged,
        purchasePrice: purchasePrice,
        sellingPrice: sellingPrice,
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
            product.unit,
            product.weight,
            product.available,
            product.sold,
            product.damaged,
            product.sellingPrice,
            product.purchasePrice
        )
    );

    dfd.resolve();

    return dfd.promise();
}

function getSpecifiedItems(refreshGrid = false, classification, type, weight, size, sellingPrice) {
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
                    (product.type == $("#filter-type").val() || type == 0) &&
                    (product.classification == $("#filter-classification").val() ||
                        classification == 0) &&
                    ((product.weight >= $("#weight-min").val() &&
                        product.weight <= $("#weight-max").val()) ||
                        weight == 0) &&
                    ((product.size >= $("#size-min").val() &&
                        product.size <= $("#size-max").val()) ||
                        size == 0) &&
                    ((product.sellingPrice >= $("#selling-price-min").val() &&
                        product.sellingPrice <= $("#selling-price-max").val()) ||
                        sellingPrice == 0) &&
                    (product.name.toLowerCase().search(check) != -1 ||
                        product.code.toLowerCase().search(check) != -1 ||
                        product.description.toLowerCase().search(check) != -1)
                ) {
                    pushItem(product);
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
function increase(input) {
    if (!isNaN(input.value)) {
        if (input.value <= 0) input.value = 0;
        input.value = parseInt(input.value) + 1;
    }
}

function decrease(input) {
    if (!isNaN(input.value) && input.value > 0) {
        input.value = parseInt(input.value) - 1;
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
                size: "5%",
                render: function (record, extra) {
                    var html =
                        '<img draggable="false" id="w2ui-image" src="/img/' +
                        record.image +
                        '" alt="' +
                        record.image +
                        '">';
                    return html;
                },
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
            { field: "classification", text: "Classifications", size: "5%", sortable: true },
            {
                field: "size",
                text: "Size",
                size: "3%",
                sortable: true,
                render: function (record) {
                    return record.size == undefined ? "" : `${record.size} ${record.unit}`;
                },
            },
            { field: "weight", text: "Weight", size: "3%", sortable: true },
            { field: "available", text: "Available", size: "3%", sortable: true },
            { field: "sold", text: "Sold", size: "2 %", sortable: true },
            { field: "damaged", text: "Damaged", size: "3%", sortable: true },
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
            //{ field: "status", text: "Status", size: "7%", sortable: true },
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
            try {
                var record = w2ui["item-grid"].get(recid.recid);
                window.open(`/item/${record.code}`, "_blank");
            } catch (error) {
                console.log(error);
            }
        },
    });

    // $(".dropdown-type").click(function () {
    //     var text = $(this).html();
    //     $("#dropdown-type-select").html(text);
    // });

    // $(".dropdown-classification").click(function () {
    //     var text = $(this).html();
    //     $("#dropdown-classification-select").html(text);
    // });

    $("#filter-search").on("keydown", function (e) {
        if (e.keyCode == 13) {
            // If the user did not type anything in search, get all items.
            var check = $("#filter-search").val();
            if (check == "") {
                getAllItems(true);
                return;
            }
            $("#table-filter-apply").click();
        }
    });

    $("#table-filter-apply").click(function () {
        /*Records it as 0 if the user did not select a category*/
        if ($("#filter-type").val() == null) {
            var type = 0;
        }
        if ($("#filter-classification").val() == null) {
            var classification = 0;
        }
        if ($("#weight-min").val() == "" || $("#weight-max").val() == "") {
            var weight = 0;
        }
        if ($("#size-min").val() == "" || $("#size-max").val() == "") {
            var size = 0;
        }
        if ($("#selling-price-min").val() == "" || $("#selling-price-max").val() == "") {
            var sellingPrice = 0;
        }

        if (DropdownContent) {
            DropdownContent.removeClass("show");
        }
        getSpecifiedItems(true, classification, type, weight, size, sellingPrice);
    });

    $("#table-filter-clear").click(function () {
        $("#filter-type").val("Type");
        $("#filter-classification").val("Classification");
        $("#weight-min").val(0);
        $("#size-min").val(0);
        $("#selling-price-min").val(0);
        $("#weight-max").val("");
        $("#size-max").val("");
        $("#selling-price-max").val("");
        $("#filter-search").val("");
        if (DropdownContent) {
            DropdownContent.removeClass("show");
        }
        getSpecifiedItems(true, 0, 0, 0, 0, 0);
    });

    //hover on image
    $(document).on("mouseover", "#w2ui-image", function (e) {
        // console.log(e.target.src);
        $("#w2ui-enlarged-image").attr("src", e.target.src);
        $("#w2ui-enlarged-image").fadeIn(150);
    });
    //leave hover on image
    $(document).on("mouseleave", "#w2ui-image", function (e) {
        // console.log("leave");
        $("#w2ui-enlarged-image").fadeOut(150);
    });
    //refresh grid when window is resized
    var resizeTimer;
    window.addEventListener(
        "resize",
        function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                w2ui["item-grid"].refresh();
            }, 510);
        },
        { passive: true }
    );
});
