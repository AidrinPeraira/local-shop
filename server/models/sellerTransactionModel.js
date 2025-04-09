import mongoose from "mongoose";

const sellerTransactionSchema = new mongoose.Schema(
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
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    type: {
      type: String,
      enum: ["ORDER_SETTLEMENT", "REFUND_DEDUCTION", "PLATFORM_FEE"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
      default: 0,
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
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    },
    scheduledDate: {
      type: Date,
    },
    processedDate: {
      type: Date,
    },
    settlementPeriod: {
      from: Date,
      to: Date
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
sellerTransactionSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `SELTXN${timestamp}${randomStr}`;
  }
  next();
});

// Indexes for better query performance
sellerTransactionSchema.index({ seller: 1, status: 1 });
sellerTransactionSchema.index({ transactionId: 1 });
sellerTransactionSchema.index({ orderId: 1 });
sellerTransactionSchema.index({ createdAt: 1 });

const SellerTransaction = mongoose.model("SellerTransaction", sellerTransactionSchema);

export default SellerTransaction;