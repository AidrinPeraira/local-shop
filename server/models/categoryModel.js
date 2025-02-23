import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
});

export default mongoose.model("Category", categorySchema);
