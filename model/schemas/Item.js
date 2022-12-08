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

    unit: {
        type: String,
        default: "cm",
    },

    weight: {
        type: Number,
    },

    available: {
        type: Number,
        required: true,
    },

    sold: {
        type: Number,
    },

    damaged: {
        type: Number,
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
