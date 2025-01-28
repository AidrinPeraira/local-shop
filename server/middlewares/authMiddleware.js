//the middleware to handle authentication and authorisation

import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { asyncHandler } from "./asyncHandler";
import { HTTP_CODES } from "../utils/responseCodes";


//authentication middleware to handle validating the user
export const authenticate = async(
    async (req, res, next) => {
        let token;

        //read jwt form the cookie
        token = req.cookie.jwt;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) //we created token using _id therfore we get id on decoding
                req.user = await User.findById(decoded.userId).select('-password') //.select('-password') ensures that the password field is excluded from the result.
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

//authorisation to approve the valid user 

// we can check for admin here)
export const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next()
    } else {
        res.status(HTTP_CODES.UNAUTHORIZED).send('Not authorized as an admin')
    }
}