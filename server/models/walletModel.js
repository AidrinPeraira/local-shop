import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ["ORDER_PAYMENT", "REFUND", "REFERRAL_REWARD", "PROMO_CREDIT", "WALLET_INTITIALIZATION"],
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  customOrderId: {
    type: String,
  },
  referralCode: {
    type: String,
  },
  promoCode: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
    default: "PENDING",
  },
  balance: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  transactions: [walletTransactionSchema],
  referralCode: {
    type: String,
    unique: true,
    index: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true });

// Generate unique transaction ID
walletTransactionSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `WAL${timestamp}${randomStr}`;
  }
  next();
});



export default mongoose.model("Wallet", walletSchema);