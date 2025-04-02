import express from "express";
import {
  getWallet,
  getWalletBalance,
  processWalletPayment,
  processRefund,
  addReferralReward,
  addPromoCredit,
  getTransactionHistory,
} from "../controller/walletController.js";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";

const walletRoutes = express.Router();

// Protect all wallet routes

// Get wallet and balance routes
walletRoutes.get("/", authenticateUser,  getWallet);
walletRoutes.get("/balance", authenticateUser, getWalletBalance);

// Transaction routes
walletRoutes.post("/pay", authenticateUser, processWalletPayment);
walletRoutes.post("/referral", authenticateUser, addReferralReward);
walletRoutes.post("/refund", authenticateSeller, authorizeSeller, processRefund);
walletRoutes.post("/promo", authenticateUser, addPromoCredit);

// Transaction history route
walletRoutes.get("/transactions", authenticateUser, getTransactionHistory);

export default walletRoutes;