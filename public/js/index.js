var Items = [];

getAllItems();

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
                Items.push(new item(product.image, product.name, product.code, product.type, product.classification, product.size, product.weight, product.quantity, product.sellingPrice, product.purchasePrice, product.status));
            }
            if (refreshGrid) {
                w2ui["itemGrid"].records = Items;
                w2ui["itemGrid"].refresh();
            }
        },
    });
}

function item(image, name, code, type, classification, length, size, weight, quantity, sellingType, purchasePrice, sellingPrice, status) {
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

$(function () {
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
                    var html = '<img id="itemImage" src="img/' + record.image + '" alt="' + record.image + '" style="height: 100px">';
                    return html;
                },
                sortable: true,
            },
            { field: "name", text: "Name", size: "5%", sortable: true },
            { field: "code", text: "Code", size: "5%", sortable: true },
            { field: "type", text: "Type", size: "5%", sortable: true },
            { field: "classification", text: "Classifications", size: "15%", sortable: true },
            { field: "size", text: "Size", size: "5%", sortable: true },
            { field: "weight", text: "Weight", size: "5%", sortable: true },
            { field: "quantity", text: "Quantity", size: "5%", sortable: true },
            { field: "sellingPrice", text: "Selling Price", size: "5%", sortable: true },
            { field: "purchasePrice", text: "Purchase Price", size: "5%", sortable: true },
            { field: "status", text: "Status", size: "10%", sortable: true },
            { 
                field: "edit", 
                size: "5%",
                render: function(record, extra) {
                    var html = '<button type="button" class="table-edit-btn" id="rec-'+record.code+'">Edit</button>' ;
                    return html;
                }
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
    $("#popup .popup_close").on("click", function(){
        $("#popup #form")[0].reset();
    })

    $("#popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        const data = new FormData($("#form")[0]);

        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        $.ajax({
            url: "/addItem",
            data: JSON.stringify({
                name: $("#name").val(),
                code: $("#code").val(),
                description: $("#description").val(),
                type: $("#type").val(),
                brand: $("#brand").val(),
                classification: $("#classification").val(),
                design: $("#design").val(),
                size: $("#size").val(),
                weight: $("#weight").val(),
                quantity: $("#quantity").val(),
                sellingType: $("#sellingType").val(),
                purchasePrice: $("#purchasePrice").val(),
                sellingPrice: $("#sellingPrice").val(),
                status: $("#status").val(),
                dateAdded: new Date(),
                dateUpdated: new Date(),
            }),
            type: "POST",
            processData: false,
            contentType: false,
            headers: {
                "Content-Type": "application/json",
            },

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
    //hover on image
    $(document).on("mouseover", "#itemImage", function (e) {
        console.log(e.target.src);
        $("#hoveredImg").attr("src", e.target.src);
        $("#hoveredImg").css("display", "block");
    });
    //leave hover on image
    $(document).on("mouseleave", "#itemImage", function (e) {
        console.log("leave");
        $("#hoveredImg").css("display", "none");
    });
});
