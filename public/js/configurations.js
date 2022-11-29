let config = {
    layout: {
        name: 'layout',
        padding: 0,
        panels: [
            { type: 'left', size: 200, resizable: true, minSize: 120 },
            { type: 'main', minSize: 550, overflow: 'hidden' }
        ]
    },
    sidebar: {
        name: 'sidebar',
        nodes: [
            { id: 'general', text: 'General', group: true, expanded: true, nodes: [
                { id: 'html', text: 'Some HTML', icon: 'fa fa-list-alt' }
            ]}
        ],
        onClick(event) {
            switch (event.target) {
                case 'html':
                    layout.html('main', '<div style="padding: 10px">Some HTML</div>')
                    query(layout.el('main'))
                        .removeClass('w2ui-grid')
                        .css({
                            'border-left': '1px solid #efefef'
                        })
                    break
            }
        }
    },
}

// let layout = new w2layout(config.layout)
// let sidebar = new w2sidebar(config.sidebar)
// // initialization
// layout.render('#config-attrib-grid')
// layout.html('left', sidebar)



$(function() {
    $('#config-attrib-grid').w2layout({
        name: 'config-attrib-grid',
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
                    layout.html('main', '<div style="padding: 10px">Some HTML</div>')
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

    w2ui["config-attrib-grid"].html('left', w2ui["attrib-sidebar"])
    
})