import { Router } from "express";
import { trimBodyObject, requiredFields } from "../middlewares/index.js";
import {
  addToCart,
  getCart,
  removeCartProduct,
} from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter
  .route("/")
  .post(trimBodyObject, requiredFields(["productId"]), addToCart)
  .get(getCart);

cartRouter.route("/:productId").delete(removeCartProduct);

export { cartRouter };
