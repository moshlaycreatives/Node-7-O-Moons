import { NotFoundException } from "../errors/index.js";
import { LabTest } from "../models/labTest.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// =========================================
// 1. Add Lab Test
// =========================================
export const addLabTest = asyncHandler(async (req, res) => {
  if (!req?.files?.image) {
    throw new NotFoundException("Lab test image is required.");
  }

  if (!req?.files?.pdf_url) {
    throw new NotFoundException("Lab test pdf file is required.");
  }

  req.body.image =
    process.env.BASE_URL + req.files.image[0].path.replace(/\\/g, "/");

  req.body.pdf_url =
    process.env.BASE_URL + req.files.pdf_url[0].path.replace(/\\/g, "/");

  const newLabTest = await LabTest.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "New lab test added successfully",
      data: newLabTest,
    })
  );
});

// =========================================
// 2. Get All Lab Tests
// =========================================
export const getAllLabTests = asyncHandler(async (req, res) => {
  const allLabTests = await LabTest.find();
  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allLabTests.lenght > 0
          ? "Lab tests fetched successfully."
          : "Lab tests collection is empty.",
      data: allLabTests,
    })
  );
});

// =========================================
// 3. Get Lab Tests
// =========================================
export const getLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findOne({ _id: req.params.id });

  if (!labTest) {
    throw new NotFoundException("Lab test not found.");
  }
  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Lab test fetched successfully.",
      data: labTest,
    })
  );
});

// =========================================
// 4. Update Lab Tests
// =========================================
export const updateLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findOne({ _id: req.params.id });

  if (!labTest) {
    throw new NotFoundException("Lab test not found.");
  }

  if (req?.files?.image) {
    req.body.image =
      process.env.BASE_URL + req.files.image[0].path.replace(/\\/g, "/");
  }

  if (req?.files?.pdf_url) {
    req.body.pdf_url =
      process.env.BASE_URL + req.files.pdf_url[0].path.replace(/\\/g, "/");
  }

  const updatedLabTest = await LabTest.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
    }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Lab test updated successfully.",
      data: updatedLabTest,
    })
  );
});

// =========================================
// 5. Delete Lab Test
// =========================================
export const delteLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findOne({ _id: req.params.id });

  if (!labTest) {
    throw new NotFoundException("Lab test not found.");
  }

  await LabTest.findOneAndDelete({ _id: req.params.id });
  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Lab test deleted successfully.",
    })
  );
});
