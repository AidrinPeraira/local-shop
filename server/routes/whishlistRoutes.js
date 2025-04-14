import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { addToWishlist, getWishlist, getWishlistCount, removeFromWishlist } from "../controller/wishlistController.js";


const wishlistRoutes = express.Router();

wishlistRoutes.route("/").get(authenticateUser, getWishlist)
wishlistRoutes.route("/count").get(authenticateUser, getWishlistCount)
wishlistRoutes.route("/add").post(authenticateUser, addToWishlist)
wishlistRoutes.route("/remove/:productId").delete(authenticateUser, removeFromWishlist)



export default wishlistRoutes;
