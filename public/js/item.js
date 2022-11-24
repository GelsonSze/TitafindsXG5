var page_item = null;

/**
 * Constructor for the item file
 */
function Item(
    image,
    name,
    code,
    type,
    classification,
    length,
    size,
    weight,
    quantity,
    sellingType,
    purchasePrice,
    sellingPrice,
    status
) {
    return {
        image: image,
        name: name,
        code: code,
        type: type,
        classification: classification,
        length: length,
        size: size,
        weight: weight,
        quantity: quantity,
        sellingType: sellingType,
        purchasePrice: purchasePrice,
        sellingPrice: sellingPrice,
        status: status,
    };
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
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (item) {
            // Note from Erik: length is undefined ata sa database hence it being an outlier with system colors
            page_item = new Item(
                item.image,
                item.name,
                item.code,
                item.type,
                item.classification,
                item.length,
                item.size,
                item.weight,
                item.quantity,
                item.sellingType,
                item.purchasePrice,
                item.sellingPrice,
                item.status
            );

            var num_keys = Object.keys(page_item).length;

            var fields = $.map(page_item, function (value, key) {
                return key;
            });
            var values = $.map(page_item, function (value, key) {
                return value;
            });

            // Appends a field into the #fields-table
            for (var i = 0; i < num_keys; i++) {
                $("#fields-table").append(itemDesc(fields[i], values[i]));
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

$(function () {
    // Loads item for the page.
    getItem();
});
