//the middleware to handle authentication and authorisation

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import { asyncHandler } from "./asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";


//authentication middleware to handle validating the user
export const authenticateUser = asyncHandler(
    async (req, res, next) => {
        let token;

        //read jwt form the cookie
        token = req.cookies.jwt;

        if (token) {
            console.log("hit")
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) //we created token using _id therfore we get id on decoding
                req.user = await User.findById(decoded.userId).select('-password') //.select('-password') ensures that the password field is excluded from the result.
                next()
            } catch (error) {
                console.log("e1jwt", error)
                res.status(HTTP_CODES.UNAUTHORIZED)
                throw new Error('Not authorised, plaese login as buyer to continue')
            }
        } else {
            res.status(HTTP_CODES.UNAUTHORIZED)
            throw new Error('Not authorised. plaese login as buyer to continue.')

        }
    }
)

//authorisation to approve the valid user 

// we can check for admin here
export const authenticateAdmin = asyncHandler(
    async (req, res, next) => {
        let token;

        //read jwt form the cookie
        token = req.cookies.jwt;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) //we created token using _id therfore we get id on decoding
                req.user = await Admin.findById(decoded.userId).select('-password') //.select('-password') ensures that the password field is excluded from the result.
                next()
            } catch (error) {
                res.status(HTTP_CODES.UNAUTHORIZED)
                throw new Error('Not authorised, token failed')
            }
        } else {
            res.status(HTTP_CODES.UNAUTHORIZED)
            throw new Error('Not authorised. No token.')

        }
    }
)
export const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next()
    } else {
        res.status(HTTP_CODES.UNAUTHORIZED).send('Not authorized as an admin')
    }
}


export const authenticateSeller = asyncHandler(
    async (req, res, next) => {
        let token
        token = req.cookies.jwt
        if (!token) {
            res.status(HTTP_CODES.UNAUTHORIZED);
            throw new Error('Not authorized. No token.');
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            let user = await Admin.findById(decoded.userId).select('-password');
            if (!user) {
                user = await Seller.findById(decoded.userId).select('-password');
            }
    
            if (!user) {
                res.status(HTTP_CODES.UNAUTHORIZED);
                throw new Error('User not found');
            }
    
            req.user = user;
            next();
        } catch (error) {
            res.status(HTTP_CODES.UNAUTHORIZED);
            throw new Error('Not authorized, token failed');
        }
    }
)
export const authorizeSeller = (req, res, next) => {
    if(req.user && (req.user.role == 'admin' || req.user.role == 'seller')){
        next()
    } else {
        res.status(HTTP_CODES.UNAUTHORIZED).send('Not authorized as admin or seller')
    }
} 