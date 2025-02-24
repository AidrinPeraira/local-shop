import mongoose from "mongoose";

//first we create a structure of the db doc using a schema
const adminSchema = mongoose.Schema({
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
    status : {
      type: String,
      required: true,
      enum: ["active", "inactive"], 
      default: "active"
    },
    role : {
        type : String,
        required : true,
        default : 'admin'
    }
}, {timestamps : true})

//now we creatte a model based on this schema

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;