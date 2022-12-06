let Attributes = [];
let Collections = [];

var curSelectedAttrib = null;

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllAttributes(refreshGrid = false) {
    $.ajax({
        url: "/getAttributes",
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (item) {
            Attributes = [];

            item.forEach(function (attr) {
                Attributes.push(new attribute(attr.name, attr.dataType, attr.options));
                console.log('Pushing attribute')
                console.log(attr)
            });

            if (refreshGrid) {
                // Grabs each id of existing ID inside the sidebar and then removes all at once.
                var nd = [];
                for (var i in w2ui['attrib-sidebar'].nodes) nd.push(w2ui['attrib-sidebar'].nodes[i].id);
                w2ui['attrib-sidebar'].remove.apply(w2ui['attrib-sidebar'], nd);

                Attributes.forEach(function(attr) {
                    addExistingAtrribute(attr);
                });
            }
        },
    });
}

function attribute(name, dataType, options) {
    return {
        name: name,
        dataType: dataType,
        options: options,
    };
}

const attribsPage = `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div class="product-attributes-wrapper"> 
            <h2> Edit product Attributes </h2>

            <div id='attribs-content'>
                <form id="attrib-form">
                    <div id="attrib-inputs-wrapper">
                        <p> Attribute name </p>
                        <input type="text" class='text-input' id='attrib-name' name="name" /> <br />
                        
                        <p> Attribute type </p>
                        <select id="attrib-type" name="dataType">
                            <option value="" disabled selected>Select</option>
                            <option value="String">String</option>
                            <option value="Boolean">Boolean</option>
                            <option value="Number">Number</option>
                            <option value="Collection">Collection</option>
                        </select>
                    </div>
                    <div id="attrib-btn-wrapper">
                        <button type='submit' id="attrib-save">Save</button>
                        <button type='button' id="attrib-delete">Delete</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
`;

const optionsPage = `
    <div class="options-page-wrapper">
        <div class="header-color">Option</div>
        <div id="options-wrapper">
            <button class="option-row">Sample Option</button>
        </div>
    </div>
`;

const typePage = `
    <div class="type-page-wrapper">
        <p>X contains the following attributes: </p>
        <div id="type-wrapper">
            <input type="checkbox" name="option1" value="option1">
        </div>
    </div>
`;

/**
 * Adds an attribute to the sidebar with default settings.
 * @param {String} attribID ID to base off of when calling in w2ui
 */
function addAtrribute(attribID) {
    w2ui["attrib-sidebar"].add({ id: attribID, text: "Untitled" });

    w2ui["attrib-sidebar"].on("click", function (event) {
        switch (event.target) {
            case attribID:
                w2ui["attrib-grid"].html("main", attribsPage);
                break;
        }
    });
}

/**
 * Adds an attribute to the sidebar with existing settings.
 * @param {Object} attr object to base off of when calling in w2ui
 */
function addExistingAtrribute(attr) {
    console.log("Adding! Node is: ");
    console.log(attr)
    w2ui["attrib-sidebar"].add({ id: attr.name, text: attr.name });

    w2ui["attrib-sidebar"].on("click", function (event) {
        switch (event.target) {
            case attr.name:
                w2ui["attrib-grid"].html("main", getAttribContent(attr.name, attr.dataType));
                break;
        }
    });
}

/**
 * A page template for existing attributes upon adding.
 * @param {String} name is name of attribute
 * @param {String} type is based off of [String, Boolean, Number, Collection]
 * @returns
 */
function getAttribContent(name, type) {
    let options = null;

    if (type == "String") {
        options = `  
                        <option value="String" selected>String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    `;
    } else if (type == "Boolean") {
        options = `  
                        <option value="String">String</option>
                        <option value="Boolean" selected>Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    `;
    } else if (type == "Number") {
        options = `  
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number" selected>Number</option>
                        <option value="Collection">Collection</option>
                    `;
    } else if (type == "Collection") {
        options = `  
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection" selected>Collection</option>
                    `;
    }

    const attribsPage =
        `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div class="product-attributes-wrapper"> 
            <h2> Edit product Attributes </h2>

            <div id='attribs-content'>
                <form id="attrib-form">
                    <div id="attrib-inputs-wrapper">
                        <p> Attribute name </p>
                        <input type="text" class='text-input' id='attrib-name' name="name" value="${name}"/> <br />
                        
                        <p> Attribute type </p>
                        <select id="attrib-type" name="dataType">
                           ` +
        options +
        ` 
                        </select>
                    </div>
                    <div id="attrib-btn-wrapper">
                        <button type='submit' id="attrib-save">Save</button>
                        <button type='button' id="attrib-delete">Delete</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
`;

    return attribsPage;
}

$(function () {
    // --------------------------------- First table ---------------------------------
    $("#config-attrib-grid").w2layout({
        name: "attrib-grid",
        padding: 0,
        panels: [
            { type: "left", size: 200, resizable: true, minSize: 120 },
            { type: "main", minSize: 550, overflow: "hidden" },
        ],
    });

    $("#config-attrib-grid-sidebar").w2sidebar({
        name: "attrib-sidebar",
        nodes: [
            {
                id: "general",
                text: "General",
                group: true,
                expanded: true,
                nodes: [{ id: "html", text: "Some HTML" }],
            },
        ],
        topHTML: '<div class="sidebar-top">Attributes</div>',
        onClick(event) {
            // Sets the selected attrib to this name
            curSelectedAttrib = event.target;

            switch (event.target) {
                case "html":
                    w2ui["attrib-grid"].html("main", attribsPage);
                    break;
            }
        },
    });

    // Adds a listener to the buttons in #config-attrib-grid
    $("#config-attrib-grid").on("click", "#attrib-save", function (e) {
        e.preventDefault();

        console.log("Saving...");
        var name = $("#attrib-name")[0];
        var type = $("#attrib-type")[0];

        const data = new FormData($("#attrib-form")[0]);
        data.append('dataType', $('#attrib-type option:selected').val())
        data.append('origName', curSelectedAttrib)

        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        if ( $('#attrib-name').val() == curSelectedAttrib) {
            $.ajax({
                url: "/addAttribute",
                data: JSON.stringify(Object.fromEntries(data)),
                type: "POST",
                processData: false,
                contentType: "application/json; charset=utf-8",
    
                success: async function (foundData) {
                    console.log("success");
                },
    
                // error: async function (jqXHR, textStatus, errorThrown) {
                //     message = jqXHR.responseJSON.message;
                //     fields = jqXHR.responseJSON.fields;
    
                //     if (fields) {
                //         fields.forEach(async function (field) {
                //             emptyFields.push($(`#${field}`)[0]);
                //         });
    
                //         showError(error, message, emptyFields);
                //     }
                // },
            });
        }
        else {
            $.ajax({
                url: "/editAttribute",
                data: JSON.stringify(Object.fromEntries(data)),
                type: "PUT",
                processData: false,
                contentType: "application/json; charset=utf-8",
    
                success: async function (foundData) {
                    console.log("success edit!");
                },
    
                // error: async function (jqXHR, textStatus, errorThrown) {
                //     message = jqXHR.responseJSON.message;
                //     fields = jqXHR.responseJSON.fields;
    
                //     if (fields) {
                //         fields.forEach(async function (field) {
                //             emptyFields.push($(`#${field}`)[0]);
                //         });
    
                //         showError(error, message, emptyFields);
                //     }
                // },
            });
        }
        
        return false;
    });

    // Adds a listener to the buttons in #config-attrib-grid
    $("#config-attrib-grid").on("click", "#attrib-delete", function (e) {
        e.preventDefault();

        const data = new FormData($("#attrib-form")[0]);
        data.append('dataType', $('#attrib-type option:selected').val())

        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }
        $.ajax({
            url: "/deleteAttribute",
            data: JSON.stringify(Object.fromEntries(data)),
            type: "DELETE",
            processData: false,
            contentType: "application/json; charset=utf-8",

            success: async function (foundData) {
                console.log("successfully deleted!");
            },

            // error: async function (jqXHR, textStatus, errorThrown) {
            //     message = jqXHR.responseJSON.message;
            //     fields = jqXHR.responseJSON.fields;

            //     if (fields) {
            //         fields.forEach(async function (field) {
            //             emptyFields.push($(`#${field}`)[0]);
            //         });

            //         showError(error, message, emptyFields);
            //     }
            // },
        });
        return false;
    });

    w2ui["attrib-grid"].html("left", w2ui["attrib-sidebar"]);

    getAllAttributes(true);

    // --------------------------------- Second Table ---------------------------------

    $("#config-options-grid").w2layout({
        name: "options-grid",
        padding: 0,
        panels: [
            { type: "left", size: 200, resizable: true, minSize: 120 },
            { type: "main", minSize: 550, overflow: "hidden" },
        ],
    });

    $("#config-options-grid-sidebar").w2sidebar({
        name: "options-sidebar",
        nodes: [
            {
                id: "general",
                text: "General",
                group: true,
                expanded: true,
                nodes: [{ id: "html", text: "Sample" }],
            },
        ],
        topHTML: '<div class="sidebar-top">Collection</div>',
        onClick(event) {
            switch (event.target) {
                case "html":
                    w2ui["options-grid"].html("main", optionsPage);
                    break;
            }
        },
    });

    w2ui["options-grid"].html("left", w2ui["options-sidebar"]);

    // --------------------------------- Third Table ---------------------------------

    $("#config-type-grid").w2layout({
        name: "type-grid",
        padding: 0,
        panels: [
            { type: "left", size: 200, resizable: true, minSize: 120 },
            { type: "main", minSize: 550, overflow: "hidden" },
        ],
    });

    $("#config-type-grid-sidebar").w2sidebar({
        name: "type-sidebar",
        nodes: [
            {
                id: "general",
                text: "General",
                group: true,
                expanded: true,
                nodes: [{ id: "html", text: "Some HTML" }],
            },
        ],
        topHTML: '<div class="sidebar-top">Type</div>',
        onClick(event) {
            switch (event.target) {
                case "html":
                    w2ui["type-grid"].html("main", typePage);
                    break;
            }
        },
    });

    w2ui["type-grid"].html("left", w2ui["type-sidebar"]);

    // ---- Other Functions ----

    /**
     * Upon clicking new attribute, creates a new attribute with ID based on the cur index
     * Adds the attribute to sidebar and pushes the ID to the Attributes array.
     */
    $("#new-attribute").click(function () {
        let num = Attributes.size;
        let attribID = String(num);
        addAtrribute(attribID);
        Attributes.push(attribID);
    });
});
