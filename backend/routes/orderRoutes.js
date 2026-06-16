const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/", orderController.createOrder);
router.post("/payment/create", orderController.createPaymentOrder);
router.post("/payment/verify", orderController.verifyPaymentAndCreateOrder);
router.get("/all", orderController.getAllOrders);
router.get("/single/:id", orderController.getOrderById);
router.get("/:userId", orderController.getOrders);
router.put("/:id", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;