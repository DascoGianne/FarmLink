require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const mainRoutes = require("./routes/mainRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Optional DB (won't crash if DB not set up)
let db = null;
try {
  db = require("./db/db");
  console.log("✅ DB module loaded");
} catch (err) {
  console.log("⚠️ DB not loaded, running without DB");
}

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default Route
app.get("/", (req, res) => {
  res.send("FarmLink Backend is running...");
});

// DB Health Check
app.get("/api/db-health", async (req, res) => {
  if (!db) {
    return res.status(503).json({
      success: false,
      message: "DB not available",
    });
  }

  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    return res.status(200).json({
      success: true,
      message: "DB connection OK",
      data: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "DB connection failed",
      error: err.message,
    });
  }
});

// API Routes
app.use("/api", mainRoutes);

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
