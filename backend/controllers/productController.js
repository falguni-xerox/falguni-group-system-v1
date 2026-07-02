import Product from "../models/Product.js";

// Get All Available Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ available: true }).sort({
      sortOrder: 1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load products",
    });
  }
};