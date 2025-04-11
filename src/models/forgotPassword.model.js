import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import {
  BadRequestException,
  InternalServerErrorException,
} from "../errors/index.js";

const forgotPasswordSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otp_verified: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// ==============================================
// 1. Hash OTP before storing in db
// ==============================================
forgotPasswordSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    console.error("An error occurred while hasing OTP.");
    throw new InternalServerErrorException(
      "An error occurred while hasing OTP."
    );
  }
});

// ==============================================
// 2. Compare OTP
// ==============================================
forgotPasswordSchema.methods.compareOTP = async function (candidateOTP) {
  try {
    return await bcrypt.compare(candidateOTP, this.otp);
  } catch (error) {
    console.error("An error occurred while comparing OTP.", error);
    throw new BadRequestException("An error occurred while comparing OTP.");
  }
};

export const ForgotPassword = model("ForgotPassword", forgotPasswordSchema);
