import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    subtotal: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Ordered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Cart = model("Cart", cartSchema);
