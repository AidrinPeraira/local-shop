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
            })
            
        } catch (error) {

            res.status(HTTP_CODES.BAD_REQUEST);
            throw new Error('Invalid user data')
            
        }
        
    }
)