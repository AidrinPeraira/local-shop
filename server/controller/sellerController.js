import { asyncHandler } from "../middlewares/asyncHandler.js";
import Seller from "../models/sellerModel.js";
import generateToken from "../utils/createToken.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from 'bcryptjs'
import { validateSellerData, validateUserData } from "../utils/validateData.js";


export const registerSeller = asyncHandler(
    async (req, res) => {

        const {
            sellerName,
            phone,
            email,
            address,
            taxId,
            productCategories,
            bankDetails,
            password,
          } = req.body;
        
        //check fgor empty data
        if(!sellerName || !email || !password || !phone || !address || !taxId || !productCategories || !bankDetails){
            throw new Error ('Please fill all the input fields')
        }
        
        //check for existing Seller
        const emailExists = await Seller.findOne({email}); 
        if(emailExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('Email already registered')
        }        

        const phoneExists = await Seller.findOne({phone}); 
        if(phoneExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('Phone number already registered')
        }
        
        //check for validity of received data
        const valid = validateSellerData({
            sellerName, 
            email, 
            phone, 
            password, 
            taxId, 
            address, 
            bankDetails,
            productCategories 
        })
        if(valid !== true) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error(`${valid}`)
        }
        

        // hash the password before storing it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // create and add new user
        const newSeller = new Seller({
            sellerName, 
            email, 
            phone, 
            taxId, 
            address, 
            bankDetails,
            productCategories,
            password : hashedPassword})

        try {
            await newSeller.save()

            //call a utility function to create a jwt token and store it in a cookie
            generateToken(res, newSeller._id)

            res.status(HTTP_CODES.CREATED).json({
                _id : newSeller._id,
                username : newSeller.username,
                email : newSeller.email,
                phone : newSeller.phone,
                role : "seller"
            })
            
        } catch (error) {

            res.status(HTTP_CODES.BAD_REQUEST);
            throw new Error(`${error}`)
            
        }
        
    }
)

export const loginSeller = asyncHandler(
    async (req, res) => {
        
        //get login credentials from request
        const {email, password} = req.body;
        //check for corresponding user
        const registeredAdmin = await Admin.findOne({email})
        //login if exist eroor message if not
        if(registeredAdmin){
            //let user login

            //compare password first
            const isPasswordValid = await bcrypt.compare(password, registeredAdmin.password)

            if(isPasswordValid){
                generateToken(res, registeredAdmin._id)

                res.status(HTTP_CODES.ACCEPTED).json({
                    _id : registeredAdmin._id,
                    username : registeredAdmin.username,
                    email : registeredAdmin.email,
                    role : registeredAdmin.role,
                })

                return //to exit the function
            } else {
                //another error message
                res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Invalid Credentials. Try Again'})
            }

        } else {
            //revert with an error message
            res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Invalid Credentials. Try Again'})
        }    
    }
)

export const logOutSeller = asyncHandler(
    async (req, res) => {
        res.cookie('jwt', '', {
            httpOnly : true,
            expires : new Date(0) //a point in the past as an expiration date
        })

        res.status(HTTP_CODES.OK).json({message : 'Logged out successfully'})
    }
)

