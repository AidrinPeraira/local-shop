import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    type: {
      type: String,
      enum: ["ORDER_PAYMENT", "SELLER_PAYOUT", "REFUND"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      buyerFee: Number,  // Fee collected from buyer
      sellerFee: Number, // Fee collected from seller
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    from: {
      entity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      type: {
        type: String,
        enum: ["BUYER", "ADMIN", "SELLER"],
        required: true,
      },
    },
    to: {
        entity: {
          type: String,
          required: true
        },
        type: {
          type: String,
          required: true
        }
      },
    scheduledDate: {
      type: Date,
    },
    processedDate: {
      type: Date,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayRefundId: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique transaction ID
transactionSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `TXN${timestamp}${randomStr}`;
  }
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;