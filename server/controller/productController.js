import Product from "../models/productModel.js";
import slugify from "slugify";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { json } from "express";
import { validateProductData } from "../utils/validateData.js";
import { HTTP_CODES } from "../utils/responseCodes.js";

export const getSellerProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  //get all products related to the seller

  const products = await Product.find({
    seller: sellerId,
    isBlocked: false,
  }).select("-createdAt -updatedAt -isBlocked");


  res.status(HTTP_CODES.OK).json({
    success: true,
    count: products.length,
    products: products,
  });

});

export const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    description,
    category,
    basePrice,
    stock,
    variantTypes,
    variants,
    bulkDiscount,
  } = req.body;

  const images = req.files.map((file) => file.path);

  let valid = validateProductData({ ...req.body, images });
  if (valid !== true) {
    res.status(HTTP_CODES.BAD_REQUEST);
    console.log(valid);
    throw new Error(`${valid}`);
  }

  const productData = {
    seller: req.user._id,
    slug: slugify(productName, { lower: true }),
    productName,
    description,
    category,
    images,
    isActive : true,
    basePrice: parseFloat(basePrice),
    stock: parseFloat(stock),
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

  console.log("this is the variants", productData.variants);

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
    variantTypes,
    variants,
    bulkDiscount,
  } = req.body;

  // Check if product exists and belongs to seller
  const existingProduct = await Product.findOne({ 
    _id: productId,
    seller: req.user._id 
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
  };

  // Handle images only if new ones are uploaded
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map((file) => file.path);
  }

  let valid = validateProductData({ 
    ...req.body, 
    images: productData.images || existingProduct.images 
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

  // Check if product exists and belongs to seller
  const existingProduct = await Product.findOne({ 
    _id: productId,
    seller: req.user._id 
  });

  if(!existingProduct) {
    res.status(HTTP_CODES.NOT_FOUND)
    throw new Error("Product not Found!!")
  }


  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      {_id : productId},
      [
        {
          $set: {
            isActive: !existingProduct.isActive
          }
        }
      ]
    )
    
    if(updatedProduct){
      res.status(HTTP_CODES.OK)
        .json({
          success : true,
          message : "Product Deactivated Successfully"
        })
    }
  } catch (error) {
    res.status(HTTP_CODES.NOT_FOUND)
    throw new Error(error)
  }
});

