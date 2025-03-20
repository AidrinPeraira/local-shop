import express from "express";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";
import { cancelUserOrders, createUserOrder, getSellerOrders, getUserOrders, returnUserOrders, sellerUpdateOrderStatus} from "../controller/orderController.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(authenticateUser, createUserOrder)
orderRoutes.route("/get").get(authenticateUser, getUserOrders)
orderRoutes.route("/cancel/:orderId").patch(authenticateUser, cancelUserOrders)
orderRoutes.route("/return/:orderId").patch(authenticateUser, returnUserOrders)


//seller routes
orderRoutes.route("/seller").get(authenticateSeller, authorizeSeller, getSellerOrders)
orderRoutes.route("/status/:orderId").patch(authenticateSeller, authorizeSeller, sellerUpdateOrderStatus)

export default orderRoutes;
