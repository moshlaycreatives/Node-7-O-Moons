import { Schema, model } from "mongoose";

const labTestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },

    image: {
      type: String,
      required: [true, "Image is required."],
    },

    pdf_url: {
      type: String,
      required: [true, "PDF file is required."],
    },
  },
  { timestamps: true }
);

export const LabTest = model("LabTest", labTestSchema);
