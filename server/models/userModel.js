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
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        required : true,
        enum: ['user-buyer', 'user-seller', 'admin'], // Allowed values
        message: '{VALUE} is not a valid role', // Optional error message
        default : 'user-buyer'
    }
}, {timestamps : true})

//now we creatte a model based on this schema

const User = mongoose.model('User', userSchema);
export default User;