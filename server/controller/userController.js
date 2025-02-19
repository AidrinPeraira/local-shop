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
        if(valid === true) {
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
                success : true,
                message : 'User Created Succesfully',
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                phone : newUser.phone
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
        
        //check for corresponding user
        const existingUser = await User.findOne({email})
        console.log(email, password, existingUser)

        //login if exist eroor message if not
        if(existingUser){
            //let user login

            //compare password first
            const isPasswordValid = await bcrypt.compare(password, existingUser.password)

            if(isPasswordValid){
                generateToken(res, existingUser._id)

                res.status(HTTP_CODES.ACCEPTED).json({
                    _id : existingUser._id,
                    username : existingUser.username,
                    email : existingUser.email,
                    role : existingUser.role,
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

export const logoutController = asyncHandler(
    async (req, res) => {
        res.cookie('jwt', '', {
            httpOnly : true,
            expires : new Date(0) //a point in the past as an expiration date
        })

        res.status(HTTP_CODES.OK).json({message : 'Logged out successfully'})
    }
)

export const getAllUsers = asyncHandler(
    async (req, res) => {
        const users = await User.find({})
        res.json(users)
    }
)

export const getCurrentUserProfile = asyncHandler(
    async (req, res) => {
        const user = await User.findById({_id : req.user._id})
        if(user){
            res.status(HTTP_CODES.OK).json({
                _id : user._id,
                username : user.username,
                email : user.email,
            })
        } else {
            res.status(HTTP_CODES.NOT_FOUND)
            throw new Error("User not found")
        }
    }
)

export const updateCurrentUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id)

        if(user){
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            if(req.body.password){

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt)

                user.password =  hashedPassword
            }
    
            const updatedUser = await user.save()
    
            res.status(HTTP_CODES.OK).json({
                success : true,
                message : 'User Updated Succesfully',
                _id : updatedUser._id,
                username : updatedUser.username,
                email : updatedUser.email,
                role : updatedUser.role,
            })

        } else {

            res.status(HTTP_CODES.NOT_FOUND)
            throw new Error('User not found')

        }


    }
)

export const deleteUserById = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id) 
        
        if(user){

            //prevent deleting an adminf
            if(user.role == 'admin'){
                res.status(HTTP_CODES.BAD_REQUEST)
                throw new Error('Cannot delete admin user')
            }

            await User.deleteOne({_id: user._id})
            res.status(HTTP_CODES.OK).json({message : "User removed"})
        } else {
            res.status(HTTP_CODES.NOT_FOUND)
            throw new Error ("User not found")
        }
    }
)

export const getUserById = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id).select('-password')

        if(user){
            res.json(user)
        } else {
            res.status(HTTP_CODES.NOT_FOUND)
            throw new Error("User not found");
        }
    }
)

export const updateUserById = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id)

        if(user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save()

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
            })
        } else {
            res.status(HTTP_CODES.NOT_FOUND)
            throw new Error('User not found')
        }

    }
)