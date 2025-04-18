import { asyncHandler } from "../middlewares/asyncHandler.js";
import Transaction from "../models/adminTransactionModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import SellerTransaction from "../models/sellerTransactionModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { getUTCDateTime } from "../utils/dateUtillServerSide.js";

// Get vendor payouts with filters
export const getVendorPayouts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 5,
    status = "PENDING",
    search = "",
    dateRange = "all",
  } = req.query;

  try {
    // Build base query for delivered orders
    const query = {
      orderStatus: "DELIVERED",
      "payment.status": "COMPLETED",
    };

    // Add date range filter if specified
    if (dateRange !== "all") {
      const today = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "week":
          startDate.setDate(today.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      query.createdAt = { $gte: startDate, $lte: today };
    }

    // Get all delivered orders with seller details
    const orders = await Order.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "sellers",
          localField: "items.seller",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      {
        $match: search
          ? {
              "sellerDetails.sellerName": { $regex: search, $options: "i" },
            }
          : {},
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          vendor: {
            _id: "$items.seller",
            name: { $arrayElemAt: ["$sellerDetails.sellerName", 0] },
            bankDetails: {
              bankName: {
                $arrayElemAt: ["$sellerDetails.bankDetails.bankName", 0],
              },
              accountNumber: {
                $arrayElemAt: ["$sellerDetails.bankDetails.accountNumber", 0],
              },
              accountHolderName: {
                $arrayElemAt: [
                  "$sellerDetails.bankDetails.accountHolderName",
                  0,
                ],
              },
              ifscCode: {
                $arrayElemAt: ["$sellerDetails.bankDetails.ifscCode", 0],
              },
            },
          },
          amount: {
            $subtract: [
              "$items.productTotal",
              {
                $multiply: [
                  "$items.productTotal",
                  {
                    $divide: [
                      "$summary.couponDiscount",
                      "$summary.subtotalAfterDiscount",
                    ],
                  },
                ],
              },
            ],
          },
          createdAt: 1,
        },
      },
      {
        $addFields: {
          "vendor.bankDetails.formatted": {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$vendor.bankDetails.bankName", null] },
                  { $ne: ["$vendor.bankDetails.accountHolderName", null] },
                  { $ne: ["$vendor.bankDetails.accountNumber", null] },
                ],
              },
              then: {
                $concat: [
                  { $ifNull: ["$vendor.bankDetails.bankName", ""] },
                  " - ",
                  { $ifNull: ["$vendor.bankDetails.accountHolderName", ""] },
                  " (",
                  {
                    $substr: [
                      { $ifNull: ["$vendor.bankDetails.accountNumber", ""] },
                      {
                        $subtract: [
                          {
                            $strLenCP: {
                              $ifNull: [
                                "$vendor.bankDetails.accountNumber",
                                "",
                              ],
                            },
                          },
                          4,
                        ],
                      },
                      4,
                    ],
                  },
                  ")",
                ],
              },
              else: "Bank details not available",
            },
          },
          amount: { $round: ["$amount", 2] },
        },
      },
    ]);

    // Check for existing transactions to update status
    const payouts = await Promise.all(
      orders.map(async (order) => {
        const existingTransaction = await Transaction.findOne({
          orderId: order._id,
          type: "SELLER_PAYOUT",
        }).sort({ createdAt: -1 });

        return {
          ...order,
          status: existingTransaction ? existingTransaction.status : "PENDING",
        };
      })
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedPayouts = payouts.slice(
      startIndex,
      startIndex + parseInt(limit)
    );
    const totalPages = Math.ceil(payouts.length / limit);

    res.status(200).json({
      success: true,
      payouts: paginatedPayouts,
      total: payouts.length,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor payouts",
      error: error.message,
    });
  }
});

export const processVendorPayout = asyncHandler(async (req, res) => {
  const { orderId, sellerId } = req.body;


  try {
    // Get the payout details from orders
    const order = await Order.findOne({
      _id: orderId,
      orderStatus: "DELIVERED",
      "payment.status": "COMPLETED",
      "items.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No eligible orders found for payout",
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const sellerItems = order.items.filter(item => item.seller.toString() === sellerId);
    const subtotal = sellerItems.reduce((total, item) => {
      const itemDiscount = (item.productTotal * order.summary.couponDiscount) / order.summary.subtotalAfterDiscount;
      return total + (item.productTotal - itemDiscount);
    }, 0);

    const platformFee = 1000;
    const payoutAmount = subtotal;

    const transactionId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create admin transaction
    const adminTransaction = await Transaction.create({
      transactionId,
      orderId: order._id,
      type: "SELLER_PAYOUT",
      amount: payoutAmount,
      platformFee: {
        buyerFee: 0,  
        sellerFee: platformFee  
      },
      status: "COMPLETED",
      paymentMethod: "BANK_TRANSFER",
      to: {
        entity: seller._id,
        type: "SELLER"
      },
      from: {
        entity: "PLATFORM",
        type: "ADMIN"
      },
      scheduledDate: getUTCDateTime(),
      metadata: {
        orderIds: [order._id],
        sellerDetails: {
          name: seller.sellerName,
          bankDetails: seller.bankDetails
        }
      }
    });

    // Create seller transaction
    const sellerTransaction = await SellerTransaction.create({
      transactionId: adminTransaction.transactionId,
      orderId: order._id,
      seller: seller._id,
      type: "ORDER_SETTLEMENT",
      amount: payoutAmount,
      platformFee: platformFee,
      platformFee: 0,
      status: "COMPLETED",
      paymentMethod: "BANK_TRANSFER",
      bankDetails: seller.bankDetails,
      scheduledDate: getUTCDateTime(),
      settlementPeriod: {
        from: order.createdAt,
        to: getUTCDateTime()
      }
    });

    res.status(200).json({
      success: true,
      message: "Payout processrd",
      data: {
        adminTransaction,
        sellerTransaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing vendor payout",
      error: error.message,
    });
  }
});
