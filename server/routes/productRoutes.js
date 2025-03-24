import express from "express";
import {
    authenticateAdmin,
  authenticateSeller,
  authorizeAdmin,
  authorizeSeller,
} from "../middlewares/authMiddleware.js";
import { addProduct, blockProduct, deleteProduct, editProduct, getAllProducts, getProductDetails, getSellerProducts, getShopProducts, unblockProduct } from "../controller/productController.js";
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
  .patch(authenticateAdmin, authorizeAdmin, blockProduct)

  productRoute
  .route("/unblock/:id")
  .patch(authenticateAdmin, authorizeAdmin, unblockProduct)
  
//not being used anymore.
productRoute
 .route("/all")
 .get(authenticateAdmin, authorizeAdmin, getAllProducts)

productRoute
  .route("/:slug/:id")
  .get(getProductDetails)

export default productRoute;
