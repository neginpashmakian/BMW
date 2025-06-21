const mongoose = require("mongoose");

const CarDataSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("CarData", CarDataSchema);
