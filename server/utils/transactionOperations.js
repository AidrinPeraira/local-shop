import Transaction from "../models/adminTransactionModel.js";

export const createOrderTransaction = async (order) => {
  try {
    // Generate transaction ID
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const transactionId = `TXN${timestamp}${randomStr}`;

    const transactionData = {
      transactionId,
      orderId: order._id,
      type: "ORDER_PAYMENT",
      amount: order.summary.cartTotal,
      platformFee: {
        buyerFee: order.summary.platformFee || 0,
        sellerFee: 0,
      },
      status: "COMPLETED",
      paymentMethod: order.payment.method,
      from: {
        entity: order.user.toString(),
        type: "USER",
      },
      to: {
        entity: "PLATFORM",
        type: "SYSTEM",
      },
      scheduledDate: new Date(),
      processedDate: order.payment.method === "COD" ? null : new Date(),
      razorpayPaymentId: order.payment.paymentDetails?.paymentId || null,
      metadata: {
        orderTotal: order.summary.cartTotal,
        paymentStatus: order.payment.status,
        platformFee: order.summary.platformFee,
      },
    };

    // For wallet payments, add wallet transaction ID
    if (order.payment.method === "WALLET" && order.payment.wallet) {
      transactionData.metadata.walletTransactionId = order.payment.wallet.transactionId;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    console.error("Error creating order transaction:", error);
    throw error;
  }
};

export const createRefundTransaction = async (order, type = "REFUND") => {
  try {
    // Generate transaction ID
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const transactionId = `REF${timestamp}${randomStr}`;

    const transactionData = {
      transactionId,
      orderId: order._id,
      type: "REFUND",
      amount: order.summary.cartTotal,
      platformFee: {
        buyerFee: 1000,
        sellerFee: 0,
      },
      status: "COMPLETED",
      paymentMethod: order.payment.method,
      from: {
        entity: "PLATFORM",
        type: "SYSTEM",
      },
      to: {
        entity: order.user.toString(),
        type: "USER",
      },
      scheduledDate: new Date(),
      processedDate: new Date(),
      metadata: {
        refundReason: type === "REFUND" ? "Order Cancelled" : "Order Returned",
        originalOrderTotal: order.summary.cartTotal,
        originalPaymentMethod: order.payment.method,
      },
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    console.error("Error creating refund transaction:", error);
    throw error;
  }
};