import { asyncHandler } from "../middlewares/asyncHandler.js";
import Transaction from "../models/adminTransactionModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js";

// Get vendor payouts with filters
export const getVendorPayouts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, dateRange } = req.query;

  try {
    const query = {
      type: "VENDOR_PAYOUT",
    };

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { "to.entity": { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
      ];
    }

    if (dateRange && dateRange !== "all") {
      const date = new Date();
      switch (dateRange) {
        case "today":
          date.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: date };
          break;
        case "week":
          date.setDate(date.getDate() - 7);
          query.createdAt = { $gte: date };
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          query.createdAt = { $gte: date };
          break;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const payouts = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("to.entity", "sellerName bankDetails")
      .lean();

    const formattedPayouts = payouts.map(payout => ({
      _id: payout._id,
      vendor: {
        name: payout.to.entity.sellerName,
        bankDetails: payout.to.entity.bankDetails
      },
      amount: payout.amount,
      orderCount: payout.metadata?.orderCount || 0,
      status: payout.status,
      createdAt: payout.createdAt
    }));

    res.json({
      success: true,
      payouts: formattedPayouts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor payouts",
      error: error.message
    });
  }
});

// Get buyer refunds with filters
export const getBuyerRefunds = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search, dateRange } = req.query;

  try {
    const query = {
      type: "REFUND",
    };

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { "to.entity": { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    if (dateRange && dateRange !== "all") {
      const date = new Date();
      switch (dateRange) {
        case "today":
          date.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: date };
          break;
        case "week":
          date.setDate(date.getDate() - 7);
          query.createdAt = { $gte: date };
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          query.createdAt = { $gte: date };
          break;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const refunds = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("to.entity", "username")
      .populate("orderId")
      .lean();

    const formattedRefunds = refunds.map(refund => ({
      _id: refund._id,
      orderId: refund.orderId?.orderId || "N/A",
      buyer: {
        name: refund.to.entity.username
      },
      amount: refund.amount,
      reason: refund.metadata?.reason || "Not specified",
      status: refund.status,
      paymentMethod: refund.paymentMethod,
      createdAt: refund.createdAt
    }));

    res.json({
      success: true,
      refunds: formattedRefunds,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching buyer refunds",
      error: error.message
    });
  }
});

