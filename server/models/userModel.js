import mongoose from "mongoose";

//first we create a structure of the db doc using a schema
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        message: 'Email id already registered!', 
    },
    password : {
        type : String,
        required : true,
    },
    phone : {
        type : Number,
        unique : true,
        sparse : true,
        message: 'Phone number already registered!', 
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    phoneVerified : {
        type : Boolean,
        default : false
    },
    isActive : {
      type: Boolean,
      required: true,
      default: true
    },
    role : {
        type : String,
        required : true,
        default : 'buyer'
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true
    }
}, {timestamps : true})

//now we creatte a model based on this schema

const User = mongoose.model('User', userSchema);
export default User;