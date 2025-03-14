import express from "express";
import {
  createUser,
  loginUser,
  logoutController,
  googleAuthController,
  getAllUsers,
  activateUser,
  deactivateUser,
  checkUserExists,
  resetUserPassword
} from "../controller/userController.js";
import rateLimit from "express-rate-limit";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

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

//forgot password routes
userRouter.route("/forgot-password/check-user").post(checkUserExists)
userRouter.route("/forgot-password/reset").post(resetUserPassword)

//------------------------

//admin actions to manipulate user data

//get all users
userRouter.route("/all").get(authenticateAdmin, authorizeAdmin, getAllUsers);
userRouter.route("/:userId/activate").patch(authenticateAdmin, authorizeAdmin, activateUser);
userRouter.route("/:userId/deactivate").patch(authenticateAdmin, authorizeAdmin, deactivateUser);

export default userRouter;