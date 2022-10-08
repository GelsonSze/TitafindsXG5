import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    /*
        Database schema for the items of the user.
    */
    prodID:{
        type: Number,
        required: true,
        unique: true,
    },

    productName:{
        type: String,
        required: true,
    },

    prodClassification:{
        type: String, 
        required: true,
    },

    prodDesign:{
        type: String,
        required: true,
    },

    prodSize:{
        type: Number,
        required: true,
    },

    prodWeight:{
        type: Number,
        required: true,
    },

    prodQuantity:{
        type: Number,
        required: true,
    },

    initialPrice:{
        type: Number,
        required: true,
    },

    sellingPrice:{
        type: Number,
        required: true,
    },

    prodProfit:{
        type: Number,
        required: true,
    },

    prodStatus:{
        type: Number,
        required: true,
    },

    prodBarcodes:{

    }
});

export default mongoose.model("Item", itemSchema);