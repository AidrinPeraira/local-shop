import { asyncHandler } from "../middlewares/asyncHandler.js";
import Transaction from "../models/adminTransactionModel.js";

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
    const formattedTransactions = transactions.map((transaction) => ({
      _id: transaction._id,
      transactionId: transaction.transactionId,
      orderId: transaction.orderId?.orderId || "N/A",
      type: transaction.type,
      amount: transaction.amount,
      platformFee: transaction.platformFee,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      from: transaction.from,
      to: transaction.to,
      scheduledDate: transaction.scheduledDate,
      processedDate: transaction.processedDate,
      createdAt: transaction.createdAt,
      metadata: transaction.metadata,
    }));

    res.status(200).json({
      success: true,
      transactions: formattedTransactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
});

// Update transaction status
export const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  try {
    // Find transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Validate status transition
    const validTransitions = {
      PENDING: ["PROCESSING", "COMPLETED", "FAILED"],
      PROCESSING: ["COMPLETED", "FAILED"],
    };

    if (
      transaction.status !== status &&
      (!validTransitions[transaction.status] ||
        !validTransitions[transaction.status].includes(status))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    // Check if transaction is in final state
    if (["COMPLETED", "FAILED"].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot update transaction in final state",
      });
    }

    // Update status
    transaction.status = status;

    // Set processed date if completing transaction
    if (status === "COMPLETED") {
      transaction.processedDate = new Date();
    }

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction status updated successfully",
      transaction: {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        status: transaction.status,
        processedDate: transaction.processedDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating transaction status",
      error: error.message,
    });
  }
});

// Get transaction by ID
export const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId)
      .populate("orderId", "orderId")
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction: {
        ...transaction,
        orderId: transaction.orderId?.orderId || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
      error: error.message,
    });
  }
});