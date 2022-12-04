import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    dataType: {
        type: String,
        required: true,
    },

    options: {
        type: Array,
    },
});

export default mongoose.model("Attribute", attributeSchema);