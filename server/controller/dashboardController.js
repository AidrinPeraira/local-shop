import { asyncHandler } from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Transaction from "../models/adminTransactionModel.js";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import Product from "../models/productModel.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { timeRange } = req.query;
  ``;
  const isSeller = req.user.role === "seller";
  const sellerId = isSeller ? req.user._id : null;

  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const baseMatch = {
      createdAt: { $gte: startDate, $lte: endDate },
      ...(isSeller && { "items.sellerId": sellerId }),
    };

    // Get total orders and related metrics
    const orderMetrics = await Order.aggregate([
      { $match: baseMatch },
      { $unwind: "$items" },
      ...(isSeller ? [{ $match: { "items.sellerId": sellerId } }] : []),
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$items.totalPrice" },
          totalDiscounts: { $sum: "$items.discount" },
          cancellations: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "CANCELLED"] }, 1, 0] },
          },
          returns: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$orderStatus",
                    [
                      "RETURNED",
                      "RETURN-REQUESTED",
                      "RETURN-PROCESSING",
                      "RETURN-COMPLETED",
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Get revenue data for chart
    const revenueData = await Order.aggregate([
      {
        $match: {
          ...baseMatch,
          orderStatus: { $nin: ["CANCELLED", "RETURNED"] },
        },
      },
      { $unwind: "$items" },
      ...(isSeller ? [{ $match: { "items.sellerId": sellerId } }] : []),
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", revenue: 1, _id: 0 } },
    ]);

    // Get category distribution
    const categoryDistribution = await Order.aggregate([
      {
        $match: {
          ...baseMatch,
          orderStatus: { $nin: ["CANCELLED", "RETURNED"] },
        },
      },
      { $unwind: "$items" },
      ...(isSeller ? [{ $match: { "items.sellerId": sellerId } }] : []),
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          value: { $sum: "$items.totalQuantity" },
        },
      },
      { $project: { name: "$_id", value: 1, _id: 0 } },
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          ...baseMatch,
          orderStatus: { $nin: ["CANCELLED", "RETURNED"] },
        },
      },
      { $unwind: "$items" },
      ...(isSeller ? [{ $match: { "items.sellerId": sellerId } }] : []),
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.productName" },
          soldCount: { $sum: "$items.totalQuantity" },
        },
      },
      { $sort: { soldCount: -1 } },
      { $limit: 10 },
      { $project: { _id: 1, name: 1, soldCount: 1 } },
    ]);

    // Get total customers and sellers
    const totalCustomers = isSeller
      ? await Order.distinct("userId", { "items.sellerId": sellerId }).length
      : await User.countDocuments();

    const totalSellers = isSeller ? 1 : await Seller.countDocuments();

    const metrics = orderMetrics[0] || {
      totalOrders: 0,
      totalSales: 0,
      totalDiscounts: 0,
      cancellations: 0,
      returns: 0,
    };

    res.status(200).json({
      success: true,
      stats: {
        totalOrders: metrics.totalOrders,
        totalSales: metrics.totalSales,
        totalCustomers,
        totalSellers,
        cancellations: metrics.cancellations,
        returns: metrics.returns,
        totalDiscounts: metrics.totalDiscounts,
        revenueData,
        categoryDistribution,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
});
