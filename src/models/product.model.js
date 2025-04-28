import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    flavor: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    color: {
      type: String,
      default: "",
    },

    labtest: {
      type: Schema.Types.ObjectId,
      ref: "LabTest",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = model("Product", productSchema);
