import express from "express";
import { authenticateSeller, authenticateUser, authorizeSeller } from "../middlewares/authMiddleware.js";
import { createUserReturnRequest, getAllReturnRequests, updateUserReturnRequest } from "../controller/returnsController.js";


const returnRoutes = express.Router();

returnRoutes.route("/create").post(authenticateUser, createUserReturnRequest);

returnRoutes.route("/getAll").get(authenticateSeller, authorizeSeller, getAllReturnRequests);
returnRoutes.route("/update/:id").patch(authenticateSeller, authorizeSeller, updateUserReturnRequest);


export default returnRoutes;
