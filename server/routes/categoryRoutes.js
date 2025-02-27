import express from "express";
import {
  authenticateAdmin,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategories,
  editCategory,
  deleteCategory
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
  .route("/edit/:id")
  .patch(authenticateAdmin, authorizeAdmin, editCategory);

categoryRoute
  .route("/delete/:id")
  .delete(authenticateAdmin, authorizeAdmin, deleteCategory);

categoryRoute
  .route("/")
  .get(authenticateAdmin, authorizeAdmin, getAllCategories); 


export default categoryRoute;
