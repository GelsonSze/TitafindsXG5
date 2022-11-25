import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    image: {
        type: String,
    },

    code: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
    },

    name: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    brand: {
        type: String,
    },

    classification: {
        type: String,
    },

    design: {
        type: String,
    },

    size: {
        type: Number,
    },

    weight: {
        type: Number,
    },

    quantity: {
        type: Number,
        required: true,
    },

    sellingType: {
        type: String,
        required: true,
    },

    purchasePrice: {
        type: Number,
    },

    sellingPrice: {
        type: Number,
    },

    status: {
        type: String,
        required: true,
    },

    dateAdded: {
        type: String,
        required: true,
    },

    dateUpdated: {
        type: String,
        default: null,
    },

    addedBy: {
        type: String,
        required: true,
    },

    mixed: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Item", itemSchema);
