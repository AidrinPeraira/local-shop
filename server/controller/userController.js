import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/createToken.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from 'bcryptjs'


export const createUser = asyncHandler(
    async (req, res) => {
        const {username, email, password} = req.body;

        //add some validation before putting it into DB
        if(!username || !email || !password){
            throw new Error ('Please fill all the input fields')
        }

        //check if the user credential already exists
        const userExists = await User.findOne({email}); // if the credentials are esisting we can find it 
        if(userExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('User already exists!')
        }

        // hash the password before storing it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // create and add new user
        const newUser = new User({username, email, password : hashedPassword})
        try {
            await newUser.save()

            //call a utility function to create a jwt token and store it in a cookie
            generateToken(res, newUser._id)

            res.status(HTTP_CODES.CREATED).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                role : newUser.role,
                imgUrl : "data:image/png;base64,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"
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
                    imgUrl : existingUser.imgUrl
                })

                return //to exit the function
            } else {
                //another error message
                res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Invalid Credentials. Try Again'})
            }

            
        } else {
            //revert with an error message
            res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Invalid Credentials. Try Again'})
        }    }
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
        const user = await User.findById(req.body._id)
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

export const adminCreateUser = asyncHandler(
    async (req, res) => {
        const {username, email, password} = req.body;

        //add some validation before putting it into DB
        if(!username || !email || !password){
            throw new Error ('Please fill all the input fields')
        }

        //check if the user credential already exists
        const userExists = await User.findOne({email}); // if the credentials are esisting we can find it 
        if(userExists) {
            res.status(HTTP_CODES.BAD_REQUEST)
            throw new Error('User already exists!')
        }

        // hash the password before storing it
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // create and add new user
        const newUser = new User({username, email, password : hashedPassword})
        try {
            await newUser.save()
            res.status(HTTP_CODES.CREATED).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                role : newUser.role,
                imgUrl : "data:image/png;base64,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"
            })
            
        } catch (error) {

            res.status(HTTP_CODES.BAD_REQUEST);
            throw new Error('Invalid user data')
            
        }
        
    }
)