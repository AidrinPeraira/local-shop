import express from "express";
import {
  getVendorPayouts,
  getBuyerRefunds,
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



export default payoutRouter;