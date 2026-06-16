const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

router.post("/add", foodController.addFood);
router.get("/", foodController.getFood);
router.get("/:id", foodController.getFoodById);
router.put("/:id", foodController.updateFood);
router.delete("/:id", foodController.deleteFood);

module.exports = router;