import { Router } from "express";

import {
  trimBodyObject,
  requiredFields,
  emailValidator,
} from "../middlewares/index.js";

import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyForgotPasswordOTP,
} from "../controllers/auth.controllers.js";

const authRouter = Router();

// ==============================================
// 1. Register
// ==============================================
authRouter
  .route("/register")
  .post(
    trimBodyObject,
    requiredFields(["first_name", "email", "password"]),
    emailValidator,
    register
  );

// ==============================================
// 2. Login
// ==============================================
authRouter
  .route("/login")
  .post(
    trimBodyObject,
    requiredFields(["email", "password"]),
    emailValidator,
    login
  );

// ==============================================
// 3. Forgot Password
// ==============================================
authRouter
  .route("/forgot-password")
  .post(
    trimBodyObject,
    requiredFields(["email"]),
    emailValidator,
    forgotPassword
  );

// ==============================================
// 4. Verify Forgot Password OTP
// ==============================================
authRouter
  .route("/verify-otp")
  .patch(
    trimBodyObject,
    requiredFields(["email", "otp"]),
    emailValidator,
    verifyForgotPasswordOTP
  );

// ==============================================
// 5. Reset Password
// ==============================================
authRouter
  .route("/reset-password")
  .patch(
    trimBodyObject,
    requiredFields(["email", "newPassword"]),
    emailValidator,
    resetPassword
  );

export { authRouter };
