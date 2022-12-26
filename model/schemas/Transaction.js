"use strict";
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    code: {
        type: String,
    },

    name: {
        type: String,
    },

    description: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    sellingPrice: {
        type: Number,
        required: true,
    },

    transactedBy: {
        type: String,
    },
});

export default mongoose.model("Transaction", transactionSchema);
