import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      returnReason: {
        type: String,
        required: true,
      },
      condition: {
        type: String,
        enum: ["UNOPENED", "OPENED", "DAMAGED"],
        required: true,
      }
    }],
    status: {
      type: String,
      enum: [
        "RETURN_REQUESTED",
        "RETURN_APPROVED",
        "RETURN_REJECTED",
        "RETURN_SHIPPED",
        "RETURN_RECEIVED",
        "REFUND_INITIATED",
        "REFUND_COMPLETED",
        "CANCELLED"
      ],
      default: "RETURN_REQUESTED"
    },
    returnAmount: {
      type: Number,
      required: true,
    },
    refundDetails: {
      transactionId: String,
      method: {
        type: String,
        enum: ["BANK_TRANSFER", "RAZORPAY", "WALLET"],
      },
      status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      },
      processedDate: Date
    },
    timeline: [{
      status: {
        type: String,
        required: true,
      },
      comment: String,
      updatedBy: {
        type: String,
        enum: ["USER", "SELLER", "ADMIN"],
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    pickupAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      }
    },
    returnShipment: {
      trackingId: String,
      courier: String,
      pickupDate: Date,
      deliveryDate: Date,
      status: String
    },
    sellerResponse: {
      status: {
        type: String,
        enum: ["APPROVED", "REJECTED", "PENDING"],
        default: "PENDING"
      },
      comment: String,
      responseDate: Date
    },
    returnPolicy: {
      returnWindow: {
        type: Number,
        required: true,
        default: 7 // days
      },
      restockingFee: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

// Generate unique return ID
returnSchema.pre("save", async function (next) {
  if (!this.returnId) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
      .replace("T", "");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.returnId = `RET${timestamp}${randomStr}`;
  }
  next();
});

// Index for faster queries
returnSchema.index({ orderId: 1, userId: 1 });
returnSchema.index({ sellerId: 1, status: 1 });
returnSchema.index({ "returnShipment.trackingId": 1 });

export default mongoose.model("Return", returnSchema);