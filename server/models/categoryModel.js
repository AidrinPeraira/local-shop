import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, 
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3], 
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    status : {
      type: String,
      required: true,
      enum: ["active", "inactive"], 
      default: "active"
    }
  },
  { timestamps: true } 
);

// // Add indexes for faster queries
// categorySchema.index({ slug: 1 });
// categorySchema.index({ parentCategory: 1 });

export default mongoose.model("Category", categorySchema);
