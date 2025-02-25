import express from "express";
import {
  authenticateAdmin,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategories,
} from "../controller/categoryController.js";

const categoryRoute = express.Router();

//normal actions to get the needed data

// need a route to get active categories only
categoryRoute
    .route('/active')
    .get(getCategories)

//admin actions to manipulate categories
categoryRoute
  .route("/create")
  .post(authenticateAdmin, authorizeAdmin, createCategory);

categoryRoute
  .route("/")
  .get(authenticateAdmin, authorizeAdmin, getAllCategories); // admin only since inactive categories are also provided.

//add user actions to get put and delete account / details

export default categoryRoute;
