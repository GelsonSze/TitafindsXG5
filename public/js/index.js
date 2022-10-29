$(function () {   

    $('#itemGrid').w2grid({
        name   : 'itemGrid',
        show: {
            footer:true,
            toolbar:true,
            lineNumbers:true,
        },
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
        
    });
});