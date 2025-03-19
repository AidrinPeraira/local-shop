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
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  variants: [orderItemVariantSchema],
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
  }
});

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
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
  landmark: String,
});

const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  transactionId: String,
  paymentGateway: {
    type: String,
    enum: ['RAZORPAY', 'STRIPE'],
  },
  paymentDetails: {
    orderId: String,
    receiptId: String,
    signature: String,
  },
  paidAmount: Number,
  paidAt: Date,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: addressSchema,
  payment: paymentSchema,
  orderStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    default: 'PENDING',
  },
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
    cartTotal: {
      type: Number,
      required: true,
    }
  },
  orderNotes: String,
  estimatedDeliveryDate: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  returnedAt: Date,
  returnReason: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);