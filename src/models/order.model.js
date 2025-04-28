import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    shipping_fee: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    whitney_blocks: {
      type: Schema.Types.ObjectId,
      ref: "WhitneyBlock",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Shipped", "Delivered", "Canceled"],
      default: "Pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
