import express from "express";
import { 
  getAllTransactions, 
  updateTransactionStatus, 
  getTransactionById 
} from "../controller/transactionsController.js";
import {  authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

const transactionRouter = express.Router();

// Admin routes for transactions
transactionRouter
  .route("/admin")
  .get(authenticateAdmin, authorizeAdmin, getAllTransactions);

transactionRouter
  .route("/admin/:transactionId")
  .get(authenticateAdmin, authorizeAdmin,  getTransactionById)
  .put(authenticateAdmin, authorizeAdmin, updateTransactionStatus);

export default transactionRouter;