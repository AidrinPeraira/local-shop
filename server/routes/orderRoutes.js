import express from "express";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";
import { createUserOrder, getSellerOrders, getUserOrders, sellerUpdateOrderStatus} from "../controller/orderController.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(authenticateUser, createUserOrder)
orderRoutes.route("/get").get(authenticateUser, getUserOrders)


//seller routes
orderRoutes.route("/seller").get(authenticateSeller, authorizeSeller, getSellerOrders)
orderRoutes.route("/status/:orderId").patch(authenticateSeller, authorizeSeller, sellerUpdateOrderStatus)

export default orderRoutes;
