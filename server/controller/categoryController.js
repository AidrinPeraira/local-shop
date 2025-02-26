import Category from "../models/categoryModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory, status } = req.body;
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
    status,
  });

  await newCategory.save();

  res.status(HTTP_CODES.CREATED).json({
    message: "Category added successfully",
    category: newCategory,
  });
});

//constroller to get both active and inactive categories in nested fashion

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

//paginated code
/**
 export const getAllCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 per page
  const skip = (page - 1) * limit;

  const result = await Category.aggregate([
    { $match: { level: 1 } }, // Get only top-level categories

    // Lookup for level 2
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategory",
        as: "subCategories",
      },
    },

    { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },

    // Lookup level 3
    {
      $lookup: {
        from: "categories",
        localField: "subCategories._id",
        foreignField: "parentCategory",
        as: "subCategories.subSubCategories",
      },
    },

    // Group back to get nested structure
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        slug: { $first: "$slug" },
        parentCategory: { $first: "$parentCategory" },
        level: { $first: "$level" },
        updatedBy: { $first: "$updatedBy" },
        createdBy: { $first: "$createdBy" },
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        subCategories: { $push: "$subCategories" },
      },
    },

    // Apply pagination
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  // Extract data and total count
  const categories = result[0]?.data || [];
  const total = result[0]?.metadata[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    categories,
    total,
    totalPages,
    currentPage: page,
    perPage: limit,
  });
});

 */

//controller to get only active categories in nested fashion
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $match: { level: 1, status: "active" } }, // Get only top-level categories (Level 1)

    // Lookup forlevel 2
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategory",
        as: "subCategories",
        pipeline: [{ $match: { status: "active" } }],
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
        pipeline: [{ $match: { status: "active" } }],
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
