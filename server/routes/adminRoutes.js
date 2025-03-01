import express from "express";
import { loginAdmin, logOutAdmin, registerAdmin,  } from "../controller/adminController.js";
import rateLimit from "express-rate-limit";
import categoryRouter from "./categoryRoutes.js";

const adminRouter = express.Router();

//this is how we initialise the rate limiiterwith ther necessaryu settings settings
const apiLimiter = rateLimit({
  // the following limit is set as 100 requests per 15 mins per route
    //we will first add this to the authentication routes only.
  windowMs: 15*60*1000, 
  max: 15, 
  message: "Too many requests, please try again later",
});


adminRouter.route("/register", apiLimiter).post(registerAdmin);
adminRouter.route("/login", apiLimiter).post(loginAdmin);
adminRouter.route("/logout", apiLimiter).post(logOutAdmin);



export default adminRouter;
