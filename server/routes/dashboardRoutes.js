import express from "express";
import {
  getDashboardStats
} from "../controller/dashboardController.js";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

// Admin dashboard routes
dashboardRouter
  .route("/dashboard/stats")
  .get(authenticateAdmin, authorizeAdmin, getDashboardStats);

export default dashboardRouter;