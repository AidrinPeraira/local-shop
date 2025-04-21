import { asyncHandler } from "../middlewares/asyncHandler.js";
import Wallet from "../models/walletModel.js";
import { HTTP_CODES } from "../utils/responseCodes.js";

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

  res.status(HTTP_CODES.OK).json({
    success: true,
    data: wallet,
  });
});

// Get wallet balance
export const getWalletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Wallet not found");
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    balance: wallet.balance,
  });
});

// Process order payment using wallet
export const processWalletPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, customOrderId } = req.body;
  const userId = req.user._id;

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Wallet not found");
  }

  if (!wallet.isActive) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Wallet is inactive");
  }

  if (wallet.balance < amount) {
    res.status(HTTP_CODES.BAD_REQUEST);
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
    customOrderId : customOrderId,
    orderId: orderId || null, // Make orderId optional
    description: `Payment for order ${customOrderId || 'pending'}`,
    status: "COMPLETED",
    balance: wallet.balance,
  });


  await wallet.save();

  res.status(HTTP_CODES.OK).json({
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
    res.status(HTTP_CODES.NOT_FOUND);
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

  res.status(HTTP_CODES.OK).json({
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
    res.status(HTTP_CODES.NOT_FOUND);
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

  res.status(HTTP_CODES.OK).json({
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
    res.status(HTTP_CODES.NOT_FOUND);
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

  res.status(HTTP_CODES.OK).json({
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
    res.status(HTTP_CODES.NOT_FOUND);
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

  res.status(HTTP_CODES.OK).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(transactions.length / limit),
    totalTransactions: transactions.length,
    transactions: paginatedTransactions,
  });
});

export const getAllWalletTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, sort = "desc", search } = req.query;

  try {
    // Build base query to get all wallets
    let query = {};

    // Add type filter
    if (type && type !== "ALL") {
      query["transactions.type"] = type;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { "transactions.transactionId": { $regex: search, $options: "i" } },
      ];
    }

    // Get all wallets
    const wallets = await Wallet.find(query)
      .populate('user', 'username email')
      .lean();

    // Extract and format all transactions
    let allTransactions = [];
    wallets.forEach(wallet => {
      const transactions = wallet.transactions.map(t => ({
        ...t,
        user: {
          _id: wallet.user._id,
          username: wallet.user.username,
          email: wallet.user.email
        }
      }));
      allTransactions = [...allTransactions, ...transactions];
    });

    // Apply type filter
    if (type && type !== "ALL") {
      allTransactions = allTransactions.filter(t => t.type === type);
    }

    // Apply search filter
    if (search) {
      allTransactions = allTransactions.filter(t => 
        t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        t.customOrderId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort transactions
    allTransactions.sort((a, b) => {
      return sort === "desc" 
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Calculate pagination
    const total = allTransactions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Get total statistics
    const statistics = {
      totalTransactions: total,
      totalAmount: allTransactions.reduce((sum, t) => sum + t.amount, 0),
      breakdown: {
        ORDER_PAYMENT: allTransactions.filter(t => t.type === "ORDER_PAYMENT").length,
        REFUND: allTransactions.filter(t => t.type === "REFUND").length,
        REFERRAL_REWARD: allTransactions.filter(t => t.type === "REFERRAL_REWARD").length,
        PROMO_CREDIT: allTransactions.filter(t => t.type === "PROMO_CREDIT").length
      }
    };

    res.status(HTTP_CODES.OK).json({
      success: true,
      transactions: paginatedTransactions,
      total,
      statistics,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching wallet transactions",
      error: error.message,
    });
  }
});