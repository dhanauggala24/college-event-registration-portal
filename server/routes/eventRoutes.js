const express = require("express");
const Event = require("../models/Event");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const {
                title,
                description,
                category,
                eventDate,
                venue,
                capacity,
                registrationDeadline
            } = req.body;

            const newEvent = new Event({
                title,
                description,
                category,
                eventDate,
                venue,
                capacity,
                registrationDeadline,
                createdBy: req.user.userId
            });

            await newEvent.save();

            res.status(201).json({
                message: "Event created successfully!",
                event: newEvent
            });

        } catch (error) {
            res.status(500).json({
                message: "Event creation failed",
                error: error.message
            });
        }
    }
);
// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 });

        res.status(200).json({
            count: events.length,
            events
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
});
// Get a single event by ID
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({ event });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
});
// Delete an event (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Event deletion failed",
            error: error.message
        });
    }
});
// Update an event (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully!",
            event: updatedEvent
        });

    } catch (error) {
        res.status(500).json({
            message: "Event update failed",
            error: error.message
        });
    }
});

module.exports = router;