import { Router } from "express";
import { trimBodyObject, requiredFields } from "../middlewares/index.js";
import {
  addToCart,
  getCart,
  removeCartProduct,
} from "../controllers/cart.controllers.js";

const cartRouter = Router();

// ==============================================
// 1. Add To Cart + Get Cart
// ==============================================
cartRouter
  .route("/")
  .post(trimBodyObject, requiredFields(["productId"]), addToCart)
  .get(getCart);

// ==============================================
// 2. Remove Cart
// ==============================================
cartRouter.route("/:productId").delete(removeCartProduct);

export { cartRouter };
