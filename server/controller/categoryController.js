import Category from "../models/categoryModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory, isActive } = req.body;
  const adminId = req.user._id;

  // Validate input
  if (!name) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error("Category name is required");
  }

  //lets throw an error if the category exists
  const existingCategory = await Category.findOne({ name, parentCategory });
  if (existingCategory) {
    res.status(HTTP_CODES.CONFLICT);
    throw new Error("Category already exists at this level");
  }

  // if we get paretn id then search for parent and add sub category
  let level = 1;
  if (parentCategory) {
    const parent = await Category.findById(parentCategory);
    if (!parent) {
      return res
        .status(HTTP_CODES.NOT_FOUND)
        .json({ message: "Parent category not found" });
    }
    level = parent.level + 1;
    if (level > 3) {
      return res
        .status(HTTP_CODES.BAD_REQUEST)
        .json({ message: "Only 3 levels of categories are allowed" });
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
    isActive,
  });

  await newCategory.save();

  res.status(HTTP_CODES.CREATED).json({
    message: "Category added successfully",
    category: newCategory,
  });
});

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, parentCategory, isActive } = req.body;
  const adminId = req.user._id;

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Category not found");
  }

  // Check if the new name already exists at the same level (except for this category)
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name,
      parentCategory: parentCategory || category.parentCategory,
      _id: { $ne: id } // Exclude the current category
    });

    if (existingCategory) {
      res.status(HTTP_CODES.CONFLICT);
      throw new Error("Category with this name already exists at this level");
    }
  }

      //how to change levels for categories?????????
  // If changing parent category, verify the level constraint
  let level = category.level;
  if (parentCategory && parentCategory !== category.parentCategory) {
    const parent = await Category.findById(parentCategory);
    console.log("hit", parent)

    if (!parent) {
      res.status(HTTP_CODES.NOT_FOUND);
      throw new Error("Parent category not found");
    }
    
    level = parent.level + 1;
    if (level > 3) {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Only 3 levels of categories are allowed");
    }

    // Check if this category has subcategories
    const hasSubcategories = await Category.exists({ parentCategory: id });
    if (hasSubcategories && level === 3) {
      res.status(HTTP_CODES.BAD_REQUEST);
      throw new Error("Cannot move category to level 3 as it has subcategories");
    }
  }

  // Update category
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: name || category.name,
      parentCategory: parentCategory || category.parentCategory,
      level,
      slug: name ? slugify(name, { lower: true }) : category.slug,
      updatedBy: adminId,
      isActive: isActive || category.isActive
    },
    { new: true }
  );

  res.status(HTTP_CODES.OK).json({
    message: "Category updated successfully",
    category: updatedCategory
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Category not found");
  }

  // Check if this category has subcategories
  const hasSubcategories = await Category.exists({ parentCategory: id });
  if (hasSubcategories) {
    // Update all subcategories to inactive as well
    await Category.updateMany(
      { parentCategory: id },
      { isActive: false, updatedBy: adminId }
    );
  }

  // Soft delete by setting status to inactive
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      isActive: false,
      updatedBy: adminId
    },
    { new: true }
  );

  res.status(HTTP_CODES.OK).json({
    message: "Category deleted successfully",
    category: updatedCategory
  });
});



//controller to get active and inactive categories
//need to add pagination
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $match: { level: 1 } }, // Get only top-level categories (Level 1)

    // Lookup for level 2
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategory",
        as: "subCategories",
      },
    },

    // Add a new field that will process each subcategory
    {
      $addFields: {
        subCategories: {
          $map: {
            input: "$subCategories",
            as: "subCat",
            in: {
              $mergeObjects: [
                "$$subCat",
                { subSubCategories: [] } // Initialize with empty array
              ]
            }
          }
        }
      }
    },

    // For each subcategory, lookup its subcategories (level 3)
    {
      $lookup: {
        from: "categories",
        let: { subCategoryIds: "$subCategories._id" },
        pipeline: [
          { 
            $match: { 
              $expr: { $in: ["$parentCategory", "$$subCategoryIds"] } 
            } 
          }
        ],
        as: "allSubSubCategories"
      }
    },

    // Properly nest level 3 categories under their respective level 2 parents
    {
      $addFields: {
        subCategories: {
          $map: {
            input: "$subCategories",
            as: "subCat",
            in: {
              $mergeObjects: [
                "$$subCat",
                {
                  subSubCategories: {
                    $filter: {
                      input: "$allSubSubCategories",
                      as: "subSubCat",
                      cond: { $eq: ["$$subSubCat.parentCategory", "$$subCat._id"] }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },

    // Clean up the temporary field
    {
      $project: {
        allSubSubCategories: 0
      }
    }
  ]);

  res.status(200).json(categories);
});


//controller to get only active categories in nested fashion
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $match: { level: 1, isActive: true } }, // Get only top-level categories

    {$project: {
      _id: 1,   // Include field1
      name: 1,   // Include field2
      level: 1,   // Exclude field3
      parentCategory : 1
    }
    },
    // Lookup level 2 categories
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategory",
        as: "subCategories",
      },
    },

    // Only keep required fields for level 2
    {
      $addFields: {
        subCategories: {
          $map: {
            input: "$subCategories",
            as: "subCat",
            in: {
              _id: "$$subCat._id",
              name: "$$subCat.name",
              level: "$$subCat.level",
              subSubCategories: [] // Initialize empty array
            }
          }
        }
      }
    },

    // Lookup level 3 categories
    {
      $lookup: {
        from: "categories",
        let: { subCategoryIds: "$subCategories._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$parentCategory", "$$subCategoryIds"] },
            },
          },
          {
            $project: { _id: 1, name: 1, level: 1, parentCategory: 1 },
          },
        ],
        as: "allSubSubCategories",
      },
    },

    // Properly nest level 3 categories
    {
      $addFields: {
        subCategories: {
          $map: {
            input: "$subCategories",
            as: "subCat",
            in: {
              _id: "$$subCat._id",
              name: "$$subCat.name",
              level: "$$subCat.level",
              subSubCategories: {
                $filter: {
                  input: "$allSubSubCategories",
                  as: "subSubCat",
                  cond: { $eq: ["$$subSubCat.parentCategory", "$$subCat._id"] },
                },
              },
            },
          },
        },
      },
    },

    // Remove unnecessary fields
    {
      $project: {
        allSubSubCategories: 0,
      },
    },
  ]);

  res.status(200).json(categories);
});
