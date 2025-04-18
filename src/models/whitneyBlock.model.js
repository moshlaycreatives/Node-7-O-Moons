import { Schema, model } from "mongoose";

const whitneyBlockSchema = new Schema(
  {
    first_name: {
      type: String,
      default: "",
    },

    last_name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    str: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    zip_code: {
      type: String,
      default: "",
    },

    contact: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const WhitneyBlock = model("WhitneyBlock", whitneyBlockSchema);
