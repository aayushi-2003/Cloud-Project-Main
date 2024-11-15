const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    password: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
module.exports = {User};