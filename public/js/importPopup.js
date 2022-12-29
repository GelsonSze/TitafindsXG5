$(function () {
    $("#import-options-popup").popup({
        blur: false,
        transition: "all 0.3s",
    });

    $("#import-results-popup").popup({
        blur: false,
        transition: "all 0.3s",
    });

    $("#download-template").click(function () {
        window.location.href = "files/Template.csv";
    });

    $("#import-csv").on("change", function () {
        try {
            var progressBar = $("#import-loading");
            if (this.files[0]) {
                console.log(this.files[0]);
                var filename = this.files[0].name;
                var ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
                console.log($`ext is ${ext}`);
                if (ext == ".csv") {
                    progressBar.fadeIn(100);
                    progressBar[0].value = 0;

                    try {
                        progressBar[0].value = 50;
                        parseCSV(this.files[0]); // Parse csv file
                    } catch (e) {
                        console.log(e);
                    }

                    progressBar[0].value = 100;
                    progressBar.fadeOut(100);

                    //remove files from input
                    $("#import-csv").val("");
                } else {
                    console.log("Not a csv file.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    function parseCSV(file) {
        var jsonData = [];
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {
            var headers = [];
            var rows = e.target.result.replace("ï»¿", "").split("\n");
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].split(",");
                var rowData = {};
                for (var j = 0; j < cells.length; j++) {
                    if (i == 0) {
                        var headerName = cells[j].trim().replaceAll(" ", "");
                        headers.push(headerName);
                    } else {
                        var key = headers[j];
                        var value = cells[j].trim();
                        if (value == "null" || value == "") {
                            value == null;
                        }
                        if (key) {
                            rowData[key] = value;
                        }
                    }
                }
                if (i != 0) {
                    jsonData.push(rowData);
                }
            }

            var data = {};
            data["dateAdded"] = new Date();
            data["dateUpdated"] = new Date();
            var itemList = JSON.stringify(jsonData, null, 0);
            data["itemList"] = itemList;
            console.log(data);
            $.ajax({
                url: "/importFromCSV",
                data: JSON.stringify(data, null, 0),
                type: "POST",
                processData: false,
                contentType: "application/json; charset=UTF-8",

                success: async function (data) {
                    getAllItems(true);
                    $("#import-options-popup").popup("hide");
                    $("#import-results-popup").popup("show");
                    let errorhtml = "<br>";
                    let successhtml = "<br>";
                    data.errors.forEach(function (error) {
                        //error line + 2 to match the number in the csv
                        errorhtml = errorhtml.concat(
                            `<p> Error line ${error.line + 2} : ${error.message} </p> <br>`
                        );
                    });
                    successhtml = successhtml.concat(
                        `<p> Number of successful imports: ${data.success.length}`
                    );
                    $("#import-results-popup #error-span").html(errorhtml);
                    $("#import-results-popup #success-span").html(successhtml);
                },
            });
        };
    }

    // Drag over
    $("#import-options-popup_wrapper").on("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    var counter = 0;
    // Drag enter
    $("#import-options-popup_wrapper").on("dragenter", function (e) {
        e.stopPropagation();
        e.preventDefault();
        counter++;
        $("#import-options-form").css("opacity", "0.5");
        $("#import-options-popup .drag-drop-text").fadeIn(100);
    });
    // Drop
    $("#import-options-popup_wrapper").on("drop", function (e) {
        e.stopPropagation();
        e.preventDefault();

        $("#import-csv").prop("files", e.originalEvent.dataTransfer.files);
        $("#import-csv").trigger("change");

        if ($("#import-options-popup .drag-drop-text").is(":visible")) {
            $("#import-options-form").css("opacity", "1");
            $("#import-options-popup .drag-drop-text").fadeOut(100);
        }
    });
    // Drag leave
    $("#import-options-popup_wrapper").on("dragleave", function (e) {
        e.stopPropagation();
        e.preventDefault();
        counter--;
        if (counter == 0) {
            $("#import-options-form").css("opacity", "1");
            $("#import-options-popup .drag-drop-text").fadeOut(100);
        }
    });

    // Shortcuts for "Shift+Alt+I" key
    $(window).keydown(function (e) {
        if (e.shiftKey && e.altKey) {
            if (e.which == "73") {
                e.preventDefault();
                // If .popup_wrapper_visible is present anywhere in the document, then return
                if ($(".popup_wrapper_visible").length) return;

                // Show the "Import Options" popup
                $("#import-options-popup").popup("show");
            }
        } else if (e.which == "27" && counter > 0) {
            e.preventDefault();
            // Cancel the file drag and drop
            $("#import-options-form").css("opacity", "1");
            $("#import-options-popup .drag-drop-text").fadeOut(100);
            counter = 0;
        }
    });
});
