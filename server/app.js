const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/db");

const mainRoutes = require("./routes/mainRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("FarmLink Backend is running...");
});

// API Routes
app.use("/api", mainRoutes);

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
