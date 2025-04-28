import { Router } from "express";
import {
  adminAuth,
  loginAuth,
  requiredFields,
  trimBodyObject,
} from "../middlewares/index.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addLabTest,
  delteLabTest,
  getAllLabTests,
  getLabTest,
  updateLabTest,
} from "../controllers/labTest.controllers.js";

const labTestRouter = Router();

// ==============================================
// 1. Add + Get All - Lab Tests
// ==============================================
labTestRouter
  .route("/")
  .post(
    loginAuth,
    adminAuth,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "pdf_url", maxCount: 1 },
    ]),
    trimBodyObject,
    requiredFields(["name"]),
    addLabTest
  )
  .get(getAllLabTests);

// ==============================================
// 2. Get + Update + Delete - Lab Test
// ==============================================
labTestRouter
  .route("/:id")
  .get(getLabTest)
  .patch(
    loginAuth,
    adminAuth,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "pdf_url", maxCount: 1 },
    ]),
    trimBodyObject,
    requiredFields(["name"]),
    updateLabTest
  )
  .delete(loginAuth, adminAuth, delteLabTest);

export { labTestRouter };
