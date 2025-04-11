import express from "express";
import { 
  getAdminBalance,
  getAllTransactions,
  getSellerBalance,
  getSellerTransactions, 
} from "../controller/transactionsController.js";
import {  authenticateAdmin, authenticateSeller, authorizeAdmin } from "../middlewares/authMiddleware.js";

const transactionRouter = express.Router();

// Admin routes for transactions
transactionRouter
  .route("/admin")
  .get(authenticateAdmin, authorizeAdmin, getAllTransactions);
transactionRouter
  .route("/admin/balance")
  .get(authenticateAdmin, authorizeAdmin, getAdminBalance);

  transactionRouter
  .route("/seller")
  .get(authenticateSeller, getSellerTransactions);
transactionRouter
  .route("/seller/balance")
  .get(authenticateSeller, getSellerBalance);


export default transactionRouter;