import Product from '../models/productModel.js'
import slugify from "slugify"; 
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { json } from 'express';


export const addProduct = asyncHandler(
    async (req, res) => {
        console.log("hhhhhhhh", req.body)
        res.json({
            messsage : "hitttt"
        })
        try {
            
        } catch (error) {
            
        }
    }
)