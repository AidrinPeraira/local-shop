import express from "express";
import rateLimit from "express-rate-limit";
import categoryRouter from "./categoryRoutes.js";
import { sellerRegValidation } from "../middlewares/sellerValidation.js";
import { activateSeller, deactivateSeller, getAllSellers, loginSeller, logOutSeller, registerSeller } from "../controller/sellerController.js";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

const sellerRouter = express.Router();

//this is how we initialise the rate limiiterwith ther necessaryu settings settings
const apiLimiter = rateLimit({
  // the following limit is set as 100 requests per 15 mins per route
  //we will first add this to the authentication routes only.
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many requests, please try again later",
});

sellerRouter.route("/register", sellerRegValidation, apiLimiter).post(registerSeller);
sellerRouter.route("/login", apiLimiter).post(loginSeller);
sellerRouter.route("/logout", apiLimiter).post(logOutSeller);

// Admin routes for seller management
sellerRouter.get("/all", getAllSellers);
sellerRouter.patch("/:sellerId/activate", authenticateAdmin, authorizeAdmin, activateSeller);
sellerRouter.patch("/:sellerId/deactivate", authenticateAdmin, authorizeAdmin, deactivateSeller);


export default sellerRouter;
