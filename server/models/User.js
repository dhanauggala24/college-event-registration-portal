const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        studentId: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);