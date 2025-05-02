import { asyncHandler } from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Address from "../models/userAddresssModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import Wallet from "../models/walletModel.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import {
  createOrderTransaction,
  createRefundTransaction,
} from "../utils/transactionOperations.js";
import { getUTCDateTime } from "../utils/dateUtillServerSide.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
//buyer side controllers

export const checkOrderItemValid = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  
  const invalidProducts = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId).populate('category');
    
    if (!product) {
      invalidProducts.push({
        productId: item.productId,
        reason: "Product not found"
      });
      continue;
    }

    // check blocked
    if (!product.isActive || product.isBlocked || !product.category.isActive) {
      invalidProducts.push({
        productId: item.productId,
        productName: product.productName,
        reason: !product.category.isActive 
          ? "Category is no longer available"
          : "Product is no longer available"
      });
      continue;
    }

    const totalQuantityRequested = item.variants.reduce((sum, variant) => 
      sum + variant.quantity, 0
    );

    // Check if product has enough total stock
    if (product.stock < totalQuantityRequested) {
      invalidProducts.push({
        productId: item.productId,
        productName: product.productName,
        reason: `Insufficient total stock. Available: ${product.stock}, Requested: ${totalQuantityRequested}`
      });
      continue;
    }

    // Check each variant's stock
    let hasInvalidVariant = false;
    for (const variant of item.variants) {
      const productVariant = product.variants.find(v => v.variantId === variant.variantId);
      
      if (!productVariant) {
        invalidProducts.push({
          productId: item.productId,
          productName: product.productName,
          variantId: variant.variantId,
          reason: "Variant no longer exists"
        });
        hasInvalidVariant = true;
        break;
      }

      if (!productVariant.inStock) {
        invalidProducts.push({
          productId: item.productId,
          productName: product.productName,
          variantId: variant.variantId,
          attributes: variant.attributes,
          reason: "Variant is out of stock"
        });
        hasInvalidVariant = true;
        break;
      }

      if (productVariant.stock < variant.quantity) {
        invalidProducts.push({
          productId: item.productId,
          productName: product.productName,
          variantId: variant.variantId,
          attributes: variant.attributes,
          available: productVariant.stock,
          requested: variant.quantity,
          reason: `Insufficient variant stock. Available: ${productVariant.stock}, Requested: ${variant.quantity}`
        });
        hasInvalidVariant = true;
        break;
      }
    }

    if (hasInvalidVariant) continue;
  }

  if (invalidProducts.length > 0) {
    res.status(HTTP_CODES.OK).json({
      success: false,
      message: "Some products are invalid or unavailable",
      invalidProducts
    });
    return;
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: "All products are valid"
  });
});

export const createUserOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    cart,
    selectedAddressId,
    paymentMethod,
    userProfile,
    couponId,
    razorpay_order_id,
    razorpay_payment_id,
    paymentStatus,
    transactionId,
  } = req.body;

  try {
    // 1. Generate base order ID
    const timestamp = new Date();
    const dateStr = timestamp
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const baseOrderId = `ODR${dateStr}${randomStr}`;

    // 2. Get shipping address
    const shippingAddress = await Address.findById(selectedAddressId);
    if (!shippingAddress) {
      return res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    // Process items and create separate orders
    const itemsWithSeller = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // Stock validation and update logic remains the same
        for (const orderVariant of item.variants) {
          const productVariant = product.variants.find(
            (v) => v.variantId === orderVariant.variantId
          );
          if (!productVariant) {
            throw new Error(`Variant not found: ${orderVariant.variantId}`);
          }
          if (productVariant.stock < orderVariant.quantity) {
            throw new Error(
              `Insufficient stock for ${item.productName} - ${orderVariant.attributes}`
            );
          }
          productVariant.stock -= orderVariant.quantity;
          productVariant.inStock = productVariant.stock > 0;
        }
        await product.save();

        return {
          ...item,
          seller: product.seller,
          bulkDiscount: product.bulkDiscount,
        };
      })
    );

    // Calculate proportions for splitting fees
    const totalSubtotal = cart.summary.subtotalBeforeDiscount;
    let couponDiscount = 0;
    let appliedCoupon = null;

    if (couponId) {
      // Coupon validation remains the same
      appliedCoupon = await Coupon.findById(couponId);
      if (!appliedCoupon) {
        throw new Error("Invalid coupon");
      }
      // ... existing coupon validation ...
      if (cart.summary.subtotalBeforeDiscount >= appliedCoupon.minPurchase) {
        couponDiscount =
          appliedCoupon.discountType === "percentage"
            ? Math.min(
                (cart.summary.subtotalBeforeDiscount *
                  appliedCoupon.discountValue) /
                  100,
                appliedCoupon.maxDiscount
              )
            : Math.min(appliedCoupon.discountValue, appliedCoupon.maxDiscount);
      }
    }

    // Create separate orders for each item
    const orders = await Promise.all(
      itemsWithSeller.map(async (item, index) => {
        const itemSubtotal = item.productSubtotal;
        const proportion = itemSubtotal / totalSubtotal;

        // Split fees proportionally
        const itemCouponDiscount = Math.round(couponDiscount * proportion);
        const itemShippingCharge = Math.round(
          cart.summary.shippingCharge * proportion
        );
        const itemPlatformFee = Math.round(
          cart.summary.platformFee * proportion
        );

        const itemTotal =
          itemSubtotal -
          item.productDiscount -
          itemCouponDiscount +
          itemShippingCharge +
          itemPlatformFee;

        const order = new Order({
          orderId: `${baseOrderId}/${index + 1}`,
          user: userId,
          items: [item],
          shippingAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            phone: shippingAddress.phone || userProfile?.phone,
          },
          summary: {
            subtotalBeforeDiscount: itemSubtotal,
            totalDiscount: item.productDiscount,
            subtotalAfterDiscount: itemSubtotal - item.productDiscount,
            shippingCharge: itemShippingCharge,
            platformFee: itemPlatformFee,
            couponDiscount: itemCouponDiscount,
            coupon: couponId,
            cartTotal: itemTotal,
          },
          payment: {
            method: paymentMethod,
            status: paymentStatus,
            paymentProvider: paymentMethod === "ONLINE" ? "RAZORPAY" : null,
            paymentDetails: {
              orderId: razorpay_order_id || null,
              paymentId: razorpay_payment_id || null,
              timestamp: getUTCDateTime(),
              paymentMethod: paymentMethod,
            },
          },
          orderStatus:
            paymentMethod === "ONLINE"
              ? paymentStatus === "COMPLETED"
                ? "PENDING"
                : "FAILED"
              : "PENDING",
          trackingDetails: [
            {
              status:
                paymentMethod === "ONLINE"
                  ? paymentStatus === "COMPLETED"
                    ? "Order Placed"
                    : "Payment Failed"
                  : "Order Placed",
              timestamp: getUTCDateTime(),
              description:
                paymentMethod === "ONLINE"
                  ? paymentStatus === "COMPLETED"
                    ? "Your order has been placed successfully"
                    : "Payment failed for your order"
                  : "Your order has been placed successfully with Cash on Delivery",
            },
          ],
        });

        if (paymentMethod === "WALLET") {
          order.payment.wallet = {
            transactionId: transactionId,
          };
        }

        return order.save();
      })
    );

    // Update coupon usage if applicable
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      appliedCoupon.usedBy.push(userId);
      await appliedCoupon.save();
    }

    // Create transactions for paid orders
    if (paymentMethod === "ONLINE" || paymentMethod === "WALLET") {
      await Promise.all(orders.map((order) => createOrderTransaction(order)));
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: {
            product: {
              $in: itemsWithSeller.map((item) => item.productId.toString()),
            },
          },
        },
      }
    );

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      message: "Orders created successfully",
      order: {
        orderId: baseOrderId,
      },
      orders: orders.map((order) => ({
        orderId: order._id,
        customOrderId: order.orderId,
        total: order.summary.cartTotal,
        status: order.orderStatus,
        paymentStatus: order.payment.status,
        couponDiscount: order.summary.couponDiscount,
      })),
    });
  } catch (error) {
    res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: "Failed to create orders",
      error: error.message,
    });
  }
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 5, sort = "desc", search = "" } = req.query;

  try {
    // Build query
    const query = {
      user: userId,
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "items.productName": { $regex: search, $options: "i" } },
        { orderStatus: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Fetch orders with pagination and sorting
    const orders = await Order.find(query)
      .sort({ createdAt: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("items.productId", "images productName")
      .populate("items.seller", "sellerName")
      .lean();

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.payment.status,
      paymentMethod: order.payment.method,
      razorpay_order_id: order.payment.razorpay_order_id,
      items: order.items.map((item) => ({
        _id: item._id,
        productName: item.productName || item.productId.productName,
        image:
          item.image || (item.productId.images && item.productId.images[0]),
        variants: item.variants.map((variant) => ({
          variantId: variant.variantId,
          attributes: variant.attributes,
          quantity: variant.quantity,
          basePrice: variant.basePrice,
          variantTotal: variant.variantTotal,
        })),
        productTotal: item.productTotal,
        seller: {
          _id: item.seller._id,
          name: item.seller.sellerName,
        },
      })),
      summary: {
        subtotalBeforeDiscount: order.summary.subtotalBeforeDiscount,
        totalDiscount: order.summary.totalDiscount,
        subtotalAfterDiscount: order.summary.subtotalAfterDiscount,
        shippingCharge: order.summary.shippingCharge,
        platformFee: order.summary.platformFee,
        couponDiscount: order.summary.couponDiscount,
        cartTotal: order.summary.cartTotal,
      },
      shippingAddress: order.shippingAddress,
      payment: order.payment,
      trackingDetails: order.trackingDetails,
    }));

    res.status(HTTP_CODES.OK).json({
      success: true,
      orders: formattedOrders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("items.productId", "images productName")
      .populate("items.seller", "sellerName")
      .lean();

    if (!order) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    // Format order for frontend
    const formattedOrder = {
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      items: order.items.map((item) => ({
        _id: item._id,
        productName: item.productName,
        image: item.image,
        variants: item.variants.map((variant) => ({
          variantId: variant.variantId,
          attributes: variant.attributes,
          quantity: variant.quantity,
          basePrice: variant.basePrice,
          variantTotal: variant.variantTotal,
        })),
        productTotal: item.productTotal,
        seller: {
          _id: item.seller._id,
          name: item.seller.sellerName,
        },
        bulkDiscount: item.bulkDiscount,
        returnStatus: item.returnStatus
          ? {
              status: item.returnStatus.status,
              reason: item.returnStatus.reason,
              requestDate: item.returnStatus.requestDate,
              approvalDate: item.returnStatus.approvalDate,
              completionDate: item.returnStatus.completionDate,
            }
          : null,
      })),
      summary: {
        subtotalBeforeDiscount: order.summary.subtotalBeforeDiscount,
        totalDiscount: order.summary.totalDiscount,
        subtotalAfterDiscount: order.summary.subtotalAfterDiscount,
        shippingCharge: order.summary.shippingCharge,
        platformFee: order.summary.platformFee,
        couponDiscount: order.summary.couponDiscount,
        cartTotal: order.summary.cartTotal,
      },
      shippingAddress: order.shippingAddress,
      payment: order.payment,
      trackingDetails: order.trackingDetails,
    };

    res.status(HTTP_CODES.OK).json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
});

export const cancelUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      orderStatus: { $in: ["PENDING", "PROCESSING"] },
    });

    if (!order) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found or cannot be cancelled",
      });
    }

    // Update order status
    order.orderStatus = "CANCELLED";

    // Add tracking detail
    order.trackingDetails.push({
      status: "CANCELLED",
      timestamp: new Date(),
      description: "Order cancelled by user",
    });

    if (
      (order.payment.method === "ONLINE" ||
        order.payment.method === "WALLET") &&
      order.payment.status === "COMPLETED"
    ) {
      // Find or create user wallet
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        wallet = await Wallet.create({
          user: userId,
          balance: 0,
        });
      }

      // Create wallet transaction
      const walletTransaction = {
        transactionId: `WREF${Date.now()}${Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase()}`,
        type: "REFUND",
        amount: order.summary.cartTotal,
        orderId: order._id,
        customOrderId: order.orderId,
        description: `Refund for cancelled order #${order.orderId}`,
        status: "COMPLETED",
        balance: wallet.balance + order.summary.cartTotal,
      };

      // Update wallet balance and add transaction
      wallet.balance += order.summary.cartTotal;
      wallet.transactions.push(walletTransaction);
      await wallet.save();
      await createRefundTransaction(order, "REFUND");
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        for (const orderVariant of item.variants) {
          const productVariant = product.variants.find(
            (v) => v.variantId === orderVariant.variantId
          );
          if (productVariant) {
            productVariant.stock += orderVariant.quantity;
            productVariant.inStock = productVariant.stock > 0;
          }
        }
        await product.save();
      }
    }

    await order.save();

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
});

export const returnUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  const { returnReason: reason } = req.body;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      orderStatus: "DELIVERED",
    });

    if (!order) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found or cannot be returned",
      });
    }

    // Check if return is requested within valid timeframe (e.g., 7 days)
    const deliveredStatus = order.trackingDetails.find(
      (t) => t.status === "DELIVERED"
    );
    if (deliveredStatus) {
      const deliveryDate = new Date(deliveredStatus.timestamp);
      const currentDate = new Date();
      const daysSinceDelivery = Math.floor(
        (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceDelivery > 7) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({
          success: false,
          message: "Return window has expired (7 days from delivery)",
        });
      }
    }

    // Update order status
    order.orderStatus = "RETURN-REQUESTED";

    // Add tracking detail with return reason
    order.trackingDetails.push({
      status: "RETURN-REQUESTED",
      timestamp: getUTCDateTime(),
      description: `Return requested by user. Reason: ${reason}`,
    });

    await order.save();

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Return request submitted successfully",
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing return request",
      error: error.message,
    });
  }
});

//razor pay
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(HTTP_CODES.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error.message,
    });
  }
});

// Add this to verify payment
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    return res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Payment verified successfully",
    });
  } else {
    return res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: "Invalid signature sent",
    });
  }
});

//seller side controllers
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const {
    page = 1,
    limit = 6,
    status = "",
    sort = "desc",
    search = "",
  } = req.query;

  try {
    // Build base query for seller's orders

    const query = {};
    if (req.user.role === "seller") {
      query["items.seller"] = sellerId;
    }

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "items.productName": { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Fetch orders with pagination and sorting
    const orders = await Order.find(query)
      .sort({ createdAt: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "username email")
      .lean();

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderId: order.orderId,
      user: order.user
        ? {
            name: order.user.username || "Deleted User",
            email: order.user.email || "No Email",
          }
        : {
            name: "Unknown User",
            email: "No Email",
          },
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      // Only filter items for sellers, show all items for admin
      items:
        req.user.role === "seller"
          ? order.items.filter(
              (item) => item.seller.toString() === sellerId.toString()
            )
          : order.items,
      summary: {
        subtotalBeforeDiscount: order.summary.subtotalBeforeDiscount,
        totalDiscount: order.summary.totalDiscount,
        subtotalAfterDiscount: order.summary.subtotalAfterDiscount,
        shippingCharge: order.summary.shippingCharge,
        platformFee: order.summary.platformFee,
        cartTotal: order.summary.cartTotal,
      },
      shippingAddress: order.shippingAddress,
      payment: order.payment,
      trackingDetails: order.trackingDetails,
    }));

    res.status(HTTP_CODES.OK).json({
      success: true,
      orders: formattedOrders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

export const sellerUpdateOrderStatus = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const user = req.user;
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order and verify seller ownership
    let order = {};
    if (user.role == "admin") {
      order = await Order.findOne({
        _id: orderId,
      });
    } else {
      order = await Order.findOne({
        _id: orderId,
        "items.seller": sellerId,
      });
    }

    if (!order) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Prevent updates for final states
    const finalStates = ["DELIVERED", "CANCELLED", "RETURNED"];
    if (finalStates.includes(order.orderStatus) && user.role !== "admin") {
      return res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: `Cannot update order status. Order is already ${order.orderStatus.toLowerCase()}`,
      });
    }

    // Validate status transition
    const validTransitions = {
      PENDING: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      "RETURN-REQUESTED": ["RETURNED", "CANCELLED", "RETURN-PROCESSING"],
    };

    if (
      validTransitions[order.orderStatus] &&
      !validTransitions[order.orderStatus].includes(status) &&
      user.role !== "admin"
    ) {
      return res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    // Update order status
    order.orderStatus = status;

    // Add tracking detail
    order.trackingDetails.push({
      status,
      timestamp: getUTCDateTime(),
      description: `Order ${status.toLowerCase()} by ${user.role} ${user._id}`,
    });

    await order.save();

    if (status === "DELIVERED" && order.payment.method === "COD") {
      await createOrderTransaction(order);
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Order status updated successfully",
      order: {
        orderId: order.orderId,
        status: order.orderStatus,
        trackingDetails: order.trackingDetails,
      },
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});

export const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update order payment status
      order.payment.status = "COMPLETED";
      order.payment.paymentDetails = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        timestamp: getUTCDateTime(),
        paymentMethod: "ONLINE",
      };
      order.orderStatus = "PENDING";

      // Add tracking detail
      order.trackingDetails.push({
        status: "Payment Completed",
        timestamp: getUTCDateTime(),
        description: "Payment completed successfully",
      });

      await order.save();

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Payment status updated successfully",
        order: {
          orderId: order.orderId,
          status: order.orderStatus,
          paymentStatus: order.payment.status,
        },
      });
    } else {
      return res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating payment status",
      error: error.message,
    });
  }
});
