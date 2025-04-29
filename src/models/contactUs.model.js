import { Schema, model } from "mongoose";

const contactUsSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
    },

    contact_no: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const ContactUs = model("ContactUs", contactUsSchema);
