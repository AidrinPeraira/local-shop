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
  }
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  image: String,
  variants: [orderItemVariantSchema],
  bulkDiscount: [{
    minQty: Number,
    priceDiscountPerUnit: Number
  }],
  productSubtotal: Number,
  productDiscount: Number,
  productTotal: Number,
  totalQuantity: Number,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: String,
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

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  summary: {
    subtotalBeforeDiscount: Number,
    totalDiscount: Number,
    subtotalAfterDiscount: Number,
    shippingCharge: Number,
    platformFee: Number,
    cartTotal: Number,
  },
  payment: {
    method: {
      type: String,
      enum: ["ONLINE", "COD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    transactionId: String,
    paymentProvider: String,
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
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ],
    default: "PENDING",
  },
  trackingDetails: [{
    status: String,
    location: String,
    timestamp: Date,
    description: String,
  }],
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);