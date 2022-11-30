const attribsPage = `
    <div class="attrib-page-wrapper">
        <div class="header-color">Settings</div>
        <div class="product-attributes-wrapper"> 
            <h2> Edit product Attributes </h2>

            <div id='attribs-content'>
                <div id="attrib-inputs-wrapper">
                    <label for="attrib-name"> Attribute name </label> <br />
                    <input type="text" class='text-input' id='attrib-name' name="attrib-dets" /> <br />
                    
                    <label for="attrib-type"> Attribute type </label> <br />
                    <select id="attrib-type" name="attrib-type">
                        <option value="" disabled selected>Select</option>
                        <option value="String">String</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Number">Number</option>
                        <option value="Collection">Collection</option>
                    </select>
                </div>

                <div id="attrib-radio-wrapper">
                    <p>Required</p>
                    <label for="attrib-required-yes"> Yes </label>
                    <input type="radio" id="attrib-required-yes" name="attrib-required"/>

                    <label for="attrib-required-no"> No </label>
                    <input type="radio" id="attrib-required-no" name="attrib-required" />
                </div>

                <div id="attrib-btn-wrapper">
                    <button id="attrib-save">Save</button>
                    <button id="attrib-delete">Delete</button>
                </div>
            </div>

        </div>
    </div>
`;


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
                    query(layout.el('main'))
                        .removeClass('w2ui-grid')
                        .css({
                            'border-left': '1px solid #efefef'
                        })
                    break
            }
        }
    })

    //let sidebar = new w2ui.w2sidebar(config.sidebar)

    w2ui["attrib-grid"].html('left', w2ui["attrib-sidebar"])


    // --------------------------------- Second Table ---------------------------------
    
})