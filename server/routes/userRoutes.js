import express from "express";
import {
  createUser,
  loginUser,
  logoutController,
} from "../controller/userController.js";
import rateLimit from "express-rate-limit";

const userRouter = express.Router();

//this is how we initialise the rate limiiterwith ther necessaryu settings settings
const apiLimiter = rateLimit({
  // the following limit is set as 100 requests per 15 mins per route
  //we will first add this to the authentication routes only.
  windowMs: 15*60*1000, 
  max: 15, 
  message: "Too many requests, please try again later",
});

userRouter.route("/register", apiLimiter).post(createUser);

userRouter.route("/login", apiLimiter).post(loginUser);

userRouter.route("/logout", apiLimiter).post(logoutController);

//------------------------

//add user actions to get put and delete account / details
//what about cart and wishlist? do we need a seperate controller for tha? that would be better

export default userRouter;
