import express from "express";
import {
  getVendorPayouts,
  getBuyerRefunds,
  processVendorPayouts,
  processBuyerRefunds
} from "../controller/payoutController.js";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

const payoutRouter = express.Router();

// Admin routes for payouts
payoutRouter
  .route("/admin/vendor-payouts")
  .get(authenticateAdmin, authorizeAdmin, getVendorPayouts);

payoutRouter
  .route("/admin/buyer-refunds")
  .get(authenticateAdmin, authorizeAdmin, getBuyerRefunds);

payoutRouter
  .route("/admin/process-payouts")
  .post(authenticateAdmin, authorizeAdmin, processVendorPayouts);

payoutRouter
  .route("/admin/process-refunds")
  .post(authenticateAdmin, authorizeAdmin, processBuyerRefunds);

export default payoutRouter;