import { Router } from "express";

import {
  trimBodyObject,
  requiredFields,
  adminAuth,
  loginAuth,
  upload,
} from "../middlewares/index.js";

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controllers.js";

const productRouter = Router();

// ==============================================
// 1. Add + Get All - Products
// ==============================================
productRouter
  .route("/")
  .post(
    loginAuth,
    adminAuth,
    upload.single("image"),
    trimBodyObject,
    requiredFields(["name"]),
    addProduct
  )
  .get(loginAuth, getAllProducts);

// ==============================================
// 2. Get + Update + Delete - Product
// ==============================================
productRouter
  .route("/:id")
  .get(loginAuth, getProduct)
  .patch(
    loginAuth,
    adminAuth,
    upload.single("image"),
    trimBodyObject,
    requiredFields(["name"]),
    updateProduct
  )
  .delete(loginAuth, adminAuth, deleteProduct);

export { productRouter };
