const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/registrations", registrationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("College Event Portal - Nodemon Working!");
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});