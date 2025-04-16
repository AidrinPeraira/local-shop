import mongoose from "mongoose";
import { getUTCDateTime } from "../utils/dateUtillServerSide.js";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
      index : true
    },
    validUntil: {
      type: Date,
      required: true,
      index : true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    usedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

couponSchema.statics.invalidateExpiredCoupons = async function() {
  const currentDate = getUTCDateTime();
  const result = await this.updateMany(
    {
      validUntil: { $lt: currentDate },
      isActive: true
    },
    {
      $set: { isActive: false }
    }
  );
  return result;
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;