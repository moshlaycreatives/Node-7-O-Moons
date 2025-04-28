import { Router } from "express";

import {
  trimBodyObject,
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
    upload.fields([
      { name: "images", maxCount: 3 },
      { name: "report", maxCount: 1 },
      { name: "lab_test_image", maxCount: 1 },
    ]),
    trimBodyObject,
    addProduct
  )
  .get(getAllProducts);

// ==============================================
// 2. Get + Update + Delete - Product
// ==============================================
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(
    loginAuth,
    adminAuth,
    upload.fields([
      { name: "images", maxCount: 3 },
      { name: "report", maxCount: 1 },
      { name: "lab_test_image", maxCount: 1 },
    ]),
    trimBodyObject,
    updateProduct
  )
  .delete(loginAuth, adminAuth, deleteProduct);

export { productRouter };
