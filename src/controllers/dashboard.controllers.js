import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

// =======================================================
// 1. Get Sales Details
// =======================================================
export const getSalesDetails = asyncHandler(async (req, res) => {
  const { referenceDate } = req.body;

  const reference = referenceDate ? new Date(referenceDate) : new Date();

  if (isNaN(reference.getTime())) {
    return res.status(400).json({ message: "Invalid reference date" });
  }

  const startOfDay = new Date(reference);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reference);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    1
  );
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(
    reference.getFullYear(),
    reference.getMonth() + 1,
    0
  );
  endOfMonth.setHours(23, 59, 59, 999);

  const [currentMonthSales, currentMonthOrderCount, todayOrderCount] =
    await Promise.all([
      Order.find({
        status: "Delivered",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Order.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }).countDocuments(),
      Order.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).countDocuments(),
    ]);

  const totalSale = currentMonthSales.reduce(
    (acc, order) => acc + order.total,
    0
  );

  const totalCustomers = await User.find({
    role: { $ne: "admin" },
  }).countDocuments();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Sales details feteched successfully.",
      data: {
        totalSale,
        totalOrders: currentMonthOrderCount,
        todayOrders: todayOrderCount,
        totalCustomers,
      },
    })
  );
});

// =======================================================
// 2. Total Sale Graph
// =======================================================
export const totalSaleGraph = asyncHandler(async (req, res) => {
  const { referenceDate } = req.body;

  let reference;

  if (referenceDate && /^\d{4}$/.test(referenceDate)) {
    reference = new Date(`${referenceDate}-01-01`);
  } else {
    reference = referenceDate ? new Date(referenceDate) : new Date();
  }

  if (isNaN(reference.getTime())) {
    return res.status(400).json({ message: "Invalid reference date" });
  }

  const referenceYear = reference.getFullYear();

  const mainStartOfYear = new Date(referenceYear, 0, 1);
  mainStartOfYear.setHours(0, 0, 0, 0);

  const mainEndOfYear = new Date(referenceYear, 11, 31);
  mainEndOfYear.setHours(23, 59, 59, 999);

  // Aggregation: Total sales per month for delivered orders
  const monthlySales = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
        date: {
          $gte: mainStartOfYear,
          $lte: mainEndOfYear,
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalSales: { $sum: "$total" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalSales: 1,
      },
    },
    {
      $sort: { month: 1 }, // Jan to Dec
    },
  ]);

  // Fill in missing months with 0 sales
  const result = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = monthlySales.find((m) => m.month === month);
    return {
      month,
      totalSales: found ? found.totalSales : 0,
    };
  });

  res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Total sales feteched successfully.",
      data: {
        year: referenceYear,
        monthlySales: result,
      },
    })
  );
});

// =======================================================
// 2. Total Orders Graph
// =======================================================
export const totalOrdersGraph = asyncHandler(async (req, res) => {
  const { referenceDate } = req.body;

  let reference;

  if (referenceDate && /^\d{4}$/.test(referenceDate)) {
    reference = new Date(`${referenceDate}-01-01`);
  } else {
    reference = referenceDate ? new Date(referenceDate) : new Date();
  }

  if (isNaN(reference.getTime())) {
    return res.status(400).json({ message: "Invalid reference date" });
  }

  const referenceYear = reference.getFullYear();

  const mainStartOfYear = new Date(referenceYear, 0, 1);
  mainStartOfYear.setHours(0, 0, 0, 0);

  const mainEndOfYear = new Date(referenceYear, 11, 31);
  mainEndOfYear.setHours(23, 59, 59, 999);

  // Aggregation: Total order count per month (no status filter)
  const monthlyOrders = await Order.aggregate([
    {
      $match: {
        date: {
          $gte: mainStartOfYear,
          $lte: mainEndOfYear,
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        orderCount: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  // Fill in missing months with 0 orders
  const result = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = monthlyOrders.find((m) => m.month === month);
    return {
      month,
      orderCount: found ? found.orderCount : 0,
    };
  });

  res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Total orders fetched successfully.",
      data: {
        year: referenceYear,
        monthlyOrders: result,
      },
    })
  );
});
