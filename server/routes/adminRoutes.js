import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { loginAdmin, registerAdmin } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);


//------------------------

//add user actions to get put and delete account / details



export default adminRouter;
