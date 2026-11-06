const express = require("express");

const Registration = require("../models/Registration");
const Event = require("../models/Event");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
// Student event registration
router.post("/:eventId", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check whether the event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check event status
        if (event.status !== "upcoming") {
            return res.status(400).json({
                message: "Event is not available for registration"
            });
        }

        // Check registration deadline
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({
                message: "Registration deadline has passed"
            });
        }

        // Check duplicate registration
        const existingRegistration = await Registration.findOne({
            student: req.user.userId,
            event: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({
                message: "You have already registered for this event"
            });
        }

        // Count active registrations
        const registrationCount = await Registration.countDocuments({
            event: eventId,
            status: "registered"
        });

        if (registrationCount >= event.capacity) {
            return res.status(400).json({
                message: "Event registration capacity is full"
            });
        }

        // Create registration
        const registration = new Registration({
            student: req.user.userId,
            event: eventId
        });

        await registration.save();

        res.status(201).json({
            message: "Event registration successful!",
            registration
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already registered for this event"
            });
        }

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});
// Get registrations of the logged-in student
router.get("/my-registrations", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const registrations = await Registration.find({
            student: req.user.userId
        })
            .populate("event")
            .sort({ registrationDate: -1 });

        res.status(200).json({
            count: registrations.length,
            registrations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
});
// Admin: Get all event registrations
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("student", "fullName email studentId")
            .populate("event", "title eventDate venue")
            .sort({ registrationDate: -1 });

        res.status(200).json({
            count: registrations.length,
            registrations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch all registrations",
            error: error.message
        });
    }
});
// Cancel student registration
router.delete("/:registrationId", protect, authorizeRoles("student"), async (req, res) => {
    try {
        const registration = await Registration.findOne({
            _id: req.params.registrationId,
            student: req.user.userId,
            status: "registered"
        });

        if (!registration) {
            return res.status(404).json({
                message: "Active registration not found"
            });
        }

        registration.status = "cancelled";

        await registration.save();

        res.status(200).json({
            message: "Registration cancelled successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Cancellation failed",
            error: error.message
        });
    }
});
module.exports = router;