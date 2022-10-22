import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    /*
        Database schema for the items of the user.
    */
    id:{
        type: Number,
        required: true,
        unique: true,
    },

    image:{
        type: String,
    },
    
    name:{
        type: String,
        required: true,
    },

    type:{
        type: String,
        required: true,
    },

    brand:{
        type: String,
    },

    classification:{
        type: String, 
    },

    design:{
        type: String,
    },

    size:{
        type: Number,
    },

    weight:{
        type: Number,
        required: true,
    },

    quantity:{
        type: Number,
        required: true,
    },

    sellingType:{
        type: String,
        required: true,
    },

    purchasePrice:{
        type: Number,
    },

    sellingPrice:{
        type: Number,
    },

    status:{
        type: Number,
        required: true,
    },

    productCode:{
        type: String,
    },

    isAdmin:{
        type: Boolean,
    }
});

export default mongoose.model("Item", itemSchema);
