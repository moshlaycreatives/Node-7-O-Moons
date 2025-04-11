import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productRouter } from "./product.routes.js";

const router = Router();

// ==============================================
// 1. User Routes
// ==============================================
router.use("/user", authRouter);

// ==============================================
// 2. Product Routes
// ==============================================
router.use("/product", productRouter);

export { router };
