import mongoose from "mongoose";

const sellerTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    type: {
      type: String,
      enum: ["ORDER_EARNING", "PLATFORM_FEE", "PAYOUT", "REFUND_DEDUCTION"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SCHEDULED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    payoutDetails: {
      method: {
        type: String,
        enum: ["BANK_TRANSFER", "UPI", "RAZORPAY"],
      },
      accountId: String,
      reference: String,
    },
    scheduledDate: Date,
    processedDate: Date,
    description: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique transaction ID
sellerTransactionSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `STXN${timestamp}${randomStr}`;
  }
  next();
});

const SellerTransaction = mongoose.model("SellerTransaction", sellerTransactionSchema);

export default SellerTransaction;