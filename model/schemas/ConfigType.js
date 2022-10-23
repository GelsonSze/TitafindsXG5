import mongoose from "mongoose";

const configTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },

    specifications:{
        type: String,
        required: true,
    },
}); 
