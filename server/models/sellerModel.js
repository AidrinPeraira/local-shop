import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      officeName: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    taxId: {
      type: String,
      required: true,
      unique: true,
    },
    productCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    bankDetails: {
      bankName: { type: String, required: true },
      accountHolderName: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountNumber: { type: String, required: true, unique: true },
    },
    password: { 
        type: String, 
        required: true 
    },
    role : {
        type : String,
        required : true,
        default : 'seller'
    },
    isActive : {
      type: Boolean,
      required: true,
      default: true
    }
  },
  
  
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
