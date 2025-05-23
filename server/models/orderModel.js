import mongoose from "mongoose";

const orderItemVariantSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true,
  },
  attributes: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  variantTotal: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  variants: [orderItemVariantSchema],
  bulkDiscount: [
    {
      minQty: {
        type: Number,
        required: true,
      },
      priceDiscountPerUnit: {
        type: Number,
        required: true,
      },
    },
  ],
  productSubtotal: {
    type: Number,
    required: true,
  },
  productDiscount: {
    type: Number,
    default: 0,
  },
  productTotal: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  returnStatus: {
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
        "CANCELLED",
      ],
    },
    reason: {
      type: String,
    },
    requestDate: {
      type: Date,
    },
    approvalDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
  },
});

const shippingAddressSchema = new mongoose.Schema({
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
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    summary: {
      subtotalBeforeDiscount: {
        type: Number,
        required: true,
      },
      totalDiscount: {
        type: Number,
        required: true,
      },
      subtotalAfterDiscount: {
        type: Number,
        required: true,
      },
      shippingCharge: {
        type: Number,
        required: true,
      },
      platformFee: {
        type: Number,
        required: true,
      },
      couponDiscount: {
        type: Number,
        default: 0,
      },
      coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      cartTotal: {
        type: Number,
        required: true,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["ONLINE", "COD", "WALLET"],
        required: true,
      },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING",
      },
      transactionId: String,
      paymentProvider: {
        type: String,
        enum: ["RAZORPAY", null],
        default: null,
      },
      paymentDetails: {
        orderId: String,
        signature: String,
        paymentId: String,
        paymentMethod: String,
        bank: String,
        wallet: String,
        timestamp: Date,
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "FAILED",
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ],
      default: "PENDING",
    },
    trackingDetails: [
      {
        status: String,
        location: String,
        timestamp: Date,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
