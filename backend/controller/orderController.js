const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });


// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { userId, userName, items, totalPrice, deliveryAddress, notes, paymentMethod = "COD" } = req.body;

    if (!userId || !items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ error: "userId, items, and totalPrice are required." });
    }

    const order = new Order({
      userId,
      userName,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
      deliveryAddress,
      notes
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE RAZORPAY ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required." });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        error: "Razorpay keys are not configured on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env."
      });
    }

    const razorpay = getRazorpayClient();
    const paymentOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `ff_${Date.now()}`
    });

    res.json({ orderId: paymentOrder.id, amount: paymentOrder.amount, currency: paymentOrder.currency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ VERIFY PAYMENT AND CREATE ORDER
exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
      return res.status(400).json({ error: "Payment verification payload is incomplete." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature." });
    }

    const { userId, userName, items, totalPrice, deliveryAddress, notes } = orderData;
    if (!userId || !items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ error: "userId, items, and totalPrice are required." });
    }

    const order = new Order({
      userId,
      userName,
      items,
      totalPrice,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      paymentGatewayOrderId: razorpay_order_id,
      paymentGatewayPaymentId: razorpay_payment_id,
      deliveryAddress,
      notes
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET ALL ORDERS (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ UPDATE STATUS (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};