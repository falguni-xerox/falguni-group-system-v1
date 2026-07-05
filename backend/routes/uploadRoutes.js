import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image selected",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "falguni-products",
      }
    );

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Image Upload Failed",
    });
  }
});

export default router;