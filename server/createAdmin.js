require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline/promises");
const User = require("./models/User");
const connectDB = require("./config/db");

const createAdmin = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        await connectDB();

        const email = "admin@college.com";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
    const newPassword = await rl.question(
        "Enter new admin password (minimum 12 characters): "
    );

    if (newPassword.length < 12) {
        console.log("Password must contain at least 12 characters.");
        return;
    }

    existingAdmin.password = await bcrypt.hash(newPassword, 10);
    await existingAdmin.save();

    console.log("Admin password reset successfully!");
    return;
}

        const password = await rl.question(
            "Enter a strong admin password (minimum 12 characters): "
        );

        if (password.length < 12) {
            console.log("Password must contain at least 12 characters.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            fullName: "College Admin",
            email,
            password: hashedPassword,
            studentId: null,
            role: "admin"
        });

        await admin.save();

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin creation failed:", error.message);
    } finally {
        rl.close();
        await mongoose.connection.close();
    }
};

createAdmin();