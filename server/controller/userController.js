import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/createToken.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from 'bcryptjs'
import { validateUserData } from "../utils/validateData.js";


export const createUser = asyncHandler(
    async (req, res) => {
        const {username, email, password, phone} = req.body;

        
        //add some validation before putting it into DB
        if(!username || !email || !password || !phone){
            throw new Error ('Please fill all the input fields')
        }
        
        //check if the user credential already exists
        const emailExists = await User.findOne({email}); // if the credentials are esisting we can find it 
        if(emailExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('Email already registered')
        }
        
        const phoneExists = await User.findOne({phone}); // if the credentials are esisting we can find it 
        if(phoneExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('Phone number already registered')
        }
        
        //check for validity of received data
        const valid = validateUserData(username, email, phone, password)
        if(valid !== true) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error(`${valid}`)
        }
        

        // hash the password before storing it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // create and add new user
        const newUser = new User({username, email, phone, password : hashedPassword})
        try {
            await newUser.save()

            //call a utility function to create a jwt token and store it in a cookie
            generateToken(res, newUser._id)

            res.status(HTTP_CODES.CREATED).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                phone : newUser.phone,
                role : "buyer"
            })
            
        } catch (error) {

            res.status(HTTP_CODES.BAD_REQUEST);
            throw new Error('Invalid user data')
            
        }
        
    }
)

export const loginUser = asyncHandler(
    async (req, res) => {
        
        //get login credentials from request
        const {email, password} = req.body;
        
        //find the user
        const existingUser = await User.findOne({email})
        //login if exist eroor message if not
        if(existingUser){
            
            if(!existingUser.isActive){
                res.status(HTTP_CODES.BAD_REQUEST)
                throw new Error('Account Blocked! Please contact admin!')
            }
     
            const isPasswordValid = await bcrypt.compare(password, existingUser.password)

            if(isPasswordValid){
                generateToken(res, existingUser._id)

                res.status(HTTP_CODES.ACCEPTED).json({
                    _id : existingUser._id,
                    username : existingUser.username,
                    email : existingUser.email,
                    role : existingUser.role,
                })

                return 
            } else {
                //another error message
                res.status(HTTP_CODES.BAD_REQUEST)
                throw new Error('Invalid Credentials. Try Again')
            }

        } else {
            //revert with an error message
            res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Invalid Credentials. Try Again'})
        }    
    }
)

export const logoutController = asyncHandler(
    async (req, res) => {
        res.cookie('jwt', '', {
            httpOnly : true,
            expires : new Date(0) //a point in the past as an expiration date
        })

        res.status(HTTP_CODES.OK).json({message : 'Logged out successfully'})
    }
)

//----------------


//get current user profile

//update current user profile

//delete current user account
