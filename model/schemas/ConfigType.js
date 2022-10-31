import mongoose from "mongoose";

const configTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    specifications: {
        type: Array,
        required: true,
    },
});
