const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  full_name: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  outlet_name: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
