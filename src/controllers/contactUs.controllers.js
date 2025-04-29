import { NotFoundException } from "../errors/index.js";
import { ContactUs } from "../models/contactUs.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// =========================================
// 1. Add New Contact Us
// =========================================
export const add = asyncHandler(async (req, res) => {
  await ContactUs.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Message has been sent.",
    })
  );
});

// =========================================
// 2. Get All
// =========================================
export const getAll = asyncHandler(async (req, res) => {
  const allEntries = await ContactUs.find().populate({
    path: "customer",
    select: "-password",
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allEntries.lenght > 0
          ? "All entries fetched successfully."
          : "There is no any entry exists",
      data: allEntries,
    })
  );
});

// =========================================
// 3. Get
// =========================================
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const entry = await ContactUs.findOne({ _id: id }).populate({
    path: "customer",
    select: "-password",
  });

  if (!entry) {
    throw new NotFoundException("Data not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Data fetched successfully.",
      data: entry,
    })
  );
});
