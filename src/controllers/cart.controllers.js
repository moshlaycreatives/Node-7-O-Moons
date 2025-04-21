import { Cart } from "../models/cart.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { BadRequestException, NotFoundException } from "../errors/index.js";
import { Product } from "../models/product.model.js";

// =========================================
// 1. Add To Cart (Corrected)
// =========================================
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) throw new BadRequestException("Product ID is required.");

  const product = await Product.findById(productId);
  if (!product) throw new NotFoundException("Product not found.");

  const qty = quantity || 1;
  if (qty < 1) throw new BadRequestException("Quantity must be at least 1.");

  let cart = await Cart.findOne({ customer: req.userId, status: "Pending" });

  if (cart) {
    const existingProduct = cart.products.find((item) =>
      item.product.equals(productId)
    );

    if (existingProduct) {
      existingProduct.quantity += qty;
    } else {
      cart.products.push({ product: productId, quantity: qty });
    }

    cart.subtotal += product.price * qty;
  } else {
    cart = await Cart.create({
      customer: req.userId,
      products: [{ product: productId, quantity: qty }],
      subtotal: product.price * qty,
    });
  }

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponce(200, "Product added to cart.", cart));
});

// =========================================
// 2. Get All Carts (Corrected)
// =========================================
export const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find({
    customer: req.userId,
    status: "Pending",
  }).populate("products.product");

  res
    .status(200)
    .json(
      new ApiResponce(
        200,
        carts.length > 0 ? "Cart fetched successfully." : "Your cart is empty.",
        carts
      )
    );
});

// =========================================
// 3. Remove Product From Cart (Corrected)
// =========================================
export const removeCartProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ customer: req.userId, status: "Pending" });
  if (!cart) throw new NotFoundException("Cart not found.");

  const productIndex = cart.products.findIndex((item) =>
    item.product.equals(productId)
  );
  if (productIndex === -1) throw new NotFoundException("Product not in cart.");

  // Get product price before removal
  const product = await Product.findById(productId);
  const removedProduct = cart.products[productIndex];
  cart.subtotal -= product.price * removedProduct.quantity;

  cart.products.splice(productIndex, 1);

  // If no products left, reset subtotal to 0
  if (cart.products.length === 0) cart.subtotal = 0;

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponce(200, "Product removed from cart.", cart));
});
