import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    firstName:{
        type: String,
        required: true,
    },

    lastName:{
        type: String,
        required: true,
    },

    isAdmin:{
        type: Boolean,
    },

});

export default mongoose.model("User", userSchema);
