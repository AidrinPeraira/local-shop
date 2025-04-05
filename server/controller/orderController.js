import { asyncHandler } from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Address from "../models/userAddresssModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import Wallet from "../models/walletModel.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from 'crypto';
import Transaction from "../models/adminTransactionModel.js";
//buyer side controllers

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
    transactionId
  } = req.body;



  try {
    // 1. Generate custom order ID
    const timestamp = new Date();
    const dateStr = timestamp
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const customOrderId = `ODR${dateStr}${randomStr}`;

    // 2. Get shipping address
    const shippingAddress = await Address.findById(selectedAddressId);
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    const itemsWithSeller = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // Update stock for each variant
        for (const orderVariant of item.variants) {
          const productVariant = product.variants.find(
            (v) => v.variantId === orderVariant.variantId
          );

          if (!productVariant) {
            throw new Error(`Variant not found: ${orderVariant.variantId}`);
          }

          // Check if enough stock is available
          if (productVariant.stock < orderVariant.quantity) {
            throw new Error(
              `Insufficient stock for ${item.productName} - ${orderVariant.attributes}`
            );
          }

          // Update variant stock
          productVariant.stock -= orderVariant.quantity;
          productVariant.inStock = productVariant.stock > 0;
        }

        // Save the updated product
        await product.save();

        return {
          ...item,
          seller: product.seller,
          bulkDiscount: product.bulkDiscount,
        };
      })
    );

    // 3. Create new order
    // Add coupon validation and calculation
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (couponId) {
      appliedCoupon = await Coupon.findById(couponId);
      if (!appliedCoupon) {
        throw new Error("Invalid coupon");
      }

      // Validate coupon
      if (!appliedCoupon.isActive || appliedCoupon.validUntil < new Date()) {
        throw new Error("Coupon has expired");
      }

      if (appliedCoupon.usedCount >= appliedCoupon.usageLimit) {
        throw new Error("Coupon usage limit exceeded");
      }

      // Calculate coupon discount
      if (cart.summary.subtotalBeforeDiscount >= appliedCoupon.minPurchase) {
        couponDiscount = appliedCoupon.discountType === "percentage"
          ? Math.min(
              (cart.summary.subtotalBeforeDiscount * appliedCoupon.discountValue) / 100,
              appliedCoupon.maxDiscount
            )
          : Math.min(appliedCoupon.discountValue, appliedCoupon.maxDiscount);
      } else {
        throw new Error(`Minimum purchase amount of ₹${appliedCoupon.minPurchase} required for this coupon`);
      }

      // Update coupon usage
      appliedCoupon.usedCount += 1;
      appliedCoupon.usedBy.push(userId);
      await appliedCoupon.save();
    }

    // Update cart total with coupon discount
    const finalAmount = cart.summary.cartTotal - couponDiscount


    // Create new order with coupon details
    const order = new Order({
      orderId: customOrderId,
      user: userId,
      items: itemsWithSeller,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        phone: shippingAddress.phone || userProfile?.phone,
      },
      summary: {
        subtotalBeforeDiscount: cart.summary.subtotalBeforeDiscount,
        totalDiscount: cart.summary.totalDiscount,
        subtotalAfterDiscount: cart.summary.subtotalAfterDiscount,
        shippingCharge: cart.summary.shippingCharge,
        platformFee: cart.summary.platformFee,
        couponDiscount: couponDiscount,
        coupon: couponId,
        cartTotal: finalAmount,
      },
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        paymentProvider: paymentMethod === "ONLINE" ? "RAZORPAY" : null,
        paymentDetails: {
          orderId: razorpay_order_id || null,
          paymentId: razorpay_payment_id || null,
          timestamp: new Date(),
          paymentMethod: paymentMethod
        }
      },
      orderStatus: paymentMethod === "ONLINE"
        ? (paymentStatus === "COMPLETED" ? "PENDING" : "FAILED")
        : "PENDING",
      trackingDetails: [
        {
          status: paymentMethod === "ONLINE"
            ? (paymentStatus === "COMPLETED" ? "Order Placed" : "Payment Failed")
            : "Order Placed",
          timestamp: new Date(),          description: paymentMethod === "ONLINE"
            ? (paymentStatus === "COMPLETED" 
                ? "Your order has been placed successfully" 
                : "Payment failed for your order")
            : "Your order has been placed successfully with Cash on Delivery",
        },
      ],
    });
    
    if (paymentMethod === "WALLET") {
      order.payment.wallet = {
        transactionId: transactionId
      };
    }


    // 4. Save the order
    await order.save();

    // make transaction
    const transaction = new Transaction({
      orderId: order._id,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type: "ORDER_PAYMENT",
      amount: finalAmount,
      platformFee: {
        buyerFee: cart.summary.platformFee,
        sellerFee: 0
      },
      status: paymentMethod === "ONLINE" 
        ? (paymentStatus === "COMPLETED" ? "COMPLETED" : "FAILED")
        : "PENDING",
      paymentMethod: paymentMethod,
      from: {
        entity: userId,
        type: "BUYER"
      },
      to: {
        entity: "localShop Pvt Ltd", 
        type: "ADMIN"
      },
      scheduledDate: new Date(),
      processedDate: paymentMethod === "ONLINE" && paymentStatus === "COMPLETED" 
        ? new Date() 
        : null
    });

    await transaction.save();

    // 5. Clear cart
    const purchasedProductIds = order.items.map(item => item.productId.toString());
    await Cart.findOneAndUpdate(
      { user: userId },
      { 
        $pull: { 
          items: {
            product: { $in: purchasedProductIds }  // Changed from productId to product
          }
        }
      },
      { new: true }
    );

    // 6. Send response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        orderId: order._id,
        customOrderId : customOrderId, 
        total: finalAmount,
        status: order.orderStatus,
        paymentStatus: order.payment.status,
        couponDiscount: couponDiscount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create order",
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
        image: item.image || (item.productId.images && item.productId.images[0]),
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
          name: item.seller.sellerName
        }
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

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
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
      user: userId
    })
    .populate("items.productId", "images productName")
    .populate("items.seller", "sellerName")
    .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
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
          name: item.seller.sellerName
        },
        bulkDiscount: item.bulkDiscount,
        returnStatus: item.returnStatus ? {
          status: item.returnStatus.status,
          reason: item.returnStatus.reason,
          requestDate: item.returnStatus.requestDate,
          approvalDate: item.returnStatus.approvalDate,
          completionDate: item.returnStatus.completionDate
        } : null
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

    res.status(200).json({
      success: true,
      order: formattedOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message
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
      orderStatus: { $in: ['PENDING', 'PROCESSING'] }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or cannot be cancelled"
      });
    }

    // Update order status
    order.orderStatus = "CANCELLED";
    
    // Add tracking detail
    order.trackingDetails.push({
      status: "CANCELLED",
      timestamp: new Date(),
      description: "Order cancelled by user"
    });

    

    const refundTransaction = new Transaction({
      orderId: order._id,
      transactionId: `REF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type: "REFUND",
      amount: order.summary.cartTotal,
      platformFee: {
        buyerFee: -order.summary.platformFee, // Negative to indicate refund
        sellerFee: 0
      },
      status: "COMPLETED",
      paymentMethod: order.payment.method,
      from: {
        entity: "localShop Pvt Ltd",
        type: "ADMIN"
      },
      to: {
        entity: userId,
        type: "BUYER"
      },
      scheduledDate: new Date(),
      processedDate: null
    });

    if ((order.payment.method === "ONLINE" || order.payment.method === "WALLET") 
      && order.payment.status === "COMPLETED") {
    // Find or create user wallet
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        balance: 0
      });
    }

    
    // Create wallet transaction
    const walletTransaction = {
      transactionId: `WREF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type: "REFUND",
      amount: order.summary.cartTotal,
      orderId: order._id,
      description: `Refund for cancelled order #${order.orderId}`,
      status: "COMPLETED",
      balance: wallet.balance + order.summary.cartTotal
    };
    
    // Update wallet balance and add transaction
    wallet.balance += order.summary.cartTotal;
    wallet.transactions.push(walletTransaction);
    await wallet.save();
  }

    await refundTransaction.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        for (const orderVariant of item.variants) {
          const productVariant = product.variants.find(
            v => v.variantId === orderVariant.variantId
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

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
});

export const returnUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  const {  returnReason : reason } = req.body;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      orderStatus: "DELIVERED"
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or cannot be returned"
      });
    }

    // Check if return is requested within valid timeframe (e.g., 7 days)
    const deliveredStatus = order.trackingDetails.find(t => t.status === "DELIVERED");
    if (deliveredStatus) {
      const deliveryDate = new Date(deliveredStatus.timestamp);
      const currentDate = new Date();
      const daysSinceDelivery = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceDelivery > 7) {
        return res.status(400).json({
          success: false,
          message: "Return window has expired (7 days from delivery)"
        });
      }
    }

    // Update order status
    order.orderStatus = "RETURN-REQUESTED";
    
    // Add tracking detail with return reason
    order.trackingDetails.push({
      status: "RETURN-REQUESTED",
      timestamp: new Date(),
      description: `Return requested by user. Reason: ${reason}`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing return request",
      error: error.message
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

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error.message,
    });
  }
});

// Add this to verify payment
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } else {
    return res.status(400).json({
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
      query['items.seller'] = sellerId;
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
      user: order.user ? {
        name: order.user.username || 'Deleted User',
        email: order.user.email || 'No Email'
      } : {
        name: 'Unknown User',
        email: 'No Email'
      },
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      // Only filter items for sellers, show all items for admin
      items: req.user.role === "seller" 
        ? order.items.filter(item => item.seller.toString() === sellerId.toString())
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

    res.status(200).json({
      success: true,
      orders: formattedOrders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
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
        "items.seller" : sellerId,
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Prevent updates for final states
    const finalStates = ["DELIVERED", "CANCELLED", "RETURNED"];
    if (finalStates.includes(order.orderStatus) && user.role !== "admin") {
      return res.status(400).json({
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
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    // Update order status
    order.orderStatus = status;

    // Add tracking detail
    order.trackingDetails.push({
      status,
      timestamp: new Date(),
      description: `Order ${status.toLowerCase()} by ${user.role} ${user._id}`,
    });

    await order.save();

    if (status === "DELIVERED" && order.payment.method === "COD") {
      await Transaction.findOneAndUpdate(
        { orderId: order._id, type: "ORDER_PAYMENT" },
        { 
          status: "COMPLETED",
          processedDate: new Date()
        }
      );
    }

    // Handle return completed status
    if (status === "RETURNED") {
      const refundTransaction = new Transaction({
        orderId: order._id,
        transactionId: `REF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        type: "REFUND",
        amount: order.summary.cartTotal,
        platformFee: {
          buyerFee: -order.summary.platformFee,
          sellerFee: 0
        },
        status: "PROCESSING",
        paymentMethod: order.payment.method,
        from: {
          entity: "localShop Pvt Ltd",
          type: "ADMIN"
        },
        to: {
          entity: order.user,
          type: "BUYER"
        },
        scheduledDate: new Date(),
        processedDate: null
      });

      await refundTransaction.save();
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: {
        orderId: order.orderId,
        status: order.orderStatus,
        trackingDetails: order.trackingDetails,
      },
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
});

export const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
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
        timestamp: new Date(),
        paymentMethod: "ONLINE"
      };
      order.orderStatus = "PENDING";

      // Add tracking detail
      order.trackingDetails.push({
        status: "Payment Completed",
        timestamp: new Date(),
        description: "Payment completed successfully"
      });

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        order: {
          orderId: order.orderId,
          status: order.orderStatus,
          paymentStatus: order.payment.status
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
      error: error.message
    });
  }
});
