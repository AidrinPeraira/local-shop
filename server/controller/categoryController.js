import Category from "../models/categoryModel.js"; 
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import slugify from "slugify"; 

export const createCategory = asyncHandler(async (req, res) => {
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

//constroller to get both active and inactive categories in nested fashion
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
      { $match: { level: 1 } }, // Get only top-level categories (Level 1)

      // Lookup forlevel 2
      {
          $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parentCategory",
              as: "subCategories",
          },
      },

      //we should unwind to remove nesting. later we can nest themn back in group
      { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },

      // Lookup level3
      {
          $lookup: {
              from: "categories",
              localField: "subCategories._id",
              foreignField: "parentCategory",
              as: "subCategories.subSubCategories",
          },
      },

      // Group back to get nested structure 
      /**
       * level 3 is already nested. we unwinded only level 2. $push will group and push all level 2 int o single leevl 1
       */
      {
          $group: {
              _id: "$_id",
              name: { $first: "$name" },
              slug: { $first: "$slug" },
              level: { $first: "$level" },
              parentCategory: { $first: "$parentCategory" },
              subCategories: { $push: "$subCategories" },
          },
      },
  ]);

  res.status(200).json(categories);
});

//controller to get only active categories in nested fashion
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([


      { $match : { level: 1, status : "active" } }, // Get only top-level categories (Level 1)
    

      // Lookup forlevel 2
      {
          $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parentCategory",
              as: "subCategories",
              pipeline : [
                { $match : { status : "active" } }
              ]
          },
      },

      //we should unwind to remove nesting. later we can nest themn back in group
      { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },

      // Lookup level3
      {
          $lookup: {
              from: "categories",
              localField: "subCategories._id",
              foreignField: "parentCategory",
              as: "subCategories.subSubCategories",
              pipeline : [
                { $match : { status : "active" } }
              ]
          },
      },

      // Group back to get nested structure 
      /**
       * level 3 is already nested. we unwinded only level 2. $push will group and push all level 2 int o single leevl 1
       */
      {
          $group: {
              _id: "$_id",
              name: { $first: "$name" },
              slug: { $first: "$slug" },
              level: { $first: "$level" },
              parentCategory: { $first: "$parentCategory" },
              subCategories: { $push: "$subCategories" },
          },
      },
  ]);

  res.status(200).json(categories);
});

