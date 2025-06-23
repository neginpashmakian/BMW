require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const loadCSV = require("./utils/csvLoader");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5050;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bmw-db";

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Server is working");
});

// Mount API routes
app.use("/data", dataRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await loadCSV();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
module.exports = app;
