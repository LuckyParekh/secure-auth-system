const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const adminOnly = require("./middleware/adminMiddleware");
require("dotenv").config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Secure Login System API is running");
});

app.get("/api/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome to your protected dashboard",
    user: req.user,
  });
});

app.get("/api/admin", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalNormalUsers = await User.countDocuments({ role: "user" });

    res.json({
      message: "Welcome Admin",
      user: req.user,
      stats: {
        totalUsers,
        totalAdmins,
        totalNormalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});