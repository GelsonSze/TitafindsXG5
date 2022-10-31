$(document).ready(function () {   
    var Items = []
    $.ajax({
        url: "/getItem",
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (data) {
            let items = JSON.parse(data);
            for(var item of items){
                Items.push(new item(
                    item.name,
                    item.type,
                    item.brand,
                    item.classification,
                    item.design,
                    item.size,
                    item.weight,
                    item.quantity,
                    item.sellingType,
                    item.purchasePrice,
                    item.sellingPrice,
                    item.status,
                ));
            }
        },
    });
    
    function item(name, type, brand, classification, design, size, weight, quantity, sellingType, purchasePrice, sellingPrice, status){
        return {
            name: name,
            type: type,
            brand: brand,
            classification: classification,
            design: design,
            size: size,
            weight: weight,
            quantity: quantity,
            sellingType: sellingType,
            purchasePrice: purchasePrice,
            sellingPrice: sellingPrice,
            status: status,
        }
    }
    $('#itemGrid').w2grid({
        name   : 'itemGrid',
        show: {
            footer:true,
            toolbar:true,
            lineNumbers:true,
        },
        method: 'GET',
        limit: 50,
        columns: [
            { field: 'code', text: 'Product Code', size: '5%', sortable: true},
            { field: 'name', text: 'Product Name', size: '5%', sortable: true },
            { field: 'type', text: 'Type', size: '5%', sortable: true },
            { field: 'classification', text: 'Classifications', size: '15%', sortable: true},
            { field: 'size', text: 'Size', size: '5%', sortable: true},
            { field: 'weight', text: 'Weight', size: '5%', sortable: true},
            { field: 'quantity', text: 'Quantity', size: '5%', sortable: true},
            { field: 'sellingPrice', text: 'Selling Price', size: '5%', sortable: true},
            { field: 'purchasePrice', text: 'Purchase Price', size: '5%', sortable: true},
            { field: 'status', text: 'Status', size: '10%', sortable: true},
        ], 
        records: Items,
    });
    res.redirect('/');
});