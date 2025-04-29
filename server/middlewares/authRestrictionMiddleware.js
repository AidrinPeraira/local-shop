import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import Admin from "../models/adminModel.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";

export const checkUserBlocked = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      user = await Seller.findById(decoded.userId).select("-password");
    }

    if (!user) {
      return next();
    }

    // Check if user is blocked
    if (!user.isActive) {
      // Clear the cookie
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });

      return res.status(HTTP_CODES.UNAUTHORIZED).json({
        blocked: true,
        role: user.role,
        message: "Your account has been blocked. Please contact admin for more details"
      });
    }

    // Store user in request for later use
    req.user = user;
    next();
  } catch (error) {
    // Handle JWT verification errors
    return res.status(HTTP_CODES.UNAUTHORIZED).json({
      message: "Invalid or expired token"
    });
  }
});
