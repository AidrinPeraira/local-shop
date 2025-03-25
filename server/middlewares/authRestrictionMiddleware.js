import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import Admin from "../models/adminModel.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import { asyncHandler } from "./asyncHandler.js";

export const checkUserBlocked = asyncHandler(async (req, res, next) => {
  // Skip check for non-authenticated routes
  if (!req.user || !req.user._id) {
    return next();
  }

  const userId = req.user._id;
  const userRole = req.user.role;

  let user;
  
  try {
    switch (userRole) {
      case 'buyer':
        user = await User.findById(userId);
        break;
      case 'seller':
        user = await Seller.findById(userId);
        break;
      case 'admin':
        user = await Admin.findById(userId);
        break;
      default:
        // Skip check for unknown roles
        return next();
    }

    if (!user) {
      // Clear the JWT cookie
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'User not found',
        logout: true
      });
    }

    if (!user.isActive) {
      // Clear the JWT cookie
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: userRole === 'admin' 
          ? 'Account Blocked! Please contact your supervisor!'
          : 'Account Blocked! Please contact admin!',
        logout: true
      });
    }

    next();
  } catch (error) {
    // Only clear cookie and return error for authenticated routes
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication error',
      logout: true
    });
  }
});