import express from "express";
import {
  createUser,
  loginUser,
  logoutController,
  googleAuthController
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

userRouter.route("/google").post(googleAuthController);

//------------------------

//admin actions to manipulate user data

//get all users
//block or unblock one user
//edit one user
//add new user

export default userRouter;
