//Controller for items
import mongoose from 'mongoose';
import Item from '../model/schemas/item.js';
const itemController = {

    getIndex: function(req, res){
        res.render('tempIndex');
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
    }
}

export default itemController;