$(document).ready(function () {    
    $('#submit').click(function (){

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
});