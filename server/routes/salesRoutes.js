import express from "express";
import { authenticateSeller } from "../middlewares/authMiddleware.js";
import { getSalesReport } from "../controller/salesController.js";

const salesRouter = express.Router();

salesRouter.get("/",  authenticateSeller, getSalesReport);

export default salesRouter;