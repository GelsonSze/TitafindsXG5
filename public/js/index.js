$(function () {   

    $('#submit').trigger("click",function (){

        //will add try catch after the ui has been finalized
        //assume all inputs are valid
        var addedItem = {
            id:  $('#itemForm #prodID').val(),
            image: 'test.png',
            name: $('#itemForm #productName').val(),
            type: $('#itemForm #productType').val(),
            brand: $('#itemForm #productBrand').val(),
            classification: $('#itemForm #prodClassification').val(),
            design: $('#itemForm #prodDesign').val(),
            size:  $('#itemForm #prodSize').val(),
            weight:  $('#itemForm #prodWeight').val(),
            quantity:  $('#itemForm #prodQuantity').val(),
            sellingType: $('#itemForm #sellingtype').val(),
            purchasePrice:  $('#itemForm #purchasePrice').val(),
            sellingPrice:  $('#itemForm #sellingPrice').val(),
            status:  $('#itemForm #prodStatus').val(),
            productCode: $('#itemForm #productCode').val(),
            isAdmin: $('#itemForm #isAdmin').val()
        }

        $.post('/addItem', {addedItem: addedItem}, function(flag){
            if(!flag){
            }
        })

    })
    
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