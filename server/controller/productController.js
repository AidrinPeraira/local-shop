import Product from "../models/productModel.js";
import slugify from "slugify";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { json } from "express";
import { validateProductData } from "../utils/validateData.js";
import { HTTP_CODES } from "../utils/responseCodes.js";
import Category from "../models/categoryModel.js";

export const getSellerProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { page = 1, limit = 10, status, search, sortBy } = req.query;

  const query = {};

  if (req.user.role == "seller") {
    query.seller = sellerId;
    isBlocked: false;
  }

  if (status) {
    switch (status) {
      case "in-stock":
        query.inStock = true;
        break;
      case "out-of-stock":
        query.inStock = false;
        break;
      case "low-stock":
        query.stock = { $gt: 0, $lte: 10 };
        break;
      case "active":
        query.isActive = true;
        break;
      case "inactive":
        query.isActive = false;
        break;
      case "deleted":
        query.isBlocked = true;
        break;
    }
  }

  if (status) {
    switch (status) {
      case "in-stock":
        query.inStock = true;
        break;
      case "out-of-stock":
        query.inStock = false;
        break;
      case "low-stock":
        query.stock = { $gt: 0, $lte: 10 };
        break;
      case "active":
        query.isActive = true;
        break;
      case "inactive":
        query.isActive = false;
        break;
      case "deleted":
        query.isBlocked = true;
        break;
    }
  }

  let sortOptions = {};
  switch (sortBy) {
    case "az":
      sortOptions.productName = 1;
      break;
    case "za":
      sortOptions.productName = -1;
      break;
    case "price-high":
      sortOptions.basePrice = -1;
      break;
    case "price-low":
      sortOptions.basePrice = 1;
      break;
    case "sales":
      sortOptions.sales = -1;
      break;
    case "latest":
    default:
      sortOptions.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  //get all products related to the seller

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-updatedAt"),
    Product.countDocuments(query),
  ]);

  res.status(HTTP_CODES.OK).json({
    success: true,
    products,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
});

export const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    description,
    category,
    basePrice,
    stock,
    stockUnit,
    variantTypes,
    variants,
    bulkDiscount,
  } = req.body;

  const images = req.files.map((file) => file.path);

  let valid = validateProductData({ ...req.body, images });
  if (valid !== true) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error(`${valid}`);
  }

  const productData = {
    seller: req.user._id,
    slug: slugify(productName, { lower: true }),
    productName,
    description,
    category,
    images,
    isActive: true,
    basePrice: parseFloat(basePrice),
    stock: parseFloat(stock),
    stockUnit: stockUnit 
  };

  //IF THERE ARE VARIANTS
  if (variantTypes) {
    /** 
       * this is how we get from front end      
       * let dummyVariantTypes = [
        { id: "1", name: "Color", values: ["Red", "Blue", "Green"] },
        { id: "2", name: "Size", values: ["Small", "Medium", "Large"] },
      ];
       */

    productData.variantTypes = JSON.parse(variantTypes).map((variation) => {
      return {
        variationName: variation.name,
        variationValues: variation.values,
      };
    });

    /**
       * this is how we get data from the frontend
      let dummyVariants = [
        {
          id: "variant-1741151566273-0",
          attributes: { Color: "Red", Size: "Small" },
          price: 400,
          stock: 400,
        }
      ];
       */

    productData.variants = JSON.parse(variants).map((variantObj) => {
      return {
        variantId: variantObj.id,
        attributes: variantObj.attributes,
        basePrice: variantObj.price,
        stock: variantObj.stock,
        inStock: variantObj.stock > 0,
      };
    });
  }


  productData.bulkDiscount = JSON.parse(bulkDiscount).map((discountObj) => {
    return {
      minQty: discountObj.minQuantity,
      priceDiscountPerUnit: discountObj.price,
    };
  });

  //lets now add the product to the db.
  //we don't have to check for duplicate products since allowing it creates healthy competititon. better prices for customers

  const product = new Product(productData);
  try {
    await product.save();

    res.status(HTTP_CODES.CREATED).json({
      success: true,
      message: "Product Created Sucessfully",
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

export const editProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const {
    productName,
    description,
    category,
    basePrice,
    stock,
    stockUnit,
    variantTypes,
    variants,
    bulkDiscount,
  } = req.body;

  // Check if product exists and belongs to seller
  const existingProduct = await Product.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!existingProduct) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Product not found or unauthorized");
  }

  // Prepare update data
  const productData = {
    slug: slugify(productName, { lower: true }),
    productName,
    description,
    category,
    basePrice: parseFloat(basePrice),
    stock: parseFloat(stock),
    stockUnit: stockUnit || "Nos",
  };

  // Handle images only if new ones are uploaded
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map((file) => file.path);
  }

  let valid = validateProductData({
    ...req.body,
    images: productData.images || existingProduct.images,
  });
  if (valid !== true) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new Error(`${valid}`);
  }

  // Handle variants if provided
  if (variantTypes) {
    productData.variantTypes = JSON.parse(variantTypes).map((variation) => ({
      variationName: variation.name,
      variationValues: variation.values,
    }));

    productData.variants = JSON.parse(variants).map((variantObj) => ({
      variantId: variantObj.id,
      attributes: variantObj.attributes,
      basePrice: variantObj.price,
      stock: variantObj.stock,
      inStock: variantObj.stock > 0,
    }));
  }

  if (bulkDiscount) {
    productData.bulkDiscount = JSON.parse(bulkDiscount).map((discountObj) => ({
      minQty: discountObj.minQuantity,
      priceDiscountPerUnit: discountObj.price,
    }));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true }
    );

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error(error);
  }
});

//the function is being used to set the field to active as well
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // Build the query with both product ID and seller ID (if seller)
  const query = {
    _id: productId,
    isBlocked: false
  };

  // Add seller check if user is a seller
  if (req.user.role === 'seller') {
    query.seller = req.user._id;
  }

  // Check if product exists and belongs to seller
  const existingProduct = await Product.findOne(query);

  if (!existingProduct) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Product not Found!!");
  }

  try {
    // Update the product's isActive status
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: !existingProduct.isActive },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(HTTP_CODES.NOT_FOUND);
      throw new Error("Failed to update product status");
    }

    res.status(HTTP_CODES.OK).json({
      success: true,
      message: `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error(error.message || "Error updating product status");
  }
});

//controller to send product data to shop page
export const getShopProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    priceRange,
    rating,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  //we will create an object to use in mongoose find
  const baseQuery = {
    isActive: true,
    isBlocked: false,
  };

  //query based on search
  if (search) {
    const searchRegex = new RegExp(search, "i"); //this is simple search need to add something to show related prosucts
    baseQuery.$or = [
      { productName: searchRegex },
      { description: searchRegex },
      { slug: searchRegex },
    ];
  }

  //if the breadcrumbs is used to go to parent category the products is not showing. so we add this code
  if (category) {
    // First, find the category and its level
    const selectedCategory = await Category.findById(category);

    if (selectedCategory) {
      if (selectedCategory.level === 3) {
        // if level three no change
        baseQuery.category = category;
      }

      // if level 2. check for subsub and loop
      else if (selectedCategory.level === 2) {
        const subCategories = await Category.find({
          parentCategory: selectedCategory._id,
          level: 3,
        });
        baseQuery.category = {
          $in: subCategories.map((cat) => cat._id),
        };
      }

      // if level 1, check for sub and loop then sub sub and loop
      else if (selectedCategory.level === 1) {
        const subCategories = await Category.find({
          parentCategory: selectedCategory._id,
          level: 2,
        });

        const subSubCategories = await Category.find({
          parentCategory: { $in: subCategories.map((cat) => cat._id) },
          level: 3,
        });

        baseQuery.category = {
          $in: subSubCategories.map((cat) => cat._id),
        };
      }
    }
  }

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(",").map(Number);
    baseQuery.basePrice = {
      $gte: minPrice,
      $lte: maxPrice,
    };
  }

  if (rating) {
    baseQuery.avgRating = {
      $gte: Number(rating),
    };
  }

  //like the object to querry db. make on to sort data
  let sortOptions = {};

  switch (sort) {
    case "price_asc":
      sortOptions.basePrice = 1;
      break;
    case "price_desc":
      sortOptions.basePrice = -1;
      break;
    case "popoular":
      sortOptions.reviewCount = -1;
      break;
    case "latest":
    default:
      sortOptions.createdAt = -1;
  }

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const totalProducts = await Product.countDocuments(baseQuery);

    const products = await Product.find(baseQuery)
      .select("-isBlocked -__v")
      .populate("category", "name")
      .populate("seller", "sellerName")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalPages = Math.ceil(totalProducts / Number(limit));

    // Get blocked or inactive categories
    const blockedCategories = await Category.find({ 
      $or: [
        { isBlocked: true },
        { isActive: false }
      ]
    });
    const blockedCategoryIds = blockedCategories.map(category => category._id.toString());

    // Transform and filter products
    const transformedProducts = products
      .filter(product => !blockedCategoryIds.includes(product.category._id.toString()))
      .map(product => ({
        _id: product._id,
        productName: product.productName,
        slug: product.slug,
        description: product.description,
        category: product.category,
        images: product.images,
        avgRating: product.avgRating,
        reviewCount: product.reviewCount,
        basePrice: product.basePrice,
        stock: product.stock,
        inStock: product.inStock,
        stockUnit: product.stockUnit,
        seller: product.seller,
        variants: product.variants,
        bulkDiscount: product.bulkDiscount,
      }));

    res.status(HTTP_CODES.OK).json({
      success: true,
      currentPage: Number(page),
      totalPages,
      totalProducts: transformedProducts.length, // Update total count after filtering
      productsPerPage: Number(limit),
      products: transformedProducts,
    });
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new Error("Error fetching products: " + error.message);
  }
});

//get details of one product
export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({
    _id: id,
    isActive: true,
    isBlocked: false,
  })
    .populate("category", "name")
    .populate("seller", "sellerName")
    .select("-isBlocked -__v");

  if (!product) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("This product is currently unavailable. Please try later");
  }

  // Transform the data to match the frontend format
  const transformedProduct = {
    _id: product._id,
    productName: product.productName,
    slug: product.slug,
    description: product.description,
    category: {
      _id: product.category._id,
      name: product.category.name,
    },
    images: product.images,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
    basePrice: product.basePrice,
    stock: product.stock,
    stockUnit: product.stockUnit,
    inStock: product.inStock,
    seller: {
      _id: product.seller._id,
      sellerName: product.seller.sellerName,
    },
    variantTypes: product.variantTypes,
    variants: product.variants.map((variant) => ({
      variantId: variant.variantId,
      attributes: variant.attributes,
      stock: variant.stock,
      inStock: variant.inStock,
      basePrice: variant.basePrice,
      _id: variant._id,
    })),
    bulkDiscount: product.bulkDiscount.map((discount) => ({
      minQty: discount.minQty,
      priceDiscountPerUnit: discount.priceDiscountPerUnit,
      _id: discount._id,
    })),
  };

  res.status(HTTP_CODES.OK).json({
    success: true,
    product: transformedProduct,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("seller", "sellerName email")
    .select("-createdAt -updatedAt");

  res.status(HTTP_CODES.OK).json({
    success: true,
    count: products.length,
    products: products,
  });
});

export const blockProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Product not found");
  }

  product.isBlocked = true;
  product.isActive = false;
  await product.save();

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: "Product blocked successfully"
  });
});

export const unblockProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new Error("Product not found");
  }

  product.isBlocked = false;
  product.isActive = true;
  await product.save();

  res.status(HTTP_CODES.OK).json({
    success: true,
    message: "Product unblocked successfully"
  });
});
