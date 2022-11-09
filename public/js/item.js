var page_item = null;

function item(image, name, code, type, classification, length, size, weight, quantity, sellingType, purchasePrice, sellingPrice, status) {
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

function getItem() {
    var item_code = window.location.pathname.split("/").pop();
    console.log(item_code)
    $.ajax({
        url:"/getItem",
        type:"GET",
        processData: false,
        contentType: false,
        data:{"code":item_code},
        headers: {
            "Content-Type": "application/json",
        },
        success: function (item) {
            console.log(item)
            page_item = new item(   item.image, item.name, item.code, item.type, item.classification, "", 
                                    item.size, item.weight, item.quantity,"", item.purchasePrice, 
                                    item.sellingPrice,  item.status
                                );
            
        },
    });
}

function item_desc(field, desc) { 
    
    var html = 
    '<div class="item-desc-wrapper">'+
        '<div class="field">'+
            field
        '</div>'+

        '<div class="desc">'+
            desc
        '</div>'+

    '</div>';

    return html;
}

$(document).ready(function(){

    // Loads item for the page.
    getItem();

    console.log("hello")
    console.log(page_item)

})