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
                setTimeout(() => {
                    w2ui["itemGrid"].records = Items;
                    w2ui["itemGrid"].refresh();
                }, 1000);
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

function getSpecifiedItems(refreshGrid = false, classification, type, status, weight, size) {
    /*Records it as 0 if the user did not select a category*/
    var Specified = [];
    var check = $("#filter-search").val().toLowerCase();

    /*Process gets all items given a specific condition, which is if the item has the following category. The ==0 condition
    is only for the instances where the category was not changed.*/
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
                if (
                    ((product.type == $("#dropdown-type-select").text() || type == 0) &&
                        (product.classification == $("#dropdown-classification-select").text() ||
                            classification == 0) &&
                        (product.status == $("#dropdown-status-select").text() || status == 0) &&
                        ((product.weight >= $("#weight-min").val() &&
                            product.weight <= $("#weight-max").val()) ||
                            weight == 0) &&
                        ((product.size >= $("#size-min").val() &&
                            product.size <= $("#size-max").val()) ||
                            size == 0) &&
                        (product.name.toLowerCase().search(check) != -1 ||
                            product.code.toLowerCase().search(check) != -1)) ||
                    check == ""
                ) {
                    Specified.push(
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
                w2ui["itemGrid"].clear();
                w2ui["itemGrid"].records = Specified;
                w2ui["itemGrid"].refresh();
            }
        },
    });
}
// On document ready
$(function () {
    $("#weight-min").val(0);
    $("#size-min").val(0);
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
        onDblClick: function (recid) {
            // Redirects to item page

            var record = w2ui["itemGrid"].get(recid.recid);
            //console.log(record)

            window.location.href = "/item/" + record.code;
        },
    });

    /* pop-up must be only closed with X button, not by clicking outside */
    $("#popup").popup({
        blur: false,
    });

    /* clicking on the X button of the popup clears the form */
    $("#popup .popup_close").on("click", function () {
        $("#popup #form")[0].reset();
        $("#image-preview").attr("src", "/img/test.png");
    });

    $("#popup form .command :reset").on("click", function (e) {
        $("#popup").popup("hide");
        $("#image-preview").attr("src", "/img/test.png");
    });

    $("#popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var name = $("#name")[0];
        var code = $("#code")[0];
        var type = $("#type")[0];
        var sellingType = $("#selling-type")[0];
        var weight = $("#weight")[0]; // required if selling type is per gram
        var quantity = $("#quantity")[0];
        var error = $(".text-error")[0];

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

        const data = new FormData($("#form")[0]);
        data.append("dateAdded", new Date());
        data.append("dateUpdated", new Date());

        const trans_data = {
            date: new Date(),
            type: "Added",
            name: $("#name").val(),
            desc: "Item added " + $("#code").val(),
            qty: parseInt($("#quantity").val()),
            sellingPrice: parseInt($("#selling-price").val()),
            transactedBy: "Someone",
        };

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

            success: async function (data) {
                if (data) {
                    console.log("success");

                    // Adds record to transactions
                    // $.ajax({
                    //     url: "/addTransaction",
                    //     data: trans_data,
                    //     type: "POST",
                    //     success: async function (data) {
                    //         console.log("New transaction added");
                    //     },
                    // });

                    Items = [];
                    getAllItems(true);
                    console.log("reloaded");
                    $("#popup").popup("hide");

                    // Reset form after successful submit
                    $("#popup #form")[0].reset();
                }
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
            if (this.files[0].type.match(/image.(jpg|png|jpeg)/)) {
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

    $("#table-filter-apply").click(function () {
        if ($("#dropdown-type-select").text() == "Type") {
            var type = 0;
        }
        if ($("#dropdown-classification-select").text() == "Classification") {
            var classification = 0;
        }
        if ($("#dropdown-status-select").text() == "Status") {
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
        $("#size-min").val("");
        $("#filter-search").val("");
        getSpecifiedItems(true, 0, 0, 0, 0, 0);
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
