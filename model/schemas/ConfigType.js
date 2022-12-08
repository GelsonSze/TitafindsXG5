import mongoose from "mongoose";

const configTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    attributes: {
        type: Array,
    },
});

export default mongoose.model("Config", configTypeSchema);