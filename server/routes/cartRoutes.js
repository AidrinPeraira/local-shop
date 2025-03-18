import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { addCartItem, getCartItems, updateCart } from "../controller/cartController.js";


const cartRoutes = express.Router();

cartRoutes.route("/add").post(authenticateUser, addCartItem)
cartRoutes.route("/update").post(authenticateUser, updateCart)
cartRoutes.route("/get").get(authenticateUser, getCartItems)


export default cartRoutes;
