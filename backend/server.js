import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// API Routes
// =========================

// Product APIs
app.use("/api/products", productRoutes);

// Order APIs
app.use("/api/orders", orderRoutes);

// Payment APIs
app.use("/api/payment", paymentRoutes);

// Image Upload APIs (Cloudinary)
app.use("/api/upload", uploadRoutes);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("✅ Falguni Group System v1.0 API Running...");
});

// =========================
// MongoDB Connection
// =========================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server Running : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });