const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "General" },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  outlet_name: { type: String, default: "" },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);