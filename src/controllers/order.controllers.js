import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { BadRequestException, NotFoundException } from "../errors/index.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { Product } from "../models/product.model.js";

// ================================================
// 1. Create Order - By Customer
// ================================================
export const createOrder = asyncHandler(async (req, res) => {
  const { cart } = req.body;

  const findCart = await Cart.findOne({
    _id: cart,
    customer: req.userId,
    status: "Pending",
  });

  if (!findCart) {
    throw new NotFoundException("Cart not found.");
  }

  req.body.total = findCart.subtotal + (req?.body?.shipping_fee || 0);

  findCart.status = "Ordered";
  await findCart.save();

  const newOrder = await Order.create(req.body);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order created successfully",
      data: newOrder,
    })
  );
});

// ================================================
// 2. Get All Orders - By Customer
// ================================================
export const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find({ customer: req.userId })
    .populate({
      path: "customer",
      select: "-password",
    })
    .populate("cart")
    .populate("whitney_blocks");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allOrders.length > 0
          ? "All orders fetched successfully."
          : "You have no order anything.",
      data: allOrders,
    })
  );
});

// ================================================
// 3. Get Order - By Customer
// ================================================
export const getOrder = asyncHandler(async (req, res) => {
  console.info("_id: ", req.params.id);
  console.info("customer: ", req.userId);
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.userId,
  })
    .populate({
      path: "customer",
      select: "-password",
    })
    .populate("cart")
    .populate("whitney_blocks");

  if (!order) {
    throw new NotFoundException("Order not found..");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order fetched successfully.",
      data: order,
    })
  );
});

// ================================================
// 4. Cancel Order - By Customer
// ================================================
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.userId,
  });

  if (!order) {
    throw new NotFoundException("Order not found.");
  }

  order.status = "Canceled";
  await order.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order canceled successfully.",
    })
  );
});

// ================================================
// 5. Change Order Status - By Admin
// ================================================
export const changeOrderStatus = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({
    _id: orderId,
  })
    .populate({
      path: "customer",
      select: "-password",
    })
    .populate({
      path: "cart",
      populate: {
        path: "products.product",
      },
    })
    .populate("whitney_blocks");

  if (!order) {
    throw new NotFoundException("Order not found.");
  }

  const validOrderStatuses = [
    "Pending",
    "In Progress",
    "Shipped",
    "Delivered",
    "Canceled",
  ];

  if (!validOrderStatuses.includes(status)) {
    throw new BadRequestException("Please provide valid status value.");
  }

  if (status === "Delivered") {
    for (const item of order.cart.products) {
      console.log("Itemmmmmmmm: ", item);

      const product = item.product;
      console.log("Producttttt: ", product);

      if (product) {
        product.stock -= item.quantity;

        await product.save();
      }
    }
  }

  order.status = status;
  await order.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order status updated successfully.",
    })
  );
});

// ================================================
// 6. Get All Orders - By Admin
// ================================================
export const getAllOrdersByAdmin = asyncHandler(async (req, res) => {
  const allOrders = await Order.find()
    .populate({
      path: "customer",
      select: "-password",
    })
    .populate({ path: "cart", populate: { path: "products.product" } })
    .populate("whitney_blocks");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allOrders.length > 0
          ? "All orders fetched successfully."
          : "There is no any order in the collection.",
      data: allOrders,
    })
  );
});
