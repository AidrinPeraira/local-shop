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
        const registerdSeller = await Seller.findOne({email})

        //blocked sellr
        
        //login if exist eroor message if not
        if(registerdSeller){
            //let user login
            if(!registerdSeller.isActive){
                res.status(HTTP_CODES.BAD_REQUEST).json({message : 'Your Account is blocked. Please contact admin for more information'})
                return //to exit the function
            }
    

            //compare password first
            const isPasswordValid = await bcrypt.compare(password, registerdSeller.password)

            if(isPasswordValid){
                generateToken(res, registerdSeller._id)

                res.status(HTTP_CODES.ACCEPTED).json({
                    _id : registerdSeller._id,
                    username : registerdSeller.sellerName,
                    email : registerdSeller.email,
                    role : registerdSeller.role,
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


//admin actions to manipulate sellers
export const getAllSellers = asyncHandler(
    async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const sort = req.query.sort || 'latest';

        const filter = {};
        
        // Status filter
        if (status && status !== 'All') {
            filter.isActive = status === 'Active';
        }

        // Search filter
        if (search) {
            filter.$or = [
                { sellerName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // sort conditions
        let sortCondition = {};
        switch (sort) {
            case 'az':
                sortCondition = { sellerName: 1 };
                break;
            case 'za':
                sortCondition = { sellerName: -1 };
                break;
            default: // 'latest'
                sortCondition = { createdAt: -1 };
        }

        try {
            const result = await Seller.aggregate([
                {
                    $facet: {
                        total: [{ $match: filter }, { $count: 'count' }],
                        sellers: [
                            { $match: filter },
                            { $sort: sortCondition },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $project: {
                                    password: 0,
                                    __v: 0
                                }
                            }
                        ]
                    }
                }
            ]);

            const total = result[0].total[0]?.count || 0;
            const sellers = result[0].sellers;

            res.status(HTTP_CODES.OK).json({
                sellers,
                total,
                page,
                pages: Math.ceil(total / limit)
            });
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
            throw new Error('Error fetching sellers: ' + error.message);
        }
    }
);

export const activateSeller = asyncHandler(
    async (req, res) => {
        const { sellerId } = req.params;

        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            res.status(HTTP_CODES.NOT_FOUND);
            throw new Error('Seller not found');
        }

        seller.isActive = true;
        await seller.save();

        res.status(HTTP_CODES.OK).json({
            message: 'Seller activated successfully',
            seller: {
                _id: seller._id,
                sellerName: seller.sellerName,
                email: seller.email,
                isActive: seller.isActive
            }
        });
    }
);

export const deactivateSeller = asyncHandler(
    async (req, res) => {
        const { sellerId } = req.params;

        const seller = await Seller.findById(sellerId);
        
        if (!seller) {
            res.status(HTTP_CODES.NOT_FOUND);
            throw new Error('Seller not found');
        }

        seller.isActive = false;
        await seller.save();

        res.status(HTTP_CODES.OK).json({
            message: 'Seller deactivated successfully',
            seller: {
                _id: seller._id,
                sellerName: seller.sellerName,
                email: seller.email,
                isActive: seller.isActive
            }
        });
    }
);
