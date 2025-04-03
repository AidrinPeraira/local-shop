import express from "express";
import {
  getDashboardStats
} from "../controller/dashboardController.js";
import { authenticateAdmin, authenticateSeller, authorizeAdmin, authorizeSeller } from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

// Admin dashboard routes
dashboardRouter
  .route("/dashboard/stats")
  .get(authenticateSeller, authorizeSeller, getDashboardStats);

export default dashboardRouter;