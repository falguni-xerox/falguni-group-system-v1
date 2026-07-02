import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Regular Tea",
    category: "Tea",
    price: 10,
    image: "/images/tea.jpg",
    parcelAvailable: false,
    sortOrder: 1,
  },
  {
    name: "Regular Coffee",
    category: "Coffee",
    price: 20,
    image: "/images/coffee.jpg",
    parcelAvailable: false,
    sortOrder: 2,
  },
  {
    name: "Black Coffee",
    category: "Black Coffee",
    price: 15,
    image: "/images/black-coffee.jpg",
    parcelAvailable: false,
    sortOrder: 3,
  },
  {
    name: "Maggi",
    category: "Maggi",
    price: 40,
    image: "/images/maggi.jpg",
    parcelAvailable: true,
    sortOrder: 4,
  },
  {
    name: "Korean Maggi",
    category: "Korean Maggi",
    price: 80,
    image: "/images/korean-maggi.jpg",
    parcelAvailable: true,
    sortOrder: 5,
  },
  {
    name: "Cold Drink 250ml",
    category: "Cold Drinks",
    price: 20,
    image: "/images/cold-drink.jpg",
    parcelAvailable: false,
    sortOrder: 6,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedProducts();