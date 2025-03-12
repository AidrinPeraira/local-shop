import express from "express";
import {
    authenticateAdmin,
  authenticateSeller,
  authorizeAdmin,
  authorizeSeller,
} from "../middlewares/authMiddleware.js";
import { addProduct, deleteProduct, editProduct, getProductDetails, getSellerProducts, getShopProducts } from "../controller/productController.js";
import { upload } from "../middlewares/multer.js";

const productRoute = express.Router();

productRoute
  .route("/shop")
  .get(getShopProducts)

productRoute
  .route("/get")
  .get(authenticateSeller, authorizeSeller, upload, getSellerProducts)

productRoute
  .route("/add")
  .post(authenticateSeller, authorizeSeller, upload, addProduct)

productRoute
  .route("/edit/:id")
  .patch(authenticateSeller, authorizeSeller, upload, editProduct)
  .delete(authenticateSeller, authorizeSeller, deleteProduct)


  productRoute
  .route("/block/:id")
  .post(authenticateAdmin, authorizeAdmin, deleteProduct)

productRoute
  .route("/:id")
  .get(getProductDetails)

export default productRoute;
