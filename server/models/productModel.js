import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [String], // Kept as simple array of image URLs
  avgRating: {
    type: Number,
    default: 0,
  },

  reviewCount: {
    type: Number,
    default: 0,
  },

  variantTypes: [
    {
      variationName: String,
      variationValues: [String],
    },
  ],
  // Store each specific variant combination
  variants: [
    {
      // Array of attributes that make up this variant
      variantId : String,
      attributes: [],
      stock: { type: Number, required: true },
      inStock: { type: Boolean, default: true },
      basePrice: { type: Number, required: true },
    },
  ],

  // bulk pricing

  bulkDiscount: [
    {
      minQty: {
        type: Number,
        default : 1
      },
      priceDiscountPerUnit: {
        type : Number,
        default: 0
      },
    },
  ],
  // Default values for products with no variations
  basePrice: Number,
  stock: Number,
  inStock: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
