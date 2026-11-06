const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student protected route
router.get("/student", protect, authorizeRoles("student"), (req, res) => {
    res.status(200).json({
        message: "Welcome! Student access granted.",
        user: req.user
    });
});

// Admin protected route
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({
        message: "Welcome! Admin access granted.",
        user: req.user
    });
});

module.exports = router;