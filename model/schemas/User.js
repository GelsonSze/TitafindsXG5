import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    // email: {
    //     type: String,
    //     unique: true,
    // },

    firstName: {
        type: String,
    },

    lastName: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isSuspended: {
        type: Boolean,
        default: false,
    },

    dateCreated: {
        type: String,
    },

    dateUpdated: {
        type: String,
        default: null,
    },

    lastLogin: {
        type: String,
        default: null,
    },
});

export default mongoose.model("User", userSchema);
