import Product from "../models/Product.js";

// GET products category wise / all
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category && category !== "All" ? { category } : {};

    const products = await Product.find(filter).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Products fetch failed",
    });
  }
};

// ADD product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product add failed",
    });
  }
};

// EDIT product / price change / availability
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product update failed",
    });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product delete failed",
    });
  }
};