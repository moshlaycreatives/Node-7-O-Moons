import { NotFoundException } from "../errors/index.js";
import { Product } from "../models/product.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// ==============================================
// 1. Add Product
// ==============================================
export const addProduct = asyncHandler(async (req, res) => {
  // Handle images
  if (req.files.images) {
    req.body.images = req.files.images.map(
      (file) => process.env.BASE_URL + file.path.replace(/\\/g, "/")
    );
  }

  // Handle report
  if (req.files.report) {
    req.body.report =
      process.env.BASE_URL + req.files.report[0].path.replace(/\\/g, "/");
  }

  const newProduct = await Product.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Product added successfully.",
      data: newProduct,
    })
  );
});

// ==============================================
// 2. Get All Products
// ==============================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await Product.find({});

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allProducts.length > 0
          ? "All products feteched successfully."
          : "Products collection is empty.",
      data: allProducts,
    })
  );
});

// ==============================================
// 3. Get Product
// ==============================================
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product feteched successfully.",
      data: product,
    })
  );
});

// ==============================================
// 4. Update Product
// ==============================================
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Product is requried.");
  }

  // Handle images
  if (req.files.images) {
    req.body.images = req.files.images.map(
      (file) => process.env.BASE_URL + file.path.replace(/\\/g, "/")
    );
  }

  // Handle report
  if (req.files.report) {
    req.body.report =
      process.env.BASE_URL + req.files.report[0].path.replace(/\\/g, "/");
  }

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Product updated successfully.",
      data: updatedProduct,
    })
  );
});

// ==============================================
// 5. Delete Product
// ==============================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundException("Product is requried.");
  }

  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  await Product.findOneAndDelete({ _id: id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product deleted successfully.",
    })
  );
});
