/**
 * Database Seeder Utility
 * Run this file to insert initial sample data into your local MongoDB.
 * Usage: node seed.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("./models/Food");
const Order = require("./models/Order");

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/FoodFlow";

const sampleFoods = [
  // ─── Snapeats ───
  {
    name: "Classic Burger",
    price: 150,
    category: "Fast Food",
    description: "Juicy beef patty with lettuce, tomato, and cheese on a toasted bun.",
    outlet_name: "Snapeats",
    available: true
  },
  {
    name: "Paneer Tikka Wrap",
    price: 130,
    category: "Rolls",
    description: "Spicy paneer chunks wrapped in a soft paratha with mint chutney.",
    outlet_name: "Snapeats",
    available: true
  },
  {
    name: "Chicken Shawarma",
    price: 160,
    category: "Fast Food",
    description: "Tender chicken strips with garlic sauce rolled in fresh pita bread.",
    outlet_name: "Snapeats",
    available: true
  },
  {
    name: "Veg Grilled Sandwich",
    price: 90,
    category: "Snacks",
    description: "Crispy grilled sandwich loaded with veggies, cheese, and herbs.",
    outlet_name: "Snapeats",
    available: true
  },
  {
    name: "French Fries",
    price: 70,
    category: "Snacks",
    description: "Golden crispy fries seasoned with peri-peri spice.",
    outlet_name: "Snapeats",
    available: true
  },
  {
    name: "Aloo Paratha Roll",
    price: 80,
    category: "Rolls",
    description: "Stuffed aloo paratha rolled with pickled onions and green chutney.",
    outlet_name: "Snapeats",
    available: true
  },

  // ─── Southern Stories ───
  {
    name: "Masala Dosa",
    price: 90,
    category: "South Indian",
    description: "Crispy crepe stuffed with spiced potato filling, served with sambar and chutney.",
    outlet_name: "Southern Stories",
    available: true
  },
  {
    name: "Idli Sambar",
    price: 60,
    category: "South Indian",
    description: "Soft steamed rice cakes served with hot sambar and coconut chutney.",
    outlet_name: "Southern Stories",
    available: true
  },
  {
    name: "Medu Vada",
    price: 50,
    category: "South Indian",
    description: "Crispy fried lentil donuts served with sambar and chutney.",
    outlet_name: "Southern Stories",
    available: true
  },
  {
    name: "Uttapam",
    price: 85,
    category: "South Indian",
    description: "Thick rice pancake topped with onions, tomatoes, and green chillies.",
    outlet_name: "Southern Stories",
    available: true
  },
  {
    name: "Filter Coffee",
    price: 40,
    category: "Beverage",
    description: "Traditional South Indian filter coffee with frothy milk.",
    outlet_name: "Southern Stories",
    available: true
  },
  {
    name: "Curd Rice",
    price: 70,
    category: "South Indian",
    description: "Creamy curd rice tempered with mustard and curry leaves.",
    outlet_name: "Southern Stories",
    available: true
  },

  // ─── Nestle HotSpot ───
  {
    name: "Cold Coffee",
    price: 120,
    category: "Beverage",
    description: "Refreshing cold brewed coffee with a scoop of vanilla ice cream.",
    outlet_name: "Nestle HotSpot",
    available: true
  },
  {
    name: "Hot Chocolate",
    price: 100,
    category: "Beverage",
    description: "Rich and creamy hot chocolate topped with whipped cream.",
    outlet_name: "Nestle HotSpot",
    available: true
  },
  {
    name: "Maggi Noodles",
    price: 50,
    category: "Snacks",
    description: "Classic 2-minute Maggi noodles with veggies and extra masala.",
    outlet_name: "Nestle HotSpot",
    available: true
  },
  {
    name: "Chocolate Brownie",
    price: 80,
    category: "Dessert",
    description: "Warm gooey chocolate brownie served with vanilla ice cream.",
    outlet_name: "Nestle HotSpot",
    available: true
  },
  {
    name: "Cappuccino",
    price: 90,
    category: "Beverage",
    description: "Perfectly brewed espresso with steamed milk and foam art.",
    outlet_name: "Nestle HotSpot",
    available: true
  },
  {
    name: "Oreo Milkshake",
    price: 140,
    category: "Beverage",
    description: "Thick creamy milkshake blended with crushed Oreo cookies.",
    outlet_name: "Nestle HotSpot",
    available: true
  },

  // ─── Green Nox ───
  {
    name: "Quinoa Salad",
    price: 180,
    category: "Healthy",
    description: "Fresh quinoa tossed with roasted veggies, feta, and balsamic glaze.",
    outlet_name: "Green Nox",
    available: true
  },
  {
    name: "Avocado Toast",
    price: 160,
    category: "Healthy",
    description: "Multigrain toast topped with smashed avocado, cherry tomatoes, and seeds.",
    outlet_name: "Green Nox",
    available: true
  },
  {
    name: "Green Smoothie",
    price: 120,
    category: "Beverage",
    description: "Spinach, banana, and almond milk blended into a nutritious smoothie.",
    outlet_name: "Green Nox",
    available: true
  },
  {
    name: "Grilled Chicken Bowl",
    price: 220,
    category: "Healthy",
    description: "Brown rice bowl with grilled chicken, steamed broccoli, and peanut sauce.",
    outlet_name: "Green Nox",
    available: true
  },
  {
    name: "Mixed Fruit Bowl",
    price: 100,
    category: "Healthy",
    description: "Seasonal fresh fruits served with honey and granola topping.",
    outlet_name: "Green Nox",
    available: true
  },
  {
    name: "Peanut Butter Protein Bar",
    price: 90,
    category: "Snacks",
    description: "Homemade protein bar with oats, peanut butter, and dark chocolate chips.",
    outlet_name: "Green Nox",
    available: true
  }
];

// Sample orders for testing
const sampleOrders = [
  {
    userId: "demo-user-1",
    userName: "Rahul Sharma",
    items: [
      { name: "Classic Burger", price: 150, quantity: 2 },
      { name: "French Fries", price: 70, quantity: 1 }
    ],
    totalPrice: 370,
    status: "Preparing",
    deliveryAddress: "Room 204, Boys Hostel A",
    notes: "Extra ketchup please"
  },
  {
    userId: "demo-user-1",
    userName: "Rahul Sharma",
    items: [
      { name: "Masala Dosa", price: 90, quantity: 1 },
      { name: "Filter Coffee", price: 40, quantity: 2 }
    ],
    totalPrice: 170,
    status: "Ready",
    deliveryAddress: "Library, 2nd Floor",
    notes: ""
  },
  {
    userId: "demo-user-2",
    userName: "Priya Patel",
    items: [
      { name: "Cold Coffee", price: 120, quantity: 1 },
      { name: "Chocolate Brownie", price: 80, quantity: 2 }
    ],
    totalPrice: 280,
    status: "Preparing",
    deliveryAddress: "Room 112, Girls Hostel B",
    notes: "No whipped cream on brownie"
  },
  {
    userId: "demo-user-2",
    userName: "Priya Patel",
    items: [
      { name: "Quinoa Salad", price: 180, quantity: 1 },
      { name: "Green Smoothie", price: 120, quantity: 1 }
    ],
    totalPrice: 300,
    status: "Delivered",
    deliveryAddress: "CS Lab, Block C",
    notes: ""
  },
  {
    userId: "demo-user-3",
    userName: "Arjun Mehta",
    items: [
      { name: "Paneer Tikka Wrap", price: 130, quantity: 3 },
      { name: "Oreo Milkshake", price: 140, quantity: 2 }
    ],
    totalPrice: 670,
    status: "Out for Delivery",
    deliveryAddress: "Auditorium",
    notes: "For event catering"
  }
];

const seedDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!");

    console.log("Clearing existing food items...");
    await Food.deleteMany({});
    console.log("Clearing existing orders...");
    await Order.deleteMany({});

    console.log("Inserting 24 sample food items across 4 outlets...");
    await Food.insertMany(sampleFoods);
    console.log("✅ Food items seeded!");

    console.log("Inserting 5 sample orders...");
    await Order.insertMany(sampleOrders);
    console.log("✅ Orders seeded!");

    console.log("\n🎉 Database seeded successfully!");
    console.log(`   Food items: ${sampleFoods.length}`);
    console.log(`   Orders: ${sampleOrders.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
