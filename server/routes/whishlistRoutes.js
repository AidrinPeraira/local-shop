import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controller/wishlistController.js";


const wishlistRoutes = express.Router();

wishlistRoutes.route("/").get(authenticateUser, getWishlist)
wishlistRoutes.route("/add").post(authenticateUser, addToWishlist)
wishlistRoutes.route("/remove/:productId").delete(authenticateUser, removeFromWishlist)



export default wishlistRoutes;
