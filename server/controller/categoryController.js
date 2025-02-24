import Category from "../models/categoryModel.js"; 
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import slugify from "slugify"; 

export const addCategory = asyncHandler(async (req, res) => {
    const { name, parentCategory } = req.body;
    const adminId = req.user._id
    
    // Validate input
    if (!name) {
        res.status(HTTP_CODES.BAD_REQUEST)
        throw new Error("Category name is required");
    }

    
    
    //lets throw an error if the category exists
    const existingCategory = await Category.findOne({ name, parentCategory }); 
    if (existingCategory) {
        res.status(HTTP_CODES.CONFLICT)
        throw new Error("Category already exists at this level")
    }

    // if we get paretn id then search for parent and add sub category
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

    // if don't get parent then we create level 1 category
    const newCategory = new Category({
        name,
        parentCategory: parentCategory || null,
        level,
        slug: slugify(name, { lower: true }),
        createdBy: adminId, //added and updated is smae person when creating the category. 
        updatedBy: adminId,
    });

    await newCategory.save();

    res.status(HTTP_CODES.CREATED).json({
        message: "Category added successfully",
        category: newCategory,
    });
});
