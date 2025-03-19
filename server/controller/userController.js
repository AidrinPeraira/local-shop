import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import Address from "../models/userAddresssModel.js";
import generateToken from "../utils/createToken.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import bcrypt from "bcryptjs";
import { validateUserData } from "../utils/validateData.js";
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";



//user signup sign in actions
export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  //add some validation before putting it into DB
  if (!username || !email || !password || !phone) {
    throw new Error("Please fill all the input fields");
  }

  //check if the user credential already exists
  const emailExists = await User.findOne({ email }); // if the credentials are esisting we can find it
  if (emailExists) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Email already registered");
  }

  const phoneExists = await User.findOne({ phone }); // if the credentials are esisting we can find it
  if (phoneExists) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Phone number already registered");
  }

  //check for validity of received data
  const valid = validateUserData(username, email, phone, password);
  if (valid !== true) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error(`${valid}`);
  }

  // hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // create and add new user
  const newUser = new User({
    username,
    email,
    phone,
    password: hashedPassword,
  });
  try {
    await newUser.save();

    //call a utility function to create a jwt token and store it in a cookie
    generateToken(res, newUser._id);

    res.status(HTTP_CODES.CREATED).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: "buyer",
    });
  } catch (error) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  //get login credentials from request
  const { email, password } = req.body;

  //find the user
  const existingUser = await User.findOne({ email });
  //login if exist eroor message if not
  if (existingUser) {
    if (!existingUser.isActive) {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Account Blocked! Please contact admin!");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      generateToken(res, existingUser._id);

      res.status(HTTP_CODES.ACCEPTED).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        joinedOn: existingUser.createdAt,
      });

      return;
    } else {
      //another error message
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Invalid Credentials. Try Again");
    }
  } else {
    //revert with an error message
    res
      .status(HTTP_CODES.BAD_REQUEST)
      .json({ message: "Invalid Credentials. Try Again" });
  }
});

export const logoutController = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), //a point in the past as an expiration date
  });

  res.status(HTTP_CODES.OK).json({ message: "Logged out successfully" });
});

export const googleAuthController = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  const { email, name } = userRes.data;
  console.log(email, name);
  let user = await User.findOne({ email });
  const randomPassword =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  if (!user) {
    user = await User.create({
      username: name,
      email,
      password: randomPassword,
    });
  }

  generateToken(res, user._id);

  res.status(HTTP_CODES.CREATED).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone || null,
    role: "buyer",
  });
});

//forgot passwrod actions
export const checkUserExists = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Email address is necessary.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("No user found with this email address");
  }

  res.status(HTTP_CODES.OK).json({
    username: user.username,
  });
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Email address is necessary.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Invalid email format");
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Invalid password format");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  user.password = hashedPassword;
  await user.save();

  res.status(HTTP_CODES.OK).json({
    message: "Password reset successful",
  });
});

//admin actions to manipulate user data
// Deactivate user
//activate user
//get all users

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const search = req.query.search;
  const sort = req.query.sort || "latest";

  // Build filter to make querrying easier
  const filter = {};

  // Status filter
  if (status && status !== "All") {
    filter.isActive = status === "Active";
  }

  // apply filters
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // apply sorts
  let sortCondition = {};
  switch (sort) {
    case "az":
      sortCondition = { username: 1 };
      break;
    case "za":
      sortCondition = { username: -1 };
      break;
    case "latest":
    default:
      sortCondition = { createdAt: -1 };
      break;
  }
  try {
    // Execute query with aggregation pipeline
    const [result] = await User.aggregate([
      { $match: filter },
      {
        $facet: {
          total: [{ $count: "count" }],
          users: [
            { $sort: sortCondition },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                password: 0,
                __v: 0,
              },
            },
          ],
        },
      },
    ]);

    const total = result.total[0]?.count || 0;
    const users = result.users;

    if (!users.length && total > 0) {
      res.status(HTTP_CODES.NOT_FOUND);
      throw new Error("No users found on this page");
    }

    res.status(HTTP_CODES.OK).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error("Error fetching users: " + error.message);
  }
});

export const activateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  user.isActive = true;
  await user.save();

  res.status(HTTP_CODES.OK).json({
    message: "User activated successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    },
  });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  user.isActive = false;
  await user.save();

  res.status(HTTP_CODES.OK).json({
    message: "User deactivated successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    },
  });
});


//add edit and delte user address
export const getUserAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const addresses = await Address.find({ userId });

  res.status(HTTP_CODES.OK).json({
    addresses
  });
});

export const addUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { street, city, state, pincode, isDefault } = req.body;

  // Validate required fields
  if (!street || !city || !state || !pincode) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("All fields are required");
  }

  // If this is default address, remove default from other addresses
  if (isDefault) {
    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }

  // Create new address
  const newAddress = await Address.create({
    userId,
    street,
    city,
    state,
    pincode,
    isDefault
  });

  // If this is the first address, make it default
  const addressCount = await Address.countDocuments({ userId });
  if (addressCount === 1) {
    newAddress.isDefault = true;
    await newAddress.save();
  }

  res.status(HTTP_CODES.CREATED).json({
    message: "Address added successfully",
    address: newAddress
  });
});

export const updateUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.body.addressId;
  const { street, city, state, pincode, isDefault } = req.body;

  // Find address and verify ownership
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Address not found");
  }

  // If setting as default, remove default from other addresses
  if (isDefault && !address.isDefault) {
    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }

  // Update address
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.pincode = pincode || address.pincode;
  address.isDefault = isDefault || address.isDefault;

  await address.save();

  res.status(HTTP_CODES.OK).json({
    message: "Address updated successfully",
    address
  });
});

export const deleteUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;

  console.log(addressId)
  // Find address and verify ownership
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Address not found");
  }

  // Don't allow deletion of default address
  if (address.isDefault) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Cannot delete default address");
  }

  await address.deleteOne();

  // If this was the last address, no need to check for default
  const remainingAddresses = await Address.countDocuments({ userId });
  if (remainingAddresses === 1) {
    // Make the remaining address default
    await Address.updateOne(
      { userId },
      { $set: { isDefault: true } }
    );
  }

  res.status(HTTP_CODES.OK).json({
    message: "Address deleted successfully"
  });
});


//show edit user profile info and change password
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await User.findById(userId).select('-password');
  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  // Get default address if exists
  const defaultAddress = await Address.findOne({ userId, isDefault: true });

  res.status(HTTP_CODES.OK).json({
    user: {
      ...user.toObject(),
      defaultAddress
    }
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username, email, phone, currentPassword } = req.body;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    res.status(HTTP_CODES.UNAUTHORIZED);
    throw new Error("Invalid password");
  }

  // Check if email is being changed and verify it's not taken
  if (email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Email already registered");
    }
  }

  // Check if phone is being changed and verify it's not taken
  if (phone !== user.phone) {
    const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
    if (phoneExists) {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Phone number already registered");
    }
  }

  // Validate new data
  const valid = validateUserData(username, email, phone, currentPassword);
  if (valid !== true) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error(`${valid}`);
  }

  // Update user
  user.username = username;
  user.email = email;
  user.phone = phone;
  // Reset verification flags if email/phone changed
  if (email !== user.email) user.emailVerified = false;
  if (phone !== user.phone) user.phoneVerified = false;

  await user.save();

  res.status(HTTP_CODES.OK).json({
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    res.status(HTTP_CODES.UNAUTHORIZED);
    throw new Error("Current password is incorrect");
  }

  // Validate new password
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character");
  }

  // Check if new password is same as current
  if (await bcrypt.compare(newPassword, user.password)) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("New password must be different from current password");
  }

  // Hash and save new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  user.password = hashedPassword;
  await user.save();

  res.status(HTTP_CODES.OK).json({
    message: "Password changed successfully"
  });
});


