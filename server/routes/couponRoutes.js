import express from "express";
import { authenticateAdmin,  authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { adminCreateCoupon, adminDeleteCoupon, adminGetCoupons, adminUpdateCoupon } from "../controller/couponController.js";


const couponRoutes = express.Router();

// couponRoutes.route("/get").get(authenticateUser, getBuyerCoupons);

couponRoutes.route("/get").get(authenticateAdmin, authorizeAdmin,  adminGetCoupons);
couponRoutes.route("/create").post(authenticateAdmin, authorizeAdmin,  adminCreateCoupon);
couponRoutes.route("/edit").put(authenticateAdmin, authorizeAdmin, adminUpdateCoupon);
couponRoutes.route("/delete/:id").delete(authenticateAdmin, authorizeAdmin, adminDeleteCoupon);



export default couponRoutes;
