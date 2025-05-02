import Category from "../models/categoryModel.js";
import Coupon from "../models/couponModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";


export const adminCreateCoupon = asyncHandler(
  async (req, res) => {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {

      // Check if coupon is already active
      if (existingCoupon.isActive) {
        return res.status(HTTP_CODES.CONFLICT).json({
          success: false,
          message: "Coupon already exists",
        });
      }

      // Update existing coupon instead of creating new one
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        existingCoupon._id,
        {
          validFrom,
          validUntil,
          isActive: true,
          $inc: { usageLimit: usageLimit || 100 }, // Increase usage limit
          discountType,
          discountValue,
          minPurchase,
          maxDiscount
        },
        { new: true, runValidators: true }
      );

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Coupon reactivated and updated successfully",
        coupon: updatedCoupon,
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      isActive: true,
      usageLimit: usageLimit || 100, // Default usage limit
    });

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  }
);

export const adminUpdateCoupon = asyncHandler(
    
  async (req, res) => {
    const { id } = req.body;
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
    } = req.body;

    // Check if coupon exists
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check if new code conflicts with other coupons
    if (code !== existingCoupon.code) {
      const codeExists = await Coupon.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: id }
      });
      if (codeExists) {
        return res.status(HTTP_CODES.CONFLICT).json({
          success: false,
          message: "Coupon code already exists",
        });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        validFrom,
        validUntil,
      },
      { new: true, runValidators: true }
    );

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  }
);

export const adminDeleteCoupon = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if(coupon.isActive){
      if (!coupon) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: "Coupon not found",
        });
      }
  
      // Check if coupon has been used
      if (coupon.usedCount > 0) {
        // Instead of deleting, deactivate the coupon
        coupon.isActive = false;
        await coupon.save();
  
        return res.status(HTTP_CODES.OK).json({
          success: true,
          message: "Coupon has been deactivated as it was already in use",
        });
      }
  
      // If never used, delete completely
      await Coupon.findByIdAndDelete(id); 
    } else {
      if (!coupon) {
        return res.status(HTTP_CODES.NOT_FOUND).json({
          success: false,
          message: "Coupon not found",
        });
      }
  
      // Check if coupon has been used
      
        coupon.isActive = true;
        await coupon.save();
  
        return res.status(HTTP_CODES.OK).json({
          success: true,
          message: "Coupon has been Activated",
        });     
  
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  }
);

export const adminGetCoupons = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const status = req.query.status;
    const sort = req.query.sort || "latest";
    const search = req.query.search || "";

    const query = {};
    
    // Status filter
    if (status === "Active") {
      query.$and = [
        { validUntil: { $gt: new Date() } },
        { isActive: true }
      ];
    } else if (status === "Expired") {
      query.$or = [
        { validUntil: { $lte: new Date() } },
        { isActive: false }
      ];
    }

    // Search
    if (search) {
      query.code = { $regex: search, $options: "i" };
    }

    // Sorting
    let sortOptions = {};
    switch (sort) {
      case "az":
        sortOptions = { code: 1 };
        break;
      case "za":
        sortOptions = { code: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const total = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(HTTP_CODES.OK).json({
      success: true,
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  }
);

export const getBuyerCoupons = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const allCoupons = await Coupon.find({
      validUntil: { $gt: new Date() },
      isActive: true,
    });

    const availableCoupons = allCoupons.filter(coupon => {
      // Check if user has used this coupon
      const hasUsed = coupon.usedBy.includes(userId);
      
      if(hasUsed) return false; // If user has used, don't show i
      
      // If user hasn't used the coupon or coupon hasn't reached usage limit
      if (!hasUsed && coupon.usedCount < coupon.usageLimit) {
        return true;
      }

      return false;
    });

    res.status(HTTP_CODES.OK).json({
      success: true,
      coupons: availableCoupons,
    });
  }

);

