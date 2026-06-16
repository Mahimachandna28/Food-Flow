const Food = require("../models/Food");



exports.addFood = async (req, res) => {
  try {
    const { name, price, category, description, image, outlet_name, available } = req.body;

    const food = new Food({ name, price, category, description, image, outlet_name, available });
    await food.save();

    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getFood = async (req, res) => {
  try {
    const { category, outlet_name, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (outlet_name) filter.outlet_name = outlet_name;
    if (available !== undefined) filter.available = available === "true";

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: "Food item not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updateFood = async (req, res) => {
  try {
    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Food item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.deleteFood = async (req, res) => {
  try {
    const deleted = await Food.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Food item not found" });
    res.json({ message: "Food deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};