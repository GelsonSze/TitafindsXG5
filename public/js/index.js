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
    /*
    $('#itemGrid').w2grid({
        name   : 'itemGrid',
        show: {
            footer:true,
            toolbar:true,
            lineNumbers:true,
        },
        limit: 50,
        columns: [
            { field: 'code', text: 'Product Code', size: '5%' },
            { field: 'name', text: 'Product Name', size: '5%' },
            { field: 'type', text: 'Type', size: '5%' },
            { field: 'classification', text: 'Classifications', size: '15%' },
            { field: 'size', text: 'Size', size: '5%' },
            { field: 'weight', text: 'Weight', size: '5%' },
            { field: 'quantity', text: 'Quantity', size: '5%' },
            { field: 'sellingPrice', text: 'Selling Price', size: '5%' },
            { field: 'purchasePrice', text: 'Purchase Price', size: '5%' },
            { field: 'status', text: 'Status', size: '10%' },
        ],
    });
    */
    $('#itemGrid').w2grid({
        name   : 'itemGrid',
        columns: [
            { field: 'fname', text: 'First Name', size: '30%' },
            { field: 'lname', text: 'Last Name', size: '30%' },
            { field: 'email', text: 'Email', size: '40%' },
            { field: 'sdate', text: 'Start Date', size: '120px' },
        ],
        records: [
            { recid: 1, fname: 'John', lname: 'Doe', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 2, fname: 'Stuart', lname: 'Motzart', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 3, fname: 'Jin', lname: 'Franson', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 4, fname: 'Susan', lname: 'Ottie', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 5, fname: 'Kelly', lname: 'Silver', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 6, fname: 'Francis', lname: 'Gatos', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 7, fname: 'Mark', lname: 'Welldo', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 8, fname: 'Thomas', lname: 'Bahh', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
            { recid: 9, fname: 'Sergei', lname: 'Rachmaninov', email: 'jdoe@gmail.com', sdate: '4/3/2012' }
        ]
    });

});