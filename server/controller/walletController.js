import { asyncHandler } from "../middlewares/asyncHandler.js";
import Wallet from "../models/walletModel.js";

// Create or get wallet for user
export const getWallet = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
      balance: 0,
      isActive: true,
    });
  }

  res.status(200).json({
    success: true,
    data: wallet,
  });
});

// Get wallet balance
export const getWalletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  res.status(200).json({
    success: true,
    balance: wallet.balance,
  });
});

// Process order payment using wallet
export const processWalletPayment = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;
  const userId = req.user._id;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  if (!wallet.isActive) {
    res.status(400);
    throw new Error("Wallet is inactive");
  }

  if (wallet.balance < amount) {
    res.status(400);
    throw new Error("Insufficient wallet balance");
  }

  // Generate transaction ID
  const transactionId = `WLT${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase();

  // Create transaction and update balance
  wallet.balance -= amount;
  wallet.transactions.push({
    transactionId,
    type: "ORDER_PAYMENT",
    amount: -amount,
    orderId: orderId || null, // Make orderId optional
    description: `Payment for order ${orderId || 'pending'}`,
    status: "COMPLETED",
    balance: wallet.balance,
  });

  await wallet.save();

  res.status(200).json({
    success: true,
    message: "Payment processed successfully",
    remainingBalance: wallet.balance,
    transactionId
  });
});

// Add refund amount to wallet
export const processRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;
  const userId = req.user._id;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  // Add refund amount and create transaction
  wallet.balance += amount;
  wallet.transactions.push({
    type: "REFUND",
    amount,
    orderId,
    description: `Refund for order ${orderId}`,
    status: "COMPLETED",
    balance: wallet.balance,
  });

  await wallet.save();

  res.status(200).json({
    success: true,
    message: "Refund processed successfully",
    currentBalance: wallet.balance,
  });
});

// Add referral reward
export const addReferralReward = asyncHandler(async (req, res) => {
  const { referralCode, amount } = req.body;
  const userId = req.user._id;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  // Add referral reward and create transaction
  wallet.balance += amount;
  wallet.transactions.push({
    type: "REFERRAL_REWARD",
    amount,
    referralCode,
    description: `Referral reward for code ${referralCode}`,
    status: "COMPLETED",
    balance: wallet.balance,
  });

  await wallet.save();

  res.status(200).json({
    success: true,
    message: "Referral reward added successfully",
    currentBalance: wallet.balance,
  });
});

// Add promo code credit
export const addPromoCredit = asyncHandler(async (req, res) => {
  const { promoCode, amount } = req.body;
  const userId = req.user._id;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  // Add promo credit and create transaction
  wallet.balance += amount;
  wallet.transactions.push({
    type: "PROMO_CREDIT",
    amount,
    promoCode,
    description: `Credit for promo code ${promoCode}`,
    status: "COMPLETED",
    balance: wallet.balance,
  });

  await wallet.save();

  res.status(200).json({
    success: true,
    message: "Promo credit added successfully",
    currentBalance: wallet.balance,
  });
});

// Get transaction history
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, type } = req.query;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  let transactions = wallet.transactions;

  // Filter by transaction type if specified
  if (type) {
    transactions = transactions.filter(t => t.type === type);
  }

  // Sort by date (newest first)
  transactions.sort((a, b) => b.createdAt - a.createdAt);

  // Implement pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(transactions.length / limit),
    totalTransactions: transactions.length,
    transactions: paginatedTransactions,
  });
});