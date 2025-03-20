import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controller/orderController.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(authenticateUser, createOrder)


export default orderRoutes;
