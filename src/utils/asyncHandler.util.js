import { ApiResponce } from "./apiResponce.util.js";

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json(
      new ApiResponce({
        statusCode: error.code || 500,
        message: error.message,
        ...error,
      })
    );
  }
};
