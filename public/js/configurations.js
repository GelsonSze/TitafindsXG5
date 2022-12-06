let Attributes = [];
let Configs = [];

var curSelectedAttribName = null;
var curSelectedAttribType = null;
var origAttrSize = 0;

var curSelectedTypeName = null;

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
                origAttrSize = Attributes.size;

                Attributes.forEach(function(attr) {
                    addExistingAtrribute(attr);
                });

                curSelectedAttribName = null;
                curSelectedAttribType = null

                w2ui['attrib-grid'].html('main', "")

                // Refreshes attributes at config
                getAllConfigs(true);
                
            }
        },
    });
}

function getAllConfigs(refreshGrid = false) {
    $.ajax({
        url: "/getConfigs",
        type: "GET",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function (item) {
            Configs = [];

            item.forEach(function (config) {
                Configs.push(new typeConfig(config.name, config.specifications));
                console.log('Pushing config')
                console.log(config)
            });

            if (refreshGrid) {
                // Grabs each id of existing ID inside the sidebar and then removes all at once.
                var nd = [];
                for (var i in w2ui['type-sidebar'].nodes) nd.push(w2ui['type-sidebar'].nodes[i].id);
                w2ui['type-sidebar'].remove.apply(w2ui['type-sidebar'], nd);

                Configs.forEach(function(config) {
                    addExistingType(config);
                });

                curSelectedTypeName = null;

                w2ui['type-grid'].html('main', "")
                
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

function typeConfig(name, specifications) {
    return {
        name: name,
        specifications: specifications
    };
}

const attribsPage = `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div id="product-page">
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

            <div class="collections-page">
                <div class="options-info">
                    <h4> Edit Collection </h4>
                    <div class="btn-wrapper">
                        <button id="options-new">New Option</button>
                        <button id="options-delete">Delete Option</button>

                    </div>
                </div>
                <div class="options-page-wrapper">
                    <div id="options-wrapper">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const typePage = `
    <div class="type-page-wrapper">
        <div class="header-color">Attributes</div>
        <div id="type-page">
            <p><b>X</b> contains the following attributes: </p>
            <div id="type-wrapper">
                <div class="checkbox-row">
                    <input type="checkbox" name="classification" value="Classification">Classification
                </div>
                <div class="checkbox-row">    
                    <input type="checkbox" name="size" value="Size/Length">Size/Length
                </div>
                <div class="checkbox-row">
                    <input type="checkbox" name="design" value="Design">Design
                </div>
            </div>
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
                w2ui["attrib-grid"].html("main", getAttribContent(attr.name, attr.dataType, attr.options));
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
function getAttribContent(name, type, collection) {
    let options = null;
    let htmlCollections = "";

    console.log(collection)
    let parsedCollection = collection.toString().split(',')
    console.log(parsedCollection)
    for (var col of parsedCollection) {
        htmlCollections += `<input type="text" class="option-row" value="${col}">`;
    }
    console.log(htmlCollections)

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
        <div id="product-page">
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

            <div class="collections-page">
                <div class="options-info">
                    <h4> Edit Collection </h4>
                    <div class="btn-wrapper">
                        <button id="options-new">New Option</button>
                        <button id="options-delete">Delete Option</button>

                    </div>
                </div>
                <div class="options-page-wrapper">
                    <div id="options-wrapper">`+
                        htmlCollections
                    +`
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

    return attribsPage;
}

function addExistingType(type) {
    console.log("Adding type! Node is: ");
    console.log(type)

    w2ui["type-sidebar"].add({ id:type.name, text: type.name});

    w2ui["type-sidebar"].on("click", function( event) {
        switch (event.target) {
            case type.name:
                w2ui["type-grid"].html("main", getTypeContent(type.name, type.specifications));
                break;
        }
    })
}

function getTypeContent(name, specs) {
    console.log("SPECS")
    console.log(specs)
    let parsedSpecs = specs.toString().split(',')

    let allAttributes = [];
    allAttributes.push({name:"Classification", checked:">"});
    allAttributes.push({name:"Size",           checked:">"});
    allAttributes.push({name:"Design",         checked:">"});

    for (var attr of Attributes) {
        let parsedAttr = {
            name: attr.name,
            checked: ">"
        };

        allAttributes.push(parsedAttr);
    }

    let attrCheck = "";

    // Adds a check on necessary boxes

    for (var spec of parsedSpecs) {
        for (var attr of allAttributes) {
            if (spec== attr.name) {
                attr.checked = "checked>";
                break;
            }
        }
    }

    console.log("ATTRIBS")
    console.log(allAttributes)

    for (var attr of allAttributes) {
        attrCheck += `
            <div class="checkbox-row" id="check-${attr.name}">
                <input class="checkbox-input" type="checkbox" name="${attr.name}" value="${attr.name}"${attr.checked} ${attr.name}
            </div>
        `;
    }

    const typePage = `
    <div class="type-page-wrapper">
        <div class="header-color">Attributes</div>
        <div id="type-page">
            <p><b>${name}</b> contains the following attributes: </p>
            <div id="type-wrapper">
                `+attrCheck+`
            </div>
        </div>
    </div>
    `;

    return typePage;
}


/**
 * Simply disables/enables the collection. This is used when collection is the selected type of
 * attribute, or not in order to disable it. This affects the buttons and input boxes of collection.
 * @param {Boolean} trigger whether to disable or not the collection
 */
function disableCollection(trigger) {
    $("#options-new").prop('disabled', trigger)
    $("#options-delete").prop('disabled', trigger)

    $(".option-row").prop('disabled', trigger)
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
            curSelectedAttribName = event.target;

            switch (event.target) {
                case "html":
                    w2ui["attrib-grid"].html("main", attribsPage);
                    break;
            }

            // Sets current type to this to check before editing.

            if (curSelectedAttribType == 'Collection') {
                disableCollection(false)
            }
            else {
                disableCollection(true)
            }


            
        },
    });

    // Adds a listener to the buttons in #config-attrib-grid
    $("#config-attrib-grid").on("click", "#attrib-save", function (e) {
        e.preventDefault();

        console.log("Saving...");
        var name = $("#attrib-name")[0];
        var type = $("#attrib-type")[0];

        var collection = [];

        $("#options-wrapper").find('input[type=text]').each(function() {
            collection.push($(this).val())
        })

        console.log("COLLECTION ADDED:")
        console.log(collection)

        const data = new FormData($("#attrib-form")[0]);
        data.append('dataType', $('#attrib-type option:selected').val());
        data.append('origName', curSelectedAttribName);
        if (curSelectedAttribType == 'Collection')
            data.append('options', collection );

        console.log(w2ui["attrib-sidebar"].selected);

        for (var pair of data.entries()) {
            console.log(pair[0] + ":" + pair[1]);
        }

        if ( w2ui["attrib-sidebar"].selected == "undefined" ) {
            $.ajax({
                url: "/addAttribute",
                data: JSON.stringify(Object.fromEntries(data)),
                type: "POST",
                processData: false,
                contentType: "application/json; charset=utf-8",
    
                success: async function (foundData) {
                    console.log("success");
                    getAllAttributes(true)
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
                    getAllAttributes(true)
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
        data.append('origName', curSelectedAttribName)

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
                getAllAttributes(true);
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

    // Adds a listener to the dropdown in #config-attrib-grid
    $("#config-attrib-grid").on("change", "#attrib-type", function(e) {
        let changedTo = this.value
        
        if (changedTo == "Collection") {
            disableCollection(false)
        }
        else {
            disableCollection(true)
        }
    })

    // Adds a listener to add an option in collection
    $("#config-attrib-grid").on("click", "#options-new", function(e) {
        var newOption = `<input type="text" class="option-row" value="Sample Option"></input>`
        $("#options-wrapper").append(newOption)
    })

    // Adds a listener to remove the option in collection
    $("#config-attrib-grid").on("click", "#options-delete", function(e) {
        if ($("#options-wrapper").children().length > 0) {
            $("#options-wrapper input:last-child").remove()
        }
    })

    w2ui["attrib-grid"].html("left", w2ui["attrib-sidebar"]);

    getAllAttributes(true);

    // --------------------------------- Second Table ---------------------------------

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
            curSelectedTypeName = event.target;

            switch (event.target) {
                case "html":
                    w2ui["type-grid"].html("main", typePage);
                    break;
            }
        },
    });

    // Adds change listener on checkboxes
    $("#config-type-grid").on("change", ".checkbox-input", function(e) {
        console.log('Changed checkbox!')

        let typeName = $(this).parent().attr('id');
        let checked = $(this).checked;

        typeName = typeName.split('-')[1];
        // Format of ID is check-VARIABLENAME

        console.log(typeName)
        console.log(curSelectedTypeName)

        let configIndex = 0;

        for(var type of Configs)  {
            if (type.name == curSelectedTypeName) {
                console.log('its real')
                console.log(type.name)
                console.log(configIndex)

                let parsedSpecs = type.specifications.toString().split(",")

                var indexItem = parsedSpecs.indexOf(typeName)
                console.log(indexItem)

                // If index exists
                if (indexItem > -1) {
                    $(this).attr('checked', false); 
                    parsedSpecs = parsedSpecs.slice(indexItem, 1)
                    if (parsedSpecs.size > 1)
                        parsedSpecs = [parsedSpecs.join(',')]

                    // Update specs
                    Configs[configIndex].specifications = parsedSpecs 

                } else {
                    $(this).attr('checked', true);
                    parsedSpecs.push(typeName)

                    if (parsedSpecs.size > 1)
                        parsedSpecs = [parsedSpecs.join(',')]

                    // Update specs
                    Configs[configIndex].specifications = parsedSpecs 
                }

                break;
            }
            configIndex++;
        }
        
    })

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

/**
 * This is only for getting the initial types
 */
function postInitialTypes() {
    
    let data = {
        name: "Necklace"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });

    data = {
        name: "Chain"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });

    data = {
        name: "Pendant"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });

    data = {
        name: "Ring"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });

    data = {
        name: "Bracelet"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });

    data = {
        name: "Earrings"
    }

    $.ajax({
        url: "/addConfig",
        data: JSON.stringify(data),
        type: "POST",
        processData: false,
        contentType: "application/json; charset=utf-8",

        success: async function (foundData) {
            console.log("success");
        }
    });
}