//Controller for items
import Item from '../model/schemas/item.js';

const itemController = {

    // The dashboard or inventory page
    home: function(req, res){
        res.render('index', {
            title: 'index',
            styles: ['index.css','w2ui-overrides.css', 'popup.css'],
            scripts: ['index.js', 'popup.js']
        });
    },

    // Redirects to home page
    homeRedirect: function(req, res){
        res.redirect('/');
    },

    // Adds item passed in a post request into the database
    addItem: async function(req, res){
        var addedItem = new Item(req.body.addedItem);
        try{
            var newItem = await addedItem.save();
            console.log("Added item: " + newItem);
        }catch(error){
            console.log(error);
        }
    },
}

export default itemController;