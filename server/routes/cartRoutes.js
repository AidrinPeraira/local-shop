import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { addCartItem, getCartItems } from "../controller/cartController.js";


const cartRoutes = express.Router();

cartRoutes.route("/add").post(authenticateUser, addCartItem)
cartRoutes.route("/get").get(authenticateUser, getCartItems)


export default cartRoutes;
