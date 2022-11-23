var page_item = null;

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
 * Requests item from database. Currently feeds it to the Item object so it's not dynamic yet.
 * It will then append it to the fileds-table to display all the attributes.
 */
function getItem() {
    var item_code = window.location.pathname.split("/").pop();
    $.ajax({
        url:"/getItem?code="+item_code,
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

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];

            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

$(document).ready(function(){

    // Loads item for the page.
    getItem();

    $("#edit-popup").popup({
        blur: false,
    });

    $("#edit-popup .edit-popup_close").on("click", function (e) {
    });

    $("#edit-popup form .command :reset").on("click", function (e) {
    });

    $("#edit-popup form .command :submit").on("click", function (e) {
        e.preventDefault();
    });

    /* clicking on the X button of the popup clears the form */
/*
    $("#edit-popup .edit-popup_close").on("click", function () {
        $("#edit-popup #edit-form")[0].reset();
        $("#image-preview").attr("src", "/img/test.png");
    });

    $("#edit-popup form .command :reset").on("click", function (e) {
        $("#edit-popup #edit-form")[0].reset();
        $("#image-preview").attr("src", "/img/test.png");
        $("#edit-popup").popup("hide");
    });

    $("#edit-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var name = $("#edit-popup #name")[0];
        var code = $("#edit-popup #code")[0];
        var type = $("#edit-popup #type")[0];
        var sellingType = $("#edit-popup #selling-type")[0];
        var weight = $("#edit-popup #weight")[0]; // required if selling type is per gram
        var quantity = $("#edit-popup #quantity")[0];
        var error = $("#edit-popup .text-error")[0];

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

        const data = new FormData($("#edit-form")[0]);
        data.append("dateAdded", new Date());
        data.append("dateUpdated", new Date());

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

            success: async function (foundData) {
                console.log("success");
                Items = [];
                getAllItems(true);
                console.log("reloaded");
                $("#add-popup #add-form")[0].reset();
                $("#add-popup").popup("hide");
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
    }); */

})