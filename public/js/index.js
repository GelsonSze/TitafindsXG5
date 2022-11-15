
var Items = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */

function showSidebar(){
    document.getElementById("inner-sidebar").style.display = "block";
    document.getElementById("outer-sidebar").style.display = "none";
}
function hideSidebar(){
    document.getElementById("inner-sidebar").style.display = "none";
    document.getElementById("outer-sidebar").style.display = "block";
}
function getAllItems(refreshGrid = false) {
    $.ajax({
        url: "/getItem",
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
    });

    /* pop-up must be only closed with X button, not by clicking outside */
    $("#popup").popup({
        blur: false,
    });

    /* WILL RENAME SELECTORS ONCE RENAMING OF THE FORM IDS ARE FINISHED*/
    /* clicking on the X button of the popup clears the form */
    $("#popup .popup_close").on("click", function () {
        $("#popup #form")[0].reset();
    });

    $("#popup form .command :reset").on("click", function (e) {
        $("#popup").popup("hide");
    });

    $("#popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        const data = new FormData($("#form")[0]);
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
                    $("#popup").popup("hide");
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
