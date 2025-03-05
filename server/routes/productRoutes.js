import express from "express";
import { authenticateSeller, authorizeSeller } from "../middlewares/authMiddleware.js";
import { addProduct } from "../controller/productController.js";
import { upload } from "../middlewares/multer.js";


const productRoute = express.Router();

productRoute
    .route('/add')
    .post(
        authenticateSeller, 
        authorizeSeller, 
        upload,  
        addProduct
    )

export default productRoute;
