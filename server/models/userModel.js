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
        required : true,
        unique : true,
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
    blocked : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        required : true,
        enum: ['buyer', 'seller', 'admin'], // Allowed values
        message: '{VALUE} is not a valid role', // Optional error message
        default : 'buyer'
    }
}, {timestamps : true})

//now we creatte a model based on this schema

const User = mongoose.model('User', userSchema);
export default User;