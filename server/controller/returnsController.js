import { asyncHandler } from "../middlewares/asyncHandler.js";
import Return from "../models/returnsModel.js";
import Order from "../models/orderModel.js";
import Wallet from "../models/walletModel.js";
import { createRefundTransaction } from "../utils/transactionOperations.js";

export const createUserReturnRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId, itemId, returnReason } = req.body;

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if order is delivered
  if (order.orderStatus !== "DELIVERED") {
    return res.status(400).json({
      success: false,
      message: "Only delivered orders can be returned",
    });
  }

  // Find the specific item in the order
  const orderItem = order.items.find(item => item._id.toString() === itemId);
  if (!orderItem) {
    return res.status(404).json({
      success: false,
      message: "Order item not found",
    });
  }

  // Create return request
  const returnRequest = await Return.create({
    orderId: order._id,
    userId,
    sellerId: orderItem.seller,
    items: [{
      productId: orderItem.productId,
      variantId: orderItem.variants[0].variantId,
      quantity: orderItem.variants[0].quantity,
      returnReason,
      condition: "UNOPENED" // Default condition
    }],
    returnAmount: orderItem.productTotal,
    pickupAddress: order.shippingAddress,
    timeline: [{
      status: "RETURN_REQUESTED",
      comment: "Return request initiated by user",
      updatedBy: "USER"
    }]
  });

  // Update order status
  if (orderItem) {
    orderItem.returnStatus = {
      status: "RETURN_REQUESTED",
      reason: returnReason,
      requestDate: new Date()
    };
    await order.save();
  }

  res.status(201).json({
    success: true,
    message: "Return request created successfully",
    return: returnRequest
  });
});

export const getAllReturnRequests = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const query = {  };
  if (status) {
    query.status = status;
  }

  if(req.user.role == "SELLER"){
    query = { sellerId };
  }

  const returns = await Return.find(query)
    .populate('orderId')
    .populate('userId')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Return.countDocuments(query);

  res.status(200).json({
    success: true,
    returns,
    total,
    totalPages: Math.ceil(total / limit)
  });
});

export const updateUserReturnRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  const returnRequest = await Return.findById(id);
  if (!returnRequest) {
    return res.status(404).json({
      success: false,
      message: "Return request not found"
    });
  }

  // Update return request status
  returnRequest.status = status;
  returnRequest.sellerResponse = {
    status: status === "RETURN_APPROVED" ? "APPROVED" : "REJECTED",
    comment,
    responseDate: new Date()
  };

  // Add timeline entry
  returnRequest.timeline.push({
    status,
    comment,
    updatedBy: "SELLER",
    timestamp: new Date()
  });

  if (status === "REFUND_COMPLETED") {
    // Find user's wallet
    let wallet = await Wallet.findOne({ user: returnRequest.userId });
    
    if (!wallet) {
      wallet = await Wallet.create({
        user: returnRequest.userId,
        balance: 0
      });
    }

    
    

    // Generate transaction ID for refund
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const transactionId = `REF${timestamp}${randomStr}`;

    // Create refund transaction with transactionId
    const refundTransaction = {
      transactionId,
      type: "REFUND",
      amount: returnRequest.returnAmount,
      orderId: returnRequest.orderId,
      description: `Refund for return request #${returnRequest._id}`,
      status: "COMPLETED",
      balance: wallet.balance + returnRequest.returnAmount
    };

    // Add transaction and update wallet balance
    wallet.transactions.push(refundTransaction);
    wallet.balance += returnRequest.returnAmount;
    await wallet.save();
    const order = await Order.findById(returnRequest.orderId);
    await createRefundTransaction(order, "RETURN");
  }
  // Update order status if return is approved/rejected
  const order = await Order.findById(returnRequest.orderId);
  if (order) {
    const orderItem = order.items.find(
      item => item._id.toString() === returnRequest.items[0].productId.toString()
    );

    if (orderItem) {
      // Update the return status of the specific item
      orderItem.returnStatus = {
        status: status === "RETURN_APPROVED" ? "RETURN_APPROVED" : "RETURN_REJECTED",
        reason: returnRequest.items[0].returnReason,
        requestDate: returnRequest.createdAt,
        approvalDate: new Date(),
      };
      
      await order.save();
  }
  }

  await returnRequest.save();

  res.status(200).json({
    success: true,
    message: "Return request updated successfully",
    return: returnRequest
  });
});