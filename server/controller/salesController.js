import Order from "../models/orderModel.js";

export const getSalesReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      period,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search = "",
    } = req.query;

    let dateFilter = {};

    if (period) {
      const now = new Date();
      switch (period) {
        case "day":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
              $lt: new Date(now.setHours(23, 59, 59, 999)),
            },
          };
          break;
        case "week":
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          dateFilter = {
            createdAt: {
              $gte: new Date(weekStart.setHours(0, 0, 0, 0)),
              $lt: new Date(now.setDate(weekStart.getDate() + 7)),
            },
          };
          break;
        case "month":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lt: new Date(now.getFullYear(), now.getMonth() + 1, 0),
            },
          };
          break;
        case "year":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), 0, 1),
              $lt: new Date(now.getFullYear() + 1, 0, 1),
            },
          };
          break;
      }
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const searchFilter = search
      ? {
          orderId: { $regex: search, $options: "i" },
        }
      : {};

    const roleFilter = {};
    if (req.user.role === "seller") {
      roleFilter["items.seller"] = req.user._id;
    }

    const filter = {
      ...dateFilter,
      ...searchFilter,
      ...roleFilter,
      orderStatus: { $nin: ["FAILED", "CANCELLED", "RETURNED"] },
    };

    // const totalCount = await Order.countDocuments(filter);
    // const totalPages = Math.ceil(totalCount / limit);

    // const orders = await Order.find(filter)
    //   .sort({ [sort]: order })
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .populate("user", "name email")
    //   .populate({
    //     path: "items",
    //     populate: {
    //       path: "seller",
    //       select: "sellerName email",
    //     },
    //   })
    //   .lean();

    const aggregationPipeline = [
      { $match: filter },
      { $unwind: "$items" },
      {
        $match: {
          $and: [
            {
              "items.returnStatus.status": {
                $nin: ["RETURN_COMPLETED", "CANCELLED"],
              },
            },
            { orderStatus: { $nin: ["FAILED", "CANCELLED"] } },
          ],
        },
      },
    ];

    if (req.user.role === "seller") {
      aggregationPipeline.push(
        { $unwind: "$items" },
        { $match: { "items.seller": req.user._id } }
      );
    }

    // Group by order for counting and calculations
    aggregationPipeline.push({
      $group: {
        _id: null,
        uniqueOrders: { $addToSet: "$_id" }, // Count unique orders
        totalItems: { $sum: 1 },
        totalAmount: {
          $sum:
            req.user.role === "seller"
              ? "$items.productTotal"
              : "$summary.cartTotal",
        },
        totalDiscount: {
          $sum:
            req.user.role === "seller"
              ? "$items.productDiscount"
              : { $add: ["$summary.totalDiscount", "$summary.couponDiscount"] },
        },
        totalProductDiscount: {
          $sum:
            req.user.role === "seller"
              ? "$items.productDiscount"
              : "$summary.totalDiscount",
        },
        totalCouponDiscount: {
          $sum: req.user.role === "seller" ? 0 : "$summary.couponDiscount",
        },
        totalPlatformFee: {
          $sum: req.user.role === "seller" ? 0 : "$summary.platformFee",
        },
        totalShippingCharge: {
          $sum: req.user.role === "seller" ? 0 : "$summary.shippingCharge",
        },
      },
    });

    // Modified orders query to exclude returned/cancelled items
    const orders = await Order.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $match: {
          $and: [
            { "items.returnStatus.status": { $nin: ["RETURN_COMPLETED", "CANCELLED"] } },
            { orderStatus: { $nin: ["FAILED", "CANCELLED"] } }
          ]
        }
      },
      ...(req.user.role === "seller" ? [{ $match: { "items.seller": req.user._id } }] : []),
      {
        $group: {
          _id: "$_id",
          orderId: { $first: "$orderId" },
          createdAt: { $first: "$createdAt" },
          user: { $first: "$user" },
          items: { $push: "$items" },
          summary: { $first: "$summary" },
          orderStatus: { $first: "$orderStatus" }
        }
      },
      { $sort: { [sort]: order === "desc" ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]).exec();

    // Populate user and seller details
    await Order.populate(orders, [
      { path: "user", select: "name email" },
      { path: "items.seller", select: "sellerName email" }
    ]);

    const aggregatedData = await Order.aggregate(aggregationPipeline);

    const stats = aggregatedData[0] || {
      totalOrders: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalProductDiscount: 0,
      totalCouponDiscount: 0,
      totalPlatformFee: 0,
      totalShippingCharge: 0,
    };

    if (aggregatedData[0]) {
      stats.totalOrders = aggregatedData[0].uniqueOrders.length;
    }
    const totalCount = orders.length;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
