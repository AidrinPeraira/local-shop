import { asyncHandler } from "../middlewares/asyncHandler.js";
import Transaction from "../models/adminTransactionModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import User from "../models/userModel.js";

// Get vendor payouts with filters
export const getVendorPayouts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = "PENDING", search = "", dateRange = "all" } = req.query;

  try {
    // Build base query for delivered orders
    const query = {
      orderStatus: "DELIVERED",
      "payment.status": "COMPLETED"
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

    // Get all delivered orders grouped by seller
    const orders = await Order.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.seller",
          totalAmount: {
            $sum: {
              $subtract: [
                "$items.productTotal",
                { 
                  $multiply: [
                    "$items.productTotal",
                    { $divide: ["$summary.couponDiscount", "$summary.subtotalAfterDiscount"] }
                  ]
                }
              ]
            }
          },
          orderCount: { $sum: 1 },
          orderIds: { $addToSet: "$_id" }
        }
      },
      {
        $lookup: {
          from: "sellers",
          localField: "_id",
          foreignField: "_id",
          as: "sellerDetails"
        }
      },
      {
        $match: search ? {
          "sellerDetails.sellerName": { $regex: search, $options: "i" }
        } : {}
      },
      {
        $project: {
          vendor: {
            _id: "$_id",
            name: { $arrayElemAt: ["$sellerDetails.sellerName", 0] },
            bankDetails: {
              bankName: { $arrayElemAt: ["$sellerDetails.bankDetails.bankName", 0] },
              accountNumber: { $arrayElemAt: ["$sellerDetails.bankDetails.accountNumber", 0] },
              accountHolderName: { $arrayElemAt: ["$sellerDetails.bankDetails.accountHolderName", 0] },
              ifscCode: { $arrayElemAt: ["$sellerDetails.bankDetails.ifscCode", 0] }
            }
          },
          amount: { $round: ["$totalAmount", 2] },
          orderCount: 1,
          orderIds: 1,
          status: "PENDING"
        }
      },
      {
        $addFields: {
          "vendor.bankDetails.formatted": {
            $concat: [
              { $arrayElemAt: ["$sellerDetails.bankDetails.bankName", 0] },
              " - ",
              { $arrayElemAt: ["$sellerDetails.bankDetails.accountHolderName", 0] },
              " (", 
              { $substr: [{ $arrayElemAt: ["$sellerDetails.bankDetails.accountNumber", 0] }, -4, 4] },
              ")"
            ]
          }
        }
      }
    ]);

    // Check for existing transactions to update status
    const payouts = await Promise.all(orders.map(async (order) => {
      const existingTransaction = await Transaction.findOne({
        'from.entity': order.vendor._id,
        type: "SELLER_PAYOUT",
      }).sort({ createdAt: -1 });

      return {
        ...order,
        status: existingTransaction ? existingTransaction.status : "PENDING"
      };
    }));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedPayouts = payouts.slice(startIndex, startIndex + parseInt(limit));
    const totalPages = Math.ceil(payouts.length / limit);

    res.status(200).json({
      success: true,
      payouts: paginatedPayouts,
      total: payouts.length,
      totalPages
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor payouts",
      error: error.message
    });
  }
});

export const processVendorPayout = asyncHandler(async (req, res) => {

})


