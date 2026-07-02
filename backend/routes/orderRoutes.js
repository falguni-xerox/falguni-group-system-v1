import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { tableNo, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrderCount = await Order.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const tokenNo = todayOrderCount + 1;

    const order = await Order.create({
      tokenNo,
      tableNo,
      items,
      totalAmount,
      paymentStatus: "SUCCESS",
      orderStatus: "NEW",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order create failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Orders fetch failed",
      error: error.message,
    });
  }
});

export default router;