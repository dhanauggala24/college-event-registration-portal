const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        registrationDeadline: {
            type: Date,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);