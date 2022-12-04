Attributes = []
Collections = []

const attribsPage = `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div class="product-attributes-wrapper"> 
            <h2> Edit product Attributes </h2>

            <div id='attribs-content'>
                <div id="attrib-inputs-wrapper">
                    <p> Attribute name </p>
                    <input type="text" class='text-input' id='attrib-name' name="attrib-dets" /> <br />
                    
                    <p> Attribute type </p>
                    <select id="attrib-type" name="attrib-type">
                        <option value="" disabled selected>Select</option>
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    </select>
                </div>
                <div id="attrib-btn-wrapper">
                    <button id="attrib-save">Save</button>
                    <button id="attrib-delete">Delete</button>
                </div>
            </div>

        </div>
    </div>
`;


function addAtrribute(attribID) {
    w2ui["attrib-sidebar"].add('general',{ id: attribID, text: 'Untitled' })

    w2ui["attrib-sidebar"].on('click', function(event) {
        switch (event.target) {
            case attribID:
                w2ui["attrib-grid"].html('main', attribsPage)
                break
        }
    })
}

function getAttribContent(name, type) {

    let options = null;

    if (type == 'String') {
        options =   `  
                        <option value="String" selected>String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    `
    }
    else if (type == 'Boolean') {
        options =   `  
                        <option value="String">String</option>
                        <option value="Boolean" selected>Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    `
    }
    else if (type == 'Number') {
        options =   `  
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number" selected>Number</option>
                        <option value="Collection">Collection</option>
                    `
    }
    else if (type == 'Collection') {
        options =   `  
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection" selected>Collection</option>
                    `
    }
    
    const attribsPage = `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div class="product-attributes-wrapper"> 
            <h2> Edit product Attributes </h2>

            <div id='attribs-content'>
                <div id="attrib-inputs-wrapper">
                    <p> Attribute name </p>
                    <input type="text" class='text-input' id='attrib-name' name="attrib-dets">${name}</input><br />
                    
                    <p> Attribute type </p>
                    <select id="attrib-type" name="attrib-type">`+
                      options
                        +
                    `</select>
                </div>
                <div id="attrib-btn-wrapper">
                    <button id="attrib-save">Save</button>
                    <button id="attrib-delete">Delete</button>
                </div>
            </div>

        </div>
    </div>
    `;

    return attribsPage
}

$(function() {
    // --------------------------------- First table ---------------------------------
    $('#config-attrib-grid').w2layout({
        name: 'attrib-grid',
        padding: 0,
        panels: [
            { type: 'left', size: 200, resizable: true, minSize: 120 },
            { type: 'main', minSize: 550, overflow: 'hidden' }
        ],
    })

    $('#config-attrib-grid-sidebar').w2sidebar({
        name: 'attrib-sidebar',
        nodes: [
            { id: 'general', text: 'General', group: true, expanded: true, nodes: [
                { id: 'html', text: 'Some HTML', icon: 'fa fa-list-alt' }
            ]}
        ],
        onClick(event) {
            switch (event.target) {
                case 'html':
                    w2ui["attrib-grid"].html('main', attribsPage)
                    break
            }
        }
    })

    //let sidebar = new w2ui.w2sidebar(config.sidebar)

    w2ui["attrib-grid"].html('left', w2ui["attrib-sidebar"])


    // --------------------------------- Second Table ---------------------------------
   
    



    // ---- Other Functions ----

    $('#new-attribute').click(function() {
        addAtrribute('AdSGHZXQ')

    })
})