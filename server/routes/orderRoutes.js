import express from "express";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";
import { cancelUserOrders, createRazorpayOrder, createUserOrder, getOrderById, getSellerOrders, getUserOrders, returnUserOrders, sellerUpdateOrderStatus, verifyRazorpayPayment} from "../controller/orderController.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(authenticateUser, createUserOrder)
orderRoutes.route("/get").get(authenticateUser, getUserOrders)
orderRoutes.route("/get/:orderId").get(authenticateUser, getOrderById)
orderRoutes.route("/cancel/:orderId").patch(authenticateUser, cancelUserOrders)
orderRoutes.route("/return/:orderId").patch(authenticateUser, returnUserOrders)


//seller routes
orderRoutes.route("/seller").get(authenticateSeller, authorizeSeller, getSellerOrders)
orderRoutes.route("/status/:orderId").patch(authenticateSeller, authorizeSeller, sellerUpdateOrderStatus)

//razor pay
orderRoutes.post("/create-razorpay-order", authenticateUser, createRazorpayOrder);
orderRoutes.post("/verify-payment", authenticateUser,  verifyRazorpayPayment);

export default orderRoutes;
