import express from "express";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";
import { cancelUserOrders, checkOrderItemValid, createRazorpayOrder, createUserOrder, getOrderById, getSellerOrders, getUserOrders, returnUserOrders, sellerUpdateOrderStatus, updateOrderPaymentStatus, verifyRazorpayPayment} from "../controller/orderController.js";


const orderRoutes = express.Router();


orderRoutes.route("/create").post(authenticateUser, createUserOrder)
orderRoutes.route("/check").post(authenticateUser, checkOrderItemValid)
orderRoutes.route("/get").get(authenticateUser, getUserOrders)
orderRoutes.route("/get/:orderId").get(authenticateUser, getOrderById)
orderRoutes.route("/cancel/:orderId").patch(authenticateUser, cancelUserOrders)
orderRoutes.route("/return/:orderId").patch(authenticateUser, returnUserOrders)

orderRoutes.patch("/payment-status/:orderId", authenticateUser,  updateOrderPaymentStatus)


//seller routes
orderRoutes.route("/seller").get(authenticateSeller, authorizeSeller, getSellerOrders)
orderRoutes.route("/status/:orderId").patch(authenticateSeller, authorizeSeller, sellerUpdateOrderStatus)

//razor pay
orderRoutes.post("/create-razorpay-order", authenticateUser, createRazorpayOrder);
orderRoutes.post("/verify-payment", authenticateUser,  verifyRazorpayPayment);
;

export default orderRoutes;
