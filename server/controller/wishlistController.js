import { asyncHandler } from "../middlewares/asyncHandler.js";
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find or create wishlist for user
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });
  } else {
    // Check if product already exists in wishlist
    if (wishlist.products.includes(productId)) {
      res.status(400);
      throw new Error("Product already in wishlist");
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  // Remove product from wishlist
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "products",
    select: "productName images basePrice variants avgRating reviewCount seller isActive isBlocked",
    populate: {
      path: "seller",
      select: "sellerName",
    },
  });

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: {
        products: [],
      },
    });
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});