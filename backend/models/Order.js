const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: "Guest" },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD"
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },
  paymentGatewayOrderId: { type: String, default: "" },
  paymentGatewayPaymentId: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Preparing"
  },
  deliveryAddress: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);