import mongoose from "mongoose";

//first we create a structure of the db doc using a schema
const otpSchema = mongoose.Schema({
    email : {
        type : String,
    },
    otp : {
        type : String,
        required : true,
    },
    verifyStatus : {
        type : String,
        required : true,
        default : false
    },
    otpExpiresAt : {
        type : Date,
        required : true,
    },
    otpAttempt : {
        type : String,
        required : true,
    }

}, {timestamps : true})

//now we creatte a model based on this schema

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;