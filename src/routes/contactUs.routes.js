import { Router } from "express";
import {
  adminAuth,
  loginAuth,
  requiredFields,
  trimBodyObject,
} from "../middlewares/index.js";
import { add, getAll, getById } from "../controllers/contactUs.controllers.js";

const contactUsRouter = Router();

// ======================================================
// 1. Add New + Get All
// ======================================================
contactUsRouter
  .route("/")
  .post(
    loginAuth,
    trimBodyObject,
    requiredFields(["customer", "name", "email", "message"]),
    add
  )
  .get(loginAuth, adminAuth, getAll);

// ======================================================
// 2. Get By ID
// ======================================================
contactUsRouter.route("/:id").get(loginAuth, adminAuth, getById);

export { contactUsRouter };
