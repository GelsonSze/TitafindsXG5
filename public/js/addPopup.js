$(function () {
    $("#add-popup").popup({
        blur: false,
        transition: "all 0.3s",
        onclose: function () {
            $("#add-popup #add-form")[0].reset();
            $("#image-preview").attr("src", "/img/product-images/default.png");
        },
    });

    $("#add-popup form .command :reset").on("click", function (e) {
        $("#add-popup").popup("hide");
    });

    $(".remove-image").on("click", function () {
        $("#image-preview").attr("src", `../img/product-images/default.png`);
        $("#image").val("");
    });

    $("#add-popup form .command :submit").on("click", function (e) {
        e.preventDefault();

        var name = $("#add-popup #name")[0];
        var code = $("#add-popup #code")[0];
        var type = $("#add-popup #type")[0];
        var sellingType = $("#add-popup #selling-type")[0];
        var weight = $("#add-popup #weight")[0]; // required if selling type is per gram
        var available = $("#add-popup #available")[0];
        var error = $("#add-popup .text-error")[0];

        let fields = [name, code, type, sellingType, available];
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
            showError(error, "Please fill out all the fields", emptyFields);
            return;
        }

        const data = new FormData($("#add-form")[0]);
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
                $("#image-preview").attr("src", "/img/product-images/default.png");

                SnackBar({
                    message: "Item added successfully",
                    status: "success",
                    position: "br",
                    timeout: 5000,
                    fixed: true,
                });
            },

            error: async function (jqXHR, textStatus, errorThrown) {
                message = jqXHR.responseJSON.message;
                fields = jqXHR.responseJSON.fields;

                if (fields) {
                    fields.forEach(async function (field) {
                        emptyFields.push($(`#${field}`)[0]);
                    });

                    showError(error, message, emptyFields);
                }
            },
        });
    });

    //on change of image
    $("#image").on("change", function () {
        try {
            if (this.files[0]) {
                //console.log(this.files[
                if (this.files[0].type.match(/image.(jpg|png|jpeg)/)) {
                    if (this.files[0].size <= 1024 * 1024 * 5) {
                        //add in here validation for size
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $("#image-preview").attr("src", e.target.result);
                        };
                        reader.readAsDataURL(this.files[0]);
                    } else {
                        $("#add-popup #image").val("");
                        showError($("#add-popup .text-error")[0], "Image file exceeds 5mb", [
                            $("#image-preview")[0],
                        ]);
                    }
                } else {
                    $("#add-popup #image").val("");
                    showError($("#add-popup .text-error")[0], "Please select an image file", [
                        $("#image-preview")[0],
                    ]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
});
