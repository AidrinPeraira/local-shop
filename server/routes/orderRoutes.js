import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { createUserOrder, getUserOrders} from "../controller/orderController.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(authenticateUser, createUserOrder)
orderRoutes.route("/get").get(authenticateUser, getUserOrders)


export default orderRoutes;
