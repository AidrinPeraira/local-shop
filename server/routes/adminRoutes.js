import express from "express";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { loginAdmin, logOutAdmin, registerAdmin,  } from "../controller/adminController.js";
import { addCategory } from "../controller/categoryController.js";
import rateLimit from "express-rate-limit";

const adminRouter = express.Router();

//this is how we initialise the rate limiiterwith ther necessaryu settings settings
const apiLimiter = rateLimit({
  // the following limit is set as 100 requests per 15 mins per route
    //we will first add this to the authentication routes only.
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later",
});


adminRouter.route("/register", rateLimit).post(registerAdmin);
adminRouter.route("/login", rateLimit).post(loginAdmin);
adminRouter.route("/logout", rateLimit).post(logOutAdmin);

//admin actions to manipulate categories
adminRouter.route('/cateegory')
    .get()
    .post(authenticateAdmin, authorizeAdmin, addCategory)


//add user actions to get put and delete account / details



export default adminRouter;
