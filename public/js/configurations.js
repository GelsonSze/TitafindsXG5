const attribsPage = `

    <div class="product-attributes-wrapper"> 
        <h2> Edit product Attributes </h2>

        <div>
            <label for="attrib-name"> Attribute name </label> <br />
            <input type="text" name="attrib-name" /> <br />
            
            <label for="attrib-type"> Attribute type </label> <br />
            <input type="text" name="attrib-type" /> <br />

            <p>Required</p>
            <label for="attrib-required-yes"> Yes </label>
            <input type="radio" id="attrib-required-yes" name="attrib-required"/>

            <label for="attrib-required-no"> No </label>
            <input type="radio" id="attrib-required-no" name="attrib-required" />
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