import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }],
  },
  { timestamps: true }
);

// Ensure a user can't add the same product twice
wishlistSchema.index({ user: 1, products: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);