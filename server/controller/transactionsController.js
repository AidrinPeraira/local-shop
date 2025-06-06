import { asyncHandler } from "../middlewares/asyncHandler.js";
import Transaction from "../models/adminTransactionModel.js";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import SellerTransaction from "../models/sellerTransactionModel.js";
import { HTTP_CODES } from "../utils/responseCodes.js";

// Get all transactions with filters, search, sort, and pagination
export const getAllTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, status, sort = "desc", search } = req.query;

  try {
    // Build query
    const query = {};

    // Add type filter
    if (type && type !== "ALL") {
      query.type = type;
    }

    // Add status filter
    if (status && status !== "ALL") {
      query.status = status;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { "from.entity": { $regex: search, $options: "i" } },
        { "to.entity": { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Fetch transactions with pagination and sorting
    const transactions = await Transaction.find(query)
      .sort({ createdAt: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("orderId", "orderId")
      .lean();

    // Format transactions for frontend
    const formattedTransactions = await Promise.all(transactions.map(async (transaction) => {
      let fromEntity = transaction.from.entity;
      let toEntity = transaction.to.entity;
    
      // Resolve "from" entity name
      if (transaction.from.type === "BUYER") {
        const user = await User.findById(fromEntity).select("username");
        if (user) fromEntity = user.username;
      } else if (transaction.from.type === "SELLER") {
        const seller = await Seller.findById(fromEntity).select("sellerName");
        if (seller) fromEntity = seller.sellerName;
      }
    
      // Resolve "to" entity name
      if (transaction.to.type === "BUYER") {
        const user = await User.findById(toEntity).select("username");
        if (user) toEntity = user.username;
      } else if (transaction.to.type === "SELLER") {
        const seller = await Seller.findById(toEntity).select("sellerName");
        if (seller) toEntity = seller.sellerName;
      }
    
      return {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        orderId: transaction.orderId?.orderId || "N/A",
        type: transaction.type,
        amount: transaction.amount,
        platformFee: transaction.platformFee,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        from: {
          ...transaction.from,
          entity: fromEntity
        },
        to: {
          ...transaction.to,
          entity: toEntity
        },
        scheduledDate: transaction.scheduledDate,
        processedDate: transaction.processedDate,
        createdAt: transaction.createdAt,
        metadata: transaction.metadata,
      };  
      
    }));  

    res.status(HTTP_CODES.OK).json({
      success: true,
      transactions: formattedTransactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
});


export const getAdminBalance = asyncHandler(async (req, res) => {
  try {
    // Get all COMPLETED transactions
    const transactions = await Transaction.find({ 
      status: "COMPLETED" 
    }).select('type amount platformFee').lean();

    let balance = 0;
    let totalPlatformFees = 0;
    let breakdown = {
      orderPayments: 0,
      sellerPayouts: 0,
      refunds: 0,
      platformFees: {
        fromBuyers: 0,
        fromSellers: 0
      }
    };

    // Calculate balance based on transaction types
    transactions.forEach(transaction => {
      switch (transaction.type) {
        case "ORDER_PAYMENT":
          balance += transaction.amount;
          breakdown.orderPayments += transaction.amount;
          if (transaction.platformFee) {
            if (transaction.platformFee.buyerFee) {
              totalPlatformFees += transaction.platformFee.buyerFee;
              breakdown.platformFees.fromBuyers += transaction.platformFee.buyerFee;
            }
            
          }
          break;

        case "SELLER_PAYOUT":
          balance -= transaction.amount;
          breakdown.sellerPayouts += transaction.amount;
          if (transaction.platformFee) {
            
            if (transaction.platformFee.sellerFee) {
              balance += transaction.platformFee.sellerFee;
              totalPlatformFees += transaction.platformFee.sellerFee;
              breakdown.platformFees.fromSellers += transaction.platformFee.sellerFee;
            }
          }
          break;

        case "REFUND":
          balance -= transaction.amount;
          breakdown.refunds += transaction.amount;
          totalPlatformFees -= transaction.platformFee.buyerFee
          breakdown.platformFees.fromBuyers -= transaction.platformFee.buyerFee
          break;
      }
    });

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        currentBalance: balance,
        totalPlatformFees,
        breakdown
      }
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error calculating admin balance",
      error: error.message
    });
  }
});



export const getSellerTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, status, sort = "desc", search } = req.query;
  const sellerId = req.user._id;

  try {
    // Build query
    const query = { seller: sellerId };

    // Add type filter
    if (type && type !== "ALL") {
      query.type = type;
    }

    // Add status filter
    if (status && status !== "ALL") {
      query.status = status;
    }

    // Add search functionality
    if (search) {
      query.transactionId = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await SellerTransaction.countDocuments(query);

    // Fetch transactions with pagination and sorting
    const transactions = await SellerTransaction.find(query)
      .sort({ createdAt: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("orderId", "orderId")
      .lean();

    res.status(HTTP_CODES.OK).json({
      success: true,
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
});

export const getSellerBalance = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  try {
    const transactions = await SellerTransaction.find({ 
      seller: sellerId,
      status: "COMPLETED" 
    }).select('type amount platformFee').lean();

    let balance = 0;
    let totalPlatformFees = 0;
    let breakdown = {
      orderSettlements: 0,
      refundDeductions: 0,
      platformFees: 0
    };

    transactions.forEach(transaction => {
      switch (transaction.type) {
        case "ORDER_SETTLEMENT":
          balance += transaction.amount;
          breakdown.orderSettlements += transaction.amount;
          totalPlatformFees += transaction.platformFee;
          breakdown.platformFees += transaction.platformFee;
          break;

        case "REFUND_DEDUCTION":
          balance -= transaction.amount;
          breakdown.refundDeductions += transaction.amount;
          break;

        case "PLATFORM_FEE":
          balance -= transaction.amount;
          breakdown.platformFees += transaction.amount;
          break;
      }
    });

    res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        currentBalance: balance,
        totalPlatformFees,
        breakdown
      }
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error calculating seller balance",
      error: error.message
    });
  }
});

