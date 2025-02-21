import express from "express";
import {
  createUser,
  loginUser,
  logoutController,
} from "../controller/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(createUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(logoutController);

//------------------------

//add user actions to get put and delete account / details
//what about cart and wishlist? do we need a seperate controller for tha? that would be better



export default userRouter;
