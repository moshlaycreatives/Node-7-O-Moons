import authorizenet from "authorizenet";
const { APIContracts, APIControllers } = authorizenet;
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import {
  BadRequestException,
  InternalServerErrorException,
} from "../errors/index.js";

export const chargeAmount = asyncHandler(async (req, res) => {
  const { price, cardDetails } = req.body;
  const { cardNumber, expiry, cvc } = cardDetails;

  const expiryDate = expiry.split("/").join("").trim();
  const card = cardNumber.split(" ").join("").trim();

  const merchantAuthenticationType =
    new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.API_LOGIN_KEY);
  merchantAuthenticationType.setTransactionKey(process.env.TRANSACTION_KEY);

  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(card);
  creditCard.setExpirationDate(expiryDate);
  creditCard.setCardCode(cvc);

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );

  const formattedPrice = parseFloat(price).toFixed(2);
  transactionRequestType.setAmount(formattedPrice);

  transactionRequestType.setPayment(paymentType);

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );
  ctrl.execute(() => {
    const apiResponse = ctrl.getResponse();
    console.log("API Response:", apiResponse);

    if (apiResponse) {
      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      if (
        response.getMessages().getResultCode() ===
        APIContracts.MessageTypeEnum.OK
      ) {
        return res.status(200).json(
          new ApiResponce({
            statusCode: 200,
            message: "Transaction successful.",
            data: response.getTransactionResponse(),
          })
        );
      } else {
        const errorMessage =
          response
            .getTransactionResponse()
            ?.getErrors()
            ?.getError()[0]
            ?.getErrorText() || "Transaction Failed";
        console.error("Transaction Error:", errorMessage);
        throw new BadRequestException(errorMessage);
      }
    } else {
      console.error("API Response is null or undefined.");
      throw InternalServerErrorException("No response from API.");
    }
  });
});
