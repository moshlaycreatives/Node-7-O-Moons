import { Cart } from "../models/cart.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { BadRequestException, NotFoundException } from "../errors/index.js";
import { Product } from "../models/product.model.js";

// =========================================
// 1. Add To Cart
// =========================================
export const addToCart = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.body.products[0].product,
  });

  if (!product) {
    throw new BadRequestException("Invalid product id.");
  }
  const existingCart = await Cart.findOne({
    customer: req.userId,
    status: "Pending",
  });

  if (existingCart) {
    existingCart.products.push(req.body.products[0]);

    existingCart.subtotal += product.price * req.body.products[0].quantity;
    await existingCart.save();
  } else {
    req.body.subtotal = product.price * req.body.products[0].quantity;
    req.body.customer = req.userId;
    await Cart.create(req.body);
  }
  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product added to cart.",
    })
  );
});

// =========================================
// 2. Get All Carts
// =========================================
export const getAllCarts = asyncHandler(async (req, res) => {
  const allCarts = await Cart.find({
    customer: req.userId,
    status: "Pending",
  }).populate("products.product");

  res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allCarts.lenght > 0
          ? "All Carts fetched successfully."
          : "You cart collection is empty.",

      data: allCarts,
    })
  );
});

// =========================================
// 3. Remove Product From Cart
// =========================================
export const removeCartProduct = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.userId, status: "Pending" });

  if (!cart) {
    throw new NotFoundException("You have no any cart.");
  }

  const isProductExists = cart.products.find(
    (product) => product.product.toString() === req.body.productId
  );

  if (!isProductExists) {
    throw new BadRequestException("Invalid product id.");
  }

  const filteredProducts = cart.products.filter(
    (product) => product.product.toString() !== req.body.productId
  );

  cart.products = filteredProducts;

  cart.products.forEach(async (product) => {
    const findProduct = await Product.findOne({ _id: product.product });
    cart.subtotal += product.quantity * findProduct.price;
  });
  await cart.save();

  res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product removed from cart.",
    })
  );
});
