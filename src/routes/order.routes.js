import { Router } from "express";
import {
  adminAuth,
  loginAuth,
  requiredFields,
  trimBodyObject,
} from "../middlewares/index.js";
import {
  cancelOrder,
  changeOrderStatus,
  createOrder,
  getAllOrders,
  getAllOrdersByAdmin,
  getOrder,
} from "../controllers/order.controllers.js";

const orderRouter = Router();

// ===============================================
// 1. Create + Get All - Orders By Customer
// ===============================================
orderRouter
  .route("/")
  .post(
    loginAuth,
    trimBodyObject,
    requiredFields(["customer", "cart", "whitney_blocks"]),
    createOrder
  )
  .get(loginAuth, getAllOrders);

// ===============================================
// 2. Get All - Orders By Admin
// ===============================================
orderRouter.route("/get-all").get(loginAuth, adminAuth, getAllOrdersByAdmin);

// ===============================================
// 2. Cancel Order - By Customer
// ===============================================
orderRouter.route("/cancel-order/:id").patch(loginAuth, cancelOrder);

// ===============================================
// 3. Get Order + Cancel Order + Change Status
// ===============================================
orderRouter
  .route("/:id")
  .get(loginAuth, getOrder)
  .patch(loginAuth, cancelOrder)
  .put(
    loginAuth,
    adminAuth,
    trimBodyObject,
    requiredFields(["status"]),
    changeOrderStatus
  );

export { orderRouter };
