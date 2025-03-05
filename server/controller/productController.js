import Product from "../models/productModel.js";
import slugify from "slugify";
import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { json } from "express";
import { validateProductData } from "../utils/validateData.js";
import { HTTP_CODES } from "../utils/responseCodes.js";

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

  console.log("this is the variants",productData.variants)

  productData.bulkDiscount = JSON.parse(bulkDiscount).map((discountObj) => {
    return {
      minQty: discountObj.minQuantity,
      priceDiscountPerUnit: discountObj.price,
    };
  });

  //lets now add the product to the db.
  //we don't have to check for duplicate products since allowing it creates healthy competititon. better prices for customers

  const product = new Product(productData);
  await product.save();

  res.status(HTTP_CODES.CREATED).json({
    success: true,
    message: "Product Created Sucessfully",
  });
});
