import { asyncHandler } from "../middlewares/asyncHandler.js";
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import { HTTP_CODES } from "../utils/responseCodes.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Product ID is required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(HTTP_CODES.NOT_FOUND);
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
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Product already in wishlist");
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Product ID is required");
  }

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Wishlist not found");
  }

  // Remove product from wishlist
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );
  await wishlist.save();

  res.status(HTTP_CODES.OK).json({
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
    return res.status(HTTP_CODES.OK).json({
      success: true,
      wishlist: {
        products: [],
      },
    });
  }

  res.status(HTTP_CODES.OK).json({
    success: true,
    wishlist,
  });
});

export const getWishlistCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const wishlist = await Wishlist.findOne({ user: userId });
  const count = wishlist ? wishlist.products.length : 0;

  res.status(HTTP_CODES.OK).json({
    success: true,
    count
  });
});