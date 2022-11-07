import mongoose from "mongoose";

const specSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    dataType: {
        type: String,
        required: true,
    },
});
