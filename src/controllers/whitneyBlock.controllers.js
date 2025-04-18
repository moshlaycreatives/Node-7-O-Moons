import { BadRequestException, NotFoundException } from "../errors/index.js";
import { WhitneyBlock } from "../models/whitneyBlock.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// ================================================
// 1. Add Whitney Block
// ================================================
export const addWhitneyBlock = asyncHandler(async (req, res) => {
  if (!req?.body?.customer) {
    throw new NotFoundException("Customer id is required.");
  }
  const newWhitneyBlock = await WhitneyBlock.create({
    ...req.body,
    customer: req.userId,
  });

  const whitneyBlock = await WhitneyBlock.findOne({
    _id: newWhitneyBlock._id,
  })
    .populate("customer")
    .select("-customer.password");
  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "New whitney block added successfully.",
      data: whitneyBlock,
    })
  );
});

// ================================================
// 2. Get Whitney Block
// ================================================
export const getWhitneyBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whitneyBlock = await WhitneyBlock.findById(id);

  if (!whitneyBlock) {
    throw new BadRequestException("Whitney block not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Whitney block fetched successfully.",
      data: whitneyBlock,
    })
  );
});

// ================================================
// 3. Get All Whitney Block
// ================================================
export const getAllWhitneyBlocks = asyncHandler(async (req, res) => {
  const whitneyBlocks = await WhitneyBlock.find({ customer: req.userId });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        whitneyBlocks.lenght > 0
          ? "Whitney blocks fetched successfully."
          : "Your whitney blocks collection is empty.",

      data: whitneyBlocks,
    })
  );
});

// ================================================
// 4. Update Whitney Block
// ================================================
export const updateWhitneyBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whitneyBlock = await WhitneyBlock.findOne({
    _id: id,
    customer: req.userId,
  });

  if (!whitneyBlock) {
    throw NotFoundException("Whitney block not found.");
  }

  const updatedWhitneyBlock = await WhitneyBlock.findOneAndUpdate(
    { _id: id, customer: req.userId },
    req.body,
    { new: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Whitney block updated successfully.",
      data: updatedWhitneyBlock,
    })
  );
});

// ================================================
// 4. Remove Whitney Block
// ================================================
export const removeWhitneyBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whitneyBlock = await WhitneyBlock.findOne({
    _id: id,
    customer: req.userId,
  });

  if (!whitneyBlock) {
    throw NotFoundException("Whitney block not found.");
  }

  await WhitneyBlock.findOneAndDelete({ _id: id, customer: req.userId });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Whitney block removed successfully.",
    })
  );
});
