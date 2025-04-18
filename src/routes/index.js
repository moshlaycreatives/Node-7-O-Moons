import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productRouter } from "./product.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { whitneyBlockRouter } from "./whitneyBlock.routes.js";

const router = Router();

// ==============================================
// 1. User Routes
// ==============================================
router.use("/user", authRouter);

// ==============================================
// 2. Product Routes
// ==============================================
router.use("/product", productRouter);

// ==============================================
// 3. Payment Routes
// ==============================================
router.use("/payment", paymentRouter);

// ==============================================
// 4. Whitney Block Routes
// ==============================================
router.use("/whitney-block", whitneyBlockRouter);

export { router };
