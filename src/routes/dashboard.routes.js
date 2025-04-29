import { Router } from "express";
import { adminAuth, loginAuth } from "../middlewares/index.js";
import {
  getSalesDetails,
  totalOrdersGraph,
  totalSaleGraph,
} from "../controllers/dashboard.controllers.js";

const dashboardRouter = Router();

// ==============================================
// 1. Get Sales Details
// ==============================================
dashboardRouter
  .route("/sale-details")
  .get(loginAuth, adminAuth, getSalesDetails);

// ==============================================
// 2. Total Sales Graph
// ==============================================
dashboardRouter
  .route("/toatal-sales-graph")
  .get(loginAuth, adminAuth, totalSaleGraph);

// ==============================================
// 3. Total Orders Graph
// ==============================================
dashboardRouter
  .route("/toatal-orders-graph")
  .get(loginAuth, adminAuth, totalOrdersGraph);

export { dashboardRouter };
