import express from "express";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { addCategory } from "../controller/categoryController.js";

const categoryRoute = express.Router();



//admin actions to manipulate categories
categoryRoute.route("/add")
    .post(authenticateAdmin, authorizeAdmin, addCategory);


//add user actions to get put and delete account / details



export default categoryRoute;
