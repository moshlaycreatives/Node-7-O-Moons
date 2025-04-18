import { Router } from "express";
import { loginAuth, trimBodyObject } from "../middlewares/index.js";
import {
  addWhitneyBlock,
  getAllWhitneyBlocks,
  getWhitneyBlock,
  removeWhitneyBlock,
  updateWhitneyBlock,
} from "../controllers/whitneyBlock.controllers.js";

const whitneyBlockRouter = Router();

// ================================================
// 1. Add + Get All - Whitney Block
// ================================================
whitneyBlockRouter
  .route("/")
  .post(loginAuth, trimBodyObject, addWhitneyBlock)
  .get(loginAuth, getAllWhitneyBlocks);

// ================================================
// 2. Get + Update + Delete - Whitney Block
// ================================================
whitneyBlockRouter
  .route("/:id")
  .get(loginAuth, getWhitneyBlock)
  .patch(loginAuth, updateWhitneyBlock)
  .delete(loginAuth, removeWhitneyBlock);
export { whitneyBlockRouter };
