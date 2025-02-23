import Category from "../models/categoryModel.js"; 
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import slugify from "slugify"; 

export const addCategory = asyncHandler(async (req, res) => {
    const { name, parentCategory } = req.body;

    // Validate input
    if (!name) {
        return res.status(HTTP_CODES.BAD_REQUEST).json({ message: "Category name is required" });
    }

    // Check if category already exists at the same level
    const existingCategory = await Category.findOne({ name, parentCategory });
    if (existingCategory) {
        return res.status(HTTP_CODES.CONFLICT).json({ message: "Category already exists at this level" });
    }

    // Determine category level
    let level = 1;
    if (parentCategory) {
        const parent = await Category.findById(parentCategory);
        if (!parent) {
            return res.status(HTTP_CODES.NOT_FOUND).json({ message: "Parent category not found" });
        }
        level = parent.level + 1;
        if (level > 3) {
            return res.status(HTTP_CODES.BAD_REQUEST).json({ message: "Only 3 levels of categories are allowed" });
        }
    }

    // Create new category
    const newCategory = new Category({
        name,
        parentCategory: parentCategory || null,
        level,
        slug: slugify(name, { lower: true }),
    });

    await newCategory.save();

    res.status(HTTP_CODES.CREATED).json({
        message: "Category added successfully",
        category: newCategory,
    });
});
