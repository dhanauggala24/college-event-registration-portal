
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ======================================
// STUDENT SIGNUP
// ======================================

router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, studentId } = req.body;

        if (!fullName || !email || !password || !studentId) {
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            studentId,
            role: "student"
        });

        await newUser.save();

        res.status(201).json({
            message: "Student registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ======================================
// CREATE ADMIN ACCOUNT (ADMIN ONLY)
// ======================================

router.post(
    "/create-admin",
    protect,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                return res.status(400).json({
                    message: "Please fill in all fields"
                });
            }

            if (password.length < 12) {
                return res.status(400).json({
                    message: "Admin password must contain at least 12 characters"
                });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const existingUser = await User.findOne({
                email: normalizedEmail
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new User({
                fullName,
                email: normalizedEmail,
                password: hashedPassword,
                studentId: null,
                role: "admin"
            });

            await newAdmin.save();

            res.status(201).json({
                message: "Admin account created successfully"
            });

        } catch (error) {
            res.status(500).json({
                message: "Admin account creation failed",
                error: error.message
            });
        }
    }
);


// ======================================
// LOGIN (STUDENT AND ADMIN)
// ======================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

module.exports = router;
