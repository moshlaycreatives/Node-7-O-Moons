import { Router } from "express";

import {
  trimBodyObject,
  adminAuth,
  loginAuth,
  productUpload,
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
  .post(loginAuth, adminAuth, productUpload, trimBodyObject, addProduct)
  .get(loginAuth, getAllProducts);

// ==============================================
// 2. Get + Update + Delete - Product
// ==============================================
productRouter
  .route("/:id")
  .get(loginAuth, getProduct)
  .patch(loginAuth, adminAuth, productUpload, trimBodyObject, updateProduct)
  .delete(loginAuth, adminAuth, deleteProduct);

export { productRouter };
