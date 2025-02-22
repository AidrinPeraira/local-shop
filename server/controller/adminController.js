import { asyncHandler } from "../middlewares/asyncHandler.js";
import Admin from "../models/adminModel.js";
import generateToken from "../utils/createToken.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from 'bcryptjs'
import { validateUserData } from "../utils/validateData.js";


export const registerAdmin = asyncHandler(
    async (req, res) => {
        const {username, email, password, phone} = req.body;

        
        //add some validation before putting it into DB
        if(!username || !email || !password || !phone ){
            throw new Error ('Please fill all the input fields')
        }
        
        //check for existing admin
        const emailExists = await Admin.findOne({email}); 
        if(emailExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('Email already registered')
        }
        
        const phoneExists = await Admin.findOne({phone}); 
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
        const newAdmin = new Admin({username, email, phone, password : hashedPassword})
        try {
            await newAdmin.save()

            //call a utility function to create a jwt token and store it in a cookie
            generateToken(res, newAdmin._id)

            res.status(HTTP_CODES.CREATED).json({
                _id : newAdmin._id,
                username : newAdmin.username,
                email : newAdmin.email,
                phone : newAdmin.phone,
                role : "buyer"
            })
            
        } catch (error) {

            res.status(HTTP_CODES.BAD_REQUEST);
            throw new Error('Invalid user data')
            
        }
        
    }
)

export const loginAdmin = asyncHandler(
    async (req, res) => {
        
        //get login credentials from request
        const {email, password} = req.body;
        console.log(email, password)
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

export const logOutAdmin = asyncHandler(
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
