var page_item = null;
var Transactions = [];

/**
 * Constructor for the item file
 */
function Item(image, name, code, type, classification, length, size, weight, quantity, sellingType, purchasePrice, sellingPrice, status) {
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
 * Constructor for transaction file
 */
function transaction( date, type, desc,
    quantity, sellingPrice, transactedBy) 
{
    return {
    recid: Transactions.length + 1,
    date: date,
    type: type,
    description: desc,
    quantity: quantity,
    sellingPrice: sellingPrice,
    transactedBy: transactedBy
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
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
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
 function getLastFiveTransactions(refreshGrid = false) {
    var itemCode = window.location.pathname.split("/").pop()

    $("#itemGrid").w2grid({
        name: "itemGrid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 60,
        columns: [
            { field: "date",         text: "Date",          size: "35%", sortable: true },
            { field: "type",         text: "Type",          size: "5%", sortable: true },
            { field: "description",  text: "Description",   size: "40%", sortable: true },
            { field: "quantity",     text: "Quantity",      size: "3%", sortable: true },
            { field: "sellingPrice", text: "Selling Price", size: "6%", sortable: true},
            { field: "transactedBy", text: "Transacted By", size: "7%", sortable: true },
        ],
        records: Transactions,
        onDblClick: function(recid) {
            // Redirects to item page

            var record = w2ui["itemGrid"].get(recid.recid);
            
            // Grabs the last string in description. This is the code.
            var code = record.description.split(" ").pop()

            window.location.href = "/item/"+code;
        },
    });



    $.ajax({
        url: `/getXTransactions=${itemCode}&${5}`,
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (items) {
            Transactions = [];
            console.log(items)
            var dfd = $.Deferred().resolve();

            items.forEach(function(trans) {
                dfd = dfd.then(function() {
                    return pushTransaction(trans)
                })
            })

            dfd.done(function() {
                console.log('yay!')
                if (refreshGrid) {
                    w2ui["itemGrid"].records = Transactions.reverse();
                    w2ui["itemGrid"].refresh();
                }
            })
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
        url:"/getItem="+item_code,
        type:"GET",
        processData: false,
        contentType: false,
        data:{"code":item_code},
        headers: {
            "Content-Type": "application/json",
        },
        success: function (item) {
            // Note from Erik: length is undefined ata sa database hence it being an outlier with system colors
            page_item = new Item(   item.image, item.name, item.code, item.type, item.classification, item.length, 
                                    item.size, item.weight, item.quantity, item.sellingType, item.purchasePrice, 
                                    item.sellingPrice,  item.status
                                );

            var num_keys = Object.keys(page_item).length

            var fields = $.map(page_item, function(value, key) {return key;})
            var values = $.map(page_item, function(value, key) {return value;})
            
            // Changes image source of img element into the item image
            $("#left-wrapper img").attr("src",`../img/${item.image}`);

            // Appends a field into the #fields-table
            for (var i = 0; i < num_keys; i++) 
            {
                $('#fields-table').append(itemDesc(fields[i], values[i]))
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
    
    `
    
    return html;
}

$(document).ready(function(){

    // Loads item for the page.
    getItem();
    getLastFiveTransactions(true);

})