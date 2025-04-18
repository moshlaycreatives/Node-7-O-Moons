import { Router } from "express";
import { chargeAmount } from "../controllers/payment.controllers.js";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";

const paymentRouter = Router();

paymentRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields([
      "price",
      "cardDetails",
      "cardDetails.cardNumber",
      "cardDetails.expiry",
      "cardDetails.cvc",
    ]),
    chargeAmount
  );

export { paymentRouter };
