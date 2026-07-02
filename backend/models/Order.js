import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    category: String,
    basePrice: Number,
    price: Number,
    quantity: Number,
    customization: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tokenNo: {
      type: Number,
      required: true,
    },

    tableNo: {
      type: String,
      default: "",
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS"],
      default: "SUCCESS",
    },

    orderStatus: {
      type: String,
      enum: ["NEW", "PRINTED", "READY", "COMPLETED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);