import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);
