import express from "express";
import { 
  getAdminBalance,
  getAllTransactions, 
} from "../controller/transactionsController.js";
import {  authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

const transactionRouter = express.Router();

// Admin routes for transactions
transactionRouter
  .route("/admin")
  .get(authenticateAdmin, authorizeAdmin, getAllTransactions);
transactionRouter
  .route("/admin/balance")
  .get(authenticateAdmin, authorizeAdmin, getAdminBalance);


export default transactionRouter;